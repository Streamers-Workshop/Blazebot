const fs = require('fs');
const settings = require('./alert-follow.json');
const Bot = require('../../modules/Bot.js');

function toggleSource(obs) {
  const tobj = {
    item: { name: settings.source },
    visible: true,
  };

  obs.send('SetSceneItemProperties', tobj).then(() => {
    setTimeout(function a() {
      tobj.visible = false;
      obs
        .send('SetSceneItemProperties', tobj)
        .then(() => {})
        .catch((e) => {
          Bot.log(e);
        });
    }, settings.delay * 1000);
  });
}

module.exports = {
  name: 'alert-follow', // Name of the Plugin
  description:
    'Sends a message to chat of new follower. Saves latest follower to text file for obs&slobs.', // Description
  chat: false, // Defines this as a Chat Command
  event: true, // Is this a Event?
  type: 5003, // Type Event
  command: 'follow', // This is the Command that is typed into Chat!
  permissions: [], // This is for Permissisons depending on the Platform.
  alias: [], // Alias commands that preform interesting things.
  cooldown: 0, // this is Set in Seconds, how long between the next usage of this command.
  settings: false, // Defining this as false will load the Settings file for this Plugin when the system loads this plugin.
  credits: `New follow system by Krammy. Original by Bioblaze Payne.`, // MAKE SURE YOU FILL THIS IN GOD DAMNIT!
  execute(client, data, modules) {
    if (settings.active) client.sendMessage(`Thanks @${data.user} for the Follow <3`);

    fs.writeFile('./labels/latest-follow.txt', data.user, (err) => {
      if (err) {
        return Bot.log(err);
      }
      return true;
    });

    const obs = Bot.getService('obs-controller-module');
    if (obs.settings.active) toggleSource(modules.obs);

    const slobs = Bot.getService('slobs-controller-module');
    if (slobs.settings.active) {
      slobs.output.toggleSource(null, settings.source);
      setTimeout(function a() {
        slobs.output.toggleSource(null, settings.source);
      }, settings.delay * 1000);
    }
  },
};
