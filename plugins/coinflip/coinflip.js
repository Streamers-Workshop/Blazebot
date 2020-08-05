const fs = require('fs');
const money = require('../casino/money.json');
const cFunctions = require('../casino/cfunctions.js');

<<<<<<< HEAD
const Bot = require('../../modules/Bot.js');

=======
>>>>>>> 2f65a93002ab79a360af452a75d6731abb743d3e
module.exports = {
  name: 'coinflip',
  description: 'Casino Pack Coinflip command',
  chat: true,
  event: false,
  type: 5004,
  command: 'coinflip',
  permissions: [],
  alias: [],
  cooldown: 1,
  settings: false,
  credits: `Made by Ulash`,
  execute(client, data) {
    if (!money[data.user]) {
      client.sendMessage(
        `You don't have any account. Please type !casino register to open an account. @${data.user}`,
      );
      return;
    }

    if (cFunctions.checkBanned(data.user) === true)
      return client.sendMessage(
        `We are sorry, you have been banned from our casino. @${data.user}`,
      );

    if (cFunctions.isNumeric(data.args[0]) === true) {
      if (data.args[1] !== 'heads' && data.args[1] !== 'tails')
        return client.sendMessage(`Correct Usage: !coinflip <bet amount> <side> @${data.user}`);

      const playerBet = parseInt(data.args[0]);

      if (playerBet > money[data.user].points) {
        client.sendMessage(`You don't have enough points to play. @${data.user}`);
        return;
      }

      if (playerBet < 100) {
        client.sendMessage(
          `Please enter a valid bet amount. Minimum amount is 20 points. @${data.user}`,
        );
        return;
      }

      money[data.user].points -= playerBet;
      fs.writeFile('./plugins/casino/money.json', JSON.stringify(money, null, 4), function (err) {
        if (err) {
<<<<<<< HEAD
          Bot.log(err);
=======
          console.log(err);
>>>>>>> 2f65a93002ab79a360af452a75d6731abb743d3e
        }
      });

      let coin = Math.floor(cFunctions.randomNumber() * 2) + 1;
      if (coin === 1) {
        coin = 'heads';
      } else {
        coin = 'tails';
      }

      client.sendMessage(`The coin landed ${coin}. @${data.user}`);
      if (coin === data.args[1]) {
        client.sendMessage(`Congratulations, You won ${playerBet * 2} points. @${data.user}`);
        money[data.user].points += playerBet * 2;
        fs.writeFile('./plugins/casino/money.json', JSON.stringify(money, null, 4), function (err) {
          if (err) {
<<<<<<< HEAD
            Bot.log(err);
=======
            console.log(err);
>>>>>>> 2f65a93002ab79a360af452a75d6731abb743d3e
          }
        });
      } else {
        client.sendMessage(`Unfortunately you lost. @${data.user}`);
      }
    } else {
      client.sendMessage(`Correct Usage: !coinflip <bet amount> <side> @${data.user}`);
    }
  },
};
