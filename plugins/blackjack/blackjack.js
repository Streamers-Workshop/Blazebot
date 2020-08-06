const fs = require('fs');
const money = require('../casino/money.json');
const cFunctions = require('../casino/cfunctions.js');


const Bot = require('../../modules/Bot.js');

module.exports = {
  name: 'blackjack',
  description: 'blackjack commands for casino.',
  chat: true, // Defines this as a Chat Command
  event: false, // Is this a Event?
  type: 5004, // Type Event
  command: 'blackjack', // This is the Command that is typed into Chat!
  permissions: [], // This is for Permissisons depending on the Platform.
  alias: [], // Alias commands that preform interesting things.
  cooldown: 10, // this is Set in Seconds, how long between the next usage of this command.
  settings: false, // Defining this as false will load the Settings file for this Plugin when the system loads this plugin.
  credits: `Made by Ulash.`, // MAKE SURE YOU FILL THIS IN GOD DAMNIT!
  execute(client, data) {
    const deck = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'J', 'K', 'Q'];
    const handString = ' ';
    const dealerHandString = ' ';

    // Check for if user created casino account or not
    if (!money[data.user]) {
      client.sendMessage('Please open an account with !casino register command to play casino.');
      return;
    }

    if (cFunctions.checkBanned(data.user) === true) {
      client.sendMessage('We are sorry, you have been banned from our casino.');
      return;
    }

    if (money[data.user].playingBlackjack === true) {
      client.sendMessage('Please finish the game you started first.');
      return;
    }

    // Waiting for like to enter a bet amount like !blackjack 1000
    if (cFunctions.isNumeric(data.args[0]) === false) {
      client.sendMessage('Please enter a valid number.');
      return;
    }

    if (parseInt(data.args[0], 10) > money[data.user].points) {
      client.sendMessage("You don't have enough points to play.");
      return;
    }

    // The entered bet is immediately decreasing and saved.
    const playerBet = parseInt(data.args[0], 10);
    money[data.user].blackjackBet = playerBet;
    money[data.user].points -= playerBet;
    money[data.user].playingBlackjack = true;
    fs.writeFile('./plugins/casino/money.json', JSON.stringify(money, null, 4), function (err) {
      if (err) {

        Bot.log(err);
      }
    });

    // Hands are dealt
    for (let n = 0; n < 2; n++) {
      money[data.user].blackjackHand.push(deck[Math.floor(cFunctions.randomNumber() * 11)]);
      money[data.user].blackjackDealerHand.push(deck[Math.floor(cFunctions.randomNumber() * 11)]);
    }

    // Calculating hands
    const playerTotal = cFunctions.calculateHand(money[data.user].blackjackHand);
    // const dealerTotal = cFunctions.calculateHand(money[data.user].blackjackDealerHand);

    client.sendMessage(
      `Your hand: ${money[data.user].blackjackHand[0]}, ${
        money[data.user].blackjackHand[1]
      } (Total: ${playerTotal})`,
    );
    client.sendMessage(`Dealers Hand: ${money[data.user].blackjackDealerHand[0]}`);

    // If it is 21, won immediately
    if (playerTotal === 21) {
      client.sendMessage(`Blackjack! You have earned ${playerBet * 3} points.`);
      money[data.user].points += playerBet * 3;
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

    fs.writeFile('./plugins/casino/money.json', JSON.stringify(money, null, 4), function (err) {
      if (err) {
        Bot.log(err);
      }
    });
  },
};
