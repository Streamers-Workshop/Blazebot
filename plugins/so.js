/*
PLUGIN BY: ssrjazz
Trovo Link:
Discord: ssrjazz#4929

Description: Shoutout command


Updated by: Krammy
Changes: Added funcitonality for @ and non-@ shout outs.
*/


console.log('loaded so')
module.exports = {
	name: 'so',
	description: 'Replies with a shoutout',
	credits: 'Created by ssrjazz modified by bioblaze to make it only select the first arg in the args array <3 also added a perm check.',
	execute(message, args, user, bot, event) {
		if (event.badges == undefined || (event.badges.indexOf("moderator") <= -1 && event.badges.indexOf("creator") <= -1)) return;
		var soUsername = args[0];
		
		if (soUsername.charAt(0) == '@')
		{
			bot.sendMessage(`Check out ${args[0]} at https://trovo.live/${args[0].substr(1)} - They are an awesome streamer and deserve some community love! (TrovoBot)`);
		}
		else
		{
			bot.sendMessage(`Check out @${args[0]} at https://trovo.live/${args[0]} - They are an awesome streamer and deserve some community love! (TrovoBot)`);

		}
		
		
		
	},
};
