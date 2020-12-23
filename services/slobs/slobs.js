const SlobsJS = require("slobs.js");
const Bot = require("../../modules/Bot");
var settings = null;
var slobs = new SlobsJS();

module.exports = {
  name: "slobs-controller",
  description: "Provides a SLOBS Intergration & Control to Trovobot.",
  author: "Krammy <krammy_ie@outlook.com> (https://github.com/kramitox)",
  license: "Apache-2.0",
  output() {
    if (slobs.getConnected()) {
      return slobs;
    } else return null;
  },
  activate() {
    Bot.log(Bot.translate("services.slobs.activated"));
    settings = require("./slobs.json");
    slobs.login(settings.ip, settings.token);
    slobs.addListener("connected", () => {
      Bot.log(Bot.translate("services.slobs.connected"));
    });
    slobs.addListener("close", (a) => {
      Bot.log(
        Bot.translate("services.slobs.close", {
          close: a,
        })
      );
    });
    slobs.addListener("error", (a) => {
      Bot.log(
        Bot.translate("services.slobs.error", {
          error: a,
        })
      );
    });
  },
  deactivate() {
    Bot.log(Bot.translate("services.slobs.deactivated"));
    slobs.removeListener("close", (a) => {
      Bot.log(
        Bot.translate("services.slobs.close", {
          close: a,
        })
      );
    });
    slobs.removeListener("error", (a) => {
      Bot.log(
        Bot.translate("services.slobs.error", {
          error: a,
        })
      );
    });
    slobs = null;
    settings = null;
  },
};
