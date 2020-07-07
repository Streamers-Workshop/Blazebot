console.log('loaded ping')
module.exports = {
	name: 'ping',
	description: 'Replies with Pong',
	execute(message, args, user, bot, event) {
		bot.sendMessage(`Pong ${user} I reply.`);
	},
};
