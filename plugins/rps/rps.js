const Bot = require("../../modules/Bot.js");
const settings = require("./rps.json");
var userInfo = {};
var valuePoints = settings.points;

function rpsExecute(object, user, client) {
  var result =
    settings.objects[
      Math.floor(Math.random() * settings.objects.length - 1) + 1
    ];
  var balance = userInfo[user].points + valuePoints;

  if (result === object) {
    client.sendMessage(
      Bot.translate("plugins.rps.objectResultWin", {
        objectResult: result,
        playerUser: user,
        points: valuePoints,
        balancePoints: balance,
      })
    );
    userInfo[user].points += valuePoints;
  } else {
    client.sendMessage(
      Bot.translate("plugins.rps.objectResultLose", {
        objectResult: result,
        playerUser: user,
      })
    );
  }
}

module.exports = {
  name: "rps",
  description: "Rock, Paper, Scissors",
  author: "Created by chiLee98",
  license: "Apache-2.0",
  command: "rps", // This is the Command that is typed into Chat!
  cooldown: 5, // this is Set in Seconds, how long between the next usage of this command.
  execute(client, data) {
    var user = data.user;
    var inputValue = data.args[0];

    switch (inputValue) {
      case "Rock":
      case "rock":
        rpsExecute("Scissors", user, client);
        break;

      case "Paper":
      case "paper":
        rpsExecute("Rock", user, client);
        break;

      case "Scissors":
      case "scissors":
        rpsExecute("Paper", user, client);
        break;

      default:
        client.sendMessage(
          Bot.translate("plugins.rps.invalidData", { value: inputValue })
        );
        break;
    }
  },
  activate() {
    userInfo = require("../../data/users/users.json");
    Bot.log(Bot.translate("plugins.rps.activated"));
  },
  deactivate() {
    userInfo = {};
    Bot.log(Bot.translate("plugins.rps.deactivated"));
  },
};
