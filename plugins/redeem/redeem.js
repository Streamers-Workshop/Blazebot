/*
PLUGIN BY: Krammy
Trovo Link: https://trovo.live/krammy
Discord: Krammy#0001

Description: redeem command that triggers stuff
*/
const settings = require('./redeem.json');
const Bot = require('../../modules/Bot.js');
const money = require('../casino/money.json');

function toggleSource(args, obs) {
  const tobj = {
    'scene-name': settings[args[0]].scene,
    item: { name: settings[args[0]].source },
    visible: true,
  };

  obs.send('SetSceneItemProperties', tobj).then(() => {
    if (settings[args[0]] !== undefined || settings[args[0]].delay > 0) {
      setTimeout(function a() {
        tobj.visible = false;
        obs
          .send('SetSceneItemProperties', tobj)
          .then(() => {})
          .catch((e) => {
            Bot.log(e);
          });
      }, settings[args[0]].delay);
    }
  });
}

/*eslint-disable */
String.prototype.interpolate = function(params) {
  const names = Object.keys(params);
  const vals = Object.values(params);
  return new Function(...names, `return \`${this}\`;`)(...vals);
}
/* eslint-enable */

module.exports = {
  name: 'redeem', // Name of the Plugin
  description: 'Replies with Pong/Ping', // Description
  chat: true, // Defines this as a Chat Command
  event: false, // Is this a Event?
  type: 5004, // Type Event
  command: 'redeem', // This is the Command that is typed into Chat!
  permissions: [], // This is for Permissisons depending on the Platform.
  alias: [], // Alias commands that preform interesting things.
  cooldown: 10, // this is Set in Seconds, how long between the next usage of this command.
  settings: false, // Defining this as false will load the Settings file for this Plugin when the system loads this plugin.
  credits: `Made by Krammy for people to redeem stuff on stream. This could be toggling sources in OBS, shoutout's for themselves, etc.`, // MAKE SURE YOU FILL THIS IN GOD DAMNIT!
  execute(client, data, modules) {
	  
	if (!money[data.user]) {
      client.sendMessage(
        `You don't have any account. Please type "!casino register" to open an account. @${data.user}`,
      );
      return;
    }
	
	
    const obs = Bot.getService('obs-controller-module');
    const list = Object.keys(settings);
    if (data.args[0] === undefined) {
      client.sendMessage(`@${data.user} list of redeems: ${list}`);
    } else {
	  if (settings[data.args[0]].cost > money[data.user].points) {
      client.sendMessage(`You don't have enough points to play.`);
      return;
      }	
		
		
      // Checks the type defined in redeem.list file
      switch (settings[data.args[0]].type) {
        case 'source toggle': {
          if (obs) toggleSource(data.args, obs.output);
          else client.sendMessage('OBS not Connected');

          break;
        }
        case 'send message': {
          const jsonMessage = settings[data.args[0]].message.toString();
          const template = jsonMessage.interpolate({ user: data.user });
          client.sendMessage(template);
          break;
        }
        default:
          client.sendMessage("No type defined or redeem doesn't exist.");
      }

        money[data.user].commandDate = new Date();
        money[data.user].points -= data.args[0].cost;
    }
  },
};
