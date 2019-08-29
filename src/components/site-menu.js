import AbstractComponent from './abstract-component.js';

export default class SiteMenu extends AbstractComponent {
  constructor(menuData) {
    super();
    this._menuData = menuData;
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
