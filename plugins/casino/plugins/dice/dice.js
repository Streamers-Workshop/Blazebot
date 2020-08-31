const fs = require('fs');
const path = require('path');
const Bot = require('./../../../../modules/Bot.js');
var cFunctions = null;
var userInfo = null;



module.exports = {
    name: 'dice', // Name of the Plugin
    description: "Dice game plugin",
    author: "Original by Ulash. Updated by Krammy",
    license: "Apache-2.0",
    command: 'dice', // This is the Command that is typed into Chat!
    permissions: [], // This is for Permissisons depending on the Platform.
    cooldown: 5, // this is Set in Seconds, how long between the next usage of this command.
    execute(client, data) {
      if (cFunctions.checkBanned(data.user) === true)
        return client.sendMessage(Bot.translate("plugins.casino.plugins.dice.banned",
        {
          user: data.user
        }));
  
      if (cFunctions.isNumeric(data.args[0]) === false) {
        client.sendMessage(Bot.translate("plugins.casino.plugins.dice.error_bet"));
        return;
      }
  
      const playerBet = parseInt(data.args[0], 10);
  
      if (playerBet > userInfo[data.user].points) {
        client.sendMessage(Bot.translate("plugins.casino.plugins.dice.balance",
        {
          user: data.user
        }));
        return;
      }
      if (playerBet < 20) {
        client.sendMessage(Bot.translate("plugins.casino.plugins.dice.min_bet", 
        {
          user: data.user
        })
        );
        return;
      }
  
      userInfo[data.user].commandDate = new Date();
  
      userInfo[data.user].points -= playerBet;
  
      const playerDice1 = Math.floor(cFunctions.randomNumber() * 6 + 1);
      const playerDice2 = Math.floor(cFunctions.randomNumber() * 6 + 1);
      const playerTotal = playerDice1 + playerDice2;
  
      const dealerDice1 = Math.floor(cFunctions.randomNumber() * 6 + 1);
      const dealerDice2 = Math.floor(cFunctions.randomNumber() * 6 + 1);
      const dealerTotal = dealerDice1 + dealerDice2;
  
      client.sendMessage(Bot.translate("plugins.casino.plugins.dice.results",
        {
          playerDice1: playerDice1,
          playerDice2: playerDice2,
          playerTotal: playerTotal,
          dealerDice1: dealerDice1,
          dealerDice2: dealerDice2,
          dealerTotal: dealerTotal
        }
      ));
  
      if (playerTotal < dealerTotal) {
        client.sendMessage(Bot.translate("plugins.casino.plugins.dice.lose",
        {
          user: data.user
        }));
      } else if (playerTotal === dealerTotal) {
        client.sendMessage(Bot.translate("plugins.casino.plugins.dice.draw",
        {
          user: data.user
        }));
        userInfo[data.user].points += playerBet;
      } else {
        client.sendMessage(Bot.translate("plugins.casino.plugins.dice.win",
        {
          playerBetH : (playerBet * 2),
          user : data.user
        }));
        userInfo[data.user].points += 2 * playerBet;
      }
    },

    activate() {
    userInfo = require(path.join(Bot.root, 'data/users/users.json'));
    cFunctions = require('../../cFunctions.js');
    Bot.log(Bot.translate("plugins.casino.plugins.dice.activated"))
    },

    deactivate() {
    userInfo = null;
    cFunctions = null;
    Bot.log(Bot.translate("plugins.casino.plugins.dice.deactivated"))
  }
}