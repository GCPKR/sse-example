const MAX_DATA = 100;

const stream = new EventSource(`/sse?limit=${MAX_DATA}`);
const ctx = document.getElementById('chart').getContext('2d');
const chart = new Chart(ctx, {
  // The type of chart we want to create
  type: 'line',
  options: {
    animation: false,
    //Boolean - If we want to override with a hard coded scale
    scaleOverride: true,
    //** Required if scaleOverride is true **
    //Number - The number of steps in a hard coded scale
    scaleSteps: 10,
    //Number - The value jump in the hard coded scale
    scaleStepWidth: 10,
    //Number - The scale starting value
    scaleStartValue: 0
  },
  data: {
    labels: [],
    datasets: [{
      label: 'value',
      data: [],
    }]
  }
});

stream.onopen = function() {
  log('Opened connection 🎉');
};

stream.onerror = function (event) {
  log('Error: ' + JSON.stringify(event));
};

stream.onmessage = function (event) {
  const serverData = JSON.parse(event.data);

  const data = chart.data.datasets[0].data;
  const labels = chart.data.labels;

  serverData.forEach((newData) => {
    data.push(newData.value);
    labels.push(newData.timestamp);
  });

  if (data.length > MAX_DATA) {
    data.splice(0, data.length - MAX_DATA);
    labels.shift();
  }
  chart.update();
  log('Received Message: ' + event.data);
};

document.querySelector('#close').addEventListener('click', () => {
  stream.close();
  log('Closed connection 😱');
});

const list = document.getElementById('log');
const log = function(text) {
  const li = document.createElement('li');
  li.innerHTML = text;
  list.appendChild(li);
}

window.addEventListener('beforeunload', function() {
  stream.close();
});

// can still push to the server as usual with good old ajax

document.querySelector('#send').addEventListener('click', () => {
  const json = JSON.stringify({ message: 'Hey there' });

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/api', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(json);

  log('Sent: ' + json);
});
