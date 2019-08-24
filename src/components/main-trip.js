const FIRST_LETTER_INDEX = 4;
const LAST_LETTER_INDEX = 11;


const getMonthAndDate = (day) => {
  return day.slice(FIRST_LETTER_INDEX, LAST_LETTER_INDEX);
};

export const getMainTripTemplate = (cities, days) => (
  `<div class="trip-info__main">
    <h1 class="trip-info__title">${cities[0]} &mdash; ... &mdash; ${cities[cities.length - 1]}</h1>
    <p class="trip-info__dates">${getMonthAndDate(days[0])}&nbsp;&mdash;&nbsp;${getMonthAndDate(days[days.length - 1])}</p>
  </div>`.trim()
);
