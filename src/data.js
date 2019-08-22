import util from './util.js';

const MIN_SENTENСES_COUNT = 1;
const MAX_SENTENСES_COUNT = 3;
const DAYS_COUNT = 7;
const HOURS_COUNT = 24;
const MIN_COUNT = 60;
const SEC_COUNT = 60;
const MS_COUNT = 1000;
const MIN_PRICE = 0;
const MAX_PRICE = 1000;

const getWeekInMs = () => Math.floor(Math.random() * DAYS_COUNT) * HOURS_COUNT * MIN_COUNT * SEC_COUNT * MS_COUNT;
const getRandomPhoto = () => `http://picsum.photos/300/150?r=${Math.random()}`;

export const getEventData = () => ({
  types: [
    {
      name: `taxi`,
      isMoving: true,
      isChecked: false,
    },
    {
      name: `bus`,
      isMoving: true,
      isChecked: false,
    },
    {
      name: `train`,
      isMoving: true,
      isChecked: false,
    },
    {
      name: `ship`,
      isMoving: true,
      isChecked: false,
    },
    {
      name: `transport`,
      isMoving: true,
      isChecked: false,
    },
    {
      name: `drive`,
      isMoving: true,
      isChecked: false,
    },
    {
      name: `flight`,
      isMoving: true,
      isChecked: true,
    },
    {
      name: `check-in`,
      isMoving: false,
      isChecked: false,
    },
    {
      name: `sightseeing`,
      isMoving: false,
      isChecked: false,
    },
    {
      name: `restaurant`,
      isMoving: false,
      isChecked: false,
    },
  ],
  cities: [
    `Amsterdam`,
    `Geneva`,
    `Chamonix`,
    `Saint Petersburg`,
    `Paris`,
    `London`,
    `Prague`,
  ],
  photos: new Array(util.getScale(3, 8)).fill(``).map(getRandomPhoto),
  description:
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`
  .split(`. `)
  .sort(() => Math.random() - 0.5)
  .splice(MIN_SENTENСES_COUNT, Math.round(Math.random() * MAX_SENTENСES_COUNT)),
  options: [
    {
      name: `Add luggage`,
      cost: 10,
      isChecked: util.getRandomBoolean(),
    },
    {
      name: `Switch to comfort class`,
      cost: 150,
      isChecked: util.getRandomBoolean(),
    },
    {
      name: `Add meal`,
      cost: 2,
      isChecked: util.getRandomBoolean(),
    },
    {
      name: `Choose seats`,
      cost: 9,
      isChecked: util.getRandomBoolean(),
    },
  ],
  timeStart: Date.now() - getWeekInMs() - util.getMs(),
  price: util.getScale(MIN_PRICE, MAX_PRICE),
  isFavorite: util.getRandomBoolean(),
});

export const getMenuData = () => ([
  {
    name: `Table`,
    isActive: true,
  },
  {
    name: `Stats`,
    isActive: false,
  },
]);

export const getFilterData = () => ([
  {
    name: `everything`,
    isChecked: true,
  },
  {
    name: `future`,
    isChecked: false,
  },
  {
    name: `past`,
    isChecked: false,
  },
]);

export const getSortingData = () => ([
  {
    name: `event`,
    isChecked: true,
    isArrow: false,
  },
  {
    name: `time`,
    isChecked: false,
    isArrow: true,
  },
  {
    name: `price`,
    isChecked: false,
    isArrow: true,
  },
]);
