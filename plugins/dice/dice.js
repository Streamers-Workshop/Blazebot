const fs = require('fs');
const money = require('../casino/money.json');
const cFunctions = require('../casino/cfunctions.js');

module.exports = {
  name: 'dice',
  description: 'Casino Pack Dice Command',
  chat: true,
  event: false,
  type: 5004,
  command: 'dice',
  permissions: [],
  alias: [],
  cooldown: 0,
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

    if (cFunctions.isNumeric(data.args[0]) === false) {
      client.sendMessage(`Please enter a valid number.`);
      return;
    }

    const playerBet = parseInt(data.args[0], 10);

    if (playerBet > money[data.user].points) {
      client.sendMessage(`You don't have enough points to play. @${data.user}`);
      return;
    }
    if (playerBet < 20) {
      client.sendMessage(
        `Please enter a valid bet amount. Minimum amount is 20 points. @${data.user}`,
      );
      return;
    }

    money[data.user].commandDate = new Date();

    money[data.user].points -= playerBet;
    fs.writeFile('./plugins/casino/money.json', JSON.stringify(money, null, 4), function (err) {
      if (err) {
        console.log(err);
      }
    });

    const playerDice1 = Math.floor(cFunctions.randomNumber() * 6 + 1);
    const playerDice2 = Math.floor(cFunctions.randomNumber() * 6 + 1);
    const playerTotal = playerDice1 + playerDice2;

    const dealerDice1 = Math.floor(cFunctions.randomNumber() * 6 + 1);
    const dealerDice2 = Math.floor(cFunctions.randomNumber() * 6 + 1);
    const dealerTotal = dealerDice1 + dealerDice2;

    client.sendMessage(
      `Dice you rolled: ${playerDice1}, ${playerDice2} (Total: ${playerTotal}).\nCasino dice: ${dealerDice1}, ${dealerDice2} (Total: ${dealerTotal}).`,
    );

    if (playerTotal < dealerTotal) {
      client.sendMessage(`Unfortunately you lost. @${data.user}`);
    } else if (playerTotal === dealerTotal) {
      client.sendMessage(`The results are equal. You got your money back. @${data.user}`);
      money[data.user].points += playerBet;
      fs.writeFile('./plugins/casino/money.json', JSON.stringify(money, null, 4), function (err) {
        if (err) {
          console.log(err);
        }
      });
    } else {
      client.sendMessage(`Congratulations, You won ${playerBet * 2} points. @${data.user}`);
      money[data.user].points += 2 * playerBet;
      fs.writeFile('./plugins/casino/money.json', JSON.stringify(money, null, 4), function (err) {
        if (err) {
          console.log(err);
        }
      });
    }
  },
};
