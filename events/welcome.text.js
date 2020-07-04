var users = [];
module.exports = {
	name: 'just joined channel!',
	description: 'Welcome\'s a User who has Joined the Stream!',
	execute(user, message, bot) {
		if (users.indexOf(user) > -1) return;
    users.push(user);
    bot.sendMessage(`Welcome @${user} Remember to Follow the Stream, and for visiting <3 type !ping or !pong to test commands!`);
	},
};
