const Bot = require('../../modules/Bot.js');
const fs = require('fs');
const path = require('path');
var sResponses = [];

module.exports = {
  name: '8ball', // Name of the Plugin
  description: "PING",
  author: "Made by EarWaxCandy. updated by Rehkloos, Bioblaze & Krammy",
  license: "Apache-2.0",
  command: '8ball', // This is the Command that is typed into Chat!
  permissions: [], // This is for Permissisons depending on the Platform.
  cooldown: 10, // this is Set in Seconds, how long between the next usage of this command.
  execute(client, data) {
     var answer = sResponses[Math.floor(Math.random() * (sResponses.length - 0) + 0)];
     client.sendMessage(`@${data.user} - ${answer}`);
  },
  activate() {
    sResponses = fs.readFileSync(path.join(__dirname, '8ball.txt'), 'utf8').split('\n');
    Bot.log(Bot.translate("plugins.8ball.activated"));
  },
  deactivate() {
    sResponses = [];
    Bot.log(Bot.translate("plugins.8ball.deactivated"))
  }
};
