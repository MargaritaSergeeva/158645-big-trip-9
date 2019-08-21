const MIN_COUNT = 60;
const SEC_COUNT = 60;
const MS_COUNT = 1000;

const getEventTitle = (eventType) => {
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
};

const getMinutesForTime = (time) => {
  let numberOfTime = time;

  if (numberOfTime !== 0) {
    if (numberOfTime < 10) {
      numberOfTime = `0` + numberOfTime;
    }
  } else {
    numberOfTime = ``;
  }

  return numberOfTime;
};

const getDuration = (start, end) => {
  const duration = end - start;
  const durationInMin = duration / MS_COUNT / SEC_COUNT;
  const numberOfHours = Math.floor(durationInMin / MIN_COUNT);
  let numberOfMinutes = Math.round(durationInMin - (Math.floor(durationInMin / MIN_COUNT) * MIN_COUNT));

  numberOfMinutes = getMinutesForTime(numberOfMinutes);

  return `${numberOfHours}H ${numberOfMinutes}M`;
};

export const getEventTemplate = ({type, city, options, dateFrom, dateTo, price}) => (
  `<div class="event">
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${getEventTitle(type)} ${city}</h3>

    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${(new Date(dateFrom)).toISOString()}">${(new Date(dateFrom)).getHours()}:${getMinutesForTime((new Date(dateFrom)).getMinutes())}</time>
        &mdash;
        <time class="event__end-time" datetime="${(new Date(dateTo)).toISOString()}">${(new Date(dateTo)).getHours()}:${getMinutesForTime((new Date(dateTo)).getMinutes())}</time>
      </p>
      <p class="event__duration">${getDuration(dateFrom, dateTo)}</p>
    </div>

    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${price}</span>
    </p>

    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${options.map(({optionName, optionPrice}) => `<li class="event__offer">
        <span class="event__offer-title">${optionName}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${optionPrice}</span>
      </li>`
      .trim())
      .join(``)}
    </ul>

    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>`.trim()
);
