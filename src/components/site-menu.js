export const getSiteMenuTemplate = (menuData) => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
    ${menuData.map(({name, isActive}) => `<a class="trip-tabs__btn
    ${isActive ? ` trip-tabs__btn--active` : ``}"
    href="#">${name}</a>`
      .trim())
      .join(``)}
  </nav>`.trim()
);
