import util from '../util.js';

export default class TripDaysList {
  constructor() {
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
    return `<ul class="trip-days">
    </ul>`.trim();
  }
}

