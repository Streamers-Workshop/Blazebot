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

app.get('/chat/:pageID', (req, res) => {
  try {
    const data = require(path.join(__dirname, 'http', 'data', `${req.params.pageID}.json`));
    data.tag = req.params.pageID;
    data.port = process.env.HTTP_PORT;
    res.render('chat', data);
  } catch (e) {
    Bot.log(
      `[HTTP] (Chat Route) ${req.params.pageID}.json is not found, does it exist in /modules/http/data?\n${e}`,
    );
    res.render('chat', {
      tag: req.params.pageID,
      port: process.env.HTTP_PORT,
    });
  }
});
app.get('/text/:pageID', (req, res) => {
  try {
    const data = require(path.join(__dirname, 'http', 'data', `${req.params.pageID}.json`));
    data.tag = req.params.pageID;
    data.port = process.env.HTTP_PORT;
    res.render('text', data);
  } catch (e) {
    Bot.log(
      `[HTTP] (Text Route) ${req.params.pageID}.json is not found, does it exist in /modules/http/data?\n${e}`,
    );
    res.render('text', {
      tag: req.params.pageID,
      port: process.env.HTTP_PORT,
    });
  }
});
app.get('/alert/:pageID', (req, res) => {
  try {
    const data = require(path.join(__dirname, 'http', 'data', `${req.params.pageID}.json`));
    data.tag = req.params.pageID;
    data.port = process.env.HTTP_PORT;
    res.render('alert', data);
  } catch (e) {
    Bot.log(
      `[HTTP] (Alert Route) ${req.params.pageID}.json is not found, does it exist in /modules/http/data?\n${e}`,
    );
    res.render('alert', {
      tag: req.params.pageID,
      port: process.env.HTTP_PORT,
    });
  }
});

const server = http.createServer(app);

const ws = new websocket.Server({ server });

// Notifies all Connected Clients.
ws.notifyAll = (data) => {
  ws.server.clients.forEach((client) => {
    client.send(JSON.stringify(data));
  });
};

ws.on('connection', () => {
  Bot.log('Page Connected');
});

module.exports = {
  name: 'http-overlay-module',
  varname: 'overlay',
  output: ws,
  activate() {
    server.listen(settings.port, () => {
      Bot.log(`HTTP Overlay Module Started on Port(${settings.port})`);
    });
  },
};
