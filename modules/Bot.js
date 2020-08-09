const fs = require('fs');
const path = require('path');
const util = require('util'); // eslint-disable-line


const clear = require('clear')
clear();
const colors = require('colors'); // eslint-disable-line
const figlet = require('figlet');
const vorpal = require('vorpal')();
vorpal.delimiter('\r\nTrovobot$'.underline.italic.grey).show();

var localizify = require('localizify');
localizify = new localizify.Instance();

const marked = require('marked');
const TerminalRenderer = require('marked-terminal');

marked.setOptions({
  renderer: new TerminalRenderer(),
});

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
  this.root = null;

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

const getJsonFiles = (source) =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => !dirent.isDirectory())
    .filter((dirent) => (dirent.name.indexOf('.json') > -1))
    .map((dirent) => dirent.name);

Bot.prototype.setRoot = (directory) => {
  instance.root = directory;
};

Bot.prototype.loadLocalizationFiles = async (directory) => {
  return new Promise((res, rej) => {
    fs.access(directory, (err) => {
      if (err) {
          vorpal.log(`Error Accessing Localization Directory (${directory})\r\nError: ${err}`);
          rej(err);
      } else {
        const jsonfiles = getJsonFiles(directory);
        for (const file of jsonfiles) {
          try {
            const json = require(path.join(directory, file));
            let split = file.split(".");
            localizify.add(split[0], json);
          } catch (e) {
            vorpal.log(
              `Error Attempting to Load Localization JSON(${file}) located at: ${path.join(directory, file)} / Error: ${e}`,
            );
          }
        }
        localizify.setLocale(instance.settings.lang);
        vorpal.log(instance.translate("bot.lang_loaded", {
          lang: instance.settings.lang
        }))
        res();
      }
    });
  });
};

Bot.prototype.translate = (key, data) => {
  if (data) return localizify.translate(key, data);
  else return localizify.translate(key);
};

Bot.prototype.addLocalization = (lang, key, value) => {
  localizify.add(lang, key, value);
}

Bot.prototype.setLocalization = (lang) => {
  localizify.setLocale(lang);
};

Bot.prototype.getLocalization = () => {
  return localizify.getLocale();
};

Bot.prototype.loadPlugins = async (directory) => {

  const table = new AsciiTable(instance.translate("bot.plugins"));
  table.setHeading(instance.translate("bot.plugin"), instance.translate("bot.status"), instance.translate("bot.state"));
  fs.access(directory, (err) => {
    if (err) {
      vorpal.log(instance.translate("bot.plugin_load_access_error", {
        directory: directory,
        err: err
      }));
    } else {
      const directories = getDirectories(directory);
      for (const dir of directories) {
        try {
          const plugin = require(path.join(directory, dir, `${dir}.js`));
          var readme = fs.readFileSync(path.join(directory, dir, `README.md`), 'utf8');
          plugin.directory = path.join(directory, dir);
          plugin.settings = require(path.join(directory, dir, `${dir}.json`));
          plugin.readme = readme;
          instance.plugins.set(dir, plugin);
          if (plugin.settings.active) {
            if (plugin.chat) {
              instance.chat.set(plugin.command.toLowerCase(), plugin);
            }
            table.addRow(plugin.name, (plugin.settings.active ? instance.translate("bot.active") : instance.translate("bot.inactive")), instance.translate("bot.loaded"));
          }
        } catch (e) {
          vorpal.log(instance.translate("bot.plugin_load_try_error", {
            name: dir,
            dir: path.join(directory, dir),
            err: e
          }));
        }
      }
    }
    if (table.__rows && table.__rows.length > 0) {
      vorpal.log(table.toString());
    } else {
      vorpal.log()
    }
  });
};

Bot.prototype.getPlugin = (plugin) => {
  const data = instance.plugins.get(plugin);
  if (!data) {
    vorpal.log(instance.translate("bot.get_plugin_error", { plugin: plugin }));
    return null;
  }
  return data;
};

Bot.prototype.triggerEvents = async (type, client, data) => {
  for (const [key, value] of instance.plugins.entries()) {
    if (value.event && value.type === type) {
      value.execute(client, data);
    }
  }
};

