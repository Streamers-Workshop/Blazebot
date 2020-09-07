const Bot = require('../../modules/Bot.js');
var i = null;

module.exports = {
  name: 'Raid',
  description: "Raid another channel. Posts the url of the other channel 5 times",
  author: "Made by ssrjazz, Update to 2.0.0 by Rehkloos",
  license: "Apache-2.0",
  command: 'raid',
  permissions: ['moderator', 'creator'],
  cooldown: 10,
  execute(client, data) {
    let raidedChannel = data.args[0],
      counter = 0;
    if (raidedChannel == undefined) {
      client.sendMessage(Bot.translate("plugins.raid.undefined"));
      return;
    }
    i=setInterval(function() {
      if (counter > 4) {
        return;
      }
      client.sendMessage(Bot.translate("plugins.raid.raidmessage", {
        raidedChannel: data.args[0]
      }));
      counter++;
    }, 1000);

  },
  activate() {
    Bot.log(Bot.translate("plugins.raid.activated"));
  },
  deactivate() {
    clearInterval(i);
    Bot.log(Bot.translate("plugins.raid.deactivated"));
  }
};
