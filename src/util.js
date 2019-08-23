const TOP_TEN = 10;
const MIN_MS_COUNT = 360000;
const MAX_MS_COUNT = 36000000;

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
        title = `Check into`;
        break;
      case `sightseeing`:
        title = `Sightseeing at`;
        break;
      case `restaurant`:
        title = `Restaurant at`;
        break;
      default:
        title = `Trip to`;
    }

    return title;
  },

  getNumberWithZero(number) {
    return number < TOP_TEN ? `0` + number : number;
  }
};
