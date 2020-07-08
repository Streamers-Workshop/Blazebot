module.exports = {
	name: 'http-overlay-text-spell-event',
	event: 5,
	description: 'Thanks a user for Triggering a Spell.',
	execute(data, bot, plugins) {
		if (!plugins.ws) return;
		plugins.ws.server.clients.forEach(function(client) {
			client.send(JSON.stringify({
				type: "text",
				page: "spell",
				name: data.user,
				message: "Put a Spell on me!"
			}));
		});
	},
};
