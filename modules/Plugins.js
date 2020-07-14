const fs = require('fs'), path = require('path'), util = require('util');

var instance = null;

var AsciiTable = require('ascii-table')

function Plugins() {
  if(arguments.callee._singletonInstance) {
    return arguments.callee._singletonInstance;
  }
  arguments.callee._singletonInstance = this;
  this.plugins = new Map();
  this.chat = new Map();
}

let pluginsTable = new AsciiTable('PLUGINS');
pluginsTable.setHeading('COMMAND', 'STATE')

const getDirectories = source => fs.readdirSync(source, { withFileTypes: true }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name)

Plugins.prototype.loadPlugins = async (directory) => {
  fs.access(directory, function(err) {
    if (err) new Error(`File does not Exist or has Access Permission Issues: ${file}`);
    else {
      const directories = getDirectories(directory);
      for(const dir of directories) {
        try {
          var plugin = require(path.join(directory, dir, `${dir}.js`));
          /** console.log(`Loaded Plugin[${plugin.name}] from File (/plugins/${dir}/${dir}.js)`); */
          pluginsTable.addRow(plugin.name, 'LOADED');
          if (plugin.settings) {
            if (fs.accessSync(path.join(directory, dir, `${dir}.json`), fs.constants.R_OK)) {
              plugin.settings = require(path.join(directory, dir, `${dir}.json`));
              console.log(`Loaded Plugin Settings[${plugin.name}] from File (/plugins/${dir}/${dir}.json)`);
            } else {
              plugin.settings = null;
            }
          }
          if (plugin.chat) {
            instance.chat.set(plugin.command, plugin);
          }
          instance.plugins.set(dir, plugin);
        } 
        catch(e) {
          pluginsTable.addRow(plugin.name, 'NOT LOADED');
        }
      }
    }
    console.log(pluginsTable.toString());
  });
}


Plugins.prototype.getSettings = (plugin) => {
    const data = instance.plugins.get(plugin);
    if (!data) {
      console.error(`Invalid Plugin Requested. Check your spelling for Plugin: ${plugin}`);
      return undefined;
    }
    else return plugin.settings;
}

Plugins.prototype.getPlugin = (plugin) => {
    const data = instance.plugins.get(plugin);
    if (!data) {
      return null;
    }
    else return plugin;
}

Plugins.prototype.triggerEvents = async (type, client, data, plugins) => {
    for (var plugin of instance.plugins.entries()) {
      var value = plugin[1];
      if (!value.event) return;
      if (value.type != type) return;
      value.execute(data, client, plugins);
    }
}

Plugins.prototype.getChatCommand = (command) => {
  const data = instance.chat.get(command);
  return data;
}

module.exports = function() {
  return instance || (instance = new Plugins());
}();
