import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';
import moment from 'moment';
import constant from '../constant.js';
import util from '../util.js';
import keyBoard from '../keyboard.js';
import EventEdit from '../components/event-edit.js';
import Event from '../components/event.js';

export class EventController {
  constructor(container, eventData, mode, onChangeView, onDataChange) {
    this._container = container;
    this._eventData = eventData;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._eventView = mode === constant.Mode.DEFAULT ? new Event(eventData) : null;
    this._eventEdit = new EventEdit(eventData);
    this._newEventData = this._eventData;
    this._mode = mode;

    this.init(this._mode);
  }

  init(mode) {
    const startTimeInputElement = this._eventEdit.getElement().querySelector(`#event-start-time-1`);
    const endTimeInputElement = this._eventEdit.getElement().querySelector(`#event-end-time-1`);
    const formEditElement = this._eventEdit.getElement().querySelector(`.event--edit`);
    const closeBtnElement = this._eventEdit.getElement().querySelector(`.event__rollup-btn`);
    const deleteBtnElement = this._eventEdit.getElement().querySelector(`.event__reset-btn`);

    let currentView = this._eventView;

    const onEscKeyDown = (evt) => {
      if (keyBoard.isEscPressed(evt)) {
        if (mode === constant.Mode.ADDING) {
          this._container.removeChild(currentView.getElement());
          this._onDataChange();
        } else {
          this._container.replaceChild(this._eventView.getElement(), this._eventEdit.getElement());
        }

        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    if (mode === constant.Mode.ADDING) {
      currentView = this._eventEdit;
      document.addEventListener(`keydown`, onEscKeyDown);
    }

    const startTimeCalendar = flatpickr(startTimeInputElement, {
      altInput: true,
      defaultDate: this._eventEdit.timeStart,
      enableTime: true,
      altFormat: `d/m/y H:i`,
      dateFormat: `d/m/y H:i`,
      maxDate: endTimeInputElement.value,
      onChange(selDates, dateStr) {
        endTimeCalendar.set(`minDate`, dateStr);
      },
    });

    const endTimeCalendar = flatpickr(endTimeInputElement, {
      altInput: true,
      defaultDate: this._eventEdit.timeStart,
      enableTime: true,
      altFormat: `d/m/y H:i`,
      dateFormat: `d/m/y H:i`,
      minDate: startTimeInputElement.value,
      onChange(selDates, dateStr) {
        startTimeCalendar.set(`maxDate`, dateStr);
      },
    });

    if (this._eventView) {
      const openBtnElement = this._eventView.getElement().querySelector(`.event__rollup-btn`);
      openBtnElement.addEventListener(`click`, () => {
        this._onChangeView();
        this._container.replaceChild(this._eventEdit.getElement(), this._eventView.getElement());
        document.addEventListener(`keydown`, onEscKeyDown);
      });
    }

    closeBtnElement.addEventListener(`click`, () => {
      this._container.replaceChild(this._eventView.getElement(), this._eventEdit.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    formEditElement.addEventListener(`submit`, (evt) => {
      evt.preventDefault(evt);
      this._fillNewEventData(formEditElement);
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    deleteBtnElement.addEventListener(`click`, () => {
      this._onDataChange(null, this._taskData);
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    util.render(this._container, currentView.getElement(), constant.Position.BEFOREEND);
  }

  setDefaultView() {
    if (this._container.contains(this._eventEdit.getElement())) {
      this._container.replaceChild(this._eventView.getElement(), this._eventEdit.getElement());
    }
  }

  _fillNewEventData(form) {
    const allTypesElements = this._eventEdit.getElement().querySelectorAll(`.event__type-input`);
    const favoriteInputElement = this._eventEdit.getElement().querySelector(`#event-favorite-1`);

    const formData = new FormData(form);
    const checkedTypeName = Array.from(allTypesElements).filter((it) => it.checked).map((it) => it.value).join(``);

    this._newEventData.type = this._newEventData.types.find((it) => it.name === checkedTypeName);
    this._newEventData.type.isChecked = true;
    if (this._newEventData.type.options) {
      this._newEventData.type.options.forEach((option) => {
        option.isChecked = formData.getAll(`event-offer`).some((it) => it === option.name);
      });
    }
    this._newEventData.timeStart = formData.get(`event-start-time`) ? +moment(formData.get(`event-start-time`), `DD/MM/YY HH:mm`).format(`x`) : ``;
    this._newEventData.timeEnd = formData.get(`event-end-time`) ? +moment(formData.get(`event-end-time`), `DD/MM/YY HH:mm`).format(`x`) : ``;
    this._newEventData.price = +formData.get(`event-price`);
    this._newEventData.isFavorite = favoriteInputElement.checked;
    this._newEventData.city = this._newEventData.cities.find((city) => city.name === formData.get(`event-destination`));

    this._onDataChange(this._newEventData, this._mode === constant.Mode.DEFAULT ? this._eventData : null);

    if (this._mode === constant.Mode.ADDING) {
      this._eventView = new Event(this._newEventData);
    }

    this._container.replaceChild(this._eventView.getElement(), this._eventEdit.getElement());
  }
}
