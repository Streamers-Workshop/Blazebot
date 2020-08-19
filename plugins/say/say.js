module.exports = {
  name: 'say',
  description: "You can say something as the Bot~",
  author: "Made by Friext#6935, Updated by Bioblaze Payne <bioblazepayne@gmail.com> (https://github.com/Bioblaze)",
  license: "Apache-2.0",
  command: 'say',
  permissions: ['moderator', 'creator'],
  execute(client, data) {
    if (data.args.length < 1) {
      client.sendMessage(Bot.translate("plugins.say.nomessage"));
    } else {
      client.sendMessage(`${data.args.join(' ')}`);
    }
  },
  activate() {
    Bot.log(Bot.translate("plugins.say.activated"))
  },
  deactivate() {
    Bot.log(Bot.translate("plugins.say.deactivated"))
  }
};
