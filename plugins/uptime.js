/*
PLUGIN BY: Krammy
Trovo Link: https://trovo.live/krammy
Discord: Krammy#0001

Description: Sends a message with how long the user has been streaming, Requires OBS Active
Date: 08/07/2020
*/


var settings = require('../events/obs.Settings.json');
console.log('loaded uptime');
module.exports = {
	name: 'uptime',
	description: 'Sends message with how long user has been streaming',
	execute(message, args, user, bot, event, plugins) {
		if (plugins.obs != null)
		{
			plugins.obs.send('GetStreamingStatus').then( data => {
			if (data.streaming == true)
			{
				bot.sendMessage("the stream has been live for: " + data.streamTimecode);
			}
			else
			{
				bot.sendMessage("Not LIVE");
			}
				}).catch(console.error);
		}
		else
		{
			bot.sendMessage("OBS not Connected");
		}
	}
};
