import util from '../util.js';

export default class SiteMenu {
  constructor(menuData) {
    this._menuData = menuData;
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
    return `<nav class="trip-controls__trip-tabs  trip-tabs">
      ${this._menuData.map(({name, isActive}) => `<a class="trip-tabs__btn
      ${isActive ? ` trip-tabs__btn--active` : ``}"
      href="#">${name}</a>`
        .trim())
        .join(``)}
    </nav>`.trim();
  }
}
