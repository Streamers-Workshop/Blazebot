const SlobsJS = require('slobs.js');
const settings = require('./slobs.json');
let slobs = null;

if (settings.active)
{
	slobs = new SlobsJS(settings.ip, settings.token);
}
module.exports = {
  name: 'slobs-controller-module',
  varname: 'slobs',
  output: slobs,
  activate() {
    return true;
  },
};