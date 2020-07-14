const fs = require('fs');
const path = require('path');

const sResponses = fs.readFileSync(path.join(__dirname, '8ball.txt'), 'utf8');
const ball = sResponses.split('\n');
module.exports = {
  name: '8ball',
  description: 'Magic fortune teller',
  chat: true,
  event: false,
  type: 5004,
  command: '8ball',
  permissions: [],
  cooldown: 10,
  settings: false,
  credits: `Made by EarWaxCandy, updated by Rehkloos & Bioblaze Payne`,
  execute(client, data) {
    const sResponse = ball[Math.floor(Math.random() * (ball.length - 0) + 0)];

    client.sendMessage(`@${data.user} - ${sResponse}`);
  },
};
