console.log('loaded obs-test')
var settings = require('../events/obs.Settings.json');
module.exports = {
	name: 'obs-test',
	description: 'Tests OBS Websocket Functionality',
	permissions: [],
	execute(message, args, user, bot, event, plugins) {
		if (!plugins.obs) return;
		var tobj = {
			source: settings.joinedSource,
			text: `Welcome ${user} remember to follow, your awesome and thank you <3`
		};
		var vobj = {
			"source-name": settings.groupName,
			item: {
				name: settings.joinedSource
			},
			visible: true
		};
		plugins.obs.send("SetTextGDIPlusProperties", tobj).then((d) => {
			return plugins.obs.send("SetSceneItemProperties", vobj).then((d) => {
				setTimeout(function() {
					vobj.visible = false;
					plugins.obs.send("SetSceneItemProperties", vobj).then((d) => {}).catch((e) => {});
				}, settings.disappearDelay);
			});
		}).catch((e) => {
			console.error(e);
		});
		bot.sendMessage(`Welcome ${user} remember to follow, your awesome and thank you <3`);
	},
};
