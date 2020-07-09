module.exports = {
	name: 'discord',
	description: 'Replies with discord link',
	permissions: [],
	execute(message, args, user, bot, event, plugins) {
		var discordLink = "discord.com/test" //CHANGE THIS TO MATCH YOUR DISCORD LINK
		bot.sendMessage(`Make sure to join our awesome discord: ` + discordLink);
	},
};
