const express = require('express');
const express_ws = require('express-ws');
const http = require('http');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const morgan = require('morgan');
const request = require('request');
const body_parser = require('body-parser');

// ==============================
// Configuration
// ==============================

const config = {
    port: 8888
};

// ==============================
// Functions
// ==============================

// Basic home-made template engine
// Based on: https://odino.org/the-simplest-template-engine-for-nodejs/
const render = (view, ctx={}) => {
    return _.template(fs.readFileSync(`./templates/${view}`))(ctx);
};

const add_ws = (ws_connection) => {
    console.log('Add WS connection');
    ws_listeners.add(ws_connection);
};

const remove_ws = (ws_connection) => {
    console.log('Remove WS connection');
    ws_listeners.delete(ws_connection);
};

const notify_wss = (message) => {
    console.log('Notify ' + ws_listeners.size + ' WS connections');
    for(let ws of ws_listeners) {
        ws.send(JSON.stringify(message));
    }
};

const create_event = () => {
    console.log('New event!');
    event = { hello: 'world' }
    notify_wss(event)
};

// ==============================
// Express application
// ==============================

// Set containing all currently active WS connections
let ws_listeners = new Set();

// Express application
let app = express();

// Create an HTTP server
let http_server = http.createServer(app);

// Wrap websocket
express_ws(app, http_server);

// Log incoming requests
app.use(morgan('combined'));

// Parse JSON-encoded bodies
app.use(body_parser.json());

// Parse URL-encoded bodies
app.use(body_parser.urlencoded({extended: true})); 

// Get the SPA
app.get('/', (req, res) => {
    return res.status(200).send(render('index.html'));
});

// Listen for WebSocket connections
app.ws('/ws', (ws_connection, req) => {
    console.log('New WS connection');

    // Register the WS as listener
    try {
        add_ws(ws_connection);
    } catch (error) {
        console.error('Fail adding WS connection: ' + error);
        ws_connection.close();
    }

    // On close: remove WS connection
    ws_connection.on('close', (msg) => {
        console.log('WS connection closed');
        try {
            remove_ws(ws_connection);
        } catch (error) {
            console.error('Fail removing WS connection: ' + error);
        }
    });
});

// Start the server
http_server.listen(config.port, '0.0.0.0', async () => {
    console.log('========================');
    console.log(' Starting the webserver ');
    console.log('========================');
    console.log();
    console.log(`Listening on port ${config.port}`);

    // Schedule a new event every 2 seconds
    setInterval(create_event, 2000);
});