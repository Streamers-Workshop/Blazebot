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

    const num = Math.floor(Math.random() * 2001); // random number generator with max num of 2000
    let url = "https://xkcd.com/info.0.json";
    let rURL = `http://xkcd.com/${num}/info.0.json`;

    let method = {
      method: "Get"
    };

    const input = data.args[0];

    switch (input) {
      case 'latest': {
        fetch(url, method)
          .then(res => res.json())
          .then((json) => {
            client.sendMessage(`@${data.user} latest xkcd comic -  ${json.img}`);
          });
        break;
      }
      case 'random': {
        fetch(rURL, method)
          .then(res => res.json())
          .then((json) => {
            console.log(json);
            client.sendMessage(`@${data.user} random xkcd comic - ${json.img}`);
          });
        break;
      }
      default:
        client.sendMessage(`Example Usage: = !xkcd latest, !xkcd random`);
    }
  },
};
