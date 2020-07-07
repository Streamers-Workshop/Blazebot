var settings = require('./obs.Settings.json');
module.exports = {
	name: 'obs-joined-event',
	event: 5001,
	description: 'Welcomes a User, via OBS',
	execute(data, bot, obs) {
		var tobj = {
			source: settings.subbedSource,
			text: `Thanks ${data.user} for Subbing, your awesome and thank you <3`
		};
		var vobj = {
			"source-name": settings.groupName,
			item: {
				name: settings.subbedSource
			},
			visible: true
		};
		obs.send("SetTextGDIPlusProperties", tobj).then((d) => {
			return obs.send("SetSceneItemProperties", vobj).then((d) => {
				setTimeout(function() {
					vobj.visible = false;
					obs.send("SetSceneItemProperties", vobj).then((d) => {}).catch((e) => {});
				}, settings.disappearDelay);
			});
		}).catch((e) => {
			console.error(e);
		});
    bot.sendMessage(`Thanks ${data.user} for Subbing, your awesome and thank you <3`);
	},
};
