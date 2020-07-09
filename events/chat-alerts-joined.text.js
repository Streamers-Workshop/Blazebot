var users = [];
module.exports = {
	name: 'user_joined',
	event: 5004,
	description: 'Welcome\'s a User who has Joined the Stream!',
	execute(data, bot, plugins) {
		let sJson = JSON.parse(fs.readFileSync("./events/specialMessages.json", "utf8"));
		const special = sJson.specials[0];
		if (users.indexOf(data.user) > -1) return;
		users.push(data.user);
		if (special.users[data.user] != undefined) {
				bot.sendMessage(special.users[data.user]);
		}
		else return bot.sendMessage(`Welcome @${data.user} Remember to Follow the Stream, and for visiting <3 type !ping or !pong to test commands!`);
	},
};
