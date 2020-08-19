const https = require('https');
const Bot = require('../../modules/Bot.js');

module.exports = {
  name: 'Latest Instagram',
  description: 'grab latest post from user ig profile',
  chat: true, // Defines this as a Chat Command
  event: false, // Is this a Event?
  type: 5004, // Type Event
  command: 'ig', // This is the Command that is typed into Chat!
  permissions: [], // This is for Permissisons depending on the Platform.
  alias: [], // Alias commands that preform interesting things.
  cooldown: 10, // this is Set in Seconds, how long between the next usage of this command.
  settings: true, // Defining this as false will load the Settings file for this Plugin when the system loads this plugin.
  credits: 'Created by Rehkloos',
  execute(client, data) {

    const username = data.args[0];

    let url = `https://instagram.hanifdwyputra.xyz/?username=${username}`; // instagram scraper api

    https.get(url, (res) => {
      let body = "";

      res.on("data", (chunk) => {
        body += chunk;
      });

      res.on("end", () => {
        try {
          let json = JSON.parse(body);
          const latest = json.graphql.user.edge_owner_to_timeline_media.edges[0].node; // json tree for finding latest post
          const post = latest.shortcode; // get ig post shortcode
          //console.log(post);
          client.sendMessage(`@${data.user} streamer's latest instagram post - https://www.instagram.com/p/${post}`);
        } catch (error) {
          console.error(error.message);
        }
      });

    }).on('error', (err) => {
      Bot.log(`Error: ${err.message}`);
    });

  },
};
