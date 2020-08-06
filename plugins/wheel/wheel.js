const fs = require('fs');
const money = require('../casino/money.json');
const cFunctions = require('../casino/cfunctions.js');


const Bot = require('../../modules/Bot.js');
module.exports = {
  name: 'wheel',
  description: 'Casino Pack Wheel stand command',
  chat: true,
  event: false,
  type: 5004,
  command: 'wheel',
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

    if (cFunctions.checkBanned(data.user) === true) return client.sendMessage(`We are sorry, you have been banned from our casino. @${data.user}`);
    if (cFunctions.isNumeric(data.args[0]) === false) return client.sendMessage(`Correct Usage: !wheel <bet amount> <1, 2, 5, 10, 20> @${data.user}`);
    if (cFunctions.isNumeric(data.args[1]) === false) return client.sendMessage(`Correct Usage: !wheel <bet amount> <1, 2, 5, 10, 20> @${data.user}`);
    if (
      parseInt(data.args[1], 10) !== 1 &&
      parseInt(data.args[1], 10) !== 2 &&
      parseInt(data.args[1], 10) !== 5 &&
      parseInt(data.args[1], 10) !== 10 &&
      parseInt(data.args[1], 10) !== 20
    )
      return client.sendMessage(`Correct Usage: !wheel <bet amount> <1, 2, 5, 10, 20> @${data.user}`);

    const playerBet = parseInt(data.args[0], 10);
    if (playerBet > money[data.user].points) {
      client.sendMessage(`You don't have enough points to play.`);
      return;
    }
    if (playerBet < 100) {
      client.sendMessage(
        `Please enter a valid bet amount. Minimum amount is 100 points. @${data.user}`,
      );
      return;
    }

    money[data.user].commandDate = new Date();

    money[data.user].points -= playerBet;

    let wheel = Math.floor(cFunctions.randomNumber() * 100) + 1;

    if (wheel < 41) {
      wheel = 1;
    } else if (wheel > 40 && wheel < 66) {
      wheel = 2;
    } else if (wheel > 65 && wheel < 81) {
      wheel = 5;
    } else if (wheel > 80 && wheel < 91) {
      wheel = 10;
    } else if (wheel > 90 && wheel < 98) {
      wheel = 20;
    } else {
      wheel = 40;
    }

    client.sendMessage(`The wheel has been spinned and it points ${wheel}. @${data.user}`);

    if (wheel === 40) {
      client.sendMessage(
        `Congratulations! You won ${playerBet * (wheel + 1)} Points. @${data.user}`,
      );
      money[data.user].points += playerBet * (wheel + 1);
      fs.writeFile('./plugins/casino/money.json', JSON.stringify(money, null, 4), function (err) {
        if (err) {

          Bot.log(err);
        }
      });
      return;
    }

    if (parseInt(data.args[1], 10) === wheel) {
      client.sendMessage(
        `Congratulations, You won ${playerBet * (wheel + 1)} points. @${data.user}`,
      );
      money[data.user].points += playerBet * (wheel + 1);
    } else {
      client.sendMessage(`Unfortunately you lost. @${data.user}`);
    }
    fs.writeFile('./plugins/casino/money.json', JSON.stringify(money, null, 4), function (err) {
      if (err) {

        Bot.log(err);
      }
    });
  },
};
