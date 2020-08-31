const fs = require('fs');
const path = require('path');
const Bot = require('../../modules/Bot.js');

module.exports = {
  name: 'Casino Games Pack', // Name of the Plugin
  description: "Casino Games Pack",
  author: "Original By Ulash. Updated by Krammy",
  license: "Apache-2.0",
  command: 'casino', // This is the Command that is typed into Chat!
  permissions: [], // This is for Permissisons depending on the Platform.
  cooldown: 10, // this is Set in Seconds, how long between the next usage of this command.
  execute(client, data) {
    client.sendMessage(Bot.translate("plugins.casino.message", {
      user: data.user
    }));
  },
  activate() {
    if (fs.existsSync(path.join(__dirname, 'plugins'))) {
        Bot.loadPlugins(path.join(__dirname, 'plugins'));
      }
    Bot.log(Bot.translate("plugins.casino.activated"))
  },
  deactivate() {
    if (fs.existsSync(path.join(__dirname, 'plugins'))) {
        Bot.unloadPlugins(path.join(__dirname, 'plugins'));
      }
    Bot.log(Bot.translate("plugins.casino.deactivated"))
  }
};
