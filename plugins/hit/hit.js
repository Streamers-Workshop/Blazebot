const fs = require('fs');
const money = require('../casino/money.json');
const cFunctions = require('../casino/cfunctions.js');


const Bot = require('../../modules/Bot.js');
module.exports = {
  name: 'hit',
  description: 'Casino Pack BlackJack Hit command',
  chat: true,
  event: false,
  type: 5004,
  command: 'hit',
  permissions: [],
  alias: [],
  cooldown: 1,
  settings: false,
  credits: `Made by Ulash`,
  execute(client, data) {
    // A can be 1 or 11. J, K and Q is 10 .
    const deck = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'J', 'K', 'Q'];
    let handString = ' ';
    const dealerHandString = ' ';

    if (!money[data.user]) {
      return;
    }

    if (money[data.user].playingBlackjack === false) {
      return;
    }

    const playerBetH = money[data.user].blackjackBet;

    money[data.user].blackjackHand.push(deck[Math.floor(cFunctions.randomNumber() * 11)]);
    const playerTotalH = cFunctions.calculateHand(money[data.user].blackjackHand);

    for (let n = 0; n < money[data.user].blackjackHand.length; n++) {
      handString += `${money[data.user].blackjackHand[n]}, `;
    }

    client.sendMessage(`Your new hand: ${handString} (Total: ${playerTotalH})`);

    if (playerTotalH > 21) {
      client.sendMessage('Unfortunately you lost.');
      money[data.user].playingBlackjack = false;
      money[data.user].blackjackDealerHand = [];
      money[data.user].blackjackHand = [];
      money[data.user].blackjackBet = 0;
      fs.writeFile('./plugins/casino/money.json', JSON.stringify(money, null, 4), function (err) {
        if (err) {

          Bot.log(err);
        }
      });
      return;
    }

    if (playerTotalH === 21) {
      let dealerTotalH = cFunctions.calculateHand(money[data.user].blackjackDealerHand);
      while (dealerTotalH < 17) {
        money[data.user].blackjackDealerHand.push(deck[Math.floor(cFunctions.randomNumber() * 11)]);
        dealerTotalH = cFunctions.calculateHand(money[data.user].blackjackDealerHand);
      }

      for (let nn = 0; nn < money[data.user].blackjackDealerHand.length; nn++) {
        handString += `${money[data.user].blackjackDealerHand[nn]}, `;
      }

      client.sendMessage(
        `The dealer has finished drawing cards and his hand is like this: ${dealerHandString}(Total: ${dealerTotalH})`,
      );

      if (dealerTotalH > 21) {
        client.sendMessage(`Dealer's hand passed 21. You won ${playerBetH * 2} Poins.`);
        money[data.user].points += playerBetH * 2;
        money[data.user].playingBlackjack = false;
        money[data.user].blackjackDealerHand = [];
        money[data.user].blackjackHand = [];
        money[data.user].blackjackBet = 0;
        fs.writeFile('./plugins/casino/money.json', JSON.stringify(money, null, 4), function (err) {
          if (err) {

            Bot.log(err);
          }
        });
        return;
      }
      if (dealerTotalH === playerTotalH) {
        client.sendMessage('The results are equal. You got your money back.');
        money[data.user].points += playerBetH;
        money[data.user].playingBlackjack = false;
        money[data.user].blackjackDealerHand = [];
        money[data.user].blackjackHand = [];
        money[data.user].blackjackBet = 0;
        fs.writeFile('./plugins/casino/money.json', JSON.stringify(money, null, 4), function (err) {
          if (err) {

            Bot.log(err);
          }
        });
        return;
      }
      if (playerTotalH > dealerTotalH) {
        client.sendMessage(`Congratulations, You won ${playerBetH * 2} points.`);
        money[data.user].points += playerBetH * 2;
        money[data.user].playingBlackjack = false;
        money[data.user].blackjackDealerHand = [];
        money[data.user].blackjackHand = [];
        money[data.user].blackjackBet = 0;
        fs.writeFile('./plugins/casino/money.json', JSON.stringify(money, null, 4), function (err) {
          if (err) {

            Bot.log(err);
          }
        });
        return;
      }
      if (playerTotalH < dealerTotalH) {
        client.sendMessage('Unfortunately you lost.');
        money[data.user].playingBlackjack = false;
        money[data.user].blackjackDealerHand = [];
        money[data.user].blackjackHand = [];
        money[data.user].blackjackBet = 0;
        fs.writeFile('./plugins/casino/money.json', JSON.stringify(money, null, 4), function (err) {
          if (err) {

            Bot.log(err);
          }
        });
      }
    }
  },
};
