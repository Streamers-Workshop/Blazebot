console.log('loaded pong')
module.exports = {
	name: 'pong',
	description: 'Replies with Ping',
	execute(message, args, user, bot, event) {
		bot.sendMessage(`Ping ${user} I reply.`);
	},
};
