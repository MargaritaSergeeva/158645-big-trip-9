import constant from '../constant.js';
import util from '../util.js';
import Filter from '../components/filter.js';
import {getFilterData} from '../data.js';

export class FilterController {
  constructor(container, onFilterChange) {
    this._container = container;
    this._allEvents = [];
    this._filteredEvents = [];
    this._filterComponent = new Filter(getFilterData());
    this._filterElement = this._filterComponent.getElement();
    this._onFilterChange = onFilterChange;

    this._init();
  }

  setData(allEvents) {
    this._allEvents = allEvents;
  }

  _init() {
    util.render(this._container, this._filterElement, constant.Position.AFTER);
    this._filterElement.addEventListener(`click`, (evt) => this._onFilterClick(evt));
  }

  _onFilterClick(evt) {
    if (util.isElementContainsClass(evt.target, `trip-filters__filter-input`)) {
      switch (evt.target.value) {
        case `everything`:
          this._onFilterChange(this._allEvents);
          break;
        case `future`:
          this._filteredEvents = this._allEvents.filter(({timeStart}) => timeStart > Date.now());
          this._onFilterChange(this._filteredEvents);
          break;
        case `past`:
          this._filteredEvents = this._allEvents.filter(({timeEnd}) => timeEnd < Date.now());
          this._onFilterChange(this._filteredEvents);
          break;
      }
    }
  }
}
