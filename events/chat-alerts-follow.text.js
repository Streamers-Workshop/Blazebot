var users = [];
module.exports = {
	name: 'user-followed',
	event: 5003,
	description: 'Thanks a user for Following the Stream!',
	execute(data, bot, plugins) {
		if (users.indexOf(data.user) > -1) return;
    users.push(data.user);
    bot.sendMessage(`Thanks @${data.user} for the Following Stream, and for visiting <3 type !ping or !pong to test commands!`);
	},
};
