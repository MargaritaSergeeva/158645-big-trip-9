import {getTripDayItemTemplate} from './trip-day-item.js';

const renderDays = (days, events) => (
  days.map((day, index) => getTripDayItemTemplate(day, events, index)).join(``)
);

export const getTripDaysListTemplate = (days, events) => (
  `<ul class="trip-days">
    ${renderDays(days, events)}
  </ul>`.trim()
);
