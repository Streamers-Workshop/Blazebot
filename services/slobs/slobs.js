const SlobsJS = require('slobs.js');


let slobs = null;

module.exports = {
  name: 'slobs-controller-module',
  varname: 'slobs',
  output: slobs,
  activate() {
    const settings = require('./slobs.json');
    slobs = new SlobsJS(settings.ip, settings.token);
  },
};
