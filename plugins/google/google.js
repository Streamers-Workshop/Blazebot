var randomWords = require('random-words');
const Bot = require('../../modules/Bot.js');

module.exports = {
  name: 'Google Search',
  description: 'Quick google search or search a random word',
  author: "Created by Rehkloos",
  license: "Apache-2.0",
  command: 'google', // This is the Command that is typed into Chat!
  permissions: [], // This is for Permissisons depending on the Platform.
  cooldown: 10, // this is Set in Seconds, how long between the next usage of this command.
  execute(client, data) {

    const input = data.args[0];

    switch (input) {
      case 'search': {
        const args = data.args.join(' ');
        const sTerm = args.split(' ').join('+').slice(7); // slice "7" removes "search+" from args
        const sURL = `https://www.google.com/search?q=${sTerm}`;
        client.sendMessage(Bot.translate("plugins.google.processed", {
          user: data.user, // in 'en.json' this is related to "@{user}"
          result: sURL // 'output' is url json result and 'img' is the specific line from json
        }));
        break;
      }
      case 'random': {
        const sRandom = randomWords();
        const srURL = `https://www.google.com/search?q=${sRandom}`;
        client.sendMessage(Bot.translate("plugins.google.processed", {
          user: data.user, // in 'en.json' this is related to "@{user}"
          result: srURL // 'output' is url json result and 'img' is the specific line from json
        }));
        break;
      }
      default:
        client.sendMessage(Bot.translate("plugins.google.args"));
    }
  },

  activate() {
    Bot.log(Bot.translate("plugins.google.activated"));
  },
  deactivate() {
    Bot.log(Bot.translate("plugins.google.deactivated"));
  }
};
