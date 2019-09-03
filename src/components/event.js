import moment from 'moment';
import util from '../util.js';
import AbstractComponent from './abstract-component.js';

const MS_IN_DAY = 86400000;
const MS_IN_HOUR = 3600000;

export default class Event extends AbstractComponent {
  constructor(events) {
    super();
    this._type = events.type;
    this._city = events.city;
    this._options = events.type.options;
    this._timeStart = events.timeStart;
    this._timeEnd = events.timeEnd;
    this._duration = events.timeEnd - events.timeStart;
    this._price = events.price;
  }

  getTemplate() {
    return `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${this._type.name}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${util.getEventTitle(this._type.name)} ${this._city.name}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${this._timeStart ? `${moment(this._timeStart).format()}` : ``}">${this._timeStart ? `${moment(this._timeStart).format(`HH:mm`)}` : ``}</time>
            &mdash;
            <time class="event__end-time" datetime="${moment(this._timeEnd).format()}">${moment(this._timeEnd).format(`HH:mm`)}</time>
          </p>
          <p class="event__duration">${this._getDuration()}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${this._price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${this._options ? `${this._options.filter((option) => option.isChecked).map(({description, cost}) => `<li class="event__offer">
            <span class="event__offer-title">${description}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${cost}</span>
          </li>`
          .trim())
          .join(``)}` : ``}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`.trim();
  }

  _getDuration() {
    let duration;
    if (this._duration >= MS_IN_DAY) {
      const numberOfDays = util.getNumberWithZero(Math.floor(this._duration / MS_IN_DAY));
      duration = `${numberOfDays}D ${moment.utc(this._duration).format(`HH[H] mm[M]`)}`;
    } else if (this._duration < MS_IN_DAY && this._duration >= MS_IN_HOUR) {
      duration = moment.utc(this._duration).format(`HH[H] mm[M]`);
    } else {
      duration = moment.utc(this._duration).format(`mm[M]`);
    }

    return duration;
  }
}
