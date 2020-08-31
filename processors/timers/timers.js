const fs = require('fs');
const path = require('path');
const util = require('util'); // eslint-disable-line
const Handlebars = require('handlebars');


const Bot = require('../../modules/Bot.js');

//APACHE 2.0 LICENSE: https://spdx.org/licenses/Apache-2.0.html#licenseText
var settings = {};
var messageCount = 0;

module.exports = {
  name: 'json-commands',
  description: "Allows for the use of commands from a json file.",
  author: "Krammy <krammy_ie@outlook.com> (https://github.com/kramitox)",
  license: "Apache-2.0",
  activate() {
    settings = require('./timers.json');
    Bot.log(Bot.translate("processors.jsoncommands.activated"));
  },
  deactivate() {
    settings = {};
    Bot.log(Bot.translate("processors.jsoncommands.deactivated"));
  },
  process(data, client, callback) {

        callback(null, false);
  },
};
