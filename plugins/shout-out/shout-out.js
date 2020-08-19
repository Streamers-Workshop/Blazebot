module.exports = {
  name: 'shout-out',
  description: "Give a shoutout to another User in Chat.",
  author: "Made by ssrjazz, updated by Krammy, Updated by Bioblaze Payne <bioblazepayne@gmail.com> (https://github.com/Bioblaze)",
  license: "Apache-2.0",
  command: 'so',
  permissions: ['moderator', 'creator'],
  cooldown: 10,
  execute(client, data) {
    const soUsername = data.args[0];
    if (soUsername.charAt(0) === '@') {
      client.sendMessage(Bot.translate("plugins.shoutout.mentionuser", {
        user: data.args[0].substr(1),
        mention: data.args[0]
      }));
    } else {
      client.sendMessage(Bot.translate("plugins.shoutout.mentionaccount", {
        account: data.args[0]
      }));
    }
  },
  activate() {
    Bot.log(Bot.translate("plugins.shoutout.activated"))
  },
  deactivate() {
    Bot.log(Bot.translate("plugins.shoutout.deactivated"))
  }
};
