const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'create',
  description: 'creates a text command',
  credits:
    'Look in Contrib for who did this, modified by bioblaze to include permissions check in it.',
  permissions: ['moderator', 'creator'],
  execute(message, args, user, bot) {
    const argsCombined = args.join(' ');
    const newCommand = argsCombined.substr(0, argsCombined.indexOf(' '));
    const commandOutput = argsCombined.substring(argsCombined.indexOf(' ') + 1);
    const fileName = `${newCommand}.js`;
    const pathToFile = path.join(path.join(__dirname, '../plugins'), fileName);

    try {
      if (!fs.existsSync(pathToFile)) {
        const data = `\
console.log('loaded ${newCommand}'); \r\
module.exports = { \r\
    name: '${newCommand}', \r\
    description: '', \r\
    permissions: [], \r\
    execute(message, args, user, bot, event, plugins) { \r\
        bot.sendMessage('${commandOutput}'); \r\
    }, \r\
}; \
`;
        const commandToAdd = {
          name: newCommand,
          description: '',
          execute() {
            bot.sendMessage(commandOutput);
          },
        };
        fs.writeFile(pathToFile, data, (err) => {
          if (err) throw Error(err);
        });

        bot.commands.set(commandToAdd.name, commandToAdd);
        bot.sendMessage(`Command ${newCommand} added.`);
      }
    } catch (err) {
      console.log(err);
      bot.sendMessage(`Command ${newCommand} not added.`);
    }
  },
};
