const path = require('path');
const fs = require('fs');

const Bot = require('../../modules/Bot.js');

const settings = require('./eventlog.json');

var save_interval = null;

var events = {};

module.exports = {
  name: 'Eventlog',
  description: "Tells you how many events the bot has seen.",
  author: "Created by Bioblaze Payne <bioblazepayne@gmail.com> (https://github.com/Bioblaze)",
  license: "Apache-2.0",
  command: 'events', // This is the Command that is typed into Chat!
  permissions: [], // This is for Permissisons depending on the Platform.
  cooldown: 60, // this is Set in Seconds, how long between the next usage of this command.
  execute(client, data) {
    events.log.push(data);
  },
  activate() {
    if (settings.use_data_folder) {
      try {
        events = require(path.join(Bot.data, 'eventlogs', 'eventlogs.json'));
      } catch(e) {
        events = {};
      }
    } else {
      events = require(path.join(__dirname, 'eventlogs.json'));
    }
    if (events.log == undefined) {
      events.log = [];
    }
    save_interval = setInterval(function() {
      try {
        var dir = null;
        if (settings.use_data_folder) {
          dir = path.join(Bot.data, 'eventlogs', 'eventlogs.json');
        } else {
          dir = path.join(__dirname, 'eventlogs.json');
        }
        fs.writeFileSync(dir, JSON.stringify(events, null, 2));
      } catch(e) {
        Bot.log(e);
      }
    }, 5000);
    Bot.log(Bot.translate("plugins.bot.activated"))
  },
  deactivate() {
    Bot.log(Bot.translate("plugins.bot.deactivated"))
    clearInterval(save_interval);
  }
};
