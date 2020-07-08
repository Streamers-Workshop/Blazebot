fs = require('fs');
path = require('path');
console.log('loaded create');
module.exports = {
	name: 'create',
	description: 'creates a text command',
	credits: "Look in Contrib for who did this, modified by bioblaze to include permissions check in it.",
  permissions: ['moderator', 'creator'],
	execute(message, args, user, bot, event, plugins) {
        args = args.join(' ')
        new_command = args.substr(0,args.indexOf(' '))
        command_output = args.substring(args.indexOf(' ')+1)
        file_name = new_command + '.js'
        path_to_file = path.join(path.join(__dirname, '../plugins'), file_name);


        try {
            if (!fs.existsSync(path_to_file)) {
                data = `\
console.log('loaded ${new_command}'); \r\
module.exports = { \r\
    name: '${new_command}', \r\
    description: '', \r\
    permissions: [], \r\
    execute(message, args, user, bot, event, plugins) { \r\
        bot.sendMessage('${command_output}'); \r\
    }, \r\
}; \
`
                command_to_add = {
                    name: new_command,
                    description: '',
                    execute(message, args, user, bot) {
                        bot.sendMessage(command_output);
                    },
                };
                fs.writeFile(path_to_file, data, function (err) {
                    if (err) throw Error(err);
                  });

                bot.commands.set(command_to_add.name, command_to_add)
		        bot.sendMessage(`Command ${new_command} added.`);

            }
          } catch(err) {
            console.log(err);
            bot.sendMessage(`Command ${new_command} not added.`);
          }
	},
};
