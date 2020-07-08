console.log('loaded warzone stats')
const https = require('https');
const config = require('./stats.Settings.json');
const urlEncodedName = encodeURIComponent(config.playerName)
const userUrl = `https://api.tracker.gg/api/v2/warzone/standard/profile/${config.platform}/${urlEncodedName}`
module.exports = {
	name: 'warzone-stats',
  description: 'Replies with warzone stat information',
  credits: "Created by Teabagz check out my channel https://trovo.live/Bagz",
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
      const brStats = obj.data.segments[1];
      const kills = brStats.stats.kills.displayValue;
      const deaths = brStats.stats.deaths.displayValue;
      const downs = brStats.stats.downs.displayValue;
      const kdr = brStats.stats.kdRatio.displayValue;
      const wins = brStats.stats.wins.displayValue;
      const top10 = brStats.stats.top10.displayValue;
      const avgLife = brStats.stats.averageLife.displayValue;
      bot.sendMessage(`${user} here are my warzone stats\rKills: ${kills} Deaths: ${deaths}\rKDR: ${kdr}\r
      Wins: ${wins}\rTop 10 placements: ${top10}\rand on average I live for ${avgLife}`);
    });
  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });

	},
};
