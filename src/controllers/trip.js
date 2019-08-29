import constant from '../constant.js';
import util from '../util.js';
import {getSortingData} from '../data.js';
import TripSorting from '../components/trip-sorting.js';
import TripDaysList from '../components/trip-days-list.js';
import TripDayItem from '../components/trip-day-item.js';
import EventEdit from '../components/event-edit.js';
import Event from '../components/event.js';

export class TripController {
  constructor(containerEvents, sortedEvents, unicDays) {
    this._containerEvents = containerEvents;
    this._sortedEvents = sortedEvents;
    this._unicDays = unicDays;
    this._tripDaysList = new TripDaysList();
    this._tripSorting = new TripSorting(getSortingData());
  }

  init() {
    util.render(this._containerEvents, this._tripSorting.getElement(), constant.Position.BEFOREEND);
    this._tripSorting.getElement().addEventListener(`click`, (evt) => this._onSortingLinkClick(evt));

    util.render(this._containerEvents, this._tripDaysList.getElement(), constant.Position.BEFOREEND);
    this._renderTripDayItem(this._sortedEvents, this._unicDays, this._tripDaysList.getElement());
  }

  _renderEvent(eventItem, eventContainer) {
    const event = new Event(eventItem);
    const eventEdit = new EventEdit(eventItem);

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        eventContainer.replaceChild(event.getElement(), eventEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    event.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        eventContainer.replaceChild(eventEdit.getElement(), event.getElement());
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    eventEdit.getElement()
    .querySelector(`.event__rollup-btn`)
    .addEventListener(`click`, () => {
      eventContainer.replaceChild(event.getElement(), eventEdit.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    eventEdit.getElement()
      .querySelector(`form`)
      .addEventListener(`submit`, () => {
        eventContainer.replaceChild(event.getElement(), eventEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    util.render(eventContainer, event.getElement(), constant.Position.BEFOREEND);
  }

  _renderEvents(day, eventsArr, container) {
    eventsArr
    .filter(({timeStart}) => (new Date(timeStart)).toDateString() === day)
    .forEach((eventItem) => this._renderEvent(eventItem, container));
  }

  _renderTripDayItem(eventsArr, daysArr, container) {
    daysArr.forEach((day, index) => {
      const tripDayItem = new TripDayItem(day, index).getElement();
      util.render(container, tripDayItem, constant.Position.BEFOREEND);
      const tripEventsList = tripDayItem.querySelector(`.trip-events__list`);
      this._renderEvents(day, eventsArr, tripEventsList);
    });
  }

  _onSortingLinkClick(evt) {
    if (evt.target.tagName !== `LABEL`) {
      return;
    }

    const tripDayItem = new TripDayItem().getElement();
    this._tripDaysList.getElement().innerHTML = ``;

    switch (evt.target.dataset.sortType) {
      case `time`:
        const getDuration = (obj) => obj.timeEnd - obj.timeStart;
        const sortedByTimeEvents = this._sortedEvents.slice().sort((a, b) => getDuration(b) - getDuration(a));

        util.render(this._tripDaysList.getElement(), tripDayItem, constant.Position.BEFOREEND);
        sortedByTimeEvents.forEach((event) => this._renderEvent(event, tripDayItem.querySelector(`.trip-events__list`)));
        break;
      case `price`:
        const sortedByPriceEvents = this._sortedEvents.slice().sort((a, b) => b.price - a.price);

        util.render(this._tripDaysList.getElement(), tripDayItem, constant.Position.BEFOREEND);
        sortedByPriceEvents.forEach((event) => this._renderEvent(event, tripDayItem.querySelector(`.trip-events__list`)));
        break;
      case `event`:
        this._renderTripDayItem(this._sortedEvents, this._unicDays, this._tripDaysList.getElement());
        break;
    }
  }
}
