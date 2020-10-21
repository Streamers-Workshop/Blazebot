const Bot = require('../../modules/Bot.js');

module.exports = {
  name: 'shout-out',
  description: "Give a hug to another User in Chat.",
  author: "Made by E'lo",
  license: "Apache-2.0",
  command: 'hug',
  permissions: [],
  cooldown: 10,
  execute(client, data) {
    const hugUsername = data.args[0];
    if (hugUsername.charAt(0) === '@') {
      client.sendMessage(Bot.translate("plugins.hug.mentionuser", {
        user: data.args[0].substr(1),
        mention: data.args[0],
		hugger: data.user
      }));
    } else {
      client.sendMessage(Bot.translate("plugins.hug.mentionaccount", {
        account: data.args[0],
		hugger: data.user
      }));
    }
  },
  activate() {
    Bot.log(Bot.translate("plugins.hug.activated"))
  },
  deactivate() {
    Bot.log(Bot.translate("plugins.hug.deactivated"))
  }
};
