import util from './util.js';
import constant from './constant.js';
import {getEventData, getMenuData, getFilterData, getSortingData} from './data.js';
import SiteMenu from './components/site-menu.js';
import MainTrip from './components/main-trip.js';
import Filter from './components/filter.js';
import TripSorting from './components/trip-sorting.js';
import TripDaysList from './components/trip-days-list.js';
import TripDayItem from './components/trip-day-item.js';
import EventEdit from './components/event-edit.js';
import Event from './components/event.js';
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


const renderEvent = (eventItem, eventContainer) => {
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
};

const renderEvents = (day, eventsArr, container) => {
  eventsArr
  .filter(({timeStart}) => (new Date(timeStart)).toDateString() === day)
  .forEach((eventItem) => renderEvent(eventItem, container));
};

const renderTripDayItem = (eventsArr, daysArr, container) => {
  daysArr.forEach((day, index) => {
    const tripDayItem = new TripDayItem(day, index).getElement();
    util.render(container, tripDayItem, constant.Position.BEFOREEND);
    const tripEventsList = tripDayItem.querySelector(`.trip-events__list`);
    renderEvents(day, eventsArr, tripEventsList);
  });
};

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
  util.render(tripEventsElement, new TripSorting(getSortingData()).getElement(), constant.Position.BEFOREEND);
  util.render(tripEventsElement, new TripDaysList().getElement(), constant.Position.BEFOREEND);

  const tripDaysListElement = tripEventsElement.querySelector(`.trip-days`);
  renderTripDayItem(sortedEvents, unicDays, tripDaysListElement);
  renderTotalPrice(sortedEvents);
} else {
  util.render(tripEventsElement, new MessageNoEvents().getElement(), constant.Position.BEFOREEND);
}
