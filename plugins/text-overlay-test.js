console.log('loaded http-overlay test')
module.exports = {
	name: 'overlay-test',
	description: 'Test the HTTP Overlay',
	permissions: [],
	execute(message, args, user, bot, event, plugins) {
		if (!plugins.ws) return;
		plugins.ws.server.clients.forEach(function(client) {
			client.send(JSON.stringify({
				type: "text",
				page: "test",
				name: user,
				message: "has Tested the System!"
			}));
		});
	},
};
