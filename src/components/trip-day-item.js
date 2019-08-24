import {getEditEventTemplate} from './event-edit.js';
import {getEventTemplate} from './event.js';

const renderEvents = (day, [firstEvent, ...otherEvents], index) => {
  let event;

  if (index === 0) {
    event = `${getEditEventTemplate(firstEvent)}
    ${otherEvents
      .filter(({timeStart}) => (new Date(timeStart)).toDateString() === day)
      .map((it) => getEventTemplate(it))
      .join(``)}`
    .trim();
  } else {
    event = `${otherEvents
      .filter(({timeStart}) => (new Date(timeStart)).toDateString() === day)
      .map((it) => getEventTemplate(it))
      .join(``)}`
    .trim();
  }

  return event;
};

export const getTripDayItemTemplate = (day, events, index) => (
  `<li class="trip-days__item  day">
    <div class="day__info">
      <span class="day__counter">${index + 1}</span>
      <time class="day__date" datetime="2019-03-18">${day.slice(4, 11)}</time>
    </div>

    <ul class="trip-events__list">
      ${renderEvents(day, events, index)}
    </ul>
  </li>`.trim()
);
