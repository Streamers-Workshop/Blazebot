var settings = require('./obs.Settings.json');
module.exports = {
	name: 'obs-spell-event',
	event: 5,
	description: 'Thanks a user for Triggering a Spell, via OBS',
	execute(data, bot, obs) {
		var tobj = {
			source: settings.spellsSource,
			text: `Thanks ${data.user} for your amazing spell casting, your awesome and thank you <3`
		};
		var vobj = {
			"source-name": settings.groupName,
			item: {
				name: settings.spellsSource
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
    bot.sendMessage(`Thanks @${data.user} your amazing, and awesome and thank you <3`);
	},
};
