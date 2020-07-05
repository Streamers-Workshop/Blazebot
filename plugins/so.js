console.log('loaded so')
module.exports = {
	name: 'so',
	description: 'Replies with a shoutout',
	credits: 'Created by ssrjazz',
	execute(message, args, user, bot) {
		bot.sendMessage(`Check out @${args} at https://trovo.live/${args} - They are an awesome streamer and deserve some community love! (TrovoBot)`);
	},
};
