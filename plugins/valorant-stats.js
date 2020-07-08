console.log('loaded valorant stats')
const https = require('https');
const config = require('./stats.Settings.json');
const urlEncodedName = encodeURIComponent(config.playerName)
const userUrl = `https://api.tracker.gg/api/v2/valorant/standard/profile/riot/${urlEncodedName}`
module.exports = {
  name: 'valorant-stats',
  description: 'Replies with valorant stat information. You need to install overwolf then install Valorant Stats by TRN',
  credits: "Edited by Ulash",
  permissions: [],
	execute(message, args, user, bot, event, plugins) {
    https.get(userUrl, (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
     data += chunk;
    })
    resp.on('end', () => {
      const obj = JSON.parse(data);
      const brStats = obj.data.segments[0];
      const kills = brStats.stats.kills.displayValue;
      const mKills = brStats.stats.mostKillsInAGame.displayValue;
      const deaths = brStats.stats.deaths.displayValue;
      const kdr = brStats.stats.kDRatio.displayValue;
      const wins = brStats.stats.wins.displayValue;
      const rank = brStats.stats.rank.displayValue;
      const winr  = brStats.stats.wlratio.displayValue;
      bot.sendMessage(`@${user} here are my Valorant stats\r Current Rank: ${rank}\rK/D Ratio: ${kdr}% \r Win Ratio: ${winr}\r Total Wins: ${wins}\r Total Kills: ${kills}\r Total Deaths: ${deaths}\r Most Kills: ${mKills}`);
    });
  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });

	},
};
