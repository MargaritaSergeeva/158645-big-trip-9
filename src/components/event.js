import util from '../util.js';

const HOURS_COUNT = 24;
const MIN_COUNT = 60;
const SEC_COUNT = 60;
const MS_COUNT = 1000;

const getDuration = (start, end) => {
  const duration = end - start;
  const durationInMin = duration / MS_COUNT / SEC_COUNT;
  const numberOfDays = util.getNumberWithZero(Math.floor(durationInMin / MIN_COUNT / HOURS_COUNT));
  const numberOfHours = util.getNumberWithZero(Math.floor((durationInMin - numberOfDays * MIN_COUNT * HOURS_COUNT) / MIN_COUNT));
  let numberOfMinutes = util.getNumberWithZero(Math.round(durationInMin - (numberOfDays * MIN_COUNT * HOURS_COUNT) - (numberOfHours * MIN_COUNT)));

  return numberOfDays > 0 ? `${numberOfDays}D ${numberOfHours}H ${numberOfMinutes}M` : `${numberOfHours}H ${numberOfMinutes}M`;
};

export default class Event {
  constructor({type, city, checkedOptions, timeStart, timeEnd, price}) {
    this._type = type;
    this._city = city;
    this._checkedOptions = checkedOptions;
    this._timeStart = timeStart;
    this._timeEnd = timeEnd;
    this._price = price;
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = util.createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  getTemplate() {
    return `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${this._type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${util.getEventTitle(this._type)} ${this._city}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${(new Date(this._timeStart)).toISOString()}">${(util.getNumberWithZero(new Date(this._timeStart)).getHours())}:${util.getNumberWithZero((new Date(this._timeStart)).getMinutes())}</time>
            &mdash;
            <time class="event__end-time" datetime="${(new Date(this._timeEnd)).toISOString()}">${util.getNumberWithZero((new Date(this._timeEnd)).getHours())}:${util.getNumberWithZero((new Date(this._timeEnd)).getMinutes())}</time>
          </p>
          <p class="event__duration">${getDuration(this._timeStart, this._timeEnd)}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${this._price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${this._checkedOptions.map(({description, cost}) => `<li class="event__offer">
            <span class="event__offer-title">${description}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${cost}</span>
          </li>`
          .trim())
          .join(``)}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`.trim();
  }
}
