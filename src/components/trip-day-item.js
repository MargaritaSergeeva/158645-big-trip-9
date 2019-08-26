import util from '../util.js';
import constant from '../constant.js';

export default class TripDayItem {
  constructor(day, index) {
    this._day = day;
    this._index = index;
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
    return `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${this._index + 1}</span>
        <time class="day__date" datetime="${this._day.slice(11, 16)}-${constant.monthMap[this._day.slice(4, 7)]}-${this._day.slice(8, 10)}">
          ${this._day.slice(4, 11)}
        </time>
      </div>

      <ul class="trip-events__list">
      </ul>
    </li>`.trim();
  }
}
