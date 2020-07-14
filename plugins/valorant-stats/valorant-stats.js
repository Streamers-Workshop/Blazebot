const https = require('https');

module.exports = {
  name: 'Valorant Stats',
  description:
    'Replies with valorant stat information. You need to install overwolf then install Valorant Stats by TRN',
  chat: true, // Defines this as a Chat Command
  event: false, // Is this a Event?
  type: 5004, // Type Event
  command: 'valorant-stats', // This is the Command that is typed into Chat!
  permissions: [], // This is for Permissisons depending on the Platform.
  alias: [], // Alias commands that preform interesting things.
  cooldown: 10, // this is Set in Seconds, how long between the next usage of this command.
  settings: false, // Defining this as false will load the Settings file for this Plugin when the system loads this plugin.
  credits: 'Edited by Ulash, Updated by Rehkloos',
  execute(client, data) {
    if (!data.args[0]) {
      client.sendMessage(`Example Usage: = !valorant-stats Nickname#TAG`);
    } else if (data.args[0]) {
      const urlEncodedName = encodeURIComponent(data.args[0]);
      const userUrl = `https://api.tracker.gg/api/v2/valorant/standard/profile/riot/${urlEncodedName}`;
      https
        .get(userUrl, (resp) => {
          let val = '';

          // A chunk of data has been recieved.
          resp.on('data', (chunk) => {
            val += chunk;
          });
          resp.on('end', () => {
            const obj = JSON.parse(val);
            if (obj.data) {
              const brStats = obj.data.segments[0];
              const kills = brStats.stats.kills.displayValue;
              const mKills = brStats.stats.mostKillsInAGame.displayValue;
              const deaths = brStats.stats.deaths.displayValue;
              const kdr = brStats.stats.kDRatio.displayValue;
              const wins = brStats.stats.wins.displayValue;
              const rank = brStats.stats.rank.displayValue;
              const winr = brStats.stats.wlratio.displayValue;
              client.sendMessage(
                `@${data.user} here are your Valorant stats:\r Current Rank: ${rank}\rK/D Ratio: ${kdr}% \r Win Ratio: ${winr}\r Total Wins: ${wins}\r Total Kills: ${kills}\r Total Deaths: ${deaths}\r Most Kills: ${mKills}`,
              );
            } else {
              const err = obj.errors[0];
              const errMsg = err.message;
              if (errMsg) {
                client.sendMessage(
                  'We could not find the player ' +
                    `${data.args[0]}` +
                    '. Make sure you have our Overwolf App!',
                );
              }
            }
          });
        })
        .on('error', (err) => {
          console.log(`Error: ${err.message}`);
        });
    }
  },
};
