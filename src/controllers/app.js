import util from '../util.js';
import constant from '../constant.js';
import {getEventData} from '../data.js';
import MessageNoEvents from '../components/message-no-events.js';
import {TripController} from './trip.js';
import {StatisticsController} from './statistics.js';
import {HeaderController} from './header.js';

const EVENT_ITEM_COUNT = 20;


export class AppController {
  constructor() {
    this._mainElement = document.querySelector(`.page-main`);
    this._mainBodyContainer = this._mainElement.querySelector(`.page-body__container`);
    this._tripEventsElement = this._mainElement.querySelector(`.trip-events`);
    this._allEvents = new Array(EVENT_ITEM_COUNT).fill(``).map(getEventData);
    this._sortedEvents = [];
    this._unicDays = [];
    this._cities = [];
    this._messageNoEventsComponent = new MessageNoEvents();
    this._statisticsController = new StatisticsController(this._mainBodyContainer);
    this._tripController = new TripController(this._tripEventsElement, this._onDataChange.bind(this));
    this._headerController = new HeaderController(this._onFilterChange.bind(this), this._onSiteMenuClick.bind(this), this._onNewEventBtnClick.bind(this));
    this._filterMode = constant.FilterMode.EVERYTHING;
  }

  init() {
    this._allEvents.forEach((it) => {
      it.city = it.cities[util.getRandomIndex(it.cities)];
      it.type = it.types[util.getRandomIndex(it.types)];
      it.type.isChecked = true;
      it.timeEnd = it.timeStart + util.getMs();
    });

    this._sortedEvents = this._allEvents
    .slice()
    .sort((left, right) => left.timeStart - right.timeStart);

    this._unicDays = Array.from(new Set(this._sortedEvents
    .map(({timeStart}) => new Date(timeStart).toDateString()
    )));

    this._cities = this._sortedEvents
    .slice()
    .map(({city}) => city);

    this._renderTripBlock();
    this._renderHeaderBlock();
    this._switchRenderingMessageNoEvents();
  }

  _onDataChange(newEvents) {
    this._allEvents = newEvents;
    this._sortedEvents = this._allEvents
      .slice()
      .sort((left, right) => left.timeStart - right.timeStart);
    this._unicDays = Array.from(new Set(this._sortedEvents
      .map(({timeStart}) => new Date(timeStart).toDateString()
      )));
    this._cities = this._sortedEvents
      .slice()
      .map(({city}) => city);

    this._renderHeaderBlock();
    this._switchRenderingMessageNoEvents();
    this._filterEventsByMode();
  }

  _onFilterChange(filterMode) {
    this._filterMode = filterMode;
    this._statisticsController.hide();
    this._filterEventsByMode();
    this._renderTripBlock();
  }

  _filterEventsByMode() {
    switch (this._filterMode) {
      case constant.FilterMode.EVERYTHING:
        this._sortedEvents = this._allEvents
          .slice()
          .sort((left, right) => left.timeStart - right.timeStart);
        break;
      case constant.FilterMode.FUTURE:
        this._sortedEvents = this._allEvents
        .slice()
        .sort((left, right) => left.timeStart - right.timeStart)
        .filter(({timeStart}) => timeStart > Date.now());
        break;
      case constant.FilterMode.PAST:
        this._sortedEvents = this._allEvents
        .slice()
        .sort((left, right) => left.timeStart - right.timeStart)
        .filter(({timeEnd}) => timeEnd < Date.now());
        break;
    }
  }

  _onSiteMenuClick(evt) {
    if (util.isElementContainsClass(evt.target, `trip-tabs__btn--stats`)) {
      this._statisticsController.show(this._sortedEvents);
      this._tripController.hide();
    } else {
      this._statisticsController.hide();
      this._renderTripBlock();
    }
  }

  _onNewEventBtnClick() {
    this._tripController.createEvent();
  }

  _renderTripBlock() {
    if (this._sortedEvents.length > 0) {
      this._tripController.show(this._allEvents, this._sortedEvents, this._filterMode);
    }
  }

  _renderHeaderBlock() {
    if (this._sortedEvents.length > 0) {
      this._headerController.render(this._sortedEvents, this._unicDays, this._cities);
    }
  }

  _switchRenderingMessageNoEvents() {
    if (this._sortedEvents.length === 0) {
      this._tripController.clean();
      this._headerController.clean();
      util.render(this._tripEventsElement, this._messageNoEventsComponent.getElement(), constant.Position.BEFOREEND);
    } else {
      if (this._tripEventsElement.contains(this._messageNoEventsComponent.getElement())) {
        util.unrender(this._messageNoEventsComponent.getElement());
        this._messageNoEventsComponent.removeElement();
      }
    }
  }
}
