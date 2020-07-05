console.log('loaded pong')
module.exports = {
	name: 'pong',
	description: 'Replies with Ping',
	allowedRoles: ['EVERYONE'],
	execute(message, args, user, bot) {
		bot.sendMessage(`Ping ${user.name} I reply.`);
	},
};
