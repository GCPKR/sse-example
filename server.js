const http = require('http');
const express = require('express');
const SSE = require('sse');
const data = require('./data');
const candleData = require('./candle-data');

const app = express().use(express.static('public'));
const server = http.createServer(app);

const port = process.env.PORT || 8080;

const DEFAULT_LIMIT = 100;

class SSEEndpoint {
  constructor(server, path) {
    this.server = server;
    this.path = path;
    this.clients = [];
    this.generators = [];
  }

  start() {
    this.sse = new SSE(this.server, { path: this.path });
    this.sse.on('connection', (client, query) => {
      this.clients.push(client);
      console.log(`Opened connection 🎉: ${this.path}`);

      let limit = DEFAULT_LIMIT;
      if (query && query.limit && !isNaN(query.limit)) {
        limit = parseInt(query.limit, 10);
      }

      // send initial data
      this.generators.forEach((meta) => this.sendData(meta.event, meta.generator, limit));

      client.on('close', () => {
        this.clients.splice(this.clients.indexOf(client), 1);
        console.log(`Closed connection 😱: ${this.path}`);
      });
    });

    this.generators.forEach((meta) => {
      setInterval(() => this.sendData(meta.event, meta.generator), meta.interval);
    });
  }

  addDataGenerator(eventName, generator, interval = 500) {
    this.generators.push({ event: eventName, generator, interval });
  }

  sendData(eventName, generator, limit = 1) {
    const data = generator.get(limit);
    const json = JSON.stringify(data);
    this.clients.forEach((client) => {
      client.send(eventName, json);
      console.log(`Sent: ${this.path}: ${eventName} ${json}`);
    });
  }
}

server.listen(port, '0.0.0.0', () => {
  const sse = new SSEEndpoint(server, '/sse');
  sse.addDataGenerator('prediction', data);
  sse.addDataGenerator('real', data);
  sse.addDataGenerator('candle', candleData);
  sse.start();
});

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
