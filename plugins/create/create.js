const fs = require('fs');
// const path = require('path');
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
  credits: 'Created by Raccoon, Update by Rehkloos',
  execute(client, data, plugins) {
    data.args = data.args.join(' ');
    const new_command = data.args.substr(0, data.args.indexOf(' '));
    const command_output = data.args.substring(data.args.indexOf(' ') + 1);
    const escaped_command_output = command_output.replace(/[\\$'"]/g, '\\$&');
    const file_name = `${new_command}.js`;
    const dir = `./plugins/${new_command}`; // Create directory based on command name
    if (!fs.existsSync(dir)) {
      // check if command name folder exists
      fs.mkdirSync(dir); // if not create the folder
    }
    const file_path = `${dir}/${file_name}`; // create the .js file within plugin/command_name directory

    try {
      if (!fs.existsSync(file_path)) {
        data = `\
console.log('loaded ${new_command}'); \r\
module.exports = { \r\
    name: '${new_command}', \r\
    description: '', \r\
    chat: true, \r\
    event: false, \r\
    type: 5004, \r\
    command: '${new_command}', \r\
    permissions: [], \r\
    alias: [], \r\
    cooldown: 10, \r\
    settings: false, \r\
    execute(client) { \r\
        client.sendMessage('${escaped_command_output}'); \r\
    }, \r\
}; \
`;
        const command_to_add = {
          name: new_command,
          description: '',
          chat: true, // Defines this as a Chat Command
          event: false, // Is this a Event?
          type: 5004, // Type Event
          command: 'create', // This is the Command that is typed into Chat!
          permissions: [], // This is for Permissisons depending on the Platform.
          alias: [], // Alias commands that preform interesting things.
          cooldown: 10, // this is Set in Seconds, how long between the next usage of this command.
          settings: false, // Defining this as false will load the Settings file for this Plugin when the system loads this plugin.
          execute(client, data) {
            client.sendMessage(command_output);
          },
        };
        fs.writeFile(file_path, data, function (err) {
          if (err) throw Error(err);
        });

        // client.commands.set(command_to_add.name, command_to_add); Needs fix
        Plugins.plugins.set(dir, file_path);
        client.sendMessage(`Command ${new_command} added.`);
      }
    } catch (err) {
      console.log(err);
      client.sendMessage(`Command ${new_command} not added.`);
    }
  },
};
