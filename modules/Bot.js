const fs = require('fs');
const path = require('path');
const util = require('util'); // eslint-disable-line


const clear = require('clear')
clear();
const colors = require('colors'); // eslint-disable-line
const figlet = require('figlet');
const vorpal = require('vorpal')();

var inquirer = require('inquirer');
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
  this.processors = new Map();
  this.services = new Map();
  this.settings = null;
  this.settingsfile = null;
  this.root = null;
  this.data = null;
  this.langs = [];
  this.client = null;

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

Bot.prototype.setClient = (data) => {
  instance.client = data;
};

Bot.prototype.setRoot = (directory) => {
  instance.root = directory;
};

Bot.prototype.setData = (directory) => {
  instance.data = directory;
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
            instance.langs.push(split[0]);
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
          plugin.filename = `${dir}.js`;
          plugin.settings = require(path.join(directory, dir, `${dir}.json`));
          plugin.readme = readme;
          if (plugin.settings.active) {
            plugin.activate();
            if (plugin.console && typeof(plugin.console) === 'function') {
              plugin.console();
            }
          }
          instance.plugins.set(dir, plugin);
          table.addRow(plugin.name, (plugin.settings.active ? instance.translate("bot.active") : instance.translate("bot.inactive")), instance.translate("bot.loaded"));
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
      vorpal.log(instance.translate("bot.no_plugins_loaded"))
    }
  });
};

