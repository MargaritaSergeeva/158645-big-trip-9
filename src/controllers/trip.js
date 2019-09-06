import constant from '../constant.js';
import util from '../util.js';
import {getSortingData} from '../data.js';
import TripSorting from '../components/trip-sorting.js';
import TripDaysList from '../components/trip-days-list.js';
import {EventController} from './event.js';
import TripDayItem from '../components/trip-day-item.js';

export class TripController {
  constructor(containerEvents, onDataChange) {
    this._containerEvents = containerEvents;
    this._onDataChangeMain = onDataChange;
    this._events = [];
    this._unicDays = [];
    this._tripDaysList = new TripDaysList();
    this._tripSorting = new TripSorting(getSortingData());
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._cloneEvents = this._events;
    this._sortedEvents = this._cloneEvents;
    this._isSorted = false;
    this._subscriptions = [];
  }

  hide() {
    this._containerEvents.classList.add(`visually-hidden`);
  }

  show(events) {
    if (events !== this._events) {
      this._setEvents(events);
    }

    this._containerEvents.classList.remove(`visually-hidden`);
  }

  _renderTrip() {
    util.render(this._containerEvents, this._tripSorting.getElement(), constant.Position.BEFOREEND);
    this._tripSorting.getElement().addEventListener(`click`, (evt) => this._onSortingLinkClick(evt));

    util.render(this._containerEvents, this._tripDaysList.getElement(), constant.Position.BEFOREEND);
    this._renderTripDays(this._events, this._unicDays, this._tripDaysList.getElement());
  }

  _setEvents(events) {
    this._events = events;

    this._unicDays = Array.from(new Set(this._events
      .map(({timeStart}) => new Date(timeStart).toDateString()
      )));

    this._renderTrip();
  }


  _onDataChange(newData, oldData) {
    this._sortedEvents[this._sortedEvents.findIndex((it) => it === oldData)] = newData;
    const i = this._cloneEvents.findIndex((it) => it === oldData);
    this._cloneEvents[i] = newData;

    this._tripDaysList.getElement().innerHTML = ``;

    if (this._isSorted) {
      this._renderTripDay(this._sortedEvents, this._tripDaysList.getElement());
    } else {
      this._unicDays = Array.from(new Set(this._cloneEvents
        .sort((left, right) => left.timeStart - right.timeStart)
        .map(({timeStart}) => new Date(timeStart).toDateString()
        )));
      this._renderTripDays(this._cloneEvents, this._unicDays, this._tripDaysList.getElement());
    }

    this._onDataChangeMain(this._sortedEvents);
  }


  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }


  _renderTripDays(eventsArr, daysArr, container) {
    daysArr.forEach((day, index) => {
      const eventsForDay = eventsArr
      .filter(({timeStart}) => (new Date(timeStart)).toDateString() === day);

      const tripDayItem = new TripDayItem(eventsForDay.length, day, index).getElement();
      const tripEventsItems = tripDayItem.querySelectorAll(`.trip-events__item`);

      util.render(container, tripDayItem, constant.Position.BEFOREEND);
      Array.from(tripEventsItems).forEach((it, i) => this._renderEvent(it, eventsForDay[i]));
    });
  }

  _renderTripDay(eventsArr, container) {
    const tripDayItem = new TripDayItem(eventsArr.length).getElement();
    const tripEventsItems = tripDayItem.querySelectorAll(`.trip-events__item`);

    util.render(container, tripDayItem, constant.Position.BEFOREEND);
    Array.from(tripEventsItems).forEach((it, i) => this._renderEvent(it, eventsArr[i]));
  }


  _renderEvent(container, event) {
    const eventController = new EventController(container, event, this._onDataChange, this._onChangeView);
    this._subscriptions.push(eventController.setDefaultView.bind(eventController));
  }


  _onSortingLinkClick(evt) {
    if (evt.target.tagName !== `LABEL`) {
      return;
    }

    this._tripDaysList.getElement().innerHTML = ``;

    switch (evt.target.dataset.sortType) {
      case `time`:
        const getDuration = (obj) => obj.timeEnd - obj.timeStart;
        this._sortedEvents = this._cloneEvents.slice().sort((a, b) => getDuration(b) - getDuration(a));
        this._renderTripDay(this._sortedEvents, this._tripDaysList.getElement());
        this._isSorted = true;
        break;
      case `price`:
        this._sortedEvents = this._cloneEvents.slice().sort((a, b) => b.price - a.price);
        this._renderTripDay(this._sortedEvents, this._tripDaysList.getElement());
        this._isSorted = true;
        break;
      case `event`:
        this._sortedEvents = this._cloneEvents;
        this._renderTripDays(this._sortedEvents, this._unicDays, this._tripDaysList.getElement());
        this._isSorted = false;
        break;
    }
  }
}
