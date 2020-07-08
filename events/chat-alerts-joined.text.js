var users = [];
module.exports = {
	name: 'user_joined',
	event: 5004,
	description: 'Welcome\'s a User who has Joined the Stream!',
	execute(data, bot, plugins) {
		if (users.indexOf(data.user) > -1) return;
		users.push(data.user);
		switch (data.user) {
			case 'someone':
				bot.sendMessage(`Ladies and gentlemen, tonight we have @${data.user} in the sky, and on stage. We are favored to welcome awesome person the world has seen.`);
				break;
			default:
			bot.sendMessage(`Welcome @${data.user} Remember to Follow the Stream, and for visiting <3 type !ping or !pong to test commands!`);
		}
	},
};
