const https = require('https');
const Bot = require('../../modules/Bot.js');
const Tool = require('../../modules/Tool.js');

module.exports = {
  name: 'socialblade',
  description: 'A quick Social Blade user lookup for Trovo',
  author: "Created by Kestalkayden",
  license: "Apache-2.0",
  command: 'socialblade',
  permissions: [],
  cooldown: 4,
  execute(client, data) {
	  
	const username = data.args[0];
	if(username == null){
		url = "https://api.socialblade.com/v2/trovo-lookup/"+data.user;
	} else {
		url = "https://api.socialblade.com/v2/trovo-lookup/"+username;
	}    

	Tool.httpsGet(url).then((output) => {			
	  const status = output.status.success;
	  if(status == true) {
		response = output.data.message;
	  } else {
		error = output.status.error;
		response = output.status.message;	
	  }
      client.sendMessage(Bot.translate("plugins.socialblade.processed", {
        user: data.user, // in 'en.json' this is related to "@{user}"
        result: response
      }));
    }).catch((err) => {
      Bot.log(Bot.translate("plugins.socialblade.error"), {
        error: err
      });
    });
  },

  activate() {
    Bot.log(Bot.translate("plugins.socialblade.activated"));
  },
  deactivate() {
    Bot.log(Bot.translate("plugins.socialblade.deactivated"));
  }
};
