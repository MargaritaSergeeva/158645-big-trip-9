const getFilterPointTemplate = (value, text, isChecked = false) => (
  `<div class="trip-filters__filter">
    <input id="filter-${value}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${value}"
    ${isChecked ? ` checked` : ``}>
    <label class="trip-filters__filter-label" for="filter-${value}">${text}</label>
  </div>`
);

export const getFilterTemplate = () => (
  `<form class="trip-filters" action="#" method="get">
    ${getFilterPointTemplate(`everything`, `Everything`, true)}
    ${getFilterPointTemplate(`future`, `Future`)}
    ${getFilterPointTemplate(`past`, `Past`)}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);
