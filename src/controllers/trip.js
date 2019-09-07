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
    this._sortedEvents = [];
    this._tripDaysList = new TripDaysList();
    this._tripSorting = new TripSorting(getSortingData());
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._isSorted = false;
    this._subscriptions = [];
    this._creatingEvent = null;
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

  createEvent() {
    if (this._creatingEvent) {
      return;
    }

    const newEvent = constant.defaultEvent;
    newEvent.cities = this._events[0].cities;

    const tripDayItem = new TripDayItem().getElement();
    util.render(this._tripDaysList.getElement(), tripDayItem, constant.Position.AFTERBEGIN);

    this._creatingTask = new EventController(tripDayItem, constant.defaultEvent, constant.Mode.ADDING, this._onChangeView, (...args) => {
      this._creatingEvent = null;
      this._onDataChange(...args);
    });
  }

  _renderTrip() {
    util.render(this._containerEvents, this._tripSorting.getElement(), constant.Position.BEFOREEND);
    this._tripSorting.getElement().addEventListener(`click`, (evt) => this._onSortingLinkClick(evt));

    util.render(this._containerEvents, this._tripDaysList.getElement(), constant.Position.BEFOREEND);
    this._renderTripDays(this._events, this._unicDays, this._tripDaysList.getElement());
  }

  _setEvents(events) {
    this._events = events;
    this._sortedEvents = this._events;

    this._unicDays = Array.from(new Set(this._events
      .map(({timeStart}) => new Date(timeStart).toDateString()
      )));

    this._renderTrip();
  }


  _onDataChange(newData, oldData) {
    const indexsortedEvents = this._sortedEvents.findIndex((event) => event === oldData);
    const indexEvents = this._events.findIndex((it) => it === oldData);

    this._tripDaysList.getElement().innerHTML = ``;

    if (newData === null) {
      this._sortedEvents = this._sortedEvents.slice(0, indexsortedEvents).concat(this._sortedEvents.slice(indexsortedEvents + 1));
      this._events = this._events.slice(0, indexEvents).concat(this._events.slice(indexEvents + 1));
    } else if (oldData === null) {
      this._sortedEvents = [newData, ...this._sortedEvents];
      this._events = [newData, ...this._events];
    } else if (newData === null && oldData === null) {
      this._creatingEvent = null;
    } else {
      this._sortedEvents[indexsortedEvents] = newData;
      this._events[indexEvents] = newData;
    }

    if (this._isSorted) {
      this._renderTripDay(this._sortedEvents, this._tripDaysList.getElement());
    } else {
      this._unicDays = Array.from(new Set(this._events
        .sort((left, right) => left.timeStart - right.timeStart)
        .map(({timeStart}) => new Date(timeStart).toDateString()
        )));
      this._renderTripDays(this._events, this._unicDays, this._tripDaysList.getElement());
    }

    this._onDataChangeMain(this._events);
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
    const eventController = new EventController(container, event, constant.Mode.DEFAULT, this._onChangeView, this._onDataChange);
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
        this._sortedEvents = this._events.slice().sort((a, b) => getDuration(b) - getDuration(a));
        this._renderTripDay(this._sortedEvents, this._tripDaysList.getElement());
        this._isSorted = true;
        break;
      case `price`:
        this._sortedEvents = this._events.slice().sort((a, b) => b.price - a.price);
        this._renderTripDay(this._sortedEvents, this._tripDaysList.getElement());
        this._isSorted = true;
        break;
      case `event`:
        this._sortedEvents = this._events;
        this._renderTripDays(this._sortedEvents, this._unicDays, this._tripDaysList.getElement());
        this._isSorted = false;
        break;
    }
  }
}