Bot.prototype.unloadPlugins = async (directory) => {

  fs.access(directory, (err) => {
    if (err) {
      vorpal.log(instance.translate("bot.plugin_unload_access_error", {
        directory: directory,
        err: err
      }));
    } else {
      const directories = getDirectories(directory);
      for (const dir of directories) {
        try {
          instance.plugins.delete(dir);
          delete require.cache[require.resolve(path.join(directory, dir, `${dir}.js`))];
          delete require.cache[require.resolve(path.join(directory, dir, `${dir}.json`))];
        } catch (e) {
          vorpal.log(instance.translate("bot.plugin_unload_try_error", {
            name: dir,
            dir: path.join(directory, dir),
            err: e
          }));
        }
      }
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
    
    if (value.event) {
      if (value.event === type) {
        value.execute(client, data);
      } else if (Array.isArray(value.event)) {
        if (value.event.indexOf(type) > -1) {
          value.execute(client, data);
        }
      }
    }
  }
};

Bot.prototype.getChatCommand = (command) => {
  var data = null;
  for (const [key, value] of instance.plugins.entries()) {
    if (value.command && value.command === command) {
      data = value;
    }
  }
  if (!data) {
    vorpal.log(instance.translate("bot.get_chat_command_error", { command: command }));
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
          processor.filename = `${dir}.js`;
          var readme = fs.readFileSync(path.join(directory, dir, `README.md`), 'utf8');
          processor.settings = require(path.join(directory, dir, `${dir}.json`));
          processor.readme = readme;
          if (processor.settings.active) {
            processor.activate();
            if (processor.console && typeof(processor.console) === 'function') {
              processor.console();
            }
          }
          instance.processors.set(processor.name, processor);
          table.addRow(processor.name, (processor.settings.active ? instance.translate("bot.active") : instance.translate("bot.inactive")), instance.translate("bot.loaded"));
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
    } else {
      vorpal.log(instance.translate("bot.no_processors_loaded"))
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

Bot.prototype.processProcessors = (message, client) => {
  const data = [];
  /* eslint-disable no-unused-vars */
  for (const [key, value] of instance.processors.entries()) {
    if (value.settings.active) {
      data.push(new Promise((res, rej) => {
        value.process(message, client, function(err, skip) {
          if (err) rej(err);
          else res(skip);
        })
      }));
    }
  }
  /* eslint-enable no-unused-vars */
  return Promise.all(data).then((check) => {
    var balance = check.filter((x) => {
      return x;
    });
    return (balance.length > 1);
  });
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
          service.filename = `${dir}.js`;
          var readme = fs.readFileSync(path.join(directory, dir, `README.md`), 'utf8').toString();
          service.settings = require(path.join(directory, dir, `${dir}.json`));
          service.readme = readme;
          if (service.settings.active) {
            service.activate();
            if (service.console && typeof(service.console) === 'function') {
              service.console();
            }
          }
          instance.services.set(service.name, service);
          table.addRow(service.name, (service.settings.active ? instance.translate("bot.active") : instance.translate("bot.inactive")), instance.translate("bot.loaded"));
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
    } else {
      vorpal.log(instance.translate("bot.no_services_loaded"))
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
    instance.settingsfile = directory;
    if (instance.settings.console) {
      vorpal.delimiter('\r\nTrovobot$'.underline.italic.grey).show();
    }
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
      "lang": "en",
      "console": true
    }, null, 2), 'utf8')
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

Bot.prototype.translog = (value) => {
  if (data) return vorpal.log(localizify.translate(key, data));
  else return vorpal.log(localizify.translate(key));
};

Bot.prototype.addConsoleCommand = (name, desc, callback) => {
  vorpal
      .command(name, desc)
      .action(callback); // Must Contain args, callback
}

Bot.prototype.removeConsoleCommands = (arr) => {
  vorpal.commands = vorpal.commands.filter((x) => {
    return (arr.indexOf(x._name) > -1);
  });
};

Bot.prototype.reloadConsoleCommands = () => {
  var save_cmds = ["exit", "help"];
  vorpal.commands = vorpal.commands.filter((x) => {
    return (save_cmds.indexOf(x._name) > -1);
  });
  instance.loadConsoleCommands();
  for (const [key, value] of instance.plugins.entries()) {
    if (value.console && typeof(value.console) === 'function') {
      value.console();
    }
  }
  for (const [key, value] of instance.services.entries()) {
    if (value.console && typeof(value.console) === 'function') {
      value.console();
    }
  }
  for (const [key, value] of instance.processors.entries()) {
    if (value.console && typeof(value.console) === 'function') {
      value.console();
    }
  }
};

Bot.prototype.loadConsoleCommands = () => {
    /*
      zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzvbvvvbbnnnnnjjnnfffssuu5ftgrfxss',m
      ^^ First computer line typed by my nephew <3 8/8/2020 ~ 7:50pm <3 So cute <3 <3
      Has the making of a little programmer <3 <3 <3 <3
    */
  vorpal
      .command('clear')
      .description(instance.translate("bot.clear_console"))
      .action((args, callback) => {
        process.stdout.write ("\u001B[2J\u001B[0;0f");
          callback();
      });

  vorpal
      .command('setlang <lang>')
      .description(instance.translate("bot.setlang_console"))
      .action((args, callback) => {
        if (instance.langs.indexOf(args.lang) > -1) {
          var prev_lang = localizify.getLocale();
          localizify.setLocale(args.lang);
          instance.reloadConsoleCommands();
          vorpal.log(instance.translate("bot.setlang_switch", {
            to: args.lang,
            from: prev_lang
          }));
          try {
            var settings = fs.readFileSync(path.resolve(instance.settingsfile), 'utf8');
            settings = JSON.parse(settings);
            settings.lang = args.lang;
            fs.writeFileSync(path.resolve(instance.settingsfile), JSON.stringify(settings, null, 2));
            delete require.cache[require.resolve(path.resolve(instance.settingsfile))];
            instance.settings = require(path.resolve(instance.settingsfile));
            vorpal.log(instance.translate("bot.setlang_saved"));
          } catch(e) {
            vorpal.log(instance.translate("bot.setlang_save_error", {
              e: e
            }));
          }
        } else {
          vorpal.log(instance.translate("bot.setlang_invalid", {
            langs: instance.langs.join(", ")
          }))
        }
          callback();
      });

  vorpal
      .command('getlangs', instance.translate("bot.getlang_console"))
      .action((args, callback) => {
        vorpal.log(instance.translate("bot.getlang_options", {
          langs: instance.langs.join(", ")
        }))
          callback();
      });

  vorpal
    .command('setup', instance.translate("bot.setup_console"))
    .action((args, callback) => {
      inquirer.prompt([{
        type: 'input',
        name: 'email',
        message: instance.translate("bot.what_email")
      }, {
        type: 'password',
        name: 'password',
        message: instance.translate("bot.what_password")
      }, {
        type: 'input',
        name: 'name',
        message: instance.translate("bot.what_name")
      }, {
        type: 'input',
        name: 'page',
        message: instance.translate("bot.what_page")
      }, {
        type: 'input',
        name: 'prefix',
        message: instance.translate("bot.what_prefix")
      }, {
        type: 'input',
        name: 'lang',
        message: instance.translate("bot.what_lang", {
          langs: instance.langs.join(", ")
        }),
        validate: (value) => {
          if (instance.langs.indexOf(value) > -1) {
            return true;
          } else {
            return instance.translate("bot.acceptable_languages", {
              langs: instance.langs.join(", ")
            });
          }
        }
      }]).then((answers) => {
        try {
          var settings = {
            "prefix": answers.prefix,
            "trovo": {
              "email": answers.email,
              "password": answers.password,
              "name": answers.name,
              "page": answers.page
            },
            "lang": answers.lang,
            "console": true
          };
          fs.writeFileSync(path.resolve(instance.settingsfile), JSON.stringify(settings, null, 2));
          delete require.cache[require.resolve(path.resolve(instance.settingsfile))];
          instance.settings = require(path.resolve(instance.settingsfile));
          vorpal.log(instance.translate("bot.setup_complete"))
        } catch(e) {
          vorpal.log(instance.translate("bot.setup_error_save", {
            e: e
          }));
        }
        callback();
      }).catch((err) => {
        vorpal.log(instance.translate("bot.setup_failed", {
          e: e
        }));
        callback();
      })
    })

  vorpal
      .command('plugin-info <plugin>', instance.translate("bot.plugin_info_desc"))
      .action((args, callback) => {
        var plugin = instance.plugins.get(args.plugin);
        if (!plugin) {
          vorpal.log(instance.translate("bot.plugin_name_invalid"));
        } else {
          vorpal.log(marked(plugin.readme));
        }
          callback()
      });

  vorpal
      .command('plugins', instance.translate("bot.plugins_desc"))
      .action((args, callback) => {
        const table = new AsciiTable(instance.translate("bot.plugins"));
        table.setHeading(instance.translate("bot.plugin"), instance.translate("bot.status"));
        for (const [key, value] of instance.plugins.entries()) {
          table.addRow(value.name, (value.settings.active ? instance.translate("bot.active") : instance.translate("bot.inactive")));
        }
        vorpal.log(table.toString());
          callback()
      });

  vorpal
      .command('reload-plugin <plugin>', instance.translate("bot.plugin_reload_desc"))
      .action((args, callback) => {
        var plugin = instance.plugins.get(args.plugin);
        if (!plugin) {
          vorpal.log(instance.translate("bot.plugin_name_invalid"));
        } else {
          if (plugin.settings.active) {
            plugin.deactivate();
          }
          instance.plugins.delete(args.plugin);
          delete require.cache[require.resolve(path.join(plugin.directory, plugin.filename))];
          delete require.cache[require.resolve(path.join(plugin.directory, `${plugin.filename.split(".")[0]}.json`))];
          var readme = fs.readFileSync(path.join(plugin.directory, `README.md`), 'utf8');
          let dir = plugin.directory;
          let file = plugin.filename;
          plugin = require(path.join(dir, file));
          plugin.directory = dir;
          plugin.filename = file;
          plugin.settings = require(path.join(dir, `${file.split(".")[0]}.json`));
          plugin.readme = readme;
          if (plugin.settings.active) {
            plugin.activate();
            if (plugin.console && typeof(plugin.console) === 'function') {
              plugin.console();
            }
          }
          instance.plugins.set(args.plugin, plugin);
          vorpal.log(instance.translate("bot.reloaded_plugin"))

        }
          callback()
      });

  vorpal
      .command('activate-plugin <plugin>', instance.translate("bot.plugin_activate_desc"))
      .action((args, callback) => {
        var plugin = instance.plugins.get(args.plugin);
        if (!plugin) {
          vorpal.log(instance.translate("bot.plugin_name_invalid"));
        } else {
          if (plugin.settings.active) {
            vorpal.log(instance.translate("bot.plugin_already_active"));
          } else {
            try {
              delete require.cache[require.resolve(path.join(plugin.directory, `${plugin.filename.split(".")[0]}.json`))];
              var settings = require(path.join(plugin.directory, `${plugin.filename.split(".")[0]}.json`));
              settings.active = true;
              fs.writeFileSync(path.join(plugin.directory, `${plugin.filename.split(".")[0]}.json`), JSON.stringify(settings, null, 2));
              plugin.settings = settings;
              plugin.activate();
              if (plugin.console && typeof(plugin.console) === 'function') {
                plugin.console();
              }
              instance.plugins.delete(args.plugin);
              instance.plugins.set(args.plugin, plugin);
              vorpal.log(instance.translate("bot.plugin_activated"));
            } catch(e) {
              vorpal.log(instance.translate("bot.plugin_activated_error", {
                name: plugin.name,
                e: e
              }));
            }
          }
        }
          callback()
      });

  vorpal
      .command('deactivate-plugin <plugin>', instance.translate("bot.plugin_deactivate_desc"))
      .action((args, callback) => {
        var plugin = instance.plugins.get(args.plugin);
        if (!plugin) {
          vorpal.log(instance.translate("bot.plugin_name_invalid"));
        } else {
          if (!plugin.settings.active) {
            vorpal.log(instance.translate("bot.plugin_already_inactive"));
          } else {
            try {
              plugin.deactivate();
              delete require.cache[require.resolve(path.join(plugin.directory, `${plugin.filename.split(".")[0]}.json`))];
              var settings = require(path.join(plugin.directory, `${plugin.filename.split(".")[0]}.json`));
              settings.active = false;
              fs.writeFileSync(path.join(plugin.directory, `${plugin.filename.split(".")[0]}.json`), JSON.stringify(settings, null, 2));
              plugin.settings = settings;
              instance.plugins.delete(args.plugin);
              instance.plugins.set(args.plugin, plugin);
              vorpal.log(instance.translate("bot.plugin_deactivated"));
            } catch(e) {
              vorpal.log(instance.translate("bot.plugin_deactivated_error", {
                name: plugin.name,
                e: e
              }));
            }
          }
        }
          callback()
      });
  vorpal
      .command('deactivate-all-plugins', instance.translate("bot.deactivate_all_plugins_desc"))
      .action((args, callback) => {
        for (const [key, value] of instance.plugins.entries()) {
          var plugin = value;
          if (plugin.settings.active) {
            try {
              plugin.deactivate();
              delete require.cache[require.resolve(path.join(plugin.directory, `${plugin.filename.split(".")[0]}.json`))];
              var settings = require(path.join(plugin.directory, `${plugin.filename.split(".")[0]}.json`));
              settings.active = false;
              fs.writeFileSync(path.join(plugin.directory, `${plugin.filename.split(".")[0]}.json`), JSON.stringify(settings, null, 2));
              plugin.settings = settings;
              instance.plugins.delete(args.plugin);
              instance.plugins.set(args.plugin, plugin);
            } catch(e) {
              vorpal.log(instance.translate("bot.plugin_deactivated_error", {
                name: plugin.name,
                e: e
              }));
            }

          }
        }
        vorpal.log(instance.translate("bot.plugins_deactivated"));
          callback()
      });
  vorpal
      .command('activate-all-plugins', instance.translate("bot.activate_all_plugins_desc"))
      .action((args, callback) => {
        for (const [key, value] of instance.plugins.entries()) {
          var plugin = value;
          if (!plugin.settings.active) {
            try {
              delete require.cache[require.resolve(path.join(plugin.directory, `${plugin.filename.split(".")[0]}.json`))];
              var settings = require(path.join(plugin.directory, `${plugin.filename.split(".")[0]}.json`));
              settings.active = true;
              fs.writeFileSync(path.join(plugin.directory, `${plugin.filename.split(".")[0]}.json`), JSON.stringify(settings, null, 2));
              plugin.settings = settings;
              plugin.activate();
              if (plugin.console && typeof(plugin.console) === 'function') {
                plugin.console();
              }
              instance.plugins.delete(args.plugin);
              instance.plugins.set(args.plugin, plugin);
            } catch(e) {
              vorpal.log(instance.translate("bot.plugin_activated_error", {
                name: plugin.name,
                e: e
              }));
            }

          }
        }
        vorpal.log(instance.translate("bot.plugins_activated"));
          callback()
      });

vorpal
    .command('processor-info <processor>', instance.translate("bot.processor_info_desc"))
    .action((args, callback) => {
      var processor = instance.processors.get(args.processor);
      if (!processor) {
        vorpal.log(instance.translate("bot.processor_name_invalid"));
      } else {
        vorpal.log(marked(processor.readme));
      }
        callback()
    });

vorpal
    .command('processors', instance.translate("bot.processors_desc"))
    .action((args, callback) => {
      const table = new AsciiTable(instance.translate("bot.processors"));
      table.setHeading(instance.translate("bot.processor"), instance.translate("bot.status"));
      for (const [key, value] of instance.processors.entries()) {
        table.addRow(value.name, (value.settings.active ? instance.translate("bot.active") : instance.translate("bot.inactive")));
      }
      vorpal.log(table.toString());
        callback()
    });

vorpal
    .command('reload-processor <processor>', instance.translate("bot.processor_reload_desc"))
    .action((args, callback) => {
      var processor = instance.processors.get(args.processor);
      if (!processor) {
        vorpal.log(instance.translate("bot.processor_name_invalid"));
      } else {
        if (processor.settings.active) {
          processor.deactivate();
        }
        instance.processors.delete(args.processor);
        delete require.cache[require.resolve(path.join(processor.directory, processor.filename))];
        delete require.cache[require.resolve(path.join(processor.directory, `${processor.filename.split(".")[0]}.json`))];
        var readme = fs.readFileSync(path.join(processor.directory, `README.md`), 'utf8');
        let dir = processor.directory;
        let file = processor.filename;
        processor = require(path.join(dir, file));
        processor.directory = dir;
        processor.filename = file;
        processor.settings = require(path.join(dir, `${file.split(".")[0]}.json`));
        processor.readme = readme;
        if (processor.settings.active) {
          processor.activate();
          if (processor.console && typeof(processor.console) === 'function') {
            processor.console();
          }
        }
        instance.processors.set(args.processor, processor);
        vorpal.log(instance.translate("bot.reloaded_processor"))
      }
        callback()
    });

vorpal
    .command('activate-processor <processor>', instance.translate("bot.processor_activate_desc"))
    .action((args, callback) => {
      var processor = instance.processors.get(args.processor);
      if (!processor) {
        vorpal.log(instance.translate("bot.processor_name_invalid"));
      } else {
        if (processor.settings.active) {
          vorpal.log(instance.translate("bot.processor_already_active"));
        } else {
          try {
            instance.processors.delete(args.processor);
            delete require.cache[require.resolve(path.join(processor.directory, `${processor.filename.split(".")[0]}.json`))];
            var settings = require(path.join(processor.directory, `${processor.filename.split(".")[0]}.json`));
            settings.active = true;
            fs.writeFileSync(path.join(processor.directory, `${processor.filename.split(".")[0]}.json`), JSON.stringify(settings, null, 2));
            processor.settings = settings;
            processor.activate();
            if (processor.console && typeof(processor.console) === 'function') {
              processor.console();
            }
            instance.processors.set(args.processor, processor);
            vorpal.log(instance.translate("bot.processor_activated"));
          } catch(e) {
            vorpal.log(instance.translate("bot.processor_activated_error", {
              name: processor.name,
              e: e
            }));
          }
        }
      }
        callback()
    });

vorpal
    .command('deactivate-processor <processor>', instance.translate("bot.processor_deactivate_desc"))
    .action((args, callback) => {
      var processor = instance.processors.get(args.processor);
      if (!processor) {
        vorpal.log(instance.translate("bot.processor_name_invalid"));
      } else {
        if (!processor.settings.active) {
          vorpal.log(instance.translate("bot.processor_already_inactive"));
        } else {
          try {
            processor.deactivate();
            instance.processors.delete(args.processor);
            delete require.cache[require.resolve(path.join(processor.directory, `${processor.filename.split(".")[0]}.json`))];
            var settings = require(path.join(processor.directory, `${processor.filename.split(".")[0]}.json`));
            settings.active = false;
            fs.writeFileSync(path.join(processor.directory, `${processor.filename.split(".")[0]}.json`), JSON.stringify(settings, null, 2));
            processor.settings = settings;
            instance.processors.set(args.processor, processor);
            vorpal.log(instance.translate("bot.processor_deactivated"));
          } catch(e) {
            vorpal.log(instance.translate("bot.processor_deactivated_error", {
              name: processor.name,
              e: e
            }));
          }
        }
      }
        callback()
    });
vorpal
    .command('deactivate-all-processors', instance.translate("bot.deactivate_all_processors_desc"))
    .action((args, callback) => {
      for (const [key, value] of instance.processors.entries()) {
        var processor = value;
        if (processor.settings.active) {
          try {
            processor.deactivate();
            instance.processors.delete(args.processor);
            delete require.cache[require.resolve(path.join(processor.directory, `${processor.filename.split(".")[0]}.json`))];
            var settings = require(path.join(processor.directory, `${processor.filename.split(".")[0]}.json`));
            settings.active = false;
            fs.writeFileSync(path.join(processor.directory, `${processor.filename.split(".")[0]}.json`), JSON.stringify(settings, null, 2));
            processor.settings = settings;
            instance.processors.set(args.processor, processor);
          } catch(e) {
            vorpal.log(instance.translate("bot.processor_deactivated_error", {
              name: processor.name,
              e: e
            }));
          }

        }
      }
      vorpal.log(instance.translate("bot.processors_deactivated"));
        callback()
    });
vorpal
    .command('activate-all-processors', instance.translate("bot.activate_all_processors_desc"))
    .action((args, callback) => {
      for (const [key, value] of instance.processors.entries()) {
        var processor = value;
        if (!processor.settings.active) {
          try {
            instance.processors.delete(args.processor);
            delete require.cache[require.resolve(path.join(processor.directory, `${processor.filename.split(".")[0]}.json`))];
            var settings = require(path.join(processor.directory, `${processor.filename.split(".")[0]}.json`));
            settings.active = true;
            fs.writeFileSync(path.join(processor.directory, `${processor.filename.split(".")[0]}.json`), JSON.stringify(settings, null, 2));
            processor.settings = settings;
            processor.activate();
            if (processor.console && typeof(processor.console) === 'function') {
              processor.console();
            }
            instance.processors.set(args.processor, processor);
          } catch(e) {
            vorpal.log(instance.translate("bot.processor_activated_error", {
              name: processor.name,
              e: e
            }));
          }

        }
      }
      vorpal.log(instance.translate("bot.processors_activated"));
        callback()
    });
    vorpal
        .command('service-info <service>', instance.translate("bot.service_info_desc"))
        .action((args, callback) => {
          var service = instance.services.get(args.service);
          if (!service) {
            vorpal.log(instance.translate("bot.service_name_invalid"));
          } else {
            vorpal.log(marked(service.readme));
          }
            callback()
        });

    vorpal
        .command('services', instance.translate("bot.services_desc"))
        .action((args, callback) => {
          const table = new AsciiTable(instance.translate("bot.services"));
          table.setHeading(instance.translate("bot.service"), instance.translate("bot.status"));
          for (const [key, value] of instance.services.entries()) {
            table.addRow(value.name, (value.settings.active ? instance.translate("bot.active") : instance.translate("bot.inactive")));
          }
          vorpal.log(table.toString());
            callback()
        });

    vorpal
        .command('reload-service <service>', instance.translate("bot.service_reload_desc"))
        .action((args, callback) => {
          var service = instance.services.get(args.service);
          if (!service) {
            vorpal.log(instance.translate("bot.service_name_invalid"));
          } else {
            if (service.settings.active) {
              service.deactivate();
            }
            instance.services.delete(args.service);
            delete require.cache[require.resolve(path.join(service.directory, service.filename))];
            delete require.cache[require.resolve(path.join(service.directory, `${service.filename.split(".")[0]}.json`))];
            var readme = fs.readFileSync(path.join(service.directory, `README.md`), 'utf8');
            let dir = service.directory;
            let file = service.filename;
            service = require(path.join(dir, file));
            service.directory = dir;
            service.filename = file;
            service.settings = require(path.join(dir, `${file.split(".")[0]}.json`));
            service.readme = readme;
            if (service.settings.active) {
              service.activate();
              if (service.console && typeof(service.console) === 'function') {
                service.console();
              }
            }
            instance.services.set(args.service, service);
            vorpal.log(instance.translate("bot.reloaded_service"))
          }
            callback()
        });

    vorpal
        .command('activate-service <service>', instance.translate("bot.service_activate_desc"))
        .action((args, callback) => {
          var service = instance.services.get(args.service);
          if (!service) {
            vorpal.log(instance.translate("bot.service_name_invalid"));
          } else {
            if (service.settings.active) {
              vorpal.log(instance.translate("bot.service_already_active"));
            } else {
              try {
                delete require.cache[require.resolve(path.join(service.directory, `${service.filename.split(".")[0]}.json`))];
                var settings = require(path.join(service.directory, `${service.filename.split(".")[0]}.json`));
                settings.active = true;
                fs.writeFileSync(path.join(service.directory, `${service.filename.split(".")[0]}.json`), JSON.stringify(settings, null, 2));
                service.settings = settings;
                service.activate();
                if (service.console && typeof(service.console) === 'function') {
                  service.console();
                }
                instance.services.delete(args.service);
                instance.services.set(args.service, service);
                vorpal.log(instance.translate("bot.service_activated"));
              } catch(e) {
                vorpal.log(instance.translate("bot.service_activated_error", {
                  name: service.name,
                  e: e
                }));
              }
            }
          }
            callback()
        });

    vorpal
        .command('deactivate-service <service>', instance.translate("bot.service_deactivate_desc"))
        .action((args, callback) => {
          var service = instance.services.get(args.service);
          if (!service) {
            vorpal.log(instance.translate("bot.service_name_invalid"));
          } else {
            if (!service.settings.active) {
              vorpal.log(instance.translate("bot.service_already_inactive"));
            } else {
              try {
                service.deactivate();
                delete require.cache[require.resolve(path.join(service.directory, `${service.filename.split(".")[0]}.json`))];
                var settings = require(path.join(service.directory, `${service.filename.split(".")[0]}.json`));
                settings.active = false;
                fs.writeFileSync(path.join(service.directory, `${service.filename.split(".")[0]}.json`), JSON.stringify(settings, null, 2));
                service.settings = settings;
                instance.services.delete(args.service);
                instance.services.set(args.service, service);
                vorpal.log(instance.translate("bot.service_deactivated"));
              } catch(e) {
                vorpal.log(instance.translate("bot.service_deactivated_error", {
                  name: service.name,
                  e: e
                }));
              }
            }
          }
            callback()
        });
    vorpal
        .command('deactivate-all-services', instance.translate("bot.deactivate_all_services_desc"))
        .action((args, callback) => {
          for (const [key, value] of instance.services.entries()) {
            var service = value;
            if (service.settings.active) {
              try {
                service.deactivate();
                delete require.cache[require.resolve(path.join(service.directory, `${service.filename.split(".")[0]}.json`))];
                var settings = require(path.join(service.directory, `${service.filename.split(".")[0]}.json`));
                settings.active = false;
                fs.writeFileSync(path.join(service.directory, `${service.filename.split(".")[0]}.json`), JSON.stringify(settings, null, 2));
                service.settings = settings;
                instance.services.delete(args.service);
                instance.services.set(args.service, service);
              } catch(e) {
                vorpal.log(instance.translate("bot.service_deactivated_error", {
                  name: service.name,
                  e: e
                }));
              }

            }
          }
          vorpal.log(instance.translate("bot.services_deactivated"));
            callback()
        });
    vorpal
        .command('activate-all-services', instance.translate("bot.activate_all_services_desc"))
        .action((args, callback) => {
          for (const [key, value] of instance.services.entries()) {
            var service = value;
            if (!service.settings.active) {
              try {
                delete require.cache[require.resolve(path.join(service.directory, `${service.filename.split(".")[0]}.json`))];
                var settings = require(path.join(service.directory, `${service.filename.split(".")[0]}.json`));
                settings.active = true;
                fs.writeFileSync(path.join(service.directory, `${service.filename.split(".")[0]}.json`), JSON.stringify(settings, null, 2));
                service.settings = settings;
                service.activate();
                if (service.console && typeof(service.console) === 'function') {
                  service.console();
                }
                instance.services.delete(args.service);
                instance.services.set(args.service, service);
              } catch(e) {
                vorpal.log(instance.translate("bot.service_activated_error", {
                  name: service.name,
                  e: e
                }));
              }

            }
          }
          vorpal.log(instance.translate("bot.services_activated"));
            callback()
        });
};

Bot.prototype.defaultFallbackLocalization = () => {
  localizify.add('en', {
    "processors": {
      "chatlog": {
        "activated": "Chatlog Processor Activated.",
        "deactivated": "Chatlog Processor Deactivated."
      },
      "jsoncommands":{
        "plugins":{
          "create":{
            "exists_error" : "{com} already exists!",
            "error_writing": "Error writing {fileName} : {error}",
            "no_args":"You didn't specify a response",
            "created": "Command: {com} , has been added.",
            "activated": "jsoncommands - Create plugin has been Activated.",
            "deactivated": "jsoncommands - Create plugin has been Activated."
          },
          "edit":{
            "edited":"Command {command}, has been edited.",
            "error_writing": "Error writing {fileName} : {error}",
            "no_args":"You didn't specify a response",
            "no_command":"{command} doesn't exist or is a pre-installed command",
            "activated": "jsoncommands - Edit Plugin Activated",
            "deactivated": "jsoncommands - Edit Plugin Deactivated"
          },
          "delete":{
            "no_command":"{command} doesn't exist or is a pre-installed command",
            "error_writing": "Error writing {fileName} : {error}",
            "deleted":"Command {command}, has been deleted",
            "activated":"jsoncommands - Delete Plugin Activated",
            "deactivated": "jsoncommands - Delete Plugin Deactivated"
          }
        },
        "activated": "Json Commands has been Activated.",
        "deactivated": "Json Commands has been Deactivated.",
        "no_command": "{command} doesn't exist or is a pre-installed command",
        "existsError": "{com} already exists!",
        "no_args" : "You didn't specify a response",
        "errorEditing": "You didn't specify what you'd like to edit the command to.",
        "errorWriting": "Error writing {fileName} : {error}",
        "created": "Command: {command}, has been added.",
        "edited": "Command {command}, has been edited.",
        "deleted": "Command {command}, has been deleted"
      },
      "user_info":
      {
        "activated": "User Information has been Activated",
        "deactivated" : "User Information has been Deactivated",
        "plugins":
        {
          "adding":
          {
            "error_user": "Please @ a user to give them points. ex: !add @user 1000",
            "success": "{user} has added {ammount} points to {receiver} balance. They now have: {points} points",
            "activated": "Add Plugin activated",
            "deactivated": "Add Plugin deactivated"
          },
          "give":
          {
            "success": "{user} has given {ammount} points to {receiver}",
            "insufficient_funds": "{user} you do not have enough points to give away. Please do !points to see your current points.",
            "negative": "You cannot give a user negative points.",
            "error_user": "Please @ a user to give them points. ex: !give @user 1000",
            "activated": "Give Plugin activated",
            "deactivated": "Give Plugin deactivated"
          },
          "points":
          {
            "activated": "Points Plugin has been activated",
            "deactivated": "Points Plugins has been deactivated",
            "message": "@{user} has {points} points."
          },
          "level":
          {
            "activated": "Level Plugin has been activated",
            "deactivated": "Level Plugins has been deactivated",
            "message": "@{user} is level: {level} (XP: {xp}/{goal})."
          },
          "seen":
          {
            "activated": "Seen Plugin Activated",
            "deactivated":"Seen Plugin Deactivated",
            "message": "@{user} was last seen: {seen}",
            "no_args":"You didn't specify a user."
          }
        }
      }
    },
    "plugins": {
      "8ball":
      {
        "activated": "8-Ball Plugin Activated",
        "deactivated": "8-ball Plugin Deactivated"
      },
      "alerts":
      {
        "activated" : "Alerts have been Activated",
        "deactivated" : "Alerts have been Deactivated",
        "error_writing" : "Error writing {fileName} : {error}"
      },
      "bot": {
        "activated": "Bot Information Plugin Activated",
        "deactivated": "Bot Information Plugin Deactivated",
        "findme": "@{user} Hey!, you can find me on https://github.com/Bioblaze/TrovoBot",
        "questions": "@{user} If you would like to meet me in person or have other questions, feel free to contact us at https://discord.gg/Kc7fyx2",
        "wiki": "@{user} Read our commands Wiki for more information on what they do at https://github.com/Bioblaze/TrovoBot/wiki/Default-Commands",
        "consolecommand": "This bot was created by Bioblaze Payne",
        "consolecommanddesc": "Tells you information about the Bot itself."
      },
      "casino": {
        "activated": "Casino Games Pack Activated",
        "deactivated": "Casino Games Pack Deactivated",
        "message": "Welcome to the casino, check out our games: Blackjack, dice, slots & wheel.",
        "plugins":
        {
          "blackjack":
          {
            "activated": "Casino - Blackjack Game Activated",
            "deactivated": "Casino - Blackjack Game Deactivated",
            "you_lost": "Unfortunately you lost.",
            "player_blackjack": "Blackjack! You have earned {playerBet} points.",
            "player_hand": "Your hand: ${cards} (Total: ${total})",
            "dealer_hand": "Dealers Hand: {dealer_hand}",
            "dealerfinishdraw" : "The dealer has finished drawing cards and his hand contains: {dealerHandString}(Total: {dealerTotalH})",
            "dealer_blackjack": "Dealer Blackjack! You lose",
            "dealer_bust": "Dealer's hand passed 21. You won {playerBetH} Points.",
            "instructions": "Please use '!blackjack stand' to keep your hand as is or '!blackjack hit' to be dealt an additional card.",
            "draw": "The results are equal. You got your points back.",
            "win": "Congratulations, You won {playerBetH} points.",
            "no_points": "You don't have enough points to play.",
            "new_hand": "Your new hand: {handString} (Total: {playerTotalH})",
            "error_bet": "Please enter a valid number.",
            "progress": "Please finish the game you started first.",
            "banned": "We are sorry, you have been banned from our casino."
          },
          "dice":
          {
            "activated": "Casino - Dice Game Activated",
            "deactivated": "Casino - Dice Game Deactivated",
            "error_bet": "Please enter a valid number.",
            "banned": "We are sorry, you have been banned from our casino. @{user}",
            "balance": "You don't have enough points to play. @{user}",
            "min_bet": "Please enter a valid bet amount. Minimum amount is 20 points. @{user}",
            "results": "Dice you rolled: {playerDice1}, {playerDice2} (Total: {playerTotal}).\nCasino dice: {dealerDice1}, {dealerDice2} (Total: {dealerTotal}).",
            "lose": "Unfortunately you lost @{user}",
            "draw": "The results are equal. You got your points back. @{user}",
            "win":"Congratulations, You won {playerBetH} points. @{user}"
          },
          "gamble":
          {
            "activated": "Casino - Gamble Game Activated",
            "deactivated": "Casino - Gamble Game Deactivated",
            "error_bet": "Please enter a valid number or all.",
            "banned": "We are sorry, you have been banned from our casino. @{user}",
            "balance": "You don't have enough points to gamble. @{user}",
            "min_bet": "Please enter a valid gamble amount. Minimum amount is 100 points. @{user}",
            "win":"Congratulations, You won {win} points. @{user}"
          },
          "slots":
          {
            "activated": "Casino - Slots Game Activated",
            "deactivated": "Casino - Slots Game Deactivated",
            "banned": "We are sorry, you have been banned from our casino. @{user}",
            "error_bet":"Please enter a valid number.",
            "balance":"You don't have enough points to play. @{user}",
            "min_bet":"Please enter a valid bet amount. Minimum amount is 100 points. @{user}",
            "win": "Congratulations, You won {playerBet} points. @{user}"
          },
          "wheel":
          {
            "activated":"Casino - Wheel Game Activated",
            "deactivated": "Casino - Wheel Game Deactivated",
            "banned":"We are sorry, you have been banned from our casino. @{user}",
            "typo": "Correct Usage: !wheel <bet amount> <1, 2, 5, 10, 20> @{user}",
            "balance":"You don't have enough points to play. @{user}",
            "min_bet":"Please enter a valid bet amount. Minimum amount is 100 points. @{user}",
            "spun": "The wheel has been spun and it points ${wheel}. @{user}",
            "win":"Congratulations, You won {playerBet} points. @{user}",
            "lose":"Unfortunately you lost @{user}"
          }
        }
      },
      "google": {
        "activated": "Google search has been Activated",
        "deactivated": "Google search has been Deactivated",
        "processed": "@{user} - {result}",
        "args": "Example Usage: = !google search <word> , !google random"
      },
      "gamep": {
        "activated": "game picker has been Activated",
        "deactivated": "game picker has been Deactivated",
        "processed": "@{user} randomly picked {result}",
        "incorrect": "@{user} incorrect argument user must use 'pick' to initiate game randomizer"
      },
      "hydrate": {
        "activated": "Hydrate has been Activated",
        "deactivated": "Hydrate has been Deactivated",
        "error": "Hydrate Error: {error}",
        "start": "Great, I will make sure the streamer stays hydrated! 💧",
        "interval": "Streamer, I recommend you drink some water! I will remind you again in 30 minutes"
      },
      "instagram": {
        "activated": "IG has been Activated",
        "deactivated": "IGhas been Deactivated",
        "error": "IG Error: {error}",
        "info": "@{user} streamer's latest instagram post - https://www.instagram.com/p/{result}"
      },
      "shoutout": {
        "activated": "Shout-out has been Activated",
        "deactivated": "Shout-out has been Deactivated",
        "mentionuser": "Check out {mention} at https://trovo.live/{user} - They are an awesome streamer and deserve some community love!",
        "mentionaccount": "Check out {account} at https://trovo.live/{account} - They are an awesome streamer and deserve some community love!",
        "args": "Example Usage: = !so default <username> , !so raid <username>",
        "raid": "This is a raid. Go to the channel of @{raidedChannel} now. --> https://trovo.live/{raidedChannel}",
        "undefined": "Username is missing. Try again"
      },
      "say": {
        "activated": "Say has been Activated",
        "deactivated": "Say has been Deactivated",
        "nomessage": "You have to put a message."
      },
      "ping": {
        "activated": "Ping has been Activated",
        "deactivated": "Ping has been Deactivated",
        "pong": "@{user} Pong I dare say."
      },
      "time":
      {
        "activated":"Time Plugin has been Activated",
        "deactivated": "Time Plugin has been Deactivated",
        "message" : "The streamers local time is: {time}"
      },
      "poll": {
        "activated": "Poll System aktivated",
        "deactivated": "Poll System Deactivated",
        "permissions": "You don't have permission to do that!",
        "pollstarted": "Poll started, type !poll {votelist}",
        "startUsage": "Usage: !poll start <voteItem1> <voteItem2> ...",
        "pollRunning": "Poll already running",
        "pollstopped": "Poll is finished. Winner is:",
        "results": "{voteItem}: {votes}",
        "pollNotRunning": "There is no poll running!",
        "alreadyVoted": "Only 1 vote for each User. @{user}",
        "startFailed": "The start failed, please try again",
        "missingargs": "Usage: !poll <voteItem> | getList | Moderator & creator: {commandlist}",
        "somethingsWrong": "Something went wrong try again or contact the Streamer or the Mods",
        "itemNotInList": "{item} is not in the Votelist. Type: !poll getList to see a list of items to vote for",
        "sameValues": "Vote items can't be the same Values poll will be reseted",
        "uservoted": "Thanks for Voting. @{user}",
        "voteReseted": "The vote has stopped and the List was cleared!",
        "winner": "{name} with {votes} votes!"
      },
      "urbandictionary": {
        "activated": "Urbandictionary has been Activated",
        "deactivated": "Urbandictionary has been Deactivated",
        "error": "Urbandictionary Error: {error}",
        "info": "@{user} {word} - {definition}"
      },
      "warzone": {
        "activated": "Warzone Stats has been Activated",
        "deactivated": "Warzone Stats has been Deactivated",
        "error": "Warzone Stats Error: {error}",
        "info": "@{user} Here are my Warzone Stats:\r Kills: {kills}\r Deaths: {deaths}\rK/D Ratio: {kdr}\rWins: {wins}\r Top 5 Placements: {top5}\r Top 10 Placements: {top10}\r I played {totma} rounds\r On average I live for: {avgLife}\r I am currently level {level}"
      },
      "xkcd": {
        "activated": "XKCD has been Activated",
        "deactivated": "XKCD has been Deactivated",
        "error": "XKCD Error: {error}",
        "processed": "@{user} - {result}"
      },
      "giveaway": 
      {
        "activated": "Giveaway activated",
        "deactivated": "Giveaway deactivated",
        "started": "Giveaway started you have {h}:{m}:{s} to type !join",
        "runningGiveaway": "You still have time to type !join",
        "winner": "The Giveaway winner is {user}",
        "noOneJoined": "No one Joined the Giveaway",
        "noTime": "You need to set a Time for the Giveaway",
        "userExists": "You can only join the Giveaway 1 Time",
        "userJoined": "User {username} joined the Giveaway",
        "notRunning": "There is no Giveaway at the moment"
      }
    },
    "services": {
      "discordrpc": {
        "activated": "Discord RPC Service Activated",
        "deactivated": "Discord RPC Service Deactivated",
        "rpcerror": "Issue with Discord RPC, is Discord Connected?\r\nError: {error}",
        "clearerr": "Issue Clearing the Activity for Discord RPC.\r\nError: {error}",
        "streamstopped": "Stream has stopped, Clearing the Discord RPC Activity.",
        "seterr": "Issue setting the Activity in Discord RPC.\r\nError: {error}"
      },
      "obs": {
        "activated": "OBS Service Activated",
        "deactivated": "OBS Service Deactivated",
        "connected": "Connected to OBS",
        "retry_attempt": "Unable to connect to OBS. Attempting to reconnect: {count} of {max}",
        "stopping_retry": "Stopping OBS connection attempts",
        "no_source": "Couldn't find Source: {source} in Scene: {scene}"
      },
      "slobs":
      {
        "activated": "SLOBS Service Activated",
        "deactivated": "SLOBS Service Deactivated",
        "error": "Slobs Error: {error}",
        "close": "Slobs Closed. Reason: {close}",
        "connected": "Connected to SLOBS"
      },
      "http": {
        "activated": "HTTP Overlay Module Started on Port({settings.port})",
        "deactivated": "HTTP Overlay has Shut down.",
        "failed_route": "[HTTP] ({route}) {pageID}.json is not found, does it exist at {location}?\r\nError: {error}"
      }
    },
    "bot": {
      "cooldown": "Hold-on for {timeLeft} more second(s) before reusing the `{name}` command.",
      "missing_permissions": "You do not have permission to use this command. Sorry.",
      "cmd_error": "Command Error({name}): {err}",
      "contact_creator": "There was a error with processing your Command. Please Contact Bioblaze Payne#6459 and let him know.",
      "process_error": "Processing Error: {err}",
      "lang_loaded": "Localization Files have been Loaded.....\r\nLocalization has been Set to: {lang}",
      "plugins": "PLUGINS",
      "plugin": "PLUGIN",
      "status": "STATUS",
      "state": "STATE",
      "plugin_load_access_error": "Error Accessing Plugin Directory ({directory})\r\nError: {err}",
      "plugin_unload_access_error": "Error Accessing a Plugin Directory ({directory})\r\nError: {err}",
      "active": "Active",
      "inactive": "In-active",
      "loaded": "LOADED",
      "plugin_load_try_error": "Error Attempting to Load Plugin({name}) located at: {dir}\r\nError: {err}",
      "plugin_unload_try_error": "Error Attempting to Load Plugin({name}) located at: {dir}\r\nError: {err}",
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
      "activate_all_plugins_desc": "Activates all Plugins.",
      "ready": "\r\nBot loaded and ready to mod!",
      "plugin_name_invalid": "No Plugin found by that name, please check your Spelling and try again.",
      "reloaded_plugin": "Reloaded Plugin~",
      "reloaded_chat_plugin": "Reloaded Chat Plugin~",
      "reloaded_plugin_added_chat": "Loaded Reloaded Plugin into Chat Commands..",
      "no_plugins_loaded": "No Plugins Loaded into the System.",
      "no_processors_loaded": "No Processors Loaded into the System.",
      "no_services_loaded": "No Services Loaded into the System.",
      "clear_console": "Will clear all the Console leaving only the Commandline Prompt for Trovobot",
      "plugin_already_active": "Plugin already Active, cannot active plugin.",
      "plugin_activated": "Activated Plugin, and updated Settings file for the Plugin.",
      "plugin_activated_error": "Error while trying to Activate Plugin({name})\r\nError: {e}",
      "plugin_already_inactive": "Plugin already Inactive, cannot deactivate plugin.",
      "plugin_deactivated": "Deactivated Plugin, and updated Settings file for the Plugin.",
      "plugin_deactivated_error": "Error while trying to Deactivate Plugin({name})\r\nError: {e}",
      "plugins_deactivated": "All Plugins Deactivated, and updated the Settings file for each Plugin.",
      "plugins_activated": "All Plugins Activated, and updated the Settings file for each Plugin.",
      "processor_info_desc": "Gives you information on a Processor within the System~",
      "processors_desc": "Displays a List of all Processors within Trovobot, that are LOADED.",
      "processor_reload_desc": "Reloads a specific Processor.",
      "processor_activate_desc": "Activates a Processor.",
      "processor_deactivate_desc": "Deactivates a Processor.",
      "deactivate_all_processors_desc": "Deactivates all Processors.",
      "activate_all_processors_desc": "Activates all Processors.",
      "processor_already_active": "Processor already Active, cannot active processor.",
      "processor_activated": "Activated Processor, and updated Settings file for the Processor.",
      "processor_activated_error": "Error while trying to Activate Processor({name})\r\nError: {e}",
      "processor_already_inactive": "Processor already Inactive, cannot deactivate processor.",
      "processor_deactivated": "Deactivated Processor, and updated Settings file for the Processor.",
      "processor_deactivated_error": "Error while trying to Deactivate Processor({name})\r\nError: {e}",
      "processors_deactivated": "All Processors Deactivated, and updated the Settings file for each Processor.",
      "processors_activated": "All Processors Activated, and updated the Settings file for each Processor.",
      "reloaded_processor": "Reloaded Processor~",
      "processor_name_invalid": "No Processor found by that name, please check your Spelling and try again.",
      "service_info_desc": "Gives you information on a Service within the System~",
      "services_desc": "Displays a List of all Services within Trovobot, that are LOADED.",
      "service_reload_desc": "Reloads a specific Service.",
      "service_activate_desc": "Activates a Service.",
      "service_deactivate_desc": "Deactivates a Service.",
      "deactivate_all_services_desc": "Deactivates all Services.",
      "activate_all_services_desc": "Activates all Services.",
      "service_already_active": "Service already Active, cannot active service.",
      "service_activated": "Activated Service, and updated Settings file for the Service.",
      "service_activated_error": "Error while trying to Activate Service({name})\r\nError: {e}",
      "service_already_inactive": "Service already Inactive, cannot deactivate service.",
      "service_deactivated": "Deactivated Service, and updated Settings file for the Service.",
      "service_deactivated_error": "Error while trying to Deactivate Service({name})\r\nError: {e}",
      "services_deactivated": "All Services Deactivated, and updated the Settings file for each Service.",
      "services_activated": "All Services Activated, and updated the Settings file for each Service.",
      "reloaded_service": "Reloaded Service~",
      "service_name_invalid": "No Service found by that name, please check your Spelling and try again.",
      "setlang_console": "Sets the Language in the System",
      "setlang_invalid": "That is a invalid Language Option please try one of these Options: {langs}",
      "setlang_switch": "Changed Language to ({to}) from Language ({from})",
      "getlang_console": "Displays all Available Languages in the System",
      "getlang_options": "Available Language Options: {langs}",
      "setlang_saved": "Settings file has been updated.",
      "setlang_save_error": "Attempting to Update Settings failed\r\nError: {e}",
      "what_email": "What is the Email of the Bot Account?",
      "what_password": "What is the Password of the Bot Account?",
      "what_name": "What is the Name of the Bot Account?",
      "what_page": "What is the URL/PAGE for the Streamer the Bot is Monitoring?",
      "what_prefix": "What is the Prefix of the Bot Account?",
      "what_lang": "What is the Default Language of the Bot Account? Available Langs: {langs}",
      "acceptable_languages": "Only Languages Known: {langs}",
      "setup_complete": "Setup has Completed, Settings are saved..",
      "setup_error_save": "Failed to Setup and Save Settings\r\nError: {e}",
      "setup_failed": "Failed to Setup\r\nError: {err}",
      "setup_console": "Allows you to Setup the Settings.json from the Console directly."
    }
  }
  );
}

module.exports = (() => {
  if (!instance) instance = new Bot();
  return instance;
})();
