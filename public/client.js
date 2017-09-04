const MAX_DATA = 100;

const stream = new EventSource(/*http://13.124.119.241*/`/sse?limit=${MAX_DATA}`);
const chart = Highcharts.stockChart('chart', {
  chart: {
    type: 'line',
    animation: false,
  },
  title: {
    text: '가격 변동'
  },
  xAxis: {
    labels: {
      formatter: function() {
        return new Date(this.value).toISOString();
      }
    },
  },
  yAxis: {
    title: {
      text: 'Price/Bitcoin'
    }
  },
  series: [
    { name: 'RandomCoin', data: [] },
    { name: 'RandomCoin', data: [] },
    { name: 'RandomCoin', type: 'candlestick', data: [], tooltip: { valueDecimals: 2 } }
  ]
});

stream.onopen = function() {
  log('Opened connection 🎉');
};

stream.onerror = function (event) {
  log('Error: ' + JSON.stringify(event));
};

const serieses = {
  prediction: {
    series: chart.series[0],
    toPoint: data => [data.timestamp, data.value],
  },
  real: {
    series: chart.series[1],
    toPoint: data => [data.timestamp, data.value],
  },
  candle: {
    series: chart.series[2],
    toPoint: data => [data.timestamp, data.open, data.high, data.low, data.close],
  },
};

for (let eventName in serieses) {
  stream.addEventListener(eventName, (event) => {
    const serverData = JSON.parse(event.data);
    const { series, toPoint } = serieses[eventName];
    const shift = series.data.length > MAX_DATA;

    serverData.forEach((data) => series.addPoint(toPoint(data), false, shift));

    chart.redraw();

    log('Received Message: ' + event.data);
  });
}

document.querySelector('#close').addEventListener('click', () => {
  stream.close();
  log('Closed connection 😱');
});

//const list = document.getElementById('log');
const log = function(text) {
  console.log(text);
};

window.addEventListener('beforeunload', function() {
  stream.close();
});
