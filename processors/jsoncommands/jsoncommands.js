const fs = require('fs');
const path = require('path');
const util = require('util'); // eslint-disable-line
const Handlebars = require('handlebars');


const Bot = require('../../modules/Bot.js');

//APACHE 2.0 LICENSE: https://spdx.org/licenses/Apache-2.0.html#licenseText
var settings = {};

module.exports = {
  name: 'chatlog',
  description: "Records all Chat to a Textfile.",
  author: "Bioblaze Payne <bioblazepayne@gmail.com> (https://github.com/Bioblaze)",
  license: "Apache-2.0",
  activate() {
    if (fs.existsSync(path.join(__dirname, 'plugins'))) {
      Bot.loadPlugins(path.join(__dirname, 'plugins'));
    }
    settings = require('./jsoncommands.json');
    Bot.log(Bot.translate("processors.chatlog.activated"));
  },
  deactivate() {
    settings = {};
    Bot.log(Bot.translate("processors.chatlog.deactivated"));
  },
  process(data, client, callback) {
    if (typeof(data.content) === 'string') {
      var args = data.content.split(" ");
      if (settings.commands[args[0]] != undefined) {
        var template = Handlebars.compile(settings.commands[args[0]]);
        client.sendMessage(template({
          data: data,
          settings: settings
        }));
      }
    }
  },
};
// "Hello, @{{data.user}} how are you?"
