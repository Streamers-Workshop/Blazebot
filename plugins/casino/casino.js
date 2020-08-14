const fs = require('fs');
const money = require('./money.json');

const Bot = require('../../modules/Bot.js');
module.exports = {
  name: 'casino',
  description: 'Replies with casino commands',
  chat: true,
  event: false,
  type: 5004,
  command: 'casino',
  permissions: [],
  alias: [],
  cooldown: 10,
  settings: false,
  credits: `Made by Ulash`,
  execute(client, data) {
    // Players who have never played in the casino before must open a new account with the !casino register command
    // For the first time, players who use the !casino register command, system will deposit 1000 points to their accounts.
    if (data.args[0] === `register`) {
      if (!money[data.user]) {
        money[data.user] = {
          points: 1000,
          vip: false,
          playingBlackjack: false,
          blackjackHand: [],
          blackjackDealerHand: [],
          blackjackBet: 0,
        };
        client.sendMessage(
          `Welcome to our casino. 1000 points has been deposited to your account to get started. @${data.user}`,
        );
        fs.writeFile('./plugins/casino/money.json', JSON.stringify(money, null, 4), function (err) {
          if (err) {

            Bot.log(err);
          }
        });
        return;
      }
      client.sendMessage(`You already have an account in our casino. @${data.user}`);
    }
	if (data.args[0] != `register`) {
	client.sendMessage(
          `Please open an account with !casino register command to play casino. @${data.user}`,
        );
			}		
  },
};

