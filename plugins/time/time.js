const Bot = require('../../modules/Bot.js');

module.exports = {
  name: 'time', // Name of the Plugin
  description: "Gets the local time of the streamer.",
  author: "Made by EarWaxCandy. updated by Rehkloos, Bioblaze & Krammy",
  license: "Apache-2.0",
  command: 'time', // This is the Command that is typed into Chat!
  permissions: [], // This is for Permissisons depending on the Platform.
  cooldown: 10, // this is Set in Seconds, how long between the next usage of this command.
  execute(client, data) {
    const d = new Date();
    const localtime = d.toLocaleTimeString();
    client.sendMessage(Bot.translate("plugins.time.message", {
      time: localtime
    }));
  },
  activate() {
        Bot.log(Bot.translate("plugins.time.activated"));
  },
  deactivate() {
        Bot.log(Bot.translate("plugins.time.deactivated"));
  }
};
