const TYPE_ARRAY_LENGTH = 10;
const CITY_ARRAY_LENGTH = 7;
const MIN_SENTENСES_COUNT = 1;
const MAX_SENTENСES_COUNT = 3;
const DAYS_COUNT = 7;
const HOURS_COUNT = 24;
const MIN_COUNT = 60;
const SEC_COUNT = 60;
const MS_COUNT = 1000;
const MIN_PRICE = 0;
const MAX_PRICE = 1000;
const MIN_OPTION_COUNT = 0;
const MAX_OPTION_COUNT = 2;
const MIN_MS_COUNT = 360000;
const MAX_MS_COUNT = 3600000;

const getWeekInMs = () => Math.floor(Math.random() * DAYS_COUNT) * HOURS_COUNT * MIN_COUNT * SEC_COUNT * MS_COUNT;
const getMs = () => Math.floor(MIN_MS_COUNT + Math.random() * (MAX_MS_COUNT + 1 - MIN_MS_COUNT));

export const getEventData = () => ({
  type: [
    `taxi`,
    `bus`,
    `train`,
    `ship`,
    `transport`,
    `drive`,
    `flight`,
    `check-in`,
    `sightseeing`,
    `restaurant`,
  ][Math.floor(Math.random() * TYPE_ARRAY_LENGTH)],
  city: [
    `Amsterdam`,
    `Geneva`,
    `Chamonix`,
    `Saint Petersburg`,
    `Paris`,
    `London`,
    `Prague`,
  ][Math.floor(Math.random() * CITY_ARRAY_LENGTH)],
  photo: `http://picsum.photos/300/150?r=${Math.random()}`,
  description: [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    `Cras aliquet varius magna, non porta ligula feugiat eget.`,
    `Fusce tristique felis at fermentum pharetra.`,
    `Aliquam id orci ut lectus varius viverra.`,
    `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
    `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
    `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
    `Sed sed nisi sed augue convallis suscipit in sed felis.`,
    `Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.`,
    `In rutrum ac purus sit amet tempus.`
  ]
  .sort(() => Math.random() - 0.5)
  .splice(MIN_SENTENСES_COUNT, Math.round(Math.random() * MAX_SENTENСES_COUNT)),
  options: [
    {
      optionName: `Add luggage`,
      optionPrice: 10,
      isChecked: Boolean(Math.round(Math.random())),
    },
    {
      optionName: `Switch to comfort class`,
      optionPrice: 150,
      isChecked: Boolean(Math.round(Math.random())),
    },
    {
      optionName: `Add meal`,
      optionPrice: 2,
      isChecked: Boolean(Math.round(Math.random())),
    },
    {
      optionName: `Choose seats`,
      optionPrice: 9,
      isChecked: Boolean(Math.round(Math.random())),
    },
  ]
  .filter((it) => it.isChecked)
  .splice(MIN_OPTION_COUNT, Math.round(Math.random() * MAX_OPTION_COUNT)),
  get dateFrom() {
    return Date.now() - getWeekInMs();
  },
  get dateTo() {
    return Date.now() + getMs();
  },
  get price() {
    return Math.floor(MIN_PRICE + Math.random() * (MAX_PRICE + 1 - MIN_PRICE));
  },
});
