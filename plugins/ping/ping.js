module.exports = {
	name: 'ping', // Name of the Plugin
	description: 'Replies with Pong/Ping', // Description
  chat: true, // Defines this as a Chat Command
  event: false, // Is this a Event?
  type: 5004, // Type Event
  command: 'ping', // This is the Command that is typed into Chat!
	permissions: [], // This is for Permissisons depending on the Platform.
  alias: ['pong'], // Alias commands that preform interesting things.
	cooldown: 10, // this is Set in Seconds, how long between the next usage of this command.
	settings: false, // Defining this as false will load the Settings file for this Plugin when the system loads this plugin.
	credits: `Made with Love by Bioblaze Payne for the Trovo.live Community, as a example of how to use the v2 TrovoBot Plugin System.`, // MAKE SURE YOU FILL THIS IN GOD DAMNIT!
	execute(client, data, modules) {
    var d = {
      ping: 'pong',
      pong: 'ping'
    }
		client.sendMessage(`${d[data.command]} ${data.user} I reply.`);
	},
};
/*
data ~ Structure
{
... ~ This is whatever is normally passed too the Event.
args, ~ List of Arguments after the Command.
command, ~ Command used by the User.
prefix ~ Prefix that was used to trigger the command!
}
*/
