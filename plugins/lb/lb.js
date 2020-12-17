const Bot = require("../../modules/Bot.js");
var userInfo = {};
var arrayValues = [];
var leaderboard = ["1st", "2nd", "3rd"];

function displayLeaderboard(client, setValue) {
  for (var users in userInfo) {
    arrayValues.push([users, userInfo[users].points, userInfo[users].level]);
  }

  if (arrayValues.length < 3) {
    client.sendMessage(Bot.translate("plugins.leaderboard.enoughUsers"));
  } else {
    arrayValues.sort((a, b) => b[setValue] - a[setValue]);
    arrayValues.splice(3, arrayValues.length);

    var result = "";
    for (var i = 0; i < leaderboard.length; i++) {
      if (setValue === 1) {
        result +=
          leaderboard[i] +
          " - " +
          arrayValues[i][0] +
          " : " +
          arrayValues[i][setValue] +
          " Points | ";
      } else {
        result +=
          leaderboard[i] +
          " - " +
          arrayValues[i][0] +
          " : " +
          " Level " +
          arrayValues[i][setValue] +
          " | ";
      }
    }
    client.sendMessage(
      Bot.translate("plugins.leaderboard.lbOutput", { resultOutput: result })
    );
    arrayValues.splice(0, arrayValues.length);
  }
}

module.exports = {
  name: "Leaderboard",
  description: "Shows who has the highest points",
  author: "Made by IAmNotTheLeo",
  license: "Apache-2.0",
  command: "lb",
  permissions: ["creator"],
  cooldown: 5,
  execute(client, data) {
    switch (data.args[0]) {
      case "points":
      case "Points":
        displayLeaderboard(client, 1);
        break;

      case "level":
      case "Level":
        displayLeaderboard(client, 2);
        break;

      default:
        client.sendMessage(Bot.translate("plugins.leaderboard.typeData"));
        break;
    }
  },
  activate() {
    userInfo = require("../../data/users/users.json");
    Bot.log(Bot.translate("plugins.leaderboard.activated"));
  },
  deactivate() {
    userInfo = {};
    Bot.log(Bot.translate("plugins.leaderboard.deactivated"));
  },
};
