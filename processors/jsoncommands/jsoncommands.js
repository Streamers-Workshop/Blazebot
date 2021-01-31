const fs = require("fs");
const path = require("path");
const util = require("util"); // eslint-disable-line
const Handlebars = require("handlebars");

const Bot = require("../../modules/Bot.js");

//APACHE 2.0 LICENSE: https://spdx.org/licenses/Apache-2.0.html#licenseText
var settings = {};

module.exports = {
  name: "json-commands",
  description: "Allows for the use of commands from a json file.",
  author:
    "Bioblaze Payne <bioblazepayne@gmail.com> (https://github.com/Bioblaze)",
  license: "Apache-2.0",
  activate() {
    if (fs.existsSync(path.join(__dirname, "plugins"))) {
      Bot.loadPlugins(path.join(__dirname, "plugins"));
    }
    settings = require("./jsoncommands.json");
    Bot.log(Bot.translate("processors.jsoncommands.activated"));
  },
  deactivate() {
    if (fs.existsSync(path.join(__dirname, "plugins"))) {
      Bot.unloadPlugins(path.join(__dirname, "plugins"));
    }
    settings = {};
    Bot.log(Bot.translate("processors.jsoncommands.deactivated"));
  },
  process(data, client, callback) {
    if (typeof data.content === "string") {
      var firstChar = data.content.charAt(0);
      var args = data.content.slice(Bot.settings.prefix.length).split(/ +/);
      var commandName = args[0].toLowerCase();

      if (
        Bot.settings.prefix == firstChar &&
        settings.commands[commandName] !== undefined
      ) {
        var template = Handlebars.compile(settings.commands[commandName]);
        client.sendMessage(
          template({
            data: data,
            settings: settings,
          })
        );
      } else {
        callback(null, false);
      }
    }
  },
};
