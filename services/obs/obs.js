const OBSWebSocket = require('obs-websocket-js');
const settings = require('./obs.json');
const Bot = require('../../modules/Bot.js');


const obs = new OBSWebSocket();

var timeout = null;
var count = 1;

function activate() {
	obs.connect({ address: `${settings.address}:${settings.port}`, password: settings.password }).then(() => {
		Bot.log("Connected to OBS");
	}).catch((e) => {
		
		
		if (count <= 5)
		{
			Bot.log(`Unable to connect to OBS. Attempting to reconnect: ${count} of 5`);
			timeout = setTimeout(function () {
				activate();
				++count;
			} , 5000);
		}
		else
		{
			Bot.log("Stopping OBS connection attempts");
		}
	});
  }


module.exports = {
  name: 'obs-controller-module',
  varname: 'obs',
  output: obs,
  activate() {
	activate();
  },
};
