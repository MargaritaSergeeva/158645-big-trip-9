import util from '../util.js';
import constant from '../constant.js';
import {getMenuData, getFilterData} from '../data.js';
import SiteMenu from '../components/site-menu.js';
import MainTrip from '../components/title-trip.js';
import Filter from '../components/filter.js';

export class HeaderController {
  constructor(onFilterChange, onSiteMenuClick, onNewEventBtnClick) {
    this._headerElement = document.querySelector(`.page-header`);
    this._tripInfoElement = this._headerElement.querySelector(`.trip-info`);
    this._tripControlsElement = this._headerElement.querySelector(`.trip-controls`);
    this._totalElement = this._headerElement.querySelector(`.trip-info__cost-value`);
    this._tripControlHeadersElements = this._tripControlsElement.querySelectorAll(`h2`);
    this._siteMenuContainerElement = this._tripControlHeadersElements[0];
    this._filterContainerElement = this._tripControlHeadersElements[1];
    this._newEventBtn = this._headerElement.querySelector(`.trip-main__event-add-btn`);
    this._defaultCheckedMenuBtn = null;

    this._siteMenuComponent = new SiteMenu(getMenuData());
    this._filterComponent = new Filter(getFilterData());
    this._titleTripComponent = null;

    this._mainOnSiteMenuClick = onSiteMenuClick;
    this._onFilterChange = onFilterChange;
    this._onNewEventBtnClick = onNewEventBtnClick;

    this._filterMode = null;

    this._init();
  }

  render(events, unicDays, cities) {
    if (this._titleTripComponent) {
      util.unrender(this._titleTripComponent.getElement());
      this._titleTripComponent.removeElement();
    }

    this._titleTripComponent = new MainTrip(cities, unicDays);

    util.render(this._tripInfoElement, this._titleTripComponent.getElement(), constant.Position.AFTERBEGIN);
    this._renderTotalPrice(events);
  }

  clean() {
    if (this._titleTripComponent) {
      util.unrender(this._titleTripComponent.getElement());
      this._titleTripComponent.removeElement();
    }

    this._totalElement.textContent = 0;
  }

  _init() {
    util.render(this._siteMenuContainerElement, this._siteMenuComponent.getElement(), constant.Position.AFTER);
    util.render(this._filterContainerElement, this._filterComponent.getElement(), constant.Position.AFTER);

    this._defaultCheckedMenuBtn = this._siteMenuComponent.getElement().querySelector(`.trip-tabs__btn--table`);

    this._siteMenuComponent.getElement().addEventListener(`click`, (evt) => this._onSiteMenuClick(evt));
    this._filterComponent.getElement().addEventListener(`click`, (evt) => this._onFilterClick(evt));
    this._newEventBtn.addEventListener(`click`, (evt) => this._onNewEventBtnClick(evt));
  }

  _renderTotalPrice(eventsArr) {
    let totalPrice = 0;
    eventsArr.forEach((it) => {
      totalPrice += it.price;
    });

    this._totalElement.textContent = totalPrice;
  }

  _onFilterClick(evt) {
    if (util.isElementContainsClass(evt.target, `trip-filters__filter-input`)) {
      switch (evt.target.value) {
        case constant.FilterMode.EVERYTHING:
          this._filterMode = constant.FilterMode.EVERYTHING;
          break;
        case constant.FilterMode.FUTURE:
          this._filterMode = constant.FilterMode.FUTURE;
          break;
        case constant.FilterMode.PAST:
          this._filterMode = constant.FilterMode.PAST;
          break;
      }

      this._resetCheckingBtn();
      this._defaultCheckedMenuBtn.classList.add(`trip-tabs__btn--active`);

      this._onFilterChange(this._filterMode);
    }
  }
  _resetCheckingBtn() {
    const siteMenuBtnElements = this._siteMenuComponent.getElement().querySelectorAll(`.trip-tabs__btn`);
    Array.from(siteMenuBtnElements).forEach((button) => {
      button.classList.remove(`trip-tabs__btn--active`);
    });
  }

  _onSiteMenuClick(evt) {
    if (util.isElementContainsClass(evt.target, `trip-tabs__btn`)) {
      this._resetCheckingBtn();
      evt.target.classList.add(`trip-tabs__btn--active`);

      this._mainOnSiteMenuClick(evt);
    }
  }
}
