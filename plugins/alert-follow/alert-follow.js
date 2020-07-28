const fs = require('fs');
const settings = require('./alert-follow.json');
const Modules = require('../../modules/Services.js');

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
          console.log(e);
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
        return console.log(err);
      }
      return true;
    });

    const obs = Modules.getService('obs-controller-module');
    if (obs) toggleSource(modules.obs);
  },
};
