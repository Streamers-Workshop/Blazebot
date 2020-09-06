const Bot = require('../../modules/Bot.js');

module.exports = {
  name: 'Giveaway Join',
  description: "Joins a giveaway",
  author: "Made by Bulllox",
  license: "Apache-2.0",
  command: 'join', // This is the Command that is typed into Chat!
  permissions: [], // This is for Permissisons depending on the Platform.
  cooldown: 60, // this is Set in Seconds, how long between the next usage of this command.

  execute(client, data) {
    const giveaway = Bot.plugins.get('giveaway');
    //Bot.log(giveaway);
    giveaway.add(client, data.user);
  },
  activate() {
    Bot.log("Joined activated");
  },
  deactivate() {
    Bot.log("Joined deactivated");
  }
};
