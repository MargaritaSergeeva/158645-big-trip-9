const getMenuPointTemplate = (text, isActive = false) => (
  `<a class="trip-tabs__btn
  ${isActive ? ` trip-tabs__btn--active` : ``}"
  href="#">${text}</a>`
);

export const getSiteMenuTemplate = () => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
    ${getMenuPointTemplate(`Table`, true)}
    ${getMenuPointTemplate(`Stats`)}
  </nav>`
);
