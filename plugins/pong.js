module.exports = {
	name: 'pong',
	description: 'Replies with Ping',
	permissions: [],
	execute(message, args, user, bot, event, plugins) {
		console.log("Triggered");
		bot.sendMessage(`Ping ${user} I reply.`);
	},
};