Bot.prototype.getChatCommand = (command) => {
  const data = instance.chat.get(command);
  if (!data) {
    vorpal.log(instance.translate("bot.get_chat_command_error", { command: command }));
    return null;
  }
  return data;
};

Bot.prototype.loadProcessors = async (directory) => {
  const table = new AsciiTable(instance.translate("bot.processors"));
  table.setHeading(instance.translate("bot.processor"), instance.translate("bot.status"), instance.translate("bot.state"));
  fs.access(directory, (err) => {
    if (err) {
      vorpal.log(instance.translate("bot.processor_load_access_error", {
        directory: directory,
        err: err
      }));
    } else {
      const directories = getDirectories(directory);
      for (const dir of directories) {
        try {
          const processor = require(path.join(directory, dir, `${dir}.js`));
          processor.directory = path.join(directory, dir);
          var readme = fs.readFileSync(path.join(directory, dir, `README.md`), 'utf8');
          processor.settings = require(path.join(directory, dir, `${dir}.json`));
          processor.readme = readme;
          instance.processors.set(processor.name, processor);
          if (processor.settings.active) {
            const mod = instance.processors.get(processor.name);
            mod.activate();
            table.addRow(processor.name, (processor.settings.active ? instance.translate("bot.active") : instance.translate("bot.inactive")), instance.translate("bot.loaded"));
          }
        } catch (e) {
          vorpal.log(instance.translate("bot.processor_load_try_error", {
            name: dir,
            dir: path.join(directory, dir),
            err: e
          }));
        }
      }
    }
    if (table.__rows && table.__rows.length > 0) {
      vorpal.log(table.toString());
    }
  });
};

Bot.prototype.getProcessor = (processor) => {
  const data = instance.processors.get(processor);
  if (!data) {
    vorpal.log(instance.translate("bot.get_processor_error", { processor: processor }));
    return null;
  }
  return data;
};

