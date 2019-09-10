import util from './util.js';
import constant from './constant.js';
import {getEventData, getMenuData, getFilterData} from './data.js';
import SiteMenu from './components/site-menu.js';
import MainTrip from './components/title-trip.js';
import Filter from './components/filter.js';
import {TripController} from './controllers/trip.js';
import {StatisticsController} from './controllers/statistics.js';
import MessageNoEvents from './components/message-no-events.js';

const EVENT_ITEM_COUNT = 20;

const headerElement = document.querySelector(`.page-header`);
const tripInfoElement = headerElement.querySelector(`.trip-info`);
const tripControlsElement = headerElement.querySelector(`.trip-controls`);
const totalElement = headerElement.querySelector(`.trip-info__cost-value`);
const tripControlHeadersCollectionElement = tripControlsElement.querySelectorAll(`h2`);
const newEventBtn = headerElement.querySelector(`.trip-main__event-add-btn`);
const mainElement = document.querySelector(`.page-main`);
const mainBodyContainer = mainElement.querySelector(`.page-body__container`);
const tripEventsElement = mainElement.querySelector(`.trip-events`);

let events = new Array(EVENT_ITEM_COUNT).fill(``).map(getEventData);

events.forEach((it) => {
  it.city = it.cities[util.getRandomIndex(it.cities)];
  it.type = it.types[util.getRandomIndex(it.types)];
  it.type.isChecked = true;
  it.timeEnd = it.timeStart + util.getMs();
});

let sortedEvents = events
  .slice()
  .sort((left, right) => left.timeStart - right.timeStart);
let unicDays = Array.from(new Set(sortedEvents
  .map(({timeStart}) => new Date(timeStart).toDateString()
  )));
let cities = sortedEvents
  .slice()
  .map(({city}) => city);

const siteMenuComponent = new SiteMenu(getMenuData());
const filterComponent = new Filter(getFilterData());
const messageNoEventsComponent = new MessageNoEvents();
const statisticsController = new StatisticsController(mainBodyContainer);

let titleTripComponent;

const renderTotalPrice = (eventsArr) => {
  let totalPrice = 0;
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

  renderHeaderBlocks();
};

const tripController = new TripController(tripEventsElement, onDataChange);

const onSiteMenuClick = (evt) => {
  if (util.isElementContainsClass(evt.target, `trip-tabs__btn`)) {
    if (util.isElementContainsClass(evt.target, `trip-tabs__btn--stats`)) {
      statisticsController.show(sortedEvents);
      tripController.clean();
      tripController.hide();
    } else {
      statisticsController.hide();
      tripController.show(sortedEvents);
    }

    const siteMenuBtnElements = siteMenuComponent.getElement().querySelectorAll(`.trip-tabs__btn`);
    Array.from(siteMenuBtnElements).forEach((button) => {
      button.classList.remove(`trip-tabs__btn--active`);
    });
    evt.target.classList.add(`trip-tabs__btn--active`);
  }
};

const onNewEventBtnClick = () => {
  tripController.createEvent();
};

const renderHeaderBlocks = () => {
  if (sortedEvents.length > 0) {
    if (titleTripComponent) {
      util.unrender(titleTripComponent.getElement());
      titleTripComponent.removeElement();
    }

    titleTripComponent = new MainTrip(cities, unicDays);

    util.render(tripInfoElement, titleTripComponent.getElement(), constant.Position.AFTERBEGIN);
    renderTotalPrice(sortedEvents);
  } else {
    util.render(tripEventsElement, messageNoEventsComponent.getElement(), constant.Position.BEFOREEND);
  }
};

const renderTripBlock = () => {
  if (sortedEvents.length > 0) {
    tripController.show(sortedEvents);
  }
};


util.render(tripControlHeadersCollectionElement[0], siteMenuComponent.getElement(), constant.Position.AFTER);
util.render(tripControlHeadersCollectionElement[1], filterComponent.getElement(), constant.Position.AFTER);

renderHeaderBlocks();
renderTripBlock();

siteMenuComponent.getElement().addEventListener(`click`, onSiteMenuClick);
newEventBtn.addEventListener(`click`, onNewEventBtnClick);
