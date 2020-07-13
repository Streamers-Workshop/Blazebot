const OBSWebSocket = require('obs-websocket-js');
const settings = require('./obs.json');

const obs = new OBSWebSocket();

module.exports = {
  name: 'obs-controller-module',
  varname: 'obs',
  output: obs,
  activate() {
    obs.connect({ address: `${settings.address}:${settings.port}`, password: settings.password });
  },
};
