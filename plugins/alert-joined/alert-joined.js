const fs = require('fs');
const path = require('path');
const settings = require('./alert-joined.json');
const Bot = require('../../modules/Bot.js');

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
  name: 'alert-joined', // Name of the Plugin
  description:
    'Sends a message to chat of new follower. Saves latest follower to text file for obs&slobs.', // Description
  chat: false, // Defines this as a Chat Command
  event: true, // Is this a Event?
  type: 5004, // Type Event
  command: 'joined', // This is the Command that is typed into Chat!
  permissions: [], // This is for Permissisons depending on the Platform.
  alias: [], // Alias commands that preform interesting things.
  cooldown: 0, // this is Set in Seconds, how long between the next usage of this command.
  settings: false, // Defining this as false will load the Settings file for this Plugin when the system loads this plugin.
  credits: `New joined system by Krammy. Original by Bioblaze Payne.`, // MAKE SURE YOU FILL THIS IN GOD DAMNIT!
  execute(client, data) {
    if (settings.active) client.sendMessage(`Welcome ${data.user}`);

    fs.writeFile(path.join(Bot.root, 'labels', 'latest-join.txt'), data.user, (err) => {
      if (err) {
        Bot.log(`Error writing latest-join.txt : ${err}`);
      }
    });
	
	if (data['live.viewers'] !== undefined)
    {
		fs.writeFile(path.join(Bot.root, 'labels', 'viewcount.txt'), data['live.viewers'], (err) => {
		  if (err) {
			Bot.log(`Error writing viewcount.txt : ${err}`);
		  }
		});
	}
	//OBS SETTINGS
    const obs = Bot.getService('obs-controller-module');
    if (obs.settings.active) toggleSource(obs.output);
	
	//SLOBS SETTINGS
    const slobs = Bot.getService('slobs-controller-module');
    if (slobs.settings.active) {
      slobs.output.toggleSource(null, settings.source);
      setTimeout(function a() {
        slobs.output.toggleSource(null, settings.source);
      }, settings.delay * 1000);
    }
	
	//HTTP SETTINGS
	var service = Bot.getService('http-overlay-module');
	if (service){
		service.output.notifyAll({
		  type: "text",
		  page: "joined",
		  name: data.user,
		  message: "has joined the Stream!"
		});
	}
  },
};
