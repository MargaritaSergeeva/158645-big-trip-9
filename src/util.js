import constant from './constant.js';

const SINGLE_DIGIT_LIMIT = 10;
const MIN_MS_COUNT = 36000;
const MAX_MS_COUNT = 360000000;

export default {
  getScale(min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  },

  getRandomBoolean() {
    return Boolean(Math.round(Math.random()));
  },

  getRandomIndex(arr) {
    return Math.floor(Math.random() * arr.length);
  },

  getMs() {
    return Math.floor(MIN_MS_COUNT + Math.random() * (MAX_MS_COUNT + 1 - MIN_MS_COUNT));
  },

  getEventTitle(eventType) {
    let title;

    switch (eventType) {
      case `taxi`:
        title = `Taxi to`;
        break;
      case `bus`:
        title = `Bus to`;
        break;
      case `train`:
        title = `Train to`;
        break;
      case `ship`:
        title = `Ship to`;
        break;
      case `transport`:
        title = `Transport to`;
        break;
      case `drive`:
        title = `Drive to`;
        break;
      case `flight`:
        title = `Flight to`;
        break;
      case `check-in`:
        title = `Check in`;
        break;
      case `sightseeing`:
        title = `Sightseeing in`;
        break;
      case `restaurant`:
        title = `Restaurant in`;
        break;
      default:
        title = `Trip to`;
    }

    return title;
  },

  getNumberWithZero(number) {
    return number < SINGLE_DIGIT_LIMIT ? `0` + number : number;
  },

  createElement(template) {
    const newElement = document.createElement(`div`);
    newElement.innerHTML = template;
    return newElement.firstChild;
  },

  render(container, element, place) {
    switch (place) {
      case constant.Position.AFTERBEGIN:
        container.prepend(element);
        break;
      case constant.Position.BEFOREEND:
        container.append(element);
        break;
      case constant.Position.AFTER:
        container.after(element);
        break;
    }
  },

  unrender(element) {
    if (element) {
      element.remove();
    }
  },

  isElementContainsClass(element, className) {
    return element.classList.contains(className);
  },

  isElementChecked(element) {
    return element.checked;
  },

  cleanElement(element) {
    element.innerHTML = ``;
  },
};
