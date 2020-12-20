const Bot = require('../../../../modules/Bot.js');
var path = require('path');
var userInfo = null;

module.exports = {
  name: 'level', // Name of the Plugin
  description: "Returns how many points a user has",
  author: "Krammy",
  license: "Apache-2.0",
  command: 'level', // This is the Command that is typed into Chat!
  permissions: [], // This is for Permissisons depending on the Platform.
  cooldown: 10, // this is Set in Seconds, how long between the next usage of this command.
  execute(client, data) {
    Bot.log(data);
    if (data.args.length > 0 && data.args[0].charAt(0) == '@')
    {
        client.sendMessage(Bot.translate("processors.user_info.plugins.level.message", {
            user: data.args[0].substr(1),
            level: userInfo[data.args[0].substr(1)].level,
            xp: userInfo[data.args[0].substr(1)].xp.toString(),
            goal: userInfo[data.args[0].substr(1)].level * 50
          }));
    }
    else
    {
        client.sendMessage(Bot.translate("processors.user_info.plugins.level.message", {
            user: data.user,
            level: userInfo[data.user].level,
            xp: userInfo[data.user].xp.toString(),
            goal: userInfo[data.user].level * 50
          }));
    }
    
    
  },
  activate() {
    userInfo = require(path.join(Bot.data, "users/users.json"));
    Bot.log(Bot.translate("processors.user_info.plugins.level.activated"))
  },
  deactivate() {
    userInfo = null;
    Bot.log(Bot.translate("processors.user_info.plugins.level.deactivated"))
  }
};
