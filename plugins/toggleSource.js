/*
PLUGIN BY: Krammy
Trovo Link: https://trovo.live/krammy
Discord: Krammy#0001

Description: Function to toggle on and off visibility of a source.
Date: 07/07/2020
*/


var settings = require('../events/obs.Settings.json');
var isVisible = false;
module.exports = {
	name: 'toggle-source', //CHANGE COMMAND HERE (ie: !toggle-source, !toggle , !source-visible)
	description: 'Toggles OBS Source',
	execute(message, args, user, bot, event, obs) {
		if (obs != null)
		{
			obs.send('GetSceneItemProperties', { item: { name: 'Follow Alert' } }).then( data => {
			isVisible = data.visible;
				}).catch(console.error);
			var tobj = {
				source: "Follow Alert",  //CHANGE SOURCE NAME HERE
				render: isVisible
			};
			obs.send('SetSourceRender', tobj);
		}
		else
		{
			bot.sendMessage("OBS not Connected");
		}	
	}
};
