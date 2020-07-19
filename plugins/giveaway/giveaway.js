const chance = require('chance').Chance();

const entrees = [];
let active = false;
module.exports = {
  name: 'giveaway', // Name of the Plugin
  description: 'Runs a giveaway on the channel', // Description
  chat: true, // Defines this as a Chat Command
  event: false, // Is this a Event?
  type: 5004, // Type Event
  command: 'giveaway', // This is the Command that is typed into Chat!
  permissions: [], // This is for Permissisons depending on the Platform.
  alias: [], // Alias commands that preform interesting things.
  cooldown: 10, // this is Set in Seconds, how long between the next usage of this command.
  settings: false, // Defining this as false will load the Settings file for this Plugin when the system loads this plugin.
  credits: `Made by Krammy`, // MAKE SURE YOU FILL THIS IN GOD DAMNIT!

  execute(client, data) {
    active = true;
    client.sendMessage(`Starting giveaway, you have ${data.args[0]}s to type !join to enter.`);

    setTimeout(function a() {
      active = false;
      if (entrees.length > 0) {
        const winner = chance.pickone(entrees);
        client.sendMessage(`The giveaway winner is: @${winner}`);
      } else client.sendMessage('Nobody entered the giveaway');
    }, data.args[0] * 1000);
  },

  add(client, user) {
    if (active) {
      entrees.push(user);
      client.sendMessage(`${user} entered the giveaway`);
    } else client.sendMessage('No giveaway to join');
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
