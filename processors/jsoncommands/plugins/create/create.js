const Bot = require('../../../../modules/Bot.js');
const fs = require('fs');
const path = require ('path');
const jsonCommands = require('../../jsoncommands.json');

module.exports = {
  name: 'create', // Name of the Plugin
  description: "creates jsoncommand",
  author: "Krammy <krammy_ie@outlook.com> (https://github.com/kramitox)",
  license: "Apache-2.0",
  command: 'create', // This is the Command that is typed into Chat!
  permissions: ['moderator','creator'], // This is for Permissisons depending on the Platform.
  cooldown: 10, // this is Set in Seconds, how long between the next usage of this command.
  execute(client, data) {
    const args = data.content.slice(Bot.settings.prefix.length).split(/ +/);
    var command = args[1];
    var response = args.slice(2, args.length).join(' ');
    if (response.length < 1)
    {
        client.sendMessage(Bot.translate("processors.jsoncommands.plugins.create.no_args"));
    }
    else if (jsonCommands.commands[command] !== undefined || Bot.getChatCommand(command) !== null)
    {
      client.sendMessage(Bot.translate("processors.jsoncommands.plugins.create.exists_error", {
				com: command
			}));
    }
    else
    {
      jsonCommands.commands[command] = response;
      client.sendMessage(Bot.translate("processors.jsoncommands.plugins.create.created", {
				com: command
			}));
      fs.writeFileSync(path.join(Bot.root, "processors", "jsoncommands", './jsoncommands.json'), JSON.stringify(jsonCommands, undefined, 4), (err) => {
        if (err) {
            Bot.log(Bot.translate("processors.jsoncommands.plugins.create.error_writing", {
                fileName: 'jsoncommands.json',
                error: err
              }));
        }
      });
    }    
  },
  activate() {
    Bot.log(Bot.translate("processors.jsoncommands.plugins.create.activated"));
  },
  deactivate() {
    Bot.log(Bot.translate("processors.jsoncommands.plugins.create.deactivated"));
  }
};
