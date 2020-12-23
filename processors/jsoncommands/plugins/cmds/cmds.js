const { keyword } = require("chalk");
const Bot = require("../../../../modules/Bot.js");

var settings = {};

module.exports = {
  name: "cmds",
  description: "Allows to display command from jsonccommands file",
  author: "Made by IAmNotTheLeo",
  license: "Apache-2.0",
  command: "cmds",
  cooldown: 5,
  execute(client) {
    var result = "";
    var count = 0;
    for (var cmd in settings.commands) {
      result += "!" + cmd + " -> " + settings.commands[cmd] + "\n";
      count++;
    }
    if (count === 0) {
      Bot.log("No Commands available");
    } else {
      Bot.log(
        Bot.translate("processors.jsoncommands.plugins.cmds.result", {
          commandList: result,
        })
      );
    }
  },
  activate() {
    settings = require("../../jsoncommands.json");
    Bot.log(Bot.translate("processors.jsoncommands.plugins.cmds.activated"));
  },
  deactivate() {
    settings = {};
    Bot.log(Bot.translate("processors.jsoncommands.plugins.cmds.activated"));
  },
};
