const OBSWebSocket = require('obs-websocket-js');
const settings = require('./obs.json');
const Bot = require('../../modules/Bot.js');


var obs = null;
var timeout = null;
var count = 1;

function connect() {
	obs.connect({ address: `${settings.address}:${settings.port}`, password: settings.password }).then(() => {
		Bot.log(Bot.translate("services.obs.connected"));
	}).catch((e) => {


		if (count <= settings.retry_count)
		{
			Bot.log(Bot.translate("services.obs.connected"), {
				count: count,
				max: settings.retry_count
			});
			timeout = setTimeout(function () {
				activate();
				++count;
			} , 5000);
		}
		else
		{
			Bot.log(Bot.translate("services.obs.stopping_retry"));
		}
	});
  }


module.exports = {
  name: 'obs-controller',
	description: "Provides a OBS Intergration & Control to Trovobot.",
	author: "Bioblaze Payne <bioblazepayne@gmail.com> (https://github.com/Bioblaze)",
	license: "Apache-2.0",
  output() {
		return obs;
	},
  activate() {
		if (!obs) {
			obs = new OBSWebSocket();
		}
		connect();
		Bot.log(Bot.translate("services.obs.activated"));
  },
	deactivate() {
		if (timeout) {
			clearTimeout(timeout);
		}
		obs = null;
		Bot.log(Bot.translate("services.obs.deactivated"));
	}
};
