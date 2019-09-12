import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import util from '../util.js';
import constant from '../constant.js';
import Statistics from '../components/statistics.js';
import moment from 'moment';

const MS_IN_DAY = 86400000;
const MS_IN_HOUR = 3600000;

const emojiMap = {
  'taxi': `🚕`,
  'bus': `🚌`,
  'train': `🚂`,
  'ship': `🚢`,
  'transport': `🚈`,
  'drive': `🚗`,
  'flight': `🛫`,
  'check-in': `🏨`,
  'sightseeing': `🏰`,
  'restaurant': `🥗`,
};

export class StatisticsController {
  constructor(container) {
    this._container = container;
    this._events = [];
    this._statistics = new Statistics();
    this._statisticsElement = this._statistics.getElement();
    this._moneyChart = null;
    this._transportChart = null;
    this._timeChart = null;
    this._typesForMoneyChart = [];
    this._sumsForMoneyChart = [];
    this._typesForTransportChart = [];
    this._countsForTransportChart = [];
    this._typesForTimeChart = [];
    this._durationsForTimeChart = [];

    this._init();
  }

  hide() {
    if (!util.isElementContainsClass(this._statisticsElement, `visually-hidden`)) {
      this._statisticsElement.classList.add(`visually-hidden`);
    }
  }

  show(events) {
    if (events !== this._events) {
      this._events = events;
    }

    this._createDataForChars(this._events);
    this._renderChars();

    this._statisticsElement.classList.remove(`visually-hidden`);
  }

  _init() {
    util.render(this._container, this._statisticsElement, constant.Position.AFTERBEGIN);
    this._statisticsElement.classList.add(`visually-hidden`);

    this._setCharts();
  }

  _renderChars() {
    this._moneyChart.data.labels = this._typesForMoneyChart;
    this._moneyChart.data.datasets[0].data = this._sumsForMoneyChart;
    this._transportChart.data.labels = this._typesForTransportChart;
    this._transportChart.data.datasets[0].data = this._countsForTransportChart;
    this._timeChart.data.labels = this._typesForTimeChart;
    this._timeChart.data.datasets[0].data = this._durationsForTimeChart;
    this._moneyChart.update();
    this._transportChart.update();
    this._timeChart.update();
  }

  _getDuration(durationInMs) {
    let durationString;
    if (durationInMs >= MS_IN_DAY) {
      const numberOfDays = util.getNumberWithZero(Math.floor(durationInMs / MS_IN_DAY));
      durationString = `${numberOfDays}D ${moment.utc(durationInMs).format(`HH[H] mm[M]`)}`;
    } else if (durationInMs < MS_IN_DAY && durationInMs >= MS_IN_HOUR) {
      durationString = moment.utc(durationInMs).format(`HH[H] mm[M]`);
    } else {
      durationString = moment.utc(durationInMs).format(`mm[M]`);
    }

    return durationString;
  }

