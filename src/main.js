import {getSiteMenuTemplate} from './components/site-menu.js';
import {getMainTripTemplate} from './components/main-trip.js';
import {getFilterTemplate} from './components/filter.js';
import {getTripSortingTemplate} from './components/trip-sorting.js';
import {getTripDaysListTemplate} from './components/trip-days-list.js';
import {getTripDayItemTemplate} from './components/trip-day-item.js';
import {getTripEventItemTemplate} from './components/trip-event-item.js';
import {getEditEventTemplate} from './components/event-edit.js';
import {getEventTemplate} from './components/event.js';

const EVENT_ITEM_COUNT = 4;
const headerElement = document.querySelector(`.page-header`);
const tripInfoElement = headerElement.querySelector(`.trip-info`);
const tripControlsElement = headerElement.querySelector(`.trip-controls`);
const tripControlHeadersCollectionElement = tripControlsElement.querySelectorAll(`h2`);
const mainElement = document.querySelector(`.page-main`);
const tripEventsElement = mainElement.querySelector(`.trip-events`);

const renderComponent = (element, container, place) => container.insertAdjacentHTML(place, element);

renderComponent(getMainTripTemplate(), tripInfoElement, `afterbegin`);
renderComponent(getSiteMenuTemplate(), tripControlHeadersCollectionElement[0], `afterend`);
renderComponent(getFilterTemplate(), tripControlHeadersCollectionElement[1], `afterend`);
renderComponent(getTripSortingTemplate(), tripEventsElement, `beforeend`);
renderComponent(getTripDaysListTemplate(), tripEventsElement, `beforeend`);

const tripDaysListElement = mainElement.querySelector(`.trip-days`);

renderComponent(getTripDayItemTemplate(), tripDaysListElement, `beforeend`);

const tripEventsListElement = mainElement.querySelector(`.trip-events__list`);

new Array(EVENT_ITEM_COUNT).fill(``).forEach(() => renderComponent(getTripEventItemTemplate(), tripEventsListElement, `beforeend`));

const tripEventItemCollectionElement = mainElement.querySelectorAll(`.trip-events__item`);

tripEventItemCollectionElement.forEach((it, index) => index === 0 ? renderComponent(getEditEventTemplate(), it, `beforeend`) : renderComponent(getEventTemplate(), it, `beforeend`));
