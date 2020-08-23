const https = require('https');
const Bot = require('../../modules/Bot.js');
const Tool = require('../../modules/Tool.js');


module.exports = {
  name: 'xkcd', // Name of the Plugin
  description: "fetch latest xkcd comics",
  author: "Created by Rehkloos",
  license: "Apache-2.0",
  command: 'xkcd', // This is the Command that is typed into Chat!
  permissions: [], // This is for Permissisons depending on the Platform.
  cooldown: 10, // this is Set in Seconds, how long between the next usage of this command.
  execute(client, data) {


    let url = "https://xkcd.com/info.0.json";

    Tool.httpsGet(url).then((output) => {
      client.sendMessage(Bot.translate("plugins.xkcd.processed", { // plugins > xkcd > processed output line
        user: data.user, // in 'en.json' this is related to "@{user}"
        result: output.img // 'output' is url json result and 'img' is the specific line from json
      }));
    }).catch((err) => {
      Bot.log(Bot.translate("plugins.xkcd.error"), {
        error: url
      });
    });
  },

  activate() {
    Bot.log(Bot.translate("plugins.xkcd.activated"));
  },
  deactivate() {
    Bot.log(Bot.translate("plugins.xkcd.deactivated"));
  }
};
