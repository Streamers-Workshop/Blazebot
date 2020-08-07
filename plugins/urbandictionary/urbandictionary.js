const https = require('https');
const Bot = require('../../modules/Bot.js');

module.exports = {
  name: 'Urban Dictionary',
  description: 'slang dictionary and for some meme :)',
  chat: true, // Defines this as a Chat Command
  event: false, // Is this a Event?
  type: 5004, // Type Event
  command: 'ud', // This is the Command that is typed into Chat!
  permissions: [], // This is for Permissisons depending on the Platform.
  alias: [], // Alias commands that preform interesting things.
  cooldown: 1, // this is Set in Seconds, how long between the next usage of this command.
  settings: false, // Defining this as false will load the Settings file for this Plugin when the system loads this plugin.
  credits: 'Created by Rehkloos',
  execute(client, data) {
    if (!data.args[0]) {
      client.sendMessage(`Example Usage: = !ud <term>`);
    } else if (data.args[0]) {
      const searchTerm = data.args[0];
      const userUrl = `https://api.urbandictionary.com/v0/define?term=${searchTerm}`;
      https
        .get(userUrl, (resp) => {
          let ud = '';

          // A chunk of data has been recieved.
          resp.on('data', (chunk) => {
            ud += chunk;
          });
          resp.on('end', () => {
            const obj = JSON.parse(ud);
            if (obj) {
              const udl = obj.list[0];
              const def = udl.definition;
              client.sendMessage(`@${data.user} ${udl} - ${def}`);
            } else {
              const err = obj.errors[0];
              const errMsg = err.message;
              if (errMsg) {
                client.sendMessage(`We could not find the term ${data.args[0]}`);
              }
            }
          });
        })
        .on('error', (err) => {
          Bot.log(`Error: ${err.message}`);
        });
    }
  },
};
