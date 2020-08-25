const Bot = require('../../modules/Bot.js');


module.exports = {
  name: 'Hydrate',
  description: 'Remind the streamer to hydrate',
  author: "Created by Rehkloos",
  license: "Apache-2.0",
  command: 'hydrate', // This is the Command that is typed into Chat!
  permissions: [], // This is for Permissisons depending on the Platform.
  cooldown: 10, // this is Set in Seconds, how long between the next usage of this command.
  execute(client) {
    const minutes = 30;
    const TIME_BETWEEN_DRINKS = minutes * 60 * 1000;
    const startDate = Date().toString();

    console.log(`starting hydration messages at ${startDate}`);
    client.sendMessage(Bot.translate("plugins.hydrate.start"));
    setInterval(() => {
      const dateTime = Date().toString();
      console.log(`sending message at ${dateTime}`);
      client.sendMessage(Bot.translate("plugins.hydrate.interval"));
    }, TIME_BETWEEN_DRINKS); // wait this many milliseconds before reminding again

  },
  activate() {
    Bot.log(Bot.translate("plugins.hydrate.activated"));
  },
  deactivate() {
    Bot.log(Bot.translate("plugins.hydrate.deactivated"));
  }
};
