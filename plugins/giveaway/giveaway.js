const Bot = require('../../modules/Bot.js');
let active = false;
const entrees = [];
const chance = require('chance').Chance();
const settings = require('./giveaway.json');

module.exports = {
  name: 'Giveaway',
  description: "Giveaway System for Trovo",
  author: "Original by Krammy, Converted by Bulllox",
  license: "Apache-2.0",
  command: 'giveaway', // This is the Command that is typed into Chat!
  permissions: ["creator", "moderator"], // This is for Permissisons depending on the Platform.
  cooldown: 60, // this is Set in Seconds, how long between the next usage of this command.

  execute(client, data) {
    if (data.args[0] != undefined) {
      var time = data.args[0].split(":");
      var hour = "00";
      var minutes = "00";
      var sec = "00";
      
      if(time.length == 1) {
        if(time[0] < 10) {
          hour = `0${time[0]}`;
        } else {
          hour = time[0];
        }
      }
      else if(time.length == 2) {
        if(time[0] < 10) {
          hour = `0${time[0]}`;
        } else {
          hour = time[0];
        }
        if(time[2] < 10) {
          minutes = `0${time[1]}`;
        } else {
          minutes = time[1];
        }
      }

      Bot.log(time.length);
      if(time.length > 3) {
        sec = time[2];
      }
    
      let timer = "";
      
      timer = time[0] * 60 * 60 * 1000 + time[1] * 60 * 1000;

      client.sendMessage(Bot.translate("plugins.giveaway.started", {
        h: hour,
        m: minutes,
        s: sec
      }));

      active = true;
      if(hour > 0 || minutes > settings.nodificationTimer) {
        setInterval(() => {
          
          client.sendMessage(Bot.translate("plugins.giveaway.runningGiveaway"));

        }, settings.nodificationTimer * 60 * 1000);
      }

      setTimeout(() => {
        active = false;
        if(entrees.length > 0) {
          const winner = chance.pickone(entrees);
          client.sendMessage(Bot.translate("plugins.giveaway.winner", {
            user: winner
          }));
        } else {
          client.sendMessage(Bot.translate("plugins.giveaway.noOneJoined"));
        }

      }, timer);
    } else {
      client.sendMessage(Bot.translate("plugins.giveaway.noTime"));
    }

  },

  add(client, user) {
    if(active == true) {
      if(entrees.includes(user)) {
         client.sendMessage(Bot.translate("plugins.giveaway.userExists"));
         return false;
      }
      entrees.push(user);      
      client.sendMessage(Bot.translate("plugins.giveaway.userJoined", {
        username: user
      }));
    } else {
      client.sendMessage(Bot.translate("plugins.giveaway.notRunning"));
    }
  },

  activate() {
    Bot.log(Bot.translate("plugins.giveaway.activated"));
  },
  deactivate() {
    Bot.log(Bot.translate("plugins.giveaway.deactivated"));
  }
};
