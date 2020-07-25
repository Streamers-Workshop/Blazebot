const Plugins = require('../../modules/Plugins.js');

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
  execute(client, data) {
    let commands = Array.from(Plugins.chat.keys());
	let message = [];
	commands.forEach( com => {
							message.push(com);
							if (message.length >= 15 || com == commands[commands.length - 1])
							{ 
								let m = message.join(',!');
								client.sendMessage(`!${m}`);
								message = [];
							}});
  },
};
