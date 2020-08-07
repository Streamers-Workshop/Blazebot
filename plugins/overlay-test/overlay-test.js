const Bot = require('../../modules/Bot.js');

module.exports = {
  name: 'overlay-test-plugin-text',
  description: 'Lets the bot introduce himself',
  chat: true, // Defines this as a Chat Command
  event: false, // Is this a Event?
  type: 5004, // Type Event
  command: 'overlay', // This is the Command that is typed into Chat!
  permissions: [], // This is for Permissisons depending on the Platform.
  alias: [], // Alias commands that preform interesting things.
  cooldown: 10, // this is Set in Seconds, how long between the next usage of this command.
  settings: false, // Defining this as false will load the Settings file for this Plugin when the system loads this plugin.
  credits: 'Created by Bioblaze Payne',
  execute(client, data) {
    var service = Bot.getService('http-overlay-module');
    service.output.notifyAll({
      type: "text",
      page: "test",
      name: data.user,
      message: "has Tested the System!"
    });
  },
};