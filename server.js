const http = require('http');
const express = require('express');
const SSE = require('sse');
const data = require('./data');

const app = express().use(express.static('public'));
const server = http.createServer(app);
const clients = [];

server.listen(8080, '127.0.0.1', () => {
  const sse = new SSE(server);

  sse.on('connection', function(client, query) {
    clients.push(client);
    console.log('Opened connection 🎉');

    let limit = 100;
    if (query && query.limit && !isNaN(query.limit)) {
      limit = parseInt(query.limit, 10);
    }

    const json = JSON.stringify(data.get(limit)); // Initial data
    client.send(json);
    console.log('Sent: ' + json);

    client.on('close', function() {
      clients.splice(clients.indexOf(client), 1);
      console.log('Closed connection 😱');
    });
  });
});


const broadcast = () => {
  const json = JSON.stringify(data.get());

  clients.forEach(function(stream) {
    stream.send(json);
    console.log('Sent: ' + json);
  });
};
setInterval(broadcast, 500);

// can receive from the client with standard http and broadcast

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.post('/api', (req, res) => {
  const message = JSON.stringify(req.body);
  console.log('Received: ' + message);
  res.status(200).end();

  const json = JSON.stringify({ message: 'Something changed' });
  clients.forEach(function(stream) {
    stream.send(json);
    console.log('Sent: ' + json);
  });
});
