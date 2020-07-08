module.exports = {
	name: 'http-overlay-text-subbed',
	event: 5001,
	description: 'Thanks a user for Subbing to the Channel.',
	execute(data, bot, plugins) {
		if (!plugins.ws) return;
		plugins.ws.server.clients.forEach(function(client) {
			client.send(JSON.stringify({
				type: "text",
				page: "sub",
				name: data.user,
				message: "Thanks for Subscribing!"
			}));
		});
	},
};
