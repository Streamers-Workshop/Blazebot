const https = require('https');
const Bot = require('../../modules/Bot.js');
const Tool = require('../../modules/Tool.js');

module.exports = {
  name: 'Warzone-Stats',
  description: 'Created by Teabagz, Updated by Wikinger1988 & rewritten by Rehkloos',
  author: "Created by Rehkloos",
  license: "Apache-2.0",
  command: 'warzone-stats', // This is the Command that is typed into Chat!
  permissions: [], // This is for Permissisons depending on the Platform.
  cooldown: 10, // this is Set in Seconds, how long between the next usage of this command.
  execute(client, data, ) {
    const platform = data.args[0];
    const urlEncodedName = encodeURIComponent(data.args[1]);

    let url = `https://api.tracker.gg/api/v2/warzone/standard/profile/${platform}/${urlEncodedName}`;

    Tool.httpsGet(url).then((output) => {
      const brStats = output.data.segments[1];
      const brStats0 = output.data.segments[0];
      const kills = brStats.stats.kills.displayValue;
      const deaths = brStats.stats.deaths.displayValue;
      const downs = brStats.stats.downs.displayValue;
      const kdr = brStats.stats.kdRatio.displayValue;
      const wins = brStats.stats.wins.displayValue;
      const top5 = brStats.stats.top5.displayValue;
      const top10 = brStats.stats.top10.displayValue;
      const totma = brStats.stats.gamesPlayed.displayValue;
      const avgLife = brStats.stats.averageLife.displayValue;
      const level = brStats0.stats.level.displayValue;
      client.sendMessage(Bot.translate("plugins.warzone.info", { // plugins > instagram > processed output line
        user: data.user,
        kills: kills,
        deaths: deaths,
        downs: downs,
        kdr: kdr,
        wins: wins,
        top5: top5,
        top10: top10,
        totma: totma,
        avgLife: avgLife,
        level: level
      }));
    }).catch((err) => {
      Bot.log(Bot.translate("plugins.warzone.error"), {
        error: err
      });
    });

  },
  activate() {
    Bot.log(Bot.translate("plugins.warzone.activated"));
  },
  deactivate() {
    Bot.log(Bot.translate("plugins.warzone.deactivated"));
  }

};
