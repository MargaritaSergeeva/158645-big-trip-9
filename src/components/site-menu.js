import AbstractComponent from './abstract-component.js';

export default class SiteMenu extends AbstractComponent {
  constructor(menuData) {
    super();
    this._menuData = menuData;
  }

  getTemplate() {
    return `<nav class="trip-controls__trip-tabs  trip-tabs">
      ${this._menuData.map(({name, isActive}) => `<a class="trip-tabs__btn trip-tabs__btn--${name}
      ${isActive ? ` trip-tabs__btn--active` : ``}"
      href="#">${name[0].toUpperCase() + name.slice(1)}</a>`
        .trim())
        .join(``)}
    </nav>`.trim();
  }
}
