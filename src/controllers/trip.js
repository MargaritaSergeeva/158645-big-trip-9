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
    this._allEvents = [];
    this._workingEvents = [];
    this._unicDays = [];
    this._sortedEvents = [];
    this._tripDaysList = new TripDaysList();
    this._tripSorting = new TripSorting(getSortingData());
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._isSorted = false;
    this._subscriptions = [];
    this._creatingEvent = null;
    this._filterMode = null;
  }

  hide() {
    this._containerEvents.classList.add(`visually-hidden`);
  }

  clean() {
    if (this._containerEvents.contains(this._tripDaysList.getElement())) {
      util.unrender(this._tripSorting.getElement());
      util.unrender(this._tripDaysList.getElement());
      this._tripSorting.removeElement();
      this._tripDaysList.removeElement();
    }
  }

  show(allEvents, workingEvents, filterMode) {
    this._setEventsData(allEvents, workingEvents, filterMode);
    this.clean();
    this._renderTrip();

    this._containerEvents.classList.remove(`visually-hidden`);
  }

  createEvent() {
    if (this._creatingEvent) {
      return;
    }

    const newEvent = constant.defaultEvent;
    newEvent.cities = this._workingEvents[0].cities;

    const tripDayItem = new TripDayItem().getElement();
    util.render(this._tripDaysList.getElement(), tripDayItem, constant.Position.AFTERBEGIN);

    this._creatingTask = new EventController(tripDayItem, constant.defaultEvent, constant.Mode.ADDING, this._onChangeView, (...args) => {
      this._creatingEvent = null;
      this._onDataChange(...args);
    });
  }

  _renderTrip() {
    util.render(this._containerEvents, this._tripSorting.getElement(), constant.Position.BEFOREEND);
    util.render(this._containerEvents, this._tripDaysList.getElement(), constant.Position.BEFOREEND);

    this._tripSorting.getElement().addEventListener(`click`, (evt) => this._onSortingLinkClick(evt));
    this._renderTripDays(this._workingEvents, this._unicDays, this._tripDaysList.getElement());
  }

  _setEventsData(allEvents, workingEvents, filterMode) {
    this._allEvents = allEvents;
    this._workingEvents = workingEvents;
    this._sortedEvents = this._workingEvents;
    this._filterMode = filterMode;

    this._unicDays = Array.from(new Set(this._workingEvents
      .map(({timeStart}) => new Date(timeStart).toDateString()
      )));
  }

  _onDataChange(newData, oldData) {
    this._tripDaysList.getElement().innerHTML = ``;

    this._changeData(newData, oldData);

    if (this._isSorted) {
      this._renderTripDay(this._sortedEvents, this._tripDaysList.getElement());
    } else {
      this._renderTripDays(this._workingEvents, this._unicDays, this._tripDaysList.getElement());
    }

    this._onDataChangeMain(this._allEvents);
  }

  _changeData(newData, oldData) {
    const indexAllEvents = this._allEvents.findIndex((it) => it === oldData);
    const indexWorkingEvents = this._workingEvents.findIndex((it) => it === oldData);
    const indexSortedEvents = this._sortedEvents.findIndex((event) => event === oldData);

    if (newData === null) {
      this._allEvents = this._allEvents.slice(0, indexAllEvents).concat(this._allEvents.slice(indexAllEvents + 1));
      this._workingEvents = this._workingEvents.slice(0, indexWorkingEvents).concat(this._workingEvents.slice(indexWorkingEvents + 1));
      this._sortedEvents = this._sortedEvents.slice(0, indexSortedEvents).concat(this._sortedEvents.slice(indexSortedEvents + 1));
    } else if (oldData === null) {
      this._allEvents = [newData, ...this._allEvents];
      this._workingEvents = [newData, ...this._workingEvents];
      this._sortedEvents = [newData, ...this._sortedEvents];
    } else if (newData === null && oldData === null) {
      this._creatingEvent = null;
    } else {
      this._allEvents[indexAllEvents] = newData;
      this._workingEvents[indexWorkingEvents] = newData;
      this._sortedEvents[indexSortedEvents] = newData;
    }

    this._unicDays = Array.from(new Set(this._workingEvents
      .sort((left, right) => left.timeStart - right.timeStart)
      .map(({timeStart}) => new Date(timeStart).toDateString()
      )));

    switch (this._filterMode) {
      case constant.FilterMode.EVERYTHING:
        break;
      case constant.FilterMode.FUTURE:
        this._sortedEvents = this._sortedEvents.filter(({timeStart}) => timeStart > Date.now());
        this._workingEvents = this._workingEvents.filter(({timeStart}) => timeStart > Date.now());
        this._unicDays = Array.from(new Set(this._workingEvents
          .sort((left, right) => left.timeStart - right.timeStart)
          .map(({timeStart}) => new Date(timeStart).toDateString()
          )));
        break;
      case constant.FilterMode.PAST:
        this._sortedEvents = this._sortedEvents.filter(({timeEnd}) => timeEnd < Date.now());
        this._workingEvents = this._sortedEvents.filter(({timeEnd}) => timeEnd < Date.now());
        this._unicDays = Array.from(new Set(this._workingEvents
          .sort((left, right) => left.timeStart - right.timeStart)
          .map(({timeStart}) => new Date(timeStart).toDateString()
          )));
        break;
    }
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
        this._sortedEvents = this._workingEvents.slice().sort((a, b) => getDuration(b) - getDuration(a));
        this._renderTripDay(this._sortedEvents, this._tripDaysList.getElement());
        this._isSorted = true;
        break;
      case `price`:
        this._sortedEvents = this._workingEvents.slice().sort((a, b) => b.price - a.price);
        this._renderTripDay(this._sortedEvents, this._tripDaysList.getElement());
        this._isSorted = true;
        break;
      case `event`:
        this._sortedEvents = this._workingEvents;
        this._renderTripDays(this._sortedEvents, this._unicDays, this._tripDaysList.getElement());
        this._isSorted = false;
        break;
    }
  }
}
