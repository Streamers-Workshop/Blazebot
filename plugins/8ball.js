const fs = require('fs');
let sResponses = fs.readFileSync("./plugins/8ball.txt", "utf8");
var data;
module.exports = {
	name: '8ball',
	description: 'Replies with 8 ball response from 8ball.txt',
	permissions: [],
	execute(message, args, user, bot, event, plugins) {
		
		data = sResponses.split('\n');
		var sResponse = data[Math.floor(Math.random() * (data.length - 0) + 0)];
	
		bot.sendMessage(`${user} ` + sResponse);
		
	},
};