const Services = require('./../../modules/Services.js');

module.exports = {
  name: 'slobs-test',
  description: "",
  chat: true, // Defines this as a Chat Command
  event: false, // Is this a Event?
  type: 5004, // Type Event
  command: 'slobs-test', // This is the Command that is typed into Chat!
  permissions: [], // This is for Permissisons depending on the Platform.
  alias: [], // Alias commands that preform interesting things.
  cooldown: 0, // this is Set in Seconds, how long between the next usage of this command.
  settings: false, // Defining this as false will load the Settings file for this Plugin when the system loads this plugin.
  credits: `Made by Krammy.`, // MAKE SURE YOU FILL THIS IN GOD DAMNIT!
  execute(client, data, modules) {
	 let slobs = Services.getService('slobs-controller-module');
    if (Services.getService('slobs-controller-module')) 
	{
      /* if (!settings.active) {
        console.log('Please enable the OBS Module to use this Function.');
      } else  */
	  if (!modules.slobs || modules.slobs === undefined) {
        console.log('Error with utilizing SLOBS plugin from the Services');
      } 
	  else {
        slobs.streamStatusChange();
      }
    } 
	else {
      client.sendMessage('Currently the OBS plugin is not enabled. Please contact the bot owner to check into this.');
    }
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
