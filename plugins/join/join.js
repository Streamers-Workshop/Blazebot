const Bot = require('../../modules/Bot.js');

module.exports = {
  name: 'join', // Name of the Plugin
  description: 'joins the giveaway if active.', // Description
  chat: true, // Defines this as a Chat Command
  event: false, // Is this a Event?
  type: 5004, // Type Event
  command: 'join', // This is the Command that is typed into Chat!
  permissions: [], // This is for Permissisons depending on the Platform.
  alias: [], // Alias commands that preform interesting things.
  cooldown: 0, // this is Set in Seconds, how long between the next usage of this command.
  settings: false, // Defining this as false will load the Settings file for this Plugin when the system loads this plugin.
  credits: `Made by Krammy`, // MAKE SURE YOU FILL THIS IN GOD DAMNIT!

  execute(client, data) {
    const giveaway = Bot.plugins.get('giveaway');
    giveaway.add(client, data.user);
  },
};
