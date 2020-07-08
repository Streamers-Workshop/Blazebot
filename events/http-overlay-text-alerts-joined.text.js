module.exports = {
	name: 'http-overlay-text-joined',
	event: 5004,
	description: 'Welcome\'s a User who has Joined the Stream!',
	execute(data, bot, plugins) {
		if (!plugins.ws) return;
		plugins.ws.server.clients.forEach(function(client) {
			client.send(JSON.stringify({
				type: "text",
				page: "joined",
				name: data.user,
				message: "Welcome to the Stream"
			}));
		});
	},
};
