const express = require('express');
const path = require('path');
const settings = require('../overlays.json');
const Bot = require('../../../modules/Bot.js');

const app = express.Router();

app.get('/chat/:pageID', (req, res) => {
  try {
    const data = require(path.join(__dirname, 'data', `${req.params.pageID}.json`));
    data.tag = req.params.pageID;
    data.port = settings.port;
    res.render('chat', data);
  } catch (e) {
    Bot.log(Bot.translate("services.http.failed_route", {
      route: "Chat Route",
      pageID: req.params.pageID,
      location: path.join(__dirname, 'data', `${req.params.pageID}.json`)
    }));
    res.render('chat', {
      tag: req.params.pageID,
      port: settings.port,
    });
  }
});
app.get('/text/:pageID', (req, res) => {
  try {
    const data = require(path.join(__dirname, 'data', `${req.params.pageID}.json`));
    data.tag = req.params.pageID;
    data.port = settings.port;
    res.render('text', data);
  } catch (e) {
    Bot.log(Bot.translate("services.http.failed_route", {
      route: "Text Route",
      pageID: req.params.pageID,
      location: path.join(__dirname, 'data', `${req.params.pageID}.json`)
    }));
    res.render('text', {
      tag: req.params.pageID,
      port: settings.port,
    });
  }
});
app.get('/alert/:pageID', (req, res) => {
  try {
    const data = require(path.join(__dirname, 'data', `${req.params.pageID}.json`));
    data.tag = req.params.pageID;
    data.port = settings.port;
    res.render('alert', data);
  } catch (e) {
    Bot.log(Bot.translate("services.http.failed_route", {
      route: "Alert Route",
      pageID: req.params.pageID,
      location: path.join(__dirname, 'data', `${req.params.pageID}.json`)
    }));
    res.render('alert', {
      tag: req.params.pageID,
      port: settings.port,
    });
  }
});

module.exports = app;
