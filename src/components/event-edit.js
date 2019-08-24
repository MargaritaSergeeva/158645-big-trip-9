import util from '../util.js';

export const getEditEventTemplate = ({types, type, cities, city, options, checkedOptions, timeStart, timeEnd, price, description, photos, isFavorite}) => (
  `<li class="trip-events__item">
    <form class="event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>
              ${types.filter((it) => it.isMoving)
                .map(({name, isChecked}) => `<div class="event__type-item">
                  <input id="event-type-${name}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${name}"
                  ${isChecked ? ` checked` : ``}>
                  <label class="event__type-label  event__type-label--${name}" for="event-type-${name}-1">${name}</label>
                </div>`
              .trim())
              .join(``)}}
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
              ${types.filter((it) => !it.isMoving)
                .map(({name, isChecked}) => `<div class="event__type-item">
                  <input id="event-type-${name}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${name}"
                  ${isChecked ? ` checked` : ``}>
                  <label class="event__type-label  event__type-label--${name}" for="event-type-${name}-1">${name}</label>
                </div>`
              .trim())
              .join(``)}}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${util.getEventTitle(type)}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${cities.map((it) => `<option value="${it}"></option>`
            .trim())
            .join(``)}}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${util.getNumberWithZero(new Date(timeStart).getDate())}/${util.getNumberWithZero(new Date(timeStart).getMonth() + 1)}/${new Date(timeStart).getFullYear()} ${(new Date(timeStart)).getHours()}:${util.getNumberWithZero((new Date(timeStart)).getMinutes())}">
          &ndash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${util.getNumberWithZero(new Date(timeEnd).getDate())}/${util.getNumberWithZero(new Date(timeEnd).getMonth() + 1)}/${new Date(timeEnd).getFullYear()} ${(new Date(timeEnd)).getHours()}:${util.getNumberWithZero((new Date(timeEnd)).getMinutes())}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>

        <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite"
        ${isFavorite ? ` checked` : ``}>
        <label class="event__favorite-btn" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>

      <section class="event__details">

        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
            ${options.map((option) => `
              <div class="event__offer-selector">
                <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage"
                ${checkedOptions.filter(({name}) => option.name === name).map(({isChecked}) => isChecked ? ` checked` : ``)}>
                <label class="event__offer-label" for="event-offer-luggage-1">
                  <span class="event__offer-title">${option.name}</span>
                  &plus;
                  &euro;&nbsp;<span class="event__offer-price">${option.cost}</span>
                </label>
              </div>`
            .trim())
            .join(``)}
          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${description}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${photos.map((photo) => `<img class="event__photo" src="${photo}" alt="Event photo">`
              .trim())
              .join(``)}
            </div>
          </div>
        </section>
      </section>
    </form>
  </li>`.trim()
);
