const fs = require('fs');
const Services = require('../../modules/Services.js');

module.exports = {
  name: 'drpc-viewercount-update', // Name of the Plugin
  description: 'Updates the Viewer Count on the Discord-RPC Module.', // Description
  chat: false, // Defines this as a Chat Command
  event: true, // Is this a Event?
  type: 5004, // Type Event
  command: null, // This is the Command that is typed into Chat!
  permissions: [], // This is for Permissisons depending on the Platform.
  alias: [], // Alias commands that preform interesting things.
  cooldown: 0, // this is Set in Seconds, how long between the next usage of this command.
  settings: false, // Defining this as false will load the Settings file for this Plugin when the system loads this plugin.
  credits: `Made with Love by Bioblaze Payne for the Trovo.live Community, as a example of how to use the v2 TrovoBot Plugin System.`, // MAKE SURE YOU FILL THIS IN GOD DAMNIT!
  execute(client, data) {
    console.log(data['live.viewers']);
    const discord = Services.getService('discord-rpc');
    if (discord) {
      if (discord.settings.active) {
        discord.setCount(Number(data['live.viewers']));
      }
    }
    fs.writeFile('./plugins/alert-follow/viewcount.txt', data['live.viewers'], (err) => {
      if (err) {
        return console.log(err);
      }
      return true;
    });
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
