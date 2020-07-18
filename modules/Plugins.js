const fs = require('fs');
const path = require('path');

var instance = null; // eslint-disable-line no-var

const AsciiTable = require('ascii-table');

function Plugins() {
  if (arguments.callee._singletonInstance) {
    return arguments.callee._singletonInstance;
  }
  arguments.callee._singletonInstance = this;
  this.plugins = new Map();
  this.chat = new Map();
}

const pluginsTable = new AsciiTable('PLUGINS');
pluginsTable.setHeading('COMMAND', 'STATE');

const getDirectories = (source) =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

Plugins.prototype.loadPlugins = async (directory) => {
  fs.access(directory, (err) => {
    if (err) throw new Error(`File does not Exist or has Access Permission Issues: ${err}`);
    else {
      const directories = getDirectories(directory);
      for (const dir of directories) {
        try {
          const plugin = require(path.join(directory, dir, `${dir}.js`));
          pluginsTable.addRow(plugin.name, 'LOADED');
          if (plugin.settings) {
            if (fs.accessSync(path.join(directory, dir, `${dir}.json`), fs.constants.R_OK)) {
              plugin.settings = require(path.join(directory, dir, `${dir}.json`));
              console.log(
                `Loaded Plugin Settings[${plugin.name}] from File (/plugins/${dir}/${dir}.json)`,
              );
            } else {
              plugin.settings = null;
            }
          }
          if (plugin.chat) {
            instance.chat.set(plugin.command, plugin);
          }
          instance.plugins.set(dir, plugin);
        } catch (e) {
          console.error(
            `Error Attempting to Load Plugin(${dir}) located at: ${path.join(directory, dir)}`,
          );
        }
      }
    }
    console.log(pluginsTable.toString());
  });
};

Plugins.prototype.getSettings = (plugin) => {
  const data = instance.plugins.get(plugin);
  if (!data) {
    console.error(`Invalid Plugin Requested. Check your spelling for Plugin: ${plugin}`);
    return undefined;
  }
  return plugin.settings;
};

Plugins.prototype.getPlugin = (plugin) => {
  const data = instance.plugins.get(plugin);
  if (!data) {
    return null;
  }
  return plugin;
};

Plugins.prototype.triggerEvents = async (type, client, data, plugins) => {
  for (const plugin of instance.plugins.entries()) {
    const value = plugin[1];
    if (value.event && value.type === type) {
      value.execute(client, data, plugins);
    }
  }
};

Plugins.prototype.getChatCommand = (command) => {
  const data = instance.chat.get(command);
  return data;
};

module.exports = (() => {
  if (!instance) instance = new Plugins();
  return instance;
})();
