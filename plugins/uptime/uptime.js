const Modules = require('../../modules/Modules.js');
const settings = require('../../services/obs/obs.json');

module.exports = {
  name: 'uptime',
  description: "Gets how long you've been streaming for. Requires OBS Websocket plugin installed.",
  chat: true, // Defines this as a Chat Command
  event: false, // Is this a Event?
  type: 5004, // Type Event
  command: 'uptime', // This is the Command that is typed into Chat!
  permissions: [], // This is for Permissisons depending on the Platform.
  alias: [], // Alias commands that preform interesting things.
  cooldown: 10, // this is Set in Seconds, how long between the next usage of this command.
  settings: false, // Defining this as false will load the Settings file for this Plugin when the system loads this plugin.
  credits: `Made by Krammy.`, // MAKE SURE YOU FILL THIS IN GOD DAMNIT!
  execute(client, data, modules) {
    if (Modules.getModule('obs')) {
      if (!settings.active) {
        console.log('Please enable the OBS Module to use this Function.');
      } else if (!modules.obs || modules.obs === undefined) {
        console.log('Error with utilizing OBS plugin from the Modules');
      } else {
        modules.obs
          .send('GetStreamingStatus')
          .then((obsData) => {
            if (obsData.streaming === true) {
              const a = obsData.streamTimecode.split(':');
              client.sendMessage(
                `the stream has been live for: ${a[0]}h, ${a[1]}min, ${a[2].substr(0, 2)}secs`,
              );
              // console.log(`${a[0]}h, ${a[1]}min, ${a[2].substr(0,2)}secs`);
            } else {
              client.sendMessage('Not LIVE');
            }
          })
          .catch(console.error);
      }
    } else {
      client.sendMessage(
        'Currently the OBS plugin is not enabled. Please contact the bot owner to check into this.',
      );
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
