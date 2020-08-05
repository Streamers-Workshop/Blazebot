const fs = require('fs');
const money = require('../casino/money.json');
const cFunctions = require('../casino/cfunctions.js');

<<<<<<< HEAD
const Bot = require('../../modules/Bot.js');

=======
>>>>>>> 2f65a93002ab79a360af452a75d6731abb743d3e
module.exports = {
  name: 'slots',
  description: 'Casino Pack Slot Machine Command',
  chat: true,
  event: false,
  type: 5004,
  command: 'slots',
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
    if (cFunctions.checkBanned(data.user) === true) {
      return client.sendMessage(
        `We are sorry, you have been banned from our casino. @${data.user}`,
      );
    }
    if (!data.args[0])
      return client.sendMessage(
        `Please enter a valid bet amount. Minimum amount is 100 points. @${data.user}`,
      );
    if (cFunctions.isNumeric(data.args[0]) === false)
      return client.sendMessage(`Please enter a valid number. @${data.user}`);

    const playerBet = parseInt(data.args[0], 10);
    if (playerBet > parseInt(money[data.user].points, 10)) {
      client.sendMessage(`You don't have enough points to play.`);
      return;
    }
    if (playerBet < 100) {
      client.sendMessage(
        `Please enter a valid bet amount. Minimum amount is 100 points. @${data.user}`,
      );
      return;
    }

    money[data.user].points -= playerBet;

    const symbolsBase = [
      ':lurk ',
      ':greenheart ',
      ':angry ',
      ':righthead :lefthead ',
      ':cake ',
      ':gg ',
      ':ez ',
    ];
    const symbols = [
      ':ez ',
      ':lurk ',
      ':greenheart ',
      ':greenheart ',
      ':angry ',
      ':angry ',
      ':angry ',
      ':righthead :lefthead ',
      ':righthead :lefthead ',
      ':righthead :lefthead ',
      ':righthead :lefthead ',
      ':cake ',
      ':cake ',
      ':cake ',
      ':cake ',
      ':cake ',
      ':gg ',
      ':gg ',
      ':lol ',
      ':gg ',
      ':lol ',
      ':gg ',
    ];
    const slotResults = [];

    let counter;
    let lurkCounter = 0;
    let rngResult;

    for (counter = 0; counter < 3; counter++) {
      rngResult = Math.floor(cFunctions.randomNumber() * symbols.length);
      slotResults.push(symbols[rngResult]);

      if (rngResult === 1) {
        lurkCounter += 1;
      }
    }

    client.sendMessage(
      `[ ${slotResults[0]} | ${slotResults[1]} | ${slotResults[2]} ] @${data.user}`,
    );

    if (lurkCounter > 0) {
      if (lurkCounter === 3) {
        client.sendMessage(`CASINO! You won ${playerBet * 500} Points. @${data.user}`);
        money[data.user].points += playerBet * 500;
      } else if (lurkCounter === 2) {
        client.sendMessage(`Congratulations, You won ${playerBet * 5} Points. @${data.user}`);
        money[data.user].points += playerBet * 5;
      } else if (lurkCounter === 1) {
        client.sendMessage(`Congratulations, You won ${playerBet * 2} Points. @${data.user}`);
        money[data.user].points += playerBet * 2;
      }

      fs.writeFile('./plugins/casino/money.json', JSON.stringify(money, null, 4), function (err) {
        if (err) {
<<<<<<< HEAD
          Bot.log(err);
=======
          console.log(err);
>>>>>>> 2f65a93002ab79a360af452a75d6731abb743d3e
        }
      });
      return;
    }

    if (slotResults[0] === slotResults[1] && slotResults[0] === slotResults[2]) {
      if (slotResults[0] === ':greenheart ') {
        client.sendMessage(`GG! You won ${playerBet * 250} Points. @${data.user}`);
        money[data.user].points += playerBet * 250;
      } else if (slotResults[0] === ':righthead :lefthead ') {
        client.sendMessage(`BOOM! You won ${playerBet * 100} Points. @${data.user}`);
        money[data.user].points += playerBet * 100;
      } else if (slotResults[0] === ':angry ') {
        client.sendMessage(`Congratulations, You won ${playerBet * 75} Points. @${data.user}`);
        money[data.user].points += playerBet * 75;
      } else if (slotResults[0] === ':cake ') {
        client.sendMessage(`Congratulations, You won ${playerBet * 50} Points. @${data.user}`);
        money[data.user].points += playerBet * 50;
      } else if (slotResults[0] === ':gg ') {
        client.sendMessage(`Congratulations, You won ${playerBet * 25} Points. @${data.user}`);
        money[data.user].points += playerBet * 25;
      } else if (slotResults[0] === ':ez ') {
        client.sendMessage(`RING RING! You won ${playerBet * 1000} Points. @${data.user}`);
        money[data.user].points += playerBet * 1000;
      }
    }

    fs.writeFile('./plugins/casino/money.json', JSON.stringify(money, null, 4), function (err) {
      if (err) {
<<<<<<< HEAD
        Bot.log(err);
=======
        console.log(err);
>>>>>>> 2f65a93002ab79a360af452a75d6731abb743d3e
      }
    });
  },
};
