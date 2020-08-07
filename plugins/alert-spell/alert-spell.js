const fs = require('fs');
const settings = require('./alert-spell.json');
const Bot = require('../../modules/Bot.js');
const path = require('path');

function toggleSource(obs) {
  const tobj = {
    'scene-name': settings.scene,
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
  name: 'alert-spell', // Name of the Plugin
  description:
    'Sends a message to chat of new Spell. Saves latest spell caster to text file for obs&slobs.', // Description
  chat: false, // Defines this as a Chat Command
  event: true, // Is this a Event?
  type: 5, // Type Event
  command: 'spell', // This is the Command that is typed into Chat!
  permissions: [], // This is for Permissisons depending on the Platform.
  alias: [], // Alias commands that preform interesting things.
  cooldown: 0, // this is Set in Seconds, how long between the next usage of this command.
  settings: false, // Defining this as false will load the Settings file for this Plugin when the system loads this plugin.
  credits: `New Spell system by Krammy. Original by Bioblaze Payne.`, // MAKE SURE YOU FILL THIS IN GOD DAMNIT!
  execute(client, data) {
    if (settings.active) client.sendMessage(`Thanks @${data.user} for the casting a spell <3`);

    fs.writeFile(path.join(Bot.root, 'labels', 'latest-spell.txt'), data.user, (err) => {
      if (err) {
        return Bot.log(err);
      }
      return true;
    });

    const obs = Bot.getService('obs-controller-module');
    if (obs.settings.active) toggleSource(obs.output);

    const slobs = Bot.getService('slobs-controller-module');
    if (slobs.settings.active) {
      slobs.output.toggleSource(null, settings.source);
      setTimeout(function a() {
        slobs.output.toggleSource(null, settings.source);
      }, settings.delay * 1000);
    }
  },
};
