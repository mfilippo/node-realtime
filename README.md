node-realtime
================

A simple Node-based server handling real-time notifications by using WebSockets.

Once requested by the client, the application will initiate the WebSocket connection. Each connection will be registered server side and it will be used to push messages to connected clients.

In this example an event is created periodically. Every event will be sent to all registered WebSocket connections.

### Run

The application can be installed with

```bash
npm install
```

and can be run with

```bash
node server.js
```

Assuming the application is running on `localhost:8888` (default port), logs will show the produced messages and all clients connected to `http://localhost:8888` will receive the messages via WebSocket in real time. The received messages can be seen by inspecting the browser console.