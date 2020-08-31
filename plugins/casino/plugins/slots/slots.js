const fs = require('fs');
const path = require('path');
const Bot = require('../../../../modules/Bot.js');
var cFunctions = null;
var userInfo = null;



module.exports = {
    name: 'slots', // Name of the Plugin
    description: "Slots game plugin",
    author: "Original by Ulash. Updated by Krammy",
    license: "Apache-2.0",
    command: 'slots', // This is the Command that is typed into Chat!
    permissions: [], // This is for Permissisons depending on the Platform.
    cooldown: 5, // this is Set in Seconds, how long between the next usage of this command.
    execute(client, data) {
      if (cFunctions.checkBanned(data.user) === true) {
        return client.sendMessage(
          Bot.translate("plugins.casino.plugins.slot.banned",{
            user: data.user
          }),
        );
      }
      if (!data.args[0])
        return client.sendMessage(
          Bot.translate("plugins.casino.plugins.slot.min_bet",{
            user: data.user
          })
        );
      if (cFunctions.isNumeric(data.args[0]) === false)
        return client.sendMessage(Bot.translate("plugins.casino.plugins.slot.error_bet",{
            user: data.user
          }),);
  
      const playerBet = parseInt(data.args[0], 10);
      if (playerBet > parseInt(userInfo[data.user].points, 10)) {
        client.sendMessage(Bot.translate("plugins.casino.plugins.slot.balance",{
          user: data.user
        }),);
        return;
      }
      if (playerBet < 100) {
        client.sendMessage(
          Bot.translate("plugins.casino.plugins.slot.min_bet",{
            user: data.user
          }),
        );
        return;
      }
  
      userInfo[data.user].points -= playerBet;
  
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
          client.sendMessage(Bot.translate("plugins.casino.plugins.slot.win",{
            playerBet: (playerBet *500),
            user: data.user
          }));
          userInfo[data.user].points += playerBet * 500;
        } else if (lurkCounter === 2) {
          client.sendMessage(Bot.translate("plugins.casino.plugins.slot.win",{
            playerBet: (playerBet *5),
            user: data.user
          }));
          userInfo[data.user].points += playerBet * 5;
        } else if (lurkCounter === 1) {
          client.sendMessage(Bot.translate("plugins.casino.plugins.slot.win",{
            playerBet: (playerBet *2),
            user: data.user
          }));
          userInfo[data.user].points += playerBet * 2;
        }
      }
  
      if (slotResults[0] === slotResults[1] && slotResults[0] === slotResults[2]) {
        if (slotResults[0] === ':greenheart ') {
          client.sendMessage(Bot.translate("plugins.casino.plugins.slot.win",{
            playerBet: (playerBet *250),
            user: data.user
          }));
          userInfo[data.user].points += playerBet * 250;
        } else if (slotResults[0] === ':righthead :lefthead ') {
          client.sendMessage(Bot.translate("plugins.casino.plugins.slot.win",{
            playerBet: (playerBet *100),
            user: data.user
          }));
          userInfo[data.user].points += playerBet * 100;
        } else if (slotResults[0] === ':angry ') {
          client.sendMessage(Bot.translate("plugins.casino.plugins.slot.win",{
            playerBet: (playerBet *75),
            user: data.user
          }));
          userInfo[data.user].points += playerBet * 75;
        } else if (slotResults[0] === ':cake ') {
          client.sendMessage(Bot.translate("plugins.casino.plugins.slot.win",{
            playerBet: (playerBet *50),
            user: data.user
          }));
          userInfo[data.user].points += playerBet * 50;
        } else if (slotResults[0] === ':gg ') {
          client.sendMessage(Bot.translate("plugins.casino.plugins.slot.win",{
            playerBet: (playerBet *25),
            user: data.user
          }));
          userInfo[data.user].points += playerBet * 25;
        } else if (slotResults[0] === ':ez ') {
          client.sendMessage(
            Bot.translate("plugins.casino.plugins.slot.win",{
              playerBet: (playerBet *1000),
              user: data.user
            })
          );
          userInfo[data.user].points += playerBet * 1000;
        }
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