const fs = require('fs');
const path = require('path');
const Plugins = require('../../modules/Plugins.js');

module.exports = {
  name: 'Delete',
  description: 'delete commands',
  chat: true, // Defines this as a Chat Command
  event: false, // Is this a Event?
  type: 5004, // Type Event
  command: 'delete', // This is the Command that is typed into Chat!
  permissions: ['moderator', 'creator'], // This is for Permissisons depending on the Platform.
  alias: [], // Alias commands that preform interesting things.
  cooldown: 1, // this is Set in Seconds, how long between the next usage of this command.
  settings: false, // Defining this as false will load the Settings file for this Plugin when the system loads this plugin.
  credits: 'Created by Rehkloos',
  execute(client, data) {
    const command = data.args[0];
    const dir = path.join(__dirname, '..');
    const fileName = `${command}.js`;
    if (command.includes('.')) {
      client.sendMessage('Something is not functioning correctly');
      return;
    }
    if (fs.existsSync(dir)) {
      /*
       * First delete command from Plugins.chat
       *  and then delete folder
       */
      const newPluginDir = path.join(__dirname, `./../`, command, `/`, fileName);
      const plugin = require(newPluginDir);
      if (plugin.userCreated) {
        Plugins.chat.delete(plugin.command); // delete plugin within instance

        fs.rmdirSync(path.join(dir, command), {
          // check directory and args
          recursive: true, // delete parameters recursively
        });
        client.sendMessage(`${command} command was deleted`);
      } else client.sendMessage('That is a pre-installed command. Cannot delete.');
    } else if (!fs.existsSync(dir)) {
      client.sendMessage(`${command} command doesn't exist`);
    }
  },
};
