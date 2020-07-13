const fs = require('fs'), path = require('path'), util = require('util');

var instance = null;

function Settings() {
  if(arguments.callee._singletonInstance) {
    return arguments.callee._singletonInstance;
  }
  arguments.callee._singletonInstance = this;
  this.settings = {};
}

Settings.prototype.loadSettings =  (file) => {
  instance.settings = require(file);
  console.log(`Settings File Load...... Total Key:Value pairs (${Object.keys(instance.settings)}) Loaded.`);
}
Settings.prototype.getSettings = function() {
  return instance.settings;
}
Settings.prototype.getValue = function(value) {
  return instance.settings[value] != undefined ? instance.settings[value] : null;
}

module.exports = function() {
  return instance || (instance = new Settings());
}();
