const fs = require('fs');
const path = require('path');
const Bot = require('./../../../../modules/Bot.js');
var cFunctions = null;
var userInfo = null;



module.exports = {
    name: 'wheel', // Name of the Plugin
    description: "wheel game plugin",
    author: "Original by Ulash. Updated by Krammy",
    license: "Apache-2.0",
    command: 'wheel', // This is the Command that is typed into Chat!
    permissions: [], // This is for Permissisons depending on the Platform.
    cooldown: 5, // this is Set in Seconds, how long between the next usage of this command.
    execute(client, data) {  
      if (cFunctions.checkBanned(data.user) === true) return client.sendMessage(Bot.translate("plugins.casino.plugins.wheel.banned",
      {
        user:data.user
      }));
      if (cFunctions.isNumeric(data.args[0]) === false) return client.sendMessage(Bot.translate("plugins.casino.plugins.wheel.typo",
      {
        user:data.user
      }));
      if (cFunctions.isNumeric(data.args[1]) === false) return client.sendMessage(Bot.translate("plugins.casino.plugins.wheel.typo",
      {
        user:data.user
      }));
      if (
        parseInt(data.args[1], 10) !== 1 &&
        parseInt(data.args[1], 10) !== 2 &&
        parseInt(data.args[1], 10) !== 5 &&
        parseInt(data.args[1], 10) !== 10 &&
        parseInt(data.args[1], 10) !== 20
      )
        return client.sendMessage(Bot.translate("plugins.casino.plugins.wheel.typo",
        {
          user:data.user
        }));
  
      const playerBet = parseInt(data.args[0], 10);
      if (playerBet > userInfo[data.user].points) {
        client.sendMessage(Bot.translate("plugins.casino.plugins.wheel.balance",
        {
          user:data.user
        }));
        return;
      }
      if (playerBet < 100) {
        client.sendMessage(
          Bot.translate("plugins.casino.plugins.wheel.balance",
        {
          user:data.user
        }),
        );
        return;
      }
  
      userInfo[data.user].commandDate = new Date();
  
      userInfo[data.user].points -= playerBet;
  
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
  
      client.sendMessage(Bot.translate("plugins.casino.plugins.wheel",
      {
        wheel: wheel,
        user: data.user
      }));
  
      if (wheel === 40) {
        client.sendMessage(
          Bot.translate("plugins.casino.plugins.wheel",
          {
            playerBet: (playerBet * (wheel + 1)),
            user: data.user
          })
        );
        userInfo[data.user].points += playerBet * (wheel + 1);
      }
  
      if (parseInt(data.args[1], 10) === wheel) {
        client.sendMessage(
          Bot.translate("plugins.casino.plugins.wheel",
          {
            playerBet: (playerBet * (wheel + 1)),
            user: data.user
          })
        );
        userInfo[data.user].points += playerBet * (wheel + 1);
      } else {
        client.sendMessage(Bot.translate("plugins.casino.plugins.wheel.lose",
        {
          user: data.user
        }));
      }
    },

    activate() {
    userInfo = require(path.join(Bot.root, 'data/users/users.json'));
    cFunctions = require('../../cFunctions.js');
    Bot.log(Bot.translate("plugins.casino.plugins.wheel.activated"))
    },

    deactivate() {
    userInfo = null;
    cFunctions = null;
    Bot.log(Bot.translate("plugins.casino.plugins.wheel.deactivated"))
  }
}