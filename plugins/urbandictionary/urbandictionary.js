const https = require('https');
const Bot = require('../../modules/Bot.js');
const Tool = require('../../modules/Tool.js');


module.exports = {
  name: 'Urban Dictionary',
  description: 'slang dictionary and for some meme :)',
  author: "Created by Rehkloos",
  license: "Apache-2.0",
  command: 'ud', // This is the Command that is typed into Chat!
  permissions: [], // This is for Permissisons depending on the Platform.
  cooldown: 10, // this is Set in Seconds, how long between the next usage of this command.
  execute(client, data, modules) {
    const searchTerm = data.args[0];

    let url = `https://api.urbandictionary.com/v0/define?term=${searchTerm}`;

    Tool.httpsGet(url).then((output) => {
      client.sendMessage(Bot.translate("plugins.urbandictionary.info", { // plugins > instagram > processed output line
        user: data.user,
        word: output.list[0].word,
        definition: output.list[0].definition.replace(/[\[\]']/g, '') // remove brackets from defition json result
      }));
    }).catch((err) => {
      Bot.log(Bot.translate("plugins.urbandictionary.error"), {
        error: err
      });
    });

  },
  activate() {
    Bot.log(Bot.translate("plugins.urbandictionary.activated"));
  },
  deactivate() {
    Bot.log(Bot.translate("plugins.urbandictionary.deactivated"));
  }
};
