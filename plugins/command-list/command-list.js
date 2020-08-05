const Bot = require('../../modules/Bot.js');

module.exports = {
  name: 'Command List',
  description: 'List all commands into chat',
  chat: true, // Defines this as a Chat Command
  event: false, // Is this a Event?
  type: 5004, // Type Event
  command: 'commands', // This is the Command that is typed into Chat!
  permissions: [], // This is for Permissisons depending on the Platform.
  alias: [], // Alias commands that preform interesting things.
  cooldown: 1, // this is Set in Seconds, how long between the next usage of this command.
  settings: false, // Defining this as false will load the Settings file for this Plugin when the system loads this plugin.
  credits: 'Created by Rehkloos & Krammy',
  execute(client) {
    const commands = Array.from(Bot.chat.keys());
    let message = [];

    for (let i = 0; i <= commands.length - 1; i++) {
      message.push(commands[i]);
      const m = message.join(', !');
      if (`!${m}`.length >= 120 || commands[i] === commands[commands.length - 1]) {
        client.sendMessage(`!${m}`);
        message = [];
      }
    }
  },
};
