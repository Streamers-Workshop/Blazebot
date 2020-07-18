const Modules = require('../../modules/Services.js');
const settings = require('../../services/obs/obs.json');

module.exports = {
  name: 'obs-test',
  description: 'Tests OBS Websocket Functionality',
  chat: true, // Defines this as a Chat Command
  event: false, // Is this a Event?
  type: 5004, // Type Event
  command: 'obs-test', // This is the Command that is typed into Chat!
  permissions: [], // This is for Permissisons depending on the Platform.
  alias: [], // Alias commands that preform interesting things.
  cooldown: 10, // this is Set in Seconds, how long between the next usage of this command.
  settings: false, // Defining this as false will load the Settings file for this Plugin when the system loads this plugin.
  credits: `Not sure who made this.`, // MAKE SURE YOU FILL THIS IN GOD DAMNIT!
  execute(client, data, modules) {
    if (Modules.getService('obs-controller-module')) {
      if (!settings.active) {
        console.log('Please enable the OBS Module to use this Function.');
      } else if (!modules.obs || modules.obs === undefined) {
        console.log('Error with utilizing OBS plugin from the Modules');
      } else {
        const tobj = {
          source: settings.joinedSource,
          text: `Welcome ${data.user} remember to follow, your awesome and thank you <3`,
        };
        const vobj = {
          'source-name': settings.groupName,
          item: {
            name: settings.joinedSource,
          },
          visible: true,
        };
        modules.obs
          .send('SetTextGDIPlusProperties', tobj)
          .then(() => {
            return modules.obs.send('SetSceneItemProperties', vobj).then(() => {
              setTimeout(() => {
                vobj.visible = false;
                modules.obs
                  .send('SetSceneItemProperties', vobj)
                  .then(() => {})
                  .catch(() => {});
              }, settings.disappearDelay);
            });
          })
          .catch((e) => {
            console.error(e);
          });
        client.sendMessage(
          `Welcome ${data.user} remember to follow, your awesome and thank you <3`,
        );
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
