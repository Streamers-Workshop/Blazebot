const settings = require('./timed-messages.json');
const Bot = require('../../modules/Bot.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'Timed-Messages',
  description: 'Send automatic timed messages to chat',
  author: `Made by Wikinger1988`,
  license: "Apache-2.0",
  command: 'timers', // This is the Command that is typed into Chat!
  permissions: ['moderator', 'creator'], // This is for Permissisons depending on the Platform.
  cooldown: 0, // this is Set in Seconds, how long between the next usage of this command.
  execute(client, data) {
    const minutes = settings.time; 
    const TIME_BETWEEN_Messages = minutes * 60 * 1000;
    const startDate = Date().toString();


// Start
    if (data.args[0] === `start`) {
	console.log(`Timed-Message: starting at ${startDate}`);
    client.sendMessage(Bot.translate("plugins.timed-messages.start"));
      i = setInterval(() => {
        const dateTime = Date().toString();
        Bot.log(`Timed-Message: sending message at ${dateTime}`);
        const sResponses = fs.readFileSync(path.join(__dirname, 'messages.txt'), 'utf8');
        const messages = sResponses.split('\n');
		var sResponse = messages[(Math.random() * messages.length ) |- 0 + 0];
        client.sendMessage(`${sResponse}`);
      }, TIME_BETWEEN_Messages);
	  return;
    }
// Stop	
	if (data.args[0] === `stop`) {
		console.log(`Timed-Message: ending at ${startDate}`);
		client.sendMessage(Bot.translate("plugins.timed-messages.stop"));
	    clearInterval(i);
		  return;
	}	
  },
  activate() {
    Bot.log(Bot.translate("plugins.timed-messages.activated"));
  },
  deactivate() {
    Bot.log(Bot.translate("plugins.timed-messages.deactivated"));
  }
};