Bot.prototype.processProcessors = (message) => {
  const data = [];
  /* eslint-disable no-unused-vars */
  for (const [key, value] of instance.processors.entries()) {
    if (value.settings.active) {
      data.push(new Promise((res, rej) => {
        value.process(message, function(err) {
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
  const table = new AsciiTable(instance.translate("bot.services"));
  table.setHeading(instance.translate("bot.service"), instance.translate("bot.status"), instance.translate("bot.state"));
  fs.access(directory, (err) => {
    if (err) {
      vorpal.log(instance.translate("bot.service_load_access_error", {
        directory: directory,
        err: err
      }));
    } else {
      const directories = getDirectories(directory);
      for (const dir of directories) {
        try {
          const service = require(path.join(directory, dir, `${dir}.js`));
          service.directory = path.join(directory, dir);
          var readme = fs.readFileSync(path.join(directory, dir, `README.md`), 'utf8').toString();
          service.settings = require(path.join(directory, dir, `${dir}.json`));
          service.readme = readme;
          instance.services.set(service.name, service);
          if (service.settings.active) {
            const mod = instance.services.get(service.name);
            mod.activate();
            table.addRow(service.name, (service.settings.active ? instance.translate("bot.active") : instance.translate("bot.inactive")), instance.translate("bot.loaded"));
          }
        } catch (e) {
          vorpal.log(instance.translate("bot.service_load_try_error", {
            name: dir,
            dir: path.join(directory, dir),
            err: e
          }));
        }
      }
    }
    if (table.__rows && table.__rows.length > 0) {
      vorpal.log(table.toString());
    }
  });
};

Bot.prototype.getService = (service) => {
  const data = instance.services.get(service);
  if (!data) {
    vorpal.log(instance.translate("bot.get_service_error", { service: service }));
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
    fs.writeFileSync(directory, JSON.stringify({
      "prefix": "!",
      "trovo": {
        "email": "",
        "password": "",
        "name": "",
        "page": ""
      },
      "lang": "en"
    }), 'utf8')
    vorpal.log(`Example Settings File Created.\r\nPlease edit the settings file, and restart the bot.`);
    process.exit(0);
  }
};

Bot.prototype.getSettingsValue = (value) => {
  return instance.settings[value] !== undefined ? instance.settings[value] : null;
};

Bot.prototype.log = (value) => {
  vorpal.log(value);
};

Bot.prototype.addConsoleCommand = (name, desc, callback) => {
  vorpal
      .command(name, desc)
      .action(callback); // Must Contain args, callback
}

Bot.prototype.loadConsoleCommands = () => {
    /*
      zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzvbvvvbbnnnnnjjnnfffssuu5ftgrfxss',m
      ^^ First computer line typed by my nephew <3 8/8/2020 ~ 7:50pm <3 So cute <3 <3
      Has the making of a little programmer <3 <3 <3 <3
    */
  vorpal
      .command('plugin-info', instance.translate("bot.plugin_info_desc"))
      .action((args, callback) => {

          callback()
      });

  vorpal
      .command('plugins', instance.translate("bot.plugins_desc"))
      .action((args, callback) => {

          callback()
      });

  vorpal
      .command('reload-plugin', instance.translate("bot.plugin_reload_desc"))
      .action((args, callback) => {

          callback()
      });

  vorpal
      .command('activate-plugin', instance.translate("bot.plugin_activate_desc"))
      .action((args, callback) => {

          callback()
      });

  vorpal
      .command('deactivate-plugin', instance.translate("bot.plugin_deactivate_desc"))
      .action((args, callback) => {

          callback()
      });
  vorpal
      .command('deactivate-all-plugins', instance.translate("bot.deactivate_all_plugins_desc"))
      .action((args, callback) => {

          callback()
      });
  vorpal
      .command('activate-all-plugins', instance.translate("bot.activate_all_plugins_desc"))
      .action((args, callback) => {

          callback()
      });
};

Bot.prototype.defaultFallbackLocalization = () => {
  localizify.add('en', {
    "bot": {
      "cooldown": "Holdon for {timeLeft} more second(s) before reusing the `{name}` command.",
      "missing_permissions": "You do not have permission to use this command. Sorry.",
      "cmd_error": "Command Error({name}): {err}",
      "contact_creator": "There was a error with processing your Command. Please Contact Bioblaze Payne#6459 and let him know.",
      "process_error": "Processing Error: {err}",
      "loaded": "\r\nBot loaded and ready to mod!",
      "lang_loaded": "Localization Files have been Loaded.....\r\nLocalization has been Set to: {lang}",
      "active_plugins": "ACTIVE PLUGINS",
      "plugin": "PLUGIN",
      "status": "STATUS",
      "state": "STATE",
      "plugin_load_access_error": "Error Accessing Plugin Directory ({directory})\r\nError: {err}",
      "active": "Active",
      "inactive": "In-active",
      "loaded": "LOADED",
      "plugin_load_try_error": "Error Attempting to Load Plugin({name}) located at: {dir}\r\nError: {err}",
      "get_plugin_error": "Invalid Plugin Requested. Check your spelling for Plugin: {plugin}",
      "get_processor_error": "Invalid Processor Requested. Check your spelling for Processor: {processor}",
      "get_service_error": "Invalid Service Requested. Check your spelling for Service: {service}",
      "get_chat_command_error": "Invalid Command Requested. Check your spelling for the Chat Command: {command}",
      "processor": "PROCESSOR",
      "processors": "PROCESSORS",
      "processor_load_access_error": "Error Accessing Processor Directory ({directory})\r\nError: {err}",
      "processor_load_try_error": "Error Attempting to Load Processor({name}) located at: {dir}\r\nError: {err}",
      "services": "SERVICES",
      "service": "SERVICE",
      "service_load_access_error": "Error Accessing Service Directory ({directory})\r\nError: {err}",
      "service_load_try_error": "Error Attempting to Load Service({name}) located at: {dir}\r\nError: {err}",
      "plugin_info_desc": "Gives you information on a Plugin within the System~",
      "plugins_desc": "Displays a List of all Plugins within Trovobot, that are LOADED.",
      "plugin_reload_desc": "Reloads a specific Plugin.",
      "plugin_activate_desc": "Activates a Plugin.",
      "plugin_deactivate_desc": "Deactivates a Plugin.",
      "deactivate_all_plugins_desc": "Deactivates all Plugins.",
      "activate_all_plugins_desc": "Activates all Plugins."
    }
  });
}

module.exports = (() => {
  if (!instance) instance = new Bot();
  return instance;
})();
