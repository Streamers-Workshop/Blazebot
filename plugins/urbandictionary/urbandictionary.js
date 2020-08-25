const https = require('https');
const Bot = require('../../modules/Bot.js');


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

    https.get(url, (res) => {
      let body = "";

      res.on("data", (chunk) => {
        body += chunk;
      });

      res.on("end", () => {
        try {
          let json = JSON.parse(body);
          const udl = json.list[0]; // search list in ud api
          const word = udl.word; // find word in udl
          const def = udl.definition; // find definition in udl
          client.sendMessage(Bot.translate("plugins.urbandictionary.info", { // plugins > instagram > processed output line
            user: data.user,
            word: word,
            definition: def.replace(/[\[\]']/g,'' ) // remove brackets from defition json result
          }));
        } catch (error) {
          console.error(error.message);
        }
      });

    }).on('error', (err) => {
      Bot.log(`Error: ${err.message}`);
    });

  },
  activate() {
    Bot.log(Bot.translate("plugins.urbandictionary.activated"));
  },
  deactivate() {
    Bot.log(Bot.translate("plugins.urbandictionary.deactivated"));
  }
};
