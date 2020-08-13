const fetch = require('node-fetch');


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

    let method = {
      method: "Get"
    };

    fetch(url, method)
      .then(res => res.json())
      .then((json) => {
        client.sendMessage(`@${data.user} latest xkcd comic -  ${json.img}`);
      });
  },
};
