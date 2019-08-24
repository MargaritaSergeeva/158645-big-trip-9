import util from '../util.js';

const HOURS_COUNT = 24;
const MIN_COUNT = 60;
const SEC_COUNT = 60;
const MS_COUNT = 1000;

const getDuration = (start, end) => {
  const duration = end - start;
  const durationInMin = duration / MS_COUNT / SEC_COUNT;
  const numberOfDays = Math.floor(durationInMin / MIN_COUNT / HOURS_COUNT);
  const numberOfHours = Math.floor((durationInMin - numberOfDays * MIN_COUNT * HOURS_COUNT) / MIN_COUNT);
  let numberOfMinutes = Math.round(durationInMin - (numberOfDays * MIN_COUNT * HOURS_COUNT) - (numberOfHours * MIN_COUNT));

  numberOfMinutes = util.getNumberWithZero(numberOfMinutes);

  return numberOfDays > 0 ? `${numberOfDays}D ${numberOfHours}H ${numberOfMinutes}M` : `${numberOfHours}H ${numberOfMinutes}M`;
};

export const getEventTemplate = ({type, city, checkedOptions, timeStart, timeEnd, price}) => (
  `<li class="trip-events__item">
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${util.getEventTitle(type)} ${city}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${(new Date(timeStart)).toISOString()}">${(new Date(timeStart)).getHours()}:${util.getNumberWithZero((new Date(timeStart)).getMinutes())}</time>
          &mdash;
          <time class="event__end-time" datetime="${(new Date(timeEnd)).toISOString()}">${(new Date(timeEnd)).getHours()}:${util.getNumberWithZero((new Date(timeEnd)).getMinutes())}</time>
        </p>
        <p class="event__duration">${getDuration(timeStart, timeEnd)}</p>
      </div>

      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>

      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${checkedOptions.map(({name, cost}) => `<li class="event__offer">
          <span class="event__offer-title">${name}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${cost}</span>
        </li>`
        .trim())
        .join(``)}
      </ul>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`.trim()
);
