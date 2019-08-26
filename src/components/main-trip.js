import util from '../util.js';

const FIRST_LETTER_INDEX = 4;
const LAST_LETTER_INDEX = 11;


const getMonthAndDate = (day) => {
  return day.slice(FIRST_LETTER_INDEX, LAST_LETTER_INDEX);
};

export default class MainTrip {
  constructor(cities, days) {
    this._cities = cities;
    this._days = days;
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
    return `<div class="trip-info__main">
      <h1 class="trip-info__title">${this._cities[0]} &mdash; ... &mdash; ${this._cities[this._cities.length - 1]}</h1>
      <p class="trip-info__dates">${getMonthAndDate(this._days[0])}&nbsp;&mdash;&nbsp;${getMonthAndDate(this._days[this._days.length - 1])}</p>
    </div>`.trim();
  }
}
