import moment from 'moment';
import util from '../util.js';
import constant from '../constant.js';
import AbstractComponent from './abstract-component.js';

export default class EventEdit extends AbstractComponent {
  constructor(events) {
    super();
    this._types = events.types;
    this._type = events.type;
    this._cities = events.cities;
    this._city = events.city;
    this._options = events.type.options;
    this._timeStart = events.timeStart;
    this._timeEnd = events.timeEnd;
    this._price = events.price;
    this._description = events.city.description;
    this._photos = events.city.photos;
    this._isFavorite = events.isFavorite;

    this._subscribeOnEvents();
  }

  getTemplate() {
    return `<li class="trip-events__item">
      <form class="event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${this._type.name}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Transfer</legend>
                ${this._types.filter((it) => it.isMoving)
                  .map(({name}) => `<div class="event__type-item">
                    <input id="event-type-${name}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${name}"
                    ${this._isTypeChecked(name, this._type.name)}>
                    <label class="event__type-label  event__type-label--${name}" for="event-type-${name}-1">${name}</label>
                  </div>`
                .trim())
                .join(``)}
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Activity</legend>
                ${this._types.filter((it) => !it.isMoving)
                  .map(({name}) => `<div class="event__type-item">
                    <input id="event-type-${name}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${name}"
                    ${this._isTypeChecked(name, this._type.name)}>
                    <label class="event__type-label  event__type-label--${name}" for="event-type-${name}-1">${name}</label>
                  </div>`
                .trim())
                .join(``)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${util.getEventTitle(this._type.name)}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${this._city.name}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${this._cities.map((it) => `<option value="${it.name}"></option>`
              .trim())
              .join(``)}}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" datetime="${moment(this._timeStart).format()}" value="${moment(this._timeStart).format(`DD/MM/YY HH:mm`)}">
            &ndash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" datetime="${moment(this._timeEnd).format()}" value="${moment(this._timeEnd).format(`DD/MM/YY HH:mm`)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${this._price}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>

          <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite"
          ${this._isFavorite ? ` checked` : ``}>
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
              ${this._options ? `<h3 class="event__section-title  event__section-title--offers">Offers</h3>
                <div class="event__available-offers">
                  ${this._options.map((option) => `
                  <div class="event__offer-selector">
                    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${option.name}-1" type="checkbox" name="event-offer" value="${option.name}"
                    ${this._options.filter(({name}) => option.name === name).map(({isChecked}) => isChecked ? ` checked` : ``)}>
                    <label class="event__offer-label event__offer-label--${option.name}" for="event-offer-${option.name}-1">
                      <span class="event__offer-title">${option.description}</span>
                      &plus;
                      &euro;&nbsp;<span class="event__offer-price">${option.cost}</span>
                    </label>
                  </div>`
              .trim())
              .join(``)}` : ``}
            </div>
          </section>

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${this._description}</p>

            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${this._photos.map((photo) => `<img class="event__photo" src="${photo}" alt="Event photo">`
                .trim())
                .join(``)}
              </div>
            </div>
          </section>
        </section>
      </form>
    </li>`.trim();
  }

  _isTypeChecked(currentTypeName, checkedTypeName) {
    return currentTypeName === checkedTypeName ? ` checked` : ``;
  }

  _isElementContainsClass(element, className) {
    return element.classList.contains(className);
  }

  _isElementChecked(element) {
    return element.checked;
  }

  _switchCheckingElement(element) {
    element.checked = this._isElementChecked(element) ? false : true;
  }

  _subscribeOnEvents() {
    this.getElement().querySelector(`.event__section--offers`).addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (this._isElementContainsClass(evt.target, `event__offer-label`)) {
        const input = this.getElement().querySelector(`#${evt.target.htmlFor}`);
        this._switchCheckingElement(input);
      }

      if (this._isElementContainsClass(evt.target.parentNode, `event__offer-label`)) {
        const input = this.getElement().querySelector(`#${evt.target.parentNode.htmlFor}`);
        this._switchCheckingElement(input);
      }
    });


    this.getElement().querySelector(`.event__type-group`).addEventListener(`click`, (evt) => {

      if (this._isElementContainsClass(evt.target, `event__type-label`)) {
        const icon = this.getElement().querySelector(`.event__type-icon`);
        icon.src = `img/icons/${evt.target.textContent}.png`;

        const eventPlaceholder = this.getElement().querySelector(`.event__label`);
        eventPlaceholder.textContent = util.getEventTitle(evt.target.textContent);

        const options = this._types.find((type) => type.name === evt.target.textContent).options ? this._types.find((type) => type.name === evt.target.textContent).options : ``;
        this.getElement().querySelector(`.event__section--offers`).innerHTML = ``;
        this.getElement().querySelector(`.event__section--offers`).insertAdjacentHTML(constant.Position.BEFOREEND, `${options ? `<h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
            ${options.map((option) => `
            <div class="event__offer-selector">
              <input class="event__offer-checkbox  visually-hidden" id="event-offer-${option.name}-1" type="checkbox" name="event-offer" value="${option.name}">
              <label class="event__offer-label event__offer-label--${option.name}" for="event-offer-${option.name}-1">
                <span class="event__offer-title">${option.description}</span>
                &plus;
                &euro;&nbsp;<span class="event__offer-price">${option.cost}</span>
              </label>
            </div>`
        .trim())
        .join(``)}` : ``}`);
      }
    });


    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, (evt) => {
      const newCity = this._cities.find((city) => city.name === evt.target.value) ? this._cities.find((city) => city.name === evt.target.value) : ``;
      this.getElement().querySelector(`.event__section--destination`).innerHTML = ``;
      this.getElement().querySelector(`.event__section--destination`).insertAdjacentHTML(constant.Position.BEFOREEND, `<h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${newCity.description}</p>
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${newCity.photos.map((photo) => `<img class="event__photo" src="${photo}" alt="Event photo">`
          .trim())
          .join(``)}
        </div>
      </div>;`);
    });
  }
}
