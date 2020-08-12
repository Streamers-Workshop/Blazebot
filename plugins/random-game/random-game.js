const fs = require('fs');
const path = require('path');
const Bot = require('../../modules/Bot.js');
const settings = require('./random-game.json');

const sResponses = fs.readFileSync(path.join(__dirname, 'game-list.txt'), 'utf8');
const game = sResponses.split('\n');
module.exports = {
  name: 'Game Picker',
  description: 'Randomly Picks a Game from the Streamers Games List',
  chat: true,
  event: false,
  type: 5004,
  command: 'gp',
  permissions: [],
  cooldown: 3600,
  settings: true,
  credits: `Made by Rehkloos`,
  execute(client, data) {
    if (!settings.active) {
      Bot.log('Please change active to true for command to work');
      client.sendMessage('Streamer disabled this command');
    } else if (data.args[0] != "pick") {
      client.sendMessage(`@${data.user} incorrect argument user must use "pick" to initiate game randomizer`);
    } else if (data.args[0] === "pick") {
      const sResponse = game[Math.floor(Math.random() * (game.length - 0) + 0)];

      client.sendMessage(`@${data.user} randomly picks ${sResponse}`);
    }
  },
};
