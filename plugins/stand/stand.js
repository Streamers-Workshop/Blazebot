const fs = require('fs');
const money = require('../casino/money.json');
const cFunctions = require('../casino/cfunctions.js');

const Bot = require('../../modules/Bot.js');

module.exports = {
  name: 'stand',
  description: 'Casino Pack BlackJack command',
  chat: true,
  event: false,
  type: 5004,
  command: 'stand',
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

    // Checking for an account and started a game
    if (!money[data.user]) {
      return;
    }
    if (money[data.user].playingBlackjack === false) {
      return;
    }

    const playerBetS = money[data.user].blackjackBet;

    const playerTotalS = cFunctions.calculateHand(money[data.user].blackjackHand);

    let dealerTotalS = cFunctions.calculateHand(money[data.user].blackjackDealerHand);
    while (dealerTotalS < 17) {
      money[data.user].blackjackDealerHand.push(deck[Math.floor(cFunctions.randomNumber() * 11)]);
      dealerTotalS = cFunctions.calculateHand(money[data.user].blackjackDealerHand);
    }

    // var dealerHandString = ' ';
    for (let nnn = 0; nnn < money[data.user].blackjackDealerHand.length; nnn++) {
      handString += `${money[data.user].blackjackDealerHand[nnn]}, `;
    }

    client.sendMessage(
      `The dealer has finished drawing cards and his hand is: ${dealerHandString}(Total: ${dealerTotalS}) @${data.user}`,
    );

    if (dealerTotalS > 21) {
      client.sendMessage(
        `Dealer's hand passed 21. , You won ${playerBetS * 2} points. @${data.user}`,
      );
      money[data.user].points += playerBetS * 2;
      money[data.user].playingBlackjack = false;
      money[data.user].blackjackDealerHand = [];
      money[data.user].blackjackHand = [];
      money[data.user].blackjackBet = 0;
      fs.writeFile('./plugins/casino/money.json', JSON.stringify(money, null, 4), function (err) {
        if (err) {
          Bot.log(err);
        }
      });
    } else if (dealerTotalS === playerTotalS) {
      client.sendMessage(`The results are equal. You got your money back. @${data.user}`);
      money[data.user].points += playerBetS;
      money[data.user].playingBlackjack = false;
      money[data.user].blackjackDealerHand = [];
      money[data.user].blackjackHand = [];
      money[data.user].blackjackBet = 0;
      fs.writeFile('./plugins/casino/money.json', JSON.stringify(money, null, 4), function (err) {
        if (err) {
          Bot.log(err);
        }
      });
    } else if (playerTotalS > dealerTotalS) {
      client.sendMessage(`Congratulations, You won ${playerBetS * 2} points. @${data.user}`);
      money[data.user].points += playerBetS * 2;
      money[data.user].playingBlackjack = false;
      money[data.user].blackjackDealerHand = [];
      money[data.user].blackjackHand = [];
      money[data.user].blackjackBet = 0;
      fs.writeFile('./plugins/casino/money.json', JSON.stringify(money, null, 4), function (err) {
        if (err) {
          Bot.log(err);
        }
      });
    } else if (playerTotalS < dealerTotalS) {
      client.sendMessage(`Unfortunately you lost. @${data.user}`);
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
  },
};
