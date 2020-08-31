const Bot = require('../../modules/Bot.js');

module.exports = {
  name: 'shout-out',
  description: "Give a shoutout to another User in Chat.",
  author: "Made by ssrjazz, updated by Krammy, Updated by Bioblaze Payne <bioblazepayne@gmail.com> (https://github.com/Bioblaze), raid section Created by IceFlom and re-implemented by Rehkloos",
  license: "Apache-2.0",
  command: 'so',
  permissions: ['moderator', 'creator'],
  cooldown: 10,
  execute(client, data) {
    const input = data.args[0];


    switch (input) {
      case 'default': {
        const soUsername = data.args[1];
        if (soUsername.charAt(1) === '@') {
          client.sendMessage(Bot.translate("plugins.shoutout.mentionuser", {
            user: data.args[1].substr(1),
            mention: data.args[1]
          }));
        } else {
          client.sendMessage(Bot.translate("plugins.shoutout.mentionaccount", {
            account: data.args[1]
          }));
        }
        break;
      }
      case 'raid': {
        let raidedChannel = data.args[1],
          counter = 0;
        if (raidedChannel == undefined) {
          client.sendMessage(Bot.translate("plugins.shoutout.undefined"));
          return;
        }
        setInterval(function() {
          if (counter > 4) {
            return;
          }
          //bot.sendMessage(`This is a raid. Go to the channel of @${raidedChannel} now. --> https://trovo.live/${raidedChannel}`);
          client.sendMessage(Bot.translate("plugins.shoutout.raid", {
            raidedChannel: data.args[1]
          }));
          counter++;
        }, 1000);
        break;
      }
      default:
        client.sendMessage(Bot.translate("plugins.shoutout.args"));
    }


  },
  activate() {
    Bot.log(Bot.translate("plugins.shoutout.activated"));
  },
  deactivate() {
    Bot.log(Bot.translate("plugins.shoutout.deactivated"));
  }
};
