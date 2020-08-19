const Bot = require('../../modules/Bot.js');

module.exports = {
  name: 'Bot',
  description: "Tells you about where to find Information about the Bot.",
  author: "Created by Takkes, Updated by Rehkloos, Updated by Bioblaze Payne <bioblazepayne@gmail.com> (https://github.com/Bioblaze)",
  license: "Apache-2.0",
  command: 'bot', // This is the Command that is typed into Chat!
  permissions: [], // This is for Permissisons depending on the Platform.
  cooldown: 60, // this is Set in Seconds, how long between the next usage of this command.
  console() {
    Bot.addConsoleCommand("bot", Bot.translate("plugins.bot.consolecommanddesc"), (args, callback) => {
      Bot.log(Bot.translate("plugins.bot.consolecommand"))
    });
  },
  execute(client, data) {
    client.sendMessage(Bot.translate("plugins.bot.findme", {
      user: data.user
    }));
    client.sendMessage(Bot.translate("plugins.bot.questions", {
      user: data.user
    }));
    client.sendMessage(Bot.translate("plugns.bot.wiki", {
      user: data.user
    }));
  },
  activate() {
    Bot.log(Bot.translate("plugins.bot.activated"))
  },
  deactivate() {
    Bot.log(Bot.translate("plugins.bot.deactivated"))
    Bot.removeConsoleCommands(["bot"]);
  }
};
