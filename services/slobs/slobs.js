const SlobsJS = require('slobs.js');


var slobs = new SlobsJS();

module.exports = {
  name: 'slobs-controller-module',
  varname: 'slobs',
  output: slobs,
  activate() {
    const settings = require('./slobs.json');
    slobs.login(settings.ip, settings.token);
  },
};
