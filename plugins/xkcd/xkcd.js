const https = require('https');
const Bot = require('../../modules/Bot.js');


module.exports = {
  name: 'xkcd',
  description: 'fetch xkcd comics',
  chat: true,
  event: false,
  type: 5004,
  command: 'xkcd',
  permissions: [],
  cooldown: 10,
  settings: false,
  credits: `Created by Rehkloos `,
  execute(client, data) {


    let url = "https://xkcd.com/info.0.json";

    https.get(url, (res) => {
      let body = "";

      res.on("data", (chunk) => {
        body += chunk;
      });

      res.on("end", () => {
        try {
          let json = JSON.parse(body);
          client.sendMessage(`@${data.user} latest xkcd comic -  ${json.img}`);
        } catch (error) {
          console.error(error.message);
        }
      });

    }).on('error', (err) => {
      Bot.log(`Error: ${err.message}`);
    });
  },
};
