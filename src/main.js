import util from './util.js';
import constant from './constant.js';
import {getEventData, getMenuData, getFilterData} from './data.js';
import SiteMenu from './components/site-menu.js';
import MainTrip from './components/main-trip.js';
import Filter from './components/filter.js';
import Statistics from './components/statistics.js';
import {TripController} from './controllers/trip.js';
import MessageNoEvents from './components/message-no-events.js';

const EVENT_ITEM_COUNT = 20;

const headerElement = document.querySelector(`.page-header`);
const tripInfoElement = headerElement.querySelector(`.trip-info`);
const tripControlsElement = headerElement.querySelector(`.trip-controls`);
const totalElement = headerElement.querySelector(`.trip-info__cost-value`);
const tripControlHeadersCollectionElement = tripControlsElement.querySelectorAll(`h2`);
const mainElement = document.querySelector(`.page-main`);
const mainBodyContainer = mainElement.querySelector(`.page-body__container`);
const tripEventsElement = mainElement.querySelector(`.trip-events`);

const events = new Array(EVENT_ITEM_COUNT).fill(``).map(getEventData);

events.forEach((it) => {
  it.city = it.cities[util.getRandomIndex(it.cities)];
  it.type = it.types[util.getRandomIndex(it.types)];
  it.type.isChecked = true;
  it.timeEnd = it.timeStart + util.getMs();
});

const sortedEvents = events
  .slice()
  .sort((left, right) => left.timeStart - right.timeStart);
const unicDays = Array.from(new Set(sortedEvents
  .map(({timeStart}) => new Date(timeStart).toDateString()
  )));
const cities = sortedEvents
  .slice()
  .map(({city}) => city);

const siteMenuComponent = new SiteMenu(getMenuData());
const filterComponent = new Filter(getFilterData());
const messageNoEventsComponent = new MessageNoEvents();
let statisticComponent;
let tripController;
let mainTripComponent;
let totalPrice = 0;


const renderTotalPrice = (eventsArr) => {
  eventsArr.forEach((it) => {
    totalPrice += it.price;
  });

  totalElement.textContent = totalPrice;
};

const onDataChange = (newEvents) => {
  events = newEvents;
  sortedEvents = events
    .slice()
    .sort((left, right) => left.timeStart - right.timeStart);
  unicDays = Array.from(new Set(sortedEvents
    .map(({timeStart}) => new Date(timeStart).toDateString()
    )));
  cities = sortedEvents
    .slice()
    .map(({city}) => city);
};

const onSiteMenuClick = (evt) => {
  if (util.isElementContainsClass(evt.target, `trip-tabs__btn`)) {
    if (util.isElementContainsClass(evt.target, `trip-tabs__btn--stats`)) {
      statisticComponent.getElement().classList.remove(`visually-hidden`);
      tripController.hide();
    } else {
      statisticComponent.getElement().classList.add(`visually-hidden`);
      tripController.show(sortedEvents);
    }

    const siteMenuBtnElements = siteMenuComponent.getElement().querySelectorAll(`.trip-tabs__btn`);
    Array.from(siteMenuBtnElements).forEach((button) => {
      button.classList.remove(`trip-tabs__btn--active`);
    });
    evt.target.classList.add(`trip-tabs__btn--active`);
  }
};

const renderTripBlocks = () => {
  if (sortedEvents.length > 0) {
    mainTripComponent = new MainTrip(cities, unicDays);
    tripController = new TripController(tripEventsElement, onDataChange);
    statisticComponent = new Statistics();

    util.render(tripInfoElement, mainTripComponent.getElement(), constant.Position.AFTERBEGIN);
    util.render(mainBodyContainer, statisticComponent.getElement(), constant.Position.AFTERBEGIN);
    statisticComponent.getElement().classList.add(`visually-hidden`);
    tripController.show(sortedEvents);
    renderTotalPrice(sortedEvents);
  } else {
    util.render(tripEventsElement, messageNoEventsComponent.getElement(), constant.Position.BEFOREEND);
  }
};


util.render(tripControlHeadersCollectionElement[0], siteMenuComponent.getElement(), constant.Position.AFTER);
util.render(tripControlHeadersCollectionElement[1], filterComponent.getElement(), constant.Position.AFTER);

renderTripBlocks();

siteMenuComponent.getElement().addEventListener(`click`, onSiteMenuClick);
