module.exports = {
	name: 'raid',
	description: 'Raid another channel. Posts the url of the other channel 5 times.',
	credits: 'Created by IceFlom.',
  permissions: ['moderator', 'creator'],
	execute(message, args, user, bot, event, plugins) {
		let raidedChannel = args[0],
		    counter = 0;
		if (raidedChannel == undefined) {
			bot.sendMessage(`Username is missing. Usage: !raid USERNAME`);
			return;
		}
		setInterval(function() {
			if (counter > 4) {
				return;
			}
			bot.sendMessage(`This is a raid. Go to the channel of @${raidedChannel} now. --> https://trovo.live/${raidedChannel}`);
			counter++;
		}, 1000);
	},
};
