console.log('loaded pong')
module.exports = {
	name: 'pong',
	description: 'Replies with Ping',
	execute(message, args, user, bot) {
		bot.sendMessage(`Ping ${user} i Reply.`);
	},
};
