/*
CREATED BY: Ulash
Trovo Link: https://trovo.live/ulash
Discord: Ulash#3836
*/
console.log('loaded block self advert')
const fs = require('fs'), path = require('path');
let isBlocked = JSON.parse(fs.readFileSync("./plugins/blockAds.json", "utf8"));
require('dotenv').config({ path: path.join(__dirname, ".env") });
module.exports = {
	name: 'block-ad',
	description: 'If anyone who sent link to the channel, bot will reply',
	execute(message, args, user, bot, event) {
		if (event.badges == undefined || (event.badges.indexOf("moderator") <= -1 && event.badges.indexOf("creator") <= -1)) return console.log(`@${user} You don\'t have enough permission to run this command!`);
    const settings = args[0];
    if(settings === undefined) return bot.sendMessage(`@${user} Misuse detected! \r @${user} To activate type !block-ad enable , to disable !block-ad disable `);
      if(settings === undefined) return;
            if (settings === "enable") {
              bot.sendMessage(`Ad filter is activated!`)
              isBlocked[process.env.TROVO_PAGE] = { blocked: "true" };
              fs.writeFile("./plugins/blockAds.json", JSON.stringify(isBlocked), (err) => { if (err) console.log(err) });
            };

    if (settings === "disable") {
        bot.sendMessage(`Ad filter is deactivated!`);
        isBlocked[process.env.TROVO_PAGE] = { blocked: "false" };
        fs.writeFile("./plugins/blockAds.json", JSON.stringify(isBlocked), (err) => { if (err) console.log(err) });
    };

	},
};
