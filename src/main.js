import util from './util.js';
import {getEventData, getMenuData, getFilterData, getSortingData} from './data.js';
import {getSiteMenuTemplate} from './components/site-menu.js';
import {getMainTripTemplate} from './components/main-trip.js';
import {getFilterTemplate} from './components/filter.js';
import {getTripSortingTemplate} from './components/trip-sorting.js';
import {getTripDaysListTemplate} from './components/trip-days-list.js';

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

const renderComponent = (element, container, place) => container.insertAdjacentHTML(place, element);

const renderTotalPrice = (eventsArr) => {
  eventsArr.forEach((it) => {
    totalPrice += it.price;
  });

  totalElement.textContent = totalPrice;
};

renderComponent(getMainTripTemplate(cities, unicDays), tripInfoElement, `afterbegin`);
renderComponent(getSiteMenuTemplate(getMenuData()), tripControlHeadersCollectionElement[0], `afterend`);
renderComponent(getFilterTemplate(getFilterData()), tripControlHeadersCollectionElement[1], `afterend`);
renderComponent(getTripSortingTemplate(getSortingData()), tripEventsElement, `beforeend`);
renderComponent(getTripDaysListTemplate(unicDays, sortedEvents), tripEventsElement, `beforeend`);
renderTotalPrice(sortedEvents);
