import constant from '../constant.js';
import AbstractComponent from './abstract-component.js';

const LetterNumber = {
  FIRST_OF_YEAR: 8,
  LAST_OF_YEAR: 10,
  FIRST_OF_MONTH: 4,
  LAST_OF_MONTH: 7,
  FIRST_OF_DAY: 11,
  LAST_OF_DAY: 16,
  FIRST_OF_MONTH_DAY: 4,
  LAST_OF_MONTH_DAY: 11,
};

export default class TripDayItem extends AbstractComponent {
  constructor(eventsCount = 1, day, index) {
    super();
    this._day = day;
    this._eventsCount = eventsCount;
    this._index = index;
  }

  getTemplate() {
    return `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${this._index === 0 || this._index ? (this._index + 1) : ``}</span>
        <time class="day__date" datetime="
        ${this._day ? `${this._day.slice(LetterNumber.FIRST_OF_DAY, LetterNumber.LAST_OF_DAY)}-${constant.monthMap[this._day.slice(LetterNumber.FIRST_OF_MONTH, LetterNumber.LAST_OF_MONTH)]}-${this._day.slice(LetterNumber.FIRST_OF_YEAR, LetterNumber.LAST_OF_YEAR)}` : ``}">
          ${this._day ? `${this._day.slice(LetterNumber.FIRST_OF_MONTH_DAY, LetterNumber.LAST_OF_MONTH_DAY)}` : ``}
        </time>
      </div>

      <ul class="trip-events__list">
        ${new Array(this._eventsCount).fill(``).map(() => `<li class="trip-events__item"></li>`.trim()).join(``)}
      </ul>
    </li>`.trim();
  }
}
