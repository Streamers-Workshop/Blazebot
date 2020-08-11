const fs = require('fs');
const path = require('path');
const settings = require('./alert-sub.json');
const Bot = require('../../modules/Bot.js');
let subCount = fs.readFileSync(path.join(Bot.root, 'labels', 'subcount.txt')).toString();

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
  name: 'alert-sub', // Name of the Plugin
  description:
    'Sends a message to chat of new Subscriber. Saves latest Subscriber to text file for obs&slobs.', // Description
  chat: false, // Defines this as a Chat Command
  event: true, // Is this a Event?
  type: 5001, // Type Event
  command: 'sub', // This is the Command that is typed into Chat!
  permissions: [], // This is for Permissisons depending on the Platform.
  alias: [], // Alias commands that preform interesting things.
  cooldown: 0, // this is Set in Seconds, how long between the next usage of this command.
  settings: false, // Defining this as false will load the Settings file for this Plugin when the system loads this plugin.
  credits: `New Subscriber system by Krammy. Original by Bioblaze Payne.`, // MAKE SURE YOU FILL THIS IN GOD DAMNIT!
  execute(client, data) {
    if (settings.active) client.sendMessage(`Thanks @${data.user} for the Subscription <3`);
    
	subCount = parseInt(subCount);
    ++subCount;
	fs.writeFile(path.join(Bot.root, 'labels', 'subcount.txt'), subCount.toString(), (err) => {
      if (err) {
        return Bot.log(err);
      }
      return true;
    });

    fs.writeFile(path.join(Bot.root, 'labels', 'latest-sub.txt'), data.user, (err) => {
      if (err) {
        return Bot.log(err);
      }
      return true;
    });


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
	
	//HTTP OVERLAYS
	var service = Bot.getService('http-overlay-module');
	if (service){
		service.output.notifyAll({
		  type: "text",
		  page: "sub",
		  name: data.user,
		  message: "has subbed the Stream!"
		});
	}
  },
};
