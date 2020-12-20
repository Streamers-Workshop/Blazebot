const Bot = require('../../../../modules/Bot.js');
var path = require('path');
var userInfo = null;

module.exports = {
  name: 'points', // Name of the Plugin
  description: "Returns how many points a user has",
  author: "Krammy",
  license: "Apache-2.0",
  command: 'points', // This is the Command that is typed into Chat!
  permissions: [], // This is for Permissisons depending on the Platform.
  cooldown: 10, // this is Set in Seconds, how long between the next usage of this command.
  execute(client, data) {
    if (data.args.length > 0 && data.args[0].charAt(0) == '@')
    {
        client.sendMessage(Bot.translate("processors.user_info.plugins.points.message", {
            user: data.args[0].substr(1),
            points: userInfo[data.args[0].substr(1)].points
          }));
    }
    else
    {
        client.sendMessage(Bot.translate("processors.user_info.plugins.points.message", {
            user: data.user,
            points: userInfo[data.user].points
          }));
    }
  },
  activate() {
    userInfo = require(path.join(Bot.data, "users/users.json"));
    Bot.log(Bot.translate("processors.user_info.plugins.points.activated"))
  },
  deactivate() {
    userInfo = null;
    Bot.log(Bot.translate("processors.user_info.plugins.points.deactivated"))
  }
};
