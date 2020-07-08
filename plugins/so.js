console.log('loaded so')
module.exports = {
	name: 'so',
	description: 'Replies with a shoutout',
	credits: 'Created by ssrjazz modified by bioblaze to make it only select the first arg in the args array <3 also added a perm check.',
  permissions: ['moderator', 'creator'],
	execute(message, args, user, bot, event, plugins) {
		bot.sendMessage(`Check out @${args[0]} at https://trovo.live/${args[0]} - They are an awesome streamer and deserve some community love! (TrovoBot)`);
	},
};
