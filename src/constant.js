export default {
  Position: {
    AFTERBEGIN: `afterbegin`,
    BEFOREEND: `beforeend`,
    AFTER: `after`,
  },

  Mode: {
    ADDING: `adding`,
    DEFAULT: `default`,
  },

  monthMap: {
    'Jan': `01`,
    'Feb': `02`,
    'Mar': `03`,
    'Apr': `04`,
    'May': `05`,
    'Jun': `06`,
    'Jul': `07`,
    'Aug': `08`,
    'Sep': `09`,
    'Oct': `10`,
    'Nov': `11`,
    'Dec': `12`,
  },

  defaultEvent: {
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
        options: [
          {
            name: `luggage`,
            description: `Add luggage`,
            cost: 10,
            isChecked: false,
          },
          {
            name: `seats`,
            description: `Choose seats`,
            cost: 9,
            isChecked: false,
          },
        ],
      },
      {
        name: `train`,
        isMoving: true,
        isChecked: false,
        options: [
          {
            name: `luggage`,
            description: `Add luggage`,
            cost: 10,
            isChecked: false,
          },
          {
            name: `comfort`,
            description: `Switch to comfort class`,
            cost: 150,
            isChecked: false,
          },
          {
            name: `meal`,
            description: `Add meal`,
            cost: 2,
            isChecked: false,
          },
          {
            name: `seats`,
            description: `Choose seats`,
            cost: 9,
            isChecked: false,
          },
        ],
      },
      {
        name: `ship`,
        isMoving: true,
        isChecked: false,
        options: [
          {
            name: `luggage`,
            description: `Add luggage`,
            cost: 10,
            isChecked: false,
          },
          {
            name: `comfort`,
            description: `Switch to comfort class`,
            cost: 150,
            isChecked: false,
          },
          {
            name: `meal`,
            description: `Add meal`,
            cost: 2,
            isChecked: false,
          },
          {
            name: `seats`,
            description: `Choose seats`,
            cost: 9,
            isChecked: false,
          },
        ],
      },
      {
        name: `transport`,
        isMoving: true,
        isChecked: false,
        options: [
          {
            name: `luggage`,
            description: `Add luggage`,
            cost: 10,
            isChecked: false,
          },
          {
            name: `comfort`,
            description: `Switch to comfort class`,
            cost: 150,
            isChecked: false,
          },
          {
            name: `meal`,
            description: `Add meal`,
            cost: 2,
            isChecked: false,
          },
          {
            name: `seats`,
            description: `Choose seats`,
            cost: 9,
            isChecked: false,
          },
          {
            name: `train`,
            description: `Travel by train`,
            cost: 40,
            isChecked: false,
          },
        ],
      },
      {
        name: `drive`,
        isMoving: true,
        isChecked: false,
      },
      {
        name: `flight`,
        isMoving: true,
        isChecked: false,
        options: [
          {
            name: `luggage`,
            description: `Add luggage`,
            cost: 10,
            isChecked: false,
          },
          {
            name: `comfort`,
            description: `Switch to comfort class`,
            cost: 150,
            isChecked: false,
          },
          {
            name: `meal`,
            description: `Add meal`,
            cost: 2,
            isChecked: false,
          },
          {
            name: `seats`,
            description: `Choose seats`,
            cost: 9,
            isChecked: false,
          },
        ],
      },
      {
        name: `check-in`,
        isMoving: false,
        isChecked: false,
        options: [
          {
            name: `comfort`,
            description: `Switch to comfort class`,
            cost: 150,
            isChecked: false,
          },
          {
            name: `meal`,
            description: `Add meal`,
            cost: 2,
            isChecked: false,
          },
        ],
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
    type: {
      name: `taxi`,
      isMoving: true,
      isChecked: true,
    },
    timeStart: Date.now(),
    timeEnd: Date.now(),
    price: ``,
    isFavorite: false,
  }
};
