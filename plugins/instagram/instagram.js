const https = require('https');
const Bot = require('../../modules/Bot.js');
const Tool = require('../../modules/Tool.js');

module.exports = {
  name: 'instagram',
  description: 'grab latest post from user ig profile',
  author: "Created by Rehkloos",
  license: "Apache-2.0",
  command: 'ig', // This is the Command that is typed into Chat!
  permissions: [], // This is for Permissisons depending on the Platform.
  cooldown: 10, // this is Set in Seconds, how long between the next usage of this command.
  execute(client, data) {

    const username = data.args[0];

    let url = `https://instagram.hanifdwyputra.xyz/?username=${username}`; // instagram scraper api

    Tool.httpsGet(url).then((output) => {
      const latest = output.graphql.user.edge_owner_to_timeline_media.edges[0].node; // json tree for finding latest post
      const post = latest.shortcode; // get ig post shortcode
      client.sendMessage(Bot.translate("plugins.instagram.info", { // plugins > instagram > processed output line
        user: data.user, // in 'en.json' this is related to "@{user}"
        result: post // 'output' is url json result and 'img' is the specific line from json
      }));
    }).catch((err) => {
      Bot.log(Bot.translate("plugins.instagram.error"), {
        error: err
      });
    });

  },
  activate() {
    Bot.log(Bot.translate("plugins.instagram.activated"));
  },
  deactivate() {
    Bot.log(Bot.translate("plugins.instagram.deactivated"));
  }
};
