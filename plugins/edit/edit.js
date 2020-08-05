const path = require('path');
const Bot = require('../../modules/Bot.js');

module.exports = {
  name: 'edit', // Name of the Plugin
  description: 'Edits user created command', // Description
  chat: true, // Defines this as a Chat Command
  event: false, // Is this a Event?
  type: 5004, // Type Event
  command: 'edit', // This is the Command that is typed into Chat!
  permissions: [], // This is for Permissisons depending on the Platform.
  alias: [], // Alias commands that preform interesting things.
  cooldown: 0, // this is Set in Seconds, how long between the next usage of this command.
  settings: false, // Defining this as false will load the Settings file for this Plugin when the system loads this plugin.
  credits: `Made by Krammy`, // MAKE SURE YOU FILL THIS IN GOD DAMNIT!
  execute(client, data) {
    const command = data.args[0];
    const commands = Array.from(Bot.chat.keys());
    const dir = path.join(__dirname, '..');

    if (commands.includes(command)) {
      const plugin = Bot.plugins.get(command);
      if (plugin.userCreated) {
        const del = Bot.plugins.get('delete');
        del.erase(dir, plugin.command);
        delete require.cache[path.join(dir, command, `${command}.js`)];
        const create = Bot.plugins.get('create');
        create.make(data);
        client.sendMessage('Edited');
      } else {
        client.sendMessage('That is a pre-installed command. Cannot be edited.');
      }
    } else client.sendMessage("That command doesn't exist");
  },
};
