import constant from '../constant.js';
import AbstractComponent from './abstract-component.js';

export default class TripDayItem extends AbstractComponent {
  constructor(day, index) {
    super();
    this._day = day;
    this._index = index;
  }

  getTemplate() {
    return `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${this._index === 0 || this._index ? (this._index + 1) : ``}</span>
        <time class="day__date" datetime="
        ${this._day ? `${this._day.slice(11, 16)}-${constant.monthMap[this._day.slice(4, 7)]}-${this._day.slice(8, 10)}` : ``}">
          ${this._day ? `${this._day.slice(4, 11)}` : ``}
        </time>
      </div>

      <ul class="trip-events__list">
      </ul>
    </li>`.trim();
  }
}
