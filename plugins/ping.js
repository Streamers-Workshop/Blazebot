console.log('loaded ping')
module.exports = {
	name: 'ping',
	description: 'Replies with Pong',
	allowedRoles: ['EVERYONE'],
	execute(message, args, user, bot) {
		bot.sendMessage(`Pong ${user.name} I reply.`);
	},
};
