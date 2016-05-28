# Server-sent Events Demo

Server-sent events allow you to open a long held HTTP connection to stream data back to the client.
On the client you open a connection by creating an `EventSource` with a url to the streaming endpoint.

Article URL: http://www.sitepoint.com/real-time-apps-websockets-server-sent-events

## Requirements

* [Node.js](http://nodejs.org/)

## Installation Steps

```bash
npm install
npm start
open http://localhost:8080/
```

Try opening multiple browsers and looking at the logs on client and server.
Here's what's happening:

- The client initiates an http request to `/sse` via `EventSource`
- The server sends `{ message: 'Gotcha '}` when a connection is established.
- The server keeps an array of all connected `clients`.
- Every three seconds the server broadcasts `{ message: 'Hello hello!' }` to all connections.
- Connections can be closed by hitting the Close button or closing the window.
- You can send `{ message: 'Hey' }` to the server by hitting `Send Message`.
- The server sends `{ message: 'Something changed' }` to all connections when a message is received.

A nice thing about `EventSource` is that it tries to re-establish lost connections automatically, to see how this works stop the server while the browser is connected.  You'll see some polling start to occur and error events logged until you start up the server again.

## Links

- [React to data changes](http://rauchg.com/2014/7-principles-of-rich-web-applications/#react-to-data-changes)
- [Using server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
- [EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)

## License

The MIT License (MIT)

Copyright (c) 2016 SitePoint

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

