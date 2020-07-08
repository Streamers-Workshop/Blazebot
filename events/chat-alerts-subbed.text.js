module.exports = {
	name: 'chat-spell-event',
	event: 5001,
	description: 'Thanks a user for Subbing to the Channel.',
	execute(data, bot, plugins) {
    bot.sendMessage(`Thanks @${data.user} for subbing too the channel your amazing <3`);
	},
};
