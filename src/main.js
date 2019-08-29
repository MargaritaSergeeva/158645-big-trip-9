import util from './util.js';
import constant from './constant.js';
import {getEventData, getMenuData, getFilterData} from './data.js';
import SiteMenu from './components/site-menu.js';
import MainTrip from './components/main-trip.js';
import Filter from './components/filter.js';
import {TripController} from './controllers/trip.js';
import MessageNoEvents from './components/message-no-events.js';

const EVENT_ITEM_COUNT = 20;
const MIN_OPTION_COUNT = 0;
const MAX_OPTION_COUNT = 2;

const headerElement = document.querySelector(`.page-header`);
const tripInfoElement = headerElement.querySelector(`.trip-info`);
const tripControlsElement = headerElement.querySelector(`.trip-controls`);
const totalElement = headerElement.querySelector(`.trip-info__cost-value`);
const tripControlHeadersCollectionElement = tripControlsElement.querySelectorAll(`h2`);
const mainElement = document.querySelector(`.page-main`);
const tripEventsElement = mainElement.querySelector(`.trip-events`);
const events = new Array(EVENT_ITEM_COUNT).fill(``).map(getEventData);
let totalPrice = 0;

events.forEach((it) => {
  it.city = it.cities[util.getRandomIndex(it.cities)];
  it.type = it.types[util.getRandomIndex(it.types)].name;
  it.checkedOptions = it.options
    .filter((option) => option.isChecked)
    .splice(MIN_OPTION_COUNT, Math.round(Math.random() * MAX_OPTION_COUNT));
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

const tripController = new TripController(tripEventsElement, sortedEvents, unicDays);


const renderTotalPrice = (eventsArr) => {
  eventsArr.forEach((it) => {
    totalPrice += it.price;
  });

  totalElement.textContent = totalPrice;
};


util.render(tripControlHeadersCollectionElement[0], new SiteMenu(getMenuData()).getElement(), constant.Position.AFTER);
util.render(tripControlHeadersCollectionElement[1], new Filter(getFilterData()).getElement(), constant.Position.AFTER);

if (sortedEvents.length > 0) {
  util.render(tripInfoElement, new MainTrip(cities, unicDays).getElement(), constant.Position.AFTERBEGIN);
  tripController.init();
  renderTotalPrice(sortedEvents);
} else {
  util.render(tripEventsElement, new MessageNoEvents().getElement(), constant.Position.BEFOREEND);
}
