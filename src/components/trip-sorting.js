const getSortingArrowTemplate = () => (
  `<svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
    <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
  </svg>`
);

const getSortingPointTemplate = (value) => (
  `<span class="trip-sort__item  trip-sort__item--${value}">${value[0].toUpperCase() + value.slice(1)}</span>`
);

const getSortingInputTemplate = (value, isArrow = false, isChecked = false) => (
  `<div class="trip-sort__item  trip-sort__item--${value}">
    <input id="sort-${value}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${value}"
    ${isChecked ? ` checked` : ``}>
    <label class="trip-sort__btn" for="sort-${value}">
    ${value[0].toUpperCase() + value.slice(1)}
    ${isArrow ? getSortingArrowTemplate() : ``}>
    </label>
  </div>`
);

export const getTripSortingTemplate = () => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${getSortingPointTemplate(`day`)}
    ${getSortingInputTemplate(`event`, false, true)}
    ${getSortingInputTemplate(`time`, true)}
    ${getSortingInputTemplate(`price`, true)}
    ${getSortingPointTemplate(`offers`)}
  </form>`
);