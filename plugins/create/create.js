const fs = require('fs');
const path = require('path');
const Plugins = require('../../modules/Plugins.js');

module.exports = {
  name: 'Create',
  description: 'Create commands from chat',
  chat: true, // Defines this as a Chat Command
  event: false, // Is this a Event?
  type: 5004, // Type Event
  command: 'create', // This is the Command that is typed into Chat!
  permissions: ['moderator', 'creator'], // This is for Permissisons depending on the Platform.
  alias: [], // Alias commands that preform interesting things.
  cooldown: 1, // this is Set in Seconds, how long between the next usage of this command.
  settings: false, // Defining this as false will load the Settings file for this Plugin when the system loads this plugin.
  credits: 'Created by Raccoon, Update by Rehkloos & kramitox',
  execute(client, data) {
    const args = data.args.join(' ');
    const newCommand = args.substr(0, data.args.indexOf(' '));
    const filePath = `./plugins/${newCommand}/${newCommand}.js`;
    try {
      if (!fs.existsSync(filePath)) {
        this.make(data);
        client.sendMessage(`Command ${newCommand} added.`);
      } else if (fs.existsSync(filePath)) {
        client.sendMessage(`Command ${newCommand} exists.`);
      }
    } catch (err) {
      client.sendMessage(`Command ${newCommand} not added.`);
    }
  },
  make(data) {
    data.args = data.args.join(' ');
    const newCommand = data.args.substr(0, data.args.indexOf(' '));
    const commandOutput = data.args.substring(data.args.indexOf(' ') + 1);
    const esCommandOutput = commandOutput.replace(/[\\$'"]/g, '\\$&'); // escaped_commandOutput
    const fileName = `${newCommand}.js`;
    const dir = `./plugins/${newCommand}`; // Create directory based on command name
    if (!fs.existsSync(dir)) {
      // check if command name folder exists
      fs.mkdirSync(dir); // if not create the folder
    }
    const filePath = `${dir}/${fileName}`; // create the .js file within plugin/command_name directory

    const fill = `\
module.exports = { \r\
    name: '${newCommand}', \r\
    description: '', \r\
    chat: true, \r\
    event: false, \r\
    type: 5004, \r\
    command: '${newCommand}', \r\
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
    fs.writeFile(filePath, fill, function a(err) {
      if (err) throw Error(err);
      else {
        // allows for reloading plugins modules initiate created file without rebooting Credit: kramitox (Krammy)
        const newPluginDir = path.join(__dirname, `./../`, newCommand, `/`, fileName);
        const plugin = require(newPluginDir);

        Plugins.chat.set(plugin.command, plugin);
        Plugins.plugins.set(newCommand, plugin);
      }
    });
  },
};
