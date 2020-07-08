var express = require('express');
var http = require('http');
var websocket = require('ws');

const fs = require('fs'), path = require('path'), util = require('util');

const app = express();

app.set('views', path.join(__dirname, "http", 'templates'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, "http", 'public')));

app.get('/chat/:pageID', function(req, res) {
  try {
    var data = require(path.join(__dirname, "http", "data", `${req.params.pageID}.json`));
    data.tag = req.params.pageID;
    data.port = process.env.HTTP_PORT;
    res.render('chat',data);
  } catch(e) {
    console.error(`[HTTP] (Chat Route) ${req.params.pageID}.json is not found, does it exist in /modules/http/data?\n${e}`);
    res.render('chat', {
      tag: req.params.pageID,
      port: process.env.HTTP_PORT
    });
  }
});
app.get('/text/:pageID', function(req, res) {
  try {
    var data = require(path.join(__dirname, "http", "data", `${req.params.pageID}.json`));
    data.tag = req.params.pageID;
    data.port = process.env.HTTP_PORT;
    res.render('text',data);
  } catch(e) {
    console.error(`[HTTP] (Text Route) ${req.params.pageID}.json is not found, does it exist in /modules/http/data?\n${e}`);
    res.render('text', {
      tag: req.params.pageID,
      port: process.env.HTTP_PORT
    });
  }
});
app.get('/alert/:pageID', function(req, res) {
  try {
    var data = require(path.join(__dirname, "http", "data", `${req.params.pageID}.json`));
    data.tag = req.params.pageID;
    data.port = process.env.HTTP_PORT;
    res.render('alert',data);
  } catch(e) {
    console.error(`[HTTP] (Alert Route) ${req.params.pageID}.json is not found, does it exist in /modules/http/data?\n${e}`);
    res.render('alert', {
      tag: req.params.pageID,
      port: process.env.HTTP_PORT
    });
  }
});

const server = http.createServer(app);

const ws = new websocket.Server({ server });

ws.on('connection', (socket) => {
  console.log('Page Connected');
});

server.listen(process.env.HTTP_PORT, () => {
  console.log("Websocket Server Started!")
})

module.exports = {
  server: ws
};
