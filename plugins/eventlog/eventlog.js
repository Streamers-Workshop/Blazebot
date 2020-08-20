const path = require('path');
const fs = require('fs');

const Bot = require('../../modules/Bot.js');

const settings = require('./eventlog.json');


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
    if (settings.use_data_folder) {
      
    } else {

    }
  },
  activate() {
    if (settings.use_data_folder) {
      events = require(path.join(Bot.data, 'eventlogs', 'eventlogs.json'));
    } else {
      events = require(path.join(__dirname, 'eventlogs.json'));
    }
    Bot.log(Bot.translate("plugins.bot.activated"))
  },
  deactivate() {
    Bot.log(Bot.translate("plugins.bot.deactivated"))
  }
};
