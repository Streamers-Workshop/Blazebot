const fs = require('fs');
const settings = require('./alert-spell.json');
const spell = require('./spells.json');
const Bot = require('../../modules/Bot.js');
const path = require('path');


function toggleSource(obs, scene, source, delay) {
  const tobj = {
    'scene-name': scene,
    item: { name: source },
    visible: true,
  };

  obs.send('SetSceneItemProperties', tobj).then(() => {
    setTimeout(function a() {
      tobj.visible = false;
      obs
        .send('SetSceneItemProperties', tobj)
        .then(() => { })
        .catch((e) => {
          Bot.log(e);
        });
    }, delay * 1000);
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
    Bot.log(data);
    if (settings.active) 

    fs.writeFile(path.join(Bot.root, 'labels', 'latest-spell.txt'), data.user, (err) => {
      if (err) {
        Bot.log(`Error writing latest-spell.txt : ${err}`);
      }
    });

    var scene = "";
    var source = "";
    if (settings.useSpells == true) {
      var spells = spell.spells;

      if (spell.spellTest == "") {
        if (data['content'].name == undefined) {
          console.log("Spell needs to have a name");
          return false;
        }
        scene = spells[data['content'].name].scene;
        source = spells[data['content'].name].source;
        delay = parseInt(spells[data['content'].name].delay);
      } else {
        scene = spells[spell.spellTest].scene;
        source = spells[spell.spellTest].source;
        delay = parseInt(spells[spell.spellTest].delay);

      }

    } else {
      scene = settings.scene;
      source = settings.source;
      delay = settings.delay;
    }

    //OBS SETTINGS
    const obs = Bot.getService('obs-controller-module');
    if (obs.settings.active) toggleSource(obs.output, scene, source, delay);

    //SLOBS SETTINGS
    const slobs = Bot.getService('slobs-controller-module');
    if (slobs.settings.active) {
      slobs.output.toggleSource(null, source);
      setTimeout(function a() {
        slobs.output.toggleSource(null, source);
      }, delay * 1000);
    }

    //HTTP SETTINGS
    var service = Bot.getService('http-overlay-module');
    if (service) {
      service.output.notifyAll({
        type: "text",
        page: "spell",
        name: data.user,
        message: "has casted a spell!"
      });
    }
  },
};
