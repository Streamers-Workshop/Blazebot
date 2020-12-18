const Bot = require('../../modules/Bot.js');
const Tool = require('../../modules/Tool.js');

module.exports = {
	name: 'Valorant-Stats',
	description: 'Replies with valorant stat information. You need to install overwolf then install Valorant Stats by TRN',
	author: "Edited by Ulash, Updated by Rehkloos, Convert to 2.0 by Wikinger1988",
	license: "Apache-2.0",
	command: 'valorant-stats', // This is the Command that is typed into Chat!
	permissions: [], // This is for Permissisons depending on the Platform.
	cooldown: 10, // this is Set in Seconds, how long between the next usage of this command.
	execute(client, data, ) {
		
		if (!data.args[0]) {
			client.sendMessage(Bot.translate("plugins.valorant.example"));
		} else if (data.args[0]) {
			
			const urlEncodedName = encodeURIComponent(data.args);
			let url = `https://api.tracker.gg/api/v2/valorant/standard/profile/riot/${urlEncodedName}`;
			
			Tool.httpsGet(url).then((output) => {
				const brStats = output.data.segments[0];
				const kills = brStats.stats.kills.displayValue;
				const deaths = brStats.stats.deaths.displayValue;
				const mKills = brStats.stats.mostKillsInMatch.displayValue;
				const kdr = brStats.stats.kDRatio.displayValue;
				const kdrg = brStats.stats.matchesWinPct.displayValue;
				const wins = brStats.stats.matchesWon.displayValue;
				const totma = brStats.stats.matchesPlayed.displayValue;
				const rank = brStats.stats.rank.displayValue;
				client.sendMessage(Bot.translate("plugins.valorant.info", {
					user: data.user,
					rank: rank,
					kills: kills,
					mKills: mKills,
					deaths: deaths,
					kdr: kdr,
					kdrg: kdrg,
					totma: totma,
					wins: wins
				}));

			}).catch((err) => {
				Bot.log(Bot.translate("plugins.valorant.error"), {
					error: err
				});
			    client.sendMessage(Bot.translate("plugins.valorant.err"), {
					
				});
			});	
		}
	},
	activate() {
		Bot.log(Bot.translate("plugins.valorant.activated"));
	},
	deactivate() {
		Bot.log(Bot.translate("plugins.valorant.deactivated"));
	}
};
