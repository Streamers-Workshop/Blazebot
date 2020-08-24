const fs = require('fs');
const path = require('path');
const Bot = require('../../modules/Bot.js');
var game = [];

module.exports = {
  name: 'Game Picker', // Name of the Plugin
  description: "Randomly Picks a Game from the Streamers Games List",
  author: "Created by Rehkloos",
  license: "Apache-2.0",
  command: 'gp', // This is the Command that is typed into Chat!
  permissions: [], // This is for Permissisons depending on the Platform.
  cooldown: 10, // this is Set in Seconds, how long between the next usage of this command.
  execute(client, data) {
    if (data.args[0] != "pick") {
      client.sendMessage(Bot.translate("plugins.gamep.incorrect", { // plugins > xkcd > processed output line
        user: data.user
      }));
    } else if (data.args[0] === "pick") {
      var answer = game[Math.floor(Math.random() * (game.length - 0) + 0)];

      client.sendMessage(Bot.translate("plugins.gamep.processed", {
        user: data.user, // in 'en.json' this is related to "@{user}"
        result: answer
      }));
    }
  },

  activate() {
    game = fs.readFileSync(path.join(__dirname, 'game-list.txt'), 'utf8').split('\n');
    Bot.log(Bot.translate("plugins.gamep.activated"));
  },
  deactivate() {
    game = [];
    Bot.log(Bot.translate("plugins.gamep.deactivated"));
  }
};
