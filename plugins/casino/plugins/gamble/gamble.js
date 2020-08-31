const fs = require('fs');
const path = require('path');
const Bot = require('./../../../../modules/Bot.js');
var cFunctions = null;
var userInfo = null;



module.exports = {
    name: 'Gamble', // Name of the Plugin
    description: "Gamble game plugin",
    author: "Krammy",
    license: "Apache-2.0",
    command: 'gamble', // This is the Command that is typed into Chat!
    permissions: [], // This is for Permissisons depending on the Platform.
    cooldown: 5, // this is Set in Seconds, how long between the next usage of this command.
    execute(client, data) {
      if (cFunctions.checkBanned(data.user) === true)
        return client.sendMessage(Bot.translate("plugins.casino.plugins.gamble.banned",
        {
          user: data.user
        }));
  
      if (cFunctions.isNumeric(data.args[0]) === false || data.args[0] !== "all") {
        client.sendMessage(Bot.translate("plugins.casino.plugins.gamble.error_bet"));
        return;
      }
      playerBet = 0;
      if (data.args[0] == "all")
      {
          playerBet = parseInt(userInfo[data.user].points, 10);
      }
      else
      {
        playerBet = parseInt(data.args[0], 10);
      }
      if (playerBet > userInfo[data.user].points) {
        client.sendMessage(Bot.translate("plugins.casino.plugins.gamble.balance",
        {
          user: data.user
        }));
        return;
      }
      if (playerBet < 20) {
        client.sendMessage(Bot.translate("plugins.casino.plugins.gamble.min_bet", 
        {
          user: data.user
        })
        );
        return;
      }
  
      userInfo[data.user].points -= playerBet;
  
      const rnd = Math.random() * 100;
      
      if (rnd > 50)
      {
          client.sendMessage(Bot.translate("plugins.casino.plugins.gamble.win",
          {
            win: (userInfo[data.user].points * 2),
            user: data.user
          }));
          userInfo[data.user].points += (playerBet * 2)
      }
      else
      {
        client.sendMessage(Bot.translate("plugins.casino.plugins.gamble.lose",
        {
          user: data.user
        }));
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