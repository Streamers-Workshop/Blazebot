const express = require('express');
const http = require('http');
const websocket = require('ws');

const path = require('path');
const settings = require('./overlays.json');

const app = express();

const Bot = require('../../modules/Bot.js');

app.set('views', path.join(__dirname, 'http', 'templates'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'http', 'public')));

app.use(require(path.join(__dirname, 'http', 'routes.js')));

const server = http.createServer(app);

const ws = new websocket.Server({ server });

// Notifies all Connected Clients.
ws.notifyAll = (data) => {
  ws.clients.forEach((client) => {
    client.send(JSON.stringify(data));
  });
};

ws.on('connection', (client) => {
  client.send("PING");
  client.on('message', (message) => {
    if (message == "PONG") {
      setTimeout(function() {
        client.send("PING");
      }, 5000);
    }
  });
});

module.exports = {
  name: 'http-overlay-controller',
  description: "Intergrates a Websocket Server and a HTTP Server which can be used for Overlays in Trovobot, or to Control Trovobot Directly <3.",
	author: "Bioblaze Payne <bioblazepayne@gmail.com> (https://github.com/Bioblaze)",
	license: "Apache-2.0",
  output() {
    return ws;
  },
  activate() {
    server.listen(settings.port, () => {
      Bot.log(`HTTP Overlay Module Started on Port(${settings.port})`);
    });
  },
  deactivate() {
    server.close(() => {
      Bot.log('HTTP Overlay has Shut down.');
    })
  }
};
