const fs = require('fs');
const path = require('path');
const Plugins = require('../../modules/Plugins.js');

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
    const commands = Array.from(Plugins.chat.keys());

    if (commands.includes(command)) {
      const fileName = `${command}.js`;
      const pluginDir = path.join(__dirname, `./../`, command, `/`, fileName);
      let plugin = require(pluginDir);
      if (plugin.userCreated) {
        // REMOVE OLD PLUGIN FROM MEMORY.
        Plugins.chat.delete(plugin.command);
        Plugins.plugins.delete(plugin.command);

        plugin = null;
        data.args = data.args.join(' ');
        const commandOutput = data.args.substring(data.args.indexOf(' ') + 1);
        const esCommandOutput = commandOutput.replace(/[\\$'"]/g, '\\$&');
        const fill = `\
module.exports = { \r\
    name: '${command}', \r\
    description: '', \r\
    chat: true, \r\
    event: false, \r\
    type: 5004, \r\
    command: '${command}', \r\
    permissions: [], \r\
    alias: [], \r\
    cooldown: 10, \r\
	userCreated: true, \r\
    settings: false, \r\
    execute(client) { \r\
        client.sendMessage('${esCommandOutput}'); \r\
    }, \r\
}; \
`;

        fs.writeFile(pluginDir, fill, function a(err) {
          if (err) {
            console.log(err);
          } else {
            delete require.cache[require.resolve(pluginDir)];
            const newPlugin = require(pluginDir);
            // console.log(newPlugin.execute.toString());
            Plugins.chat.set(newPlugin.command, newPlugin);
            Plugins.plugins.set(newPlugin.command, newPlugin);
            client.sendMessage(`Edited ${command}`);
          }
        });

        // allows for reloading plugins modules initiate created file without rebooting Credit: kramitox (Krammy)
      } else {
        client.sendMessage('That is a pre-installed command. Cannot be edited.');
      }
    } else client.sendMessage("That command doesn't exist");
  },
};
