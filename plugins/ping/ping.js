module.exports = {
  name: 'ping', // Name of the Plugin
  description: "PING",
  author: "Bioblaze Payne <bioblazepayne@gmail.com> (https://github.com/Bioblaze)",
  license: "Apache-2.0",
  command: 'ping', // This is the Command that is typed into Chat!
  permissions: [], // This is for Permissisons depending on the Platform.
  cooldown: 10, // this is Set in Seconds, how long between the next usage of this command.
  execute(client, data) {
    client.sendMessage(Bot.translate("plugins.ping.pong", {
      user: data.user
    }));
  },
  activate() {
    Bot.log(Bot.translate("plugins.ping.activated"))
  },
  deactivate() {
    Bot.log(Bot.translate("plugins.ping.deactivated"))
  }
};
