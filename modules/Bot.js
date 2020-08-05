const fs = require('fs');
const path = require('path');
const util = require('util'); // eslint-disable-line


const clear = require('clear')
const colors = require('colors'); // eslint-disable-line
const figlet = require('figlet')
const vorpal = require('vorpal')();
vorpal.delimiter('\r\nTrovobot$'.underline.italic.grey).show();

var instance = null;

const AsciiTable = require('ascii-table');


const fonts = [
    'ANSI Shadow',
    'Elite',
    'Georgia11',
    'ANSI Regular',
    'Bloody',
    'Delta Corps Priest 1',
    'Electronic',
];


function Bot() {
  if (arguments.callee._singletonInstance) {
    return arguments.callee._singletonInstance;
  }
  arguments.callee._singletonInstance = this;

  this.plugins = new Map();
  this.chat = new Map();
  this.processors = new Map();
  this.services = new Map();
  this.settings = null;
  clear()

  vorpal.log(
      `\r\n${figlet.textSync('Trovobot', {
          font: fonts[Math.floor(Math.random() * fonts.length)],
          horizontalLayout: 'default',
          verticalLayout: 'default',
          whitespaceBreak: true,
      })}`
  )
}

const getDirectories = (source) =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);


Bot.prototype.loadPlugins = async (directory) => {
  const table = new AsciiTable('PLUGINS');
  table.setHeading('PLUGIN', 'STATUS', 'STATE');
  fs.access(directory, (err) => {
    if (err) vorpal.log(`Issue Accessing Plugin Directory (${directory}) / Permission Issues: ${err}`);
    else {
      const directories = getDirectories(directory);
      for (const dir of directories) {
        try {
          const plugin = require(path.join(directory, dir, `${dir}.js`));
          if (plugin.settings) {
            if (fs.accessSync(path.join(directory, dir, `${dir}.json`), fs.constants.R_OK)) {
              plugin.settings = require(path.join(directory, dir, `${dir}.json`));
              vorpal.log(
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
          table.addRow(plugin.name, (plugin.settings.active ? 'Active' : 'Deactive'), 'LOADED');
        } catch (e) {
          vorpal.log(
            `Error Attempting to Load Plugin(${dir}) located at: ${path.join(directory, dir)}`,
          );
        }
      }
    }
    vorpal.log(table.toString());
  });
};

Bot.prototype.getPluginSettings = (plugin) => {
  const data = instance.plugins.get(plugin);
  if (!data) {
    vorpal.log(`Invalid Plugin Requested. Check your spelling for Plugin: ${plugin}`);
    return null;
  }
  return plugin.settings;
};

Bot.prototype.getPlugin = (plugin) => {
  const data = instance.plugins.get(plugin);
  if (!data) {
    vorpal.log(`Invalid Plugin Requested. Check your spelling for Plugin: ${plugin}`);
    return null;
  }
  return plugin;
};

Bot.prototype.triggerEvents = async (type, client, data, plugins) => {
  for (const [key, value] of instance.plugins.entries()) {
    if (value.event && value.type === type) {
      value.execute(client, data, plugins, vorpal.log);
    }
  }
};

Bot.prototype.getChatCommand = (command) => {
  const data = instance.chat.get(command);
  if (!data) {
    vorpal.log(`Invalid Chat Plugin Requested. Check your spelling for Plugin: ${plugin}`);
    return null;
  }
  return data;
};

Bot.prototype.loadProcessors = async (directory) => {
  const table = new AsciiTable('PROCESSORS');
  table.setHeading('PROCESSOR', 'STATUS', 'STATE');
  fs.access(directory, (err) => {
    if (err) vorpal.log(`Issue Accessing Processor Directory (${directory}) / Permission Issues: ${err}`);
    else {
      const directories = getDirectories(directory);
      for (const dir of directories) {
        try {
          const processor = require(path.join(directory, dir, `${dir}.js`));
          processor.settings = require(path.join(directory, dir, `${dir}.json`));
          instance.processors.set(processor.name, processor);
          if (processor.settings.active) {
            const mod = instance.processors.get(processor.name);
            mod.activate();
          }
          table.addRow(processor.name, (processor.settings.active ? 'Active' : 'Deactive'), 'LOADED');
        } catch (e) {
          vorpal.log(
            `Error Attempting to Load Processor(${dir}) located at: ${path.join(directory, dir)}`,
          );
          vorpal.log(`Load Processor Error: ${e}`);
        }
      }
    }
    vorpal.log(table.toString());
  });
};

Bot.prototype.getProcessorsOutput = () => {
  const data = {};
  /* eslint-disable no-unused-vars */
  for (const [key, value] of instance.processors.entries()) {
    if (value.settings.active) {
      data[value.varname] = value.output;
    }
  }
  /* eslint-enable no-unused-vars */
  return data;
};

Bot.prototype.getProcessor = (processor) => {
  const data = instance.processors.get(processor);
  if (!data) {
    vorpal.log(`Invalid Processor Requested. Check your spelling for Processor: ${processor}`);
    return null;
  }
  return data;
};

Bot.prototype.processProcessors = (message) => {
  const data = [];
  /* eslint-disable no-unused-vars */
  for (const [key, value] of instance.services.entries()) {
    if (value.settings.active) {
      data.push(new Promise((res, rej) => {
        value.process(message, vorpal.log, function(err) {
          if (err) rej(err);
          else res();
        })
      }));
    }
  }
  /* eslint-enable no-unused-vars */
  return Promise.all(data);
};

Bot.prototype.loadServices = async (directory) => {
  const table = new AsciiTable('SERVICES');
  table.setHeading('SERVICE', 'STATUS', 'STATE');
  fs.access(directory, (err) => {
    if (err) vorpal.log(`Issue Accessing Service Directory (${directory}) / Permission Issues: ${err}`);
    else {
      const directories = getDirectories(directory);
      for (const dir of directories) {
        try {
          const service = require(path.join(directory, dir, `${dir}.js`));
          service.settings = require(path.join(directory, dir, `${dir}.json`));
          instance.services.set(service.name, service);
          if (service.settings.active) {
            const mod = instance.services.get(service.name);
            mod.activate();
          }
          table.addRow(service.name, (service.settings.active ? 'Active' : 'Deactive'), 'LOADED');
        } catch (e) {
          vorpal.log(
            `Error Attempting to Load Service(${dir}) located at: ${path.join(directory, dir)}`,
          );
          vorpal.log(`Load Services Error: ${e}`);
        }
      }
    }
    vorpal.log(table.toString());
  });
};

Bot.prototype.getServicesOutput = () => {
  const data = {};
  /* eslint-disable no-unused-vars */
  for (const [key, value] of instance.services.entries()) {
    if (value.settings.active) {
      data[value.varname] = value.output;
    }
  }
  /* eslint-enable no-unused-vars */
  return data;
};

Bot.prototype.getService = (service) => {
  const data = instance.services.get(service);
  if (!data) {
    vorpal.log(`Invalid Service Requested. Check your spelling for Service: ${service}`);
    return null;
  }
  return data;
};

Bot.prototype.loadSettings = async (directory) => {
  try {
    instance.settings = require(directory);
    vorpal.log('Settings Loaded....');
  } catch(e) {
    vorpal.log(`Unable to find Settings File: ${directory}`);
    vorpal.log(`Settings Load Error: ${e}`);
  }
};

Bot.prototype.getSettings = () => {
  return instance.settings;
};

Bot.prototype.getSettingsValue = (value) => {
  return instance.settings[value] !== undefined ? instance.settings[value] : null;
};

Bot.prototype.log = (value) => {
  vorpal.log(value);
};

module.exports = (() => {
  if (!instance) instance = new Bot();
  return instance;
})();
