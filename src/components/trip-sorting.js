import AbstractComponent from './abstract-component.js';

const getSortingArrowTemplate = () => (
  `<svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
    <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
  </svg>`.trim()
);

const getSortingPointTemplate = (value) => (
  `<span class="trip-sort__item  trip-sort__item--${value}">${value[0].toUpperCase() + value.slice(1)}</span>`.trim()
);

export default class TripSorting extends AbstractComponent {
  constructor(sorts) {
    super();
    this._sorts = sorts;
  }

  getTemplate() {
    return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${getSortingPointTemplate(`day`)}
      ${this._sorts.map(({name, isChecked, isArrow}) => `<div class="trip-sort__item  trip-sort__item--${name}">
        <input id="sort-${name}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${name}"
        ${isChecked ? ` checked` : ``}>
        <label class="trip-sort__btn" for="sort-${name}" data-sort-type="${name}">
        ${name}
        ${isArrow ? getSortingArrowTemplate() : ``}
        </label>
      </div>`
      .trim())
      .join(``)}
      ${getSortingPointTemplate(`offers`)}
    </form>`.trim();
  }
}