  _createDataForChars(events) {
    const allTypes = Array.from(new Set(events.map(({type}) => type.name)));
    const transportTypes = Array.from(new Set(
        events
        .filter(({type}) => type.isMoving)
        .map(({type}) => type.name)));
    const typesWithData = [];
    const transportTypesWithData = [];

    const getTypesArray = (types, newTypesArray) => {
      types.forEach((name) => {
        const sum = events.reduce((sumCost, event) => {
          if (event.type.name === name) {
            sumCost += event.price;
          }
          return sumCost;
        }, 0);

        const count = events.filter(({type}) => type.name === name).length;

        const duration = events.reduce((sumDuration, event) => {
          if (event.type.name === name) {
            const durationInMs = event.timeEnd - event.timeStart;
            sumDuration += durationInMs;
          }
          return sumDuration;
        }, 0);

        newTypesArray.push({
          type: name,
          sum,
          count,
          duration,
        });
      });
    };

    getTypesArray(allTypes, typesWithData);
    getTypesArray(transportTypes, transportTypesWithData);

    const sortedTypesBySum = typesWithData.slice().sort((left, right) => {
      return right.sum - left.sum;
    });

    const sortedTransportTypesByCount = transportTypesWithData.slice()
    .sort((left, right) => {
      return right.count - left.count;
    });

    const sortedTypesByDuration = typesWithData.slice().sort((left, right) => {
      return right.duration - left.duration;
    });

    this._typesForMoneyChart = sortedTypesBySum.map(({type}) => emojiMap[type] + ` ` + type.toUpperCase());
    this._sumsForMoneyChart = sortedTypesBySum.map(({sum}) => sum);

    this._typesForTransportChart = sortedTransportTypesByCount.map(({type}) => emojiMap[type] + ` ` + type.toUpperCase());
    this._countsForTransportChart = sortedTransportTypesByCount.map(({count}) => count);

    this._typesForTimeChart = sortedTypesByDuration.map(({type}) => emojiMap[type] + ` ` + type.toUpperCase());
    this._durationsForTimeChart = sortedTypesByDuration.map(({duration}) => duration);
  }

  _setCharts() {
    const moneyCtx = this._statisticsElement.querySelector(`.statistics__chart--money`);
    const transportCtx = this._statisticsElement.querySelector(`.statistics__chart--transport`);
    const timeCtx = this._statisticsElement.querySelector(`.statistics__chart--time`);

    this._moneyChart = new Chart(moneyCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: this._typesForMoneyChart,
        datasets: [{
          data: this._sumsForMoneyChart,
          backgroundColor: `#ffffff`,
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 11,
            },
            color: `#000000`,
            formatter(value) {
              return `€ ` + value;
            },
            anchor: `end`,
            align: `right`,
          }
        },
        title: {
          display: true,
          text: `MONEY`,
          fontSize: 25,
          fontColor: `#000000`,
          position: `left`,
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              fontColor: `#000000`,
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }],
          xAxes: [{
            ticks: {
              beginAtZero: true,
              display: false,
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }]
        },
        legend: {
          display: false,
        },
        layout: {
          padding: {
            left: 70,
            right: 50,
          }
        },
        tooltips: {
          enabled: false,
        },
      },
    });

    this._transportChart = new Chart(transportCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: this._typesForTransportChart,
        datasets: [{
          data: this._countsForTransportChart,
          backgroundColor: `#ffffff`,
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 11,
            },
            color: `#000000`,
            formatter(value) {
              return value + `x`;
            },
            anchor: `end`,
            align: `right`,
          }
        },
        tooltips: {
          enabled: false,
        },
        title: {
          display: true,
          text: `TRANSPORT`,
          fontSize: 25,
          fontColor: `#000000`,
          position: `left`,
        },
        legend: {
          display: false,
        },
        layout: {
          padding: {
            left: 70,
            right: 50,
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              fontColor: `#000000`,
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }],
          xAxes: [{
            ticks: {
              beginAtZero: true,
              display: false,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
          }],
        },
      }
    });

    this._timeChart = new Chart(timeCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: this._typesForTimeChart,
        datasets: [{
          data: this._durationsForTimeChart,
          backgroundColor: `#ffffff`,
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 11,
            },
            color: `#000000`,
            formatter: (value) => {
              return this._getDuration(value);
            },
            anchor: `end`,
            align: `right`,
          }
        },
        tooltips: {
          enabled: false,
        },
        title: {
          display: true,
          text: `TIME SPENT`,
          fontSize: 25,
          fontColor: `#000000`,
          position: `left`,
        },
        legend: {
          display: false,
        },
        layout: {
          padding: {
            left: 70,
            right: 50,
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              fontColor: `#000000`,
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }],
          xAxes: [{
            ticks: {
              beginAtZero: true,
              display: false,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
          }],
        },
      }
    });
  }
}
