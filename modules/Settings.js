let instance = null;

function Settings() {
  if (arguments.callee._singletonInstance) {
    return arguments.callee._singletonInstance;
  }
  arguments.callee._singletonInstance = this;
  this.settings = {};
}

Settings.prototype.loadSettings = (file) => {
  instance.settings = require(file);
  console.log(
    `Settings File Load...... Total Key:Value pairs (${Object.keys(instance.settings)}) Loaded.`,
  );
};
Settings.prototype.getSettings = () => {
  return instance.settings;
};
Settings.prototype.getValue = (value) => {
  return instance.settings[value] !== undefined ? instance.settings[value] : null;
};

module.exports = (() => {
  if (!instance) instance = new Settings();
  return instance;
})();
