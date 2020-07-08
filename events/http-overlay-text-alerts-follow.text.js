module.exports = {
	name: 'http-overlay-text-followed',
	event: 5003,
	description: 'Thanks a user for Following the Stream!',
	execute(data, bot, plugins) {
		if (!plugins.ws) return;
		plugins.ws.server.clients.forEach(function(client) {
			client.send(JSON.stringify({
				type: "text",
				page: "follow",
				name: data.user,
				message: "Has followed the Stream!"
			}));
		});
	},
};
