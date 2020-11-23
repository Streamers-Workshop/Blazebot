const Bot = require("../../../../modules/Bot.js");

var settings = {};

module.exports = {
  name: "cmds",
  description: "Allows to display commands from jsonccommands file",
  author: "Made by chiLee98",
  license: "Apache-2.0",
  command: "cmds",
  cooldown: 10,
  execute(client) {
    var result = "";
    for (var command in settings.commands) {
      result += "!" + command + " , ";
    }
    client.sendMessage(
      Bot.translate("processors.jsoncommands.plugins.cmds.result", {
        commandList: result.replace(/,\s*$/, ""),
      })
    );
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
