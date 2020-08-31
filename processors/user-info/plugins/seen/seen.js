const Bot = require('../../../../modules/Bot.js');
var path = require('path');
var userInfo = null;

module.exports = {
  name: 'seen', // Name of the Plugin
  description: "Returns how many points a user has",
  author: "Krammy",
  license: "Apache-2.0",
  command: 'seen', // This is the Command that is typed into Chat!
  permissions: [], // This is for Permissisons depending on the Platform.
  cooldown: 10, // this is Set in Seconds, how long between the next usage of this command.
  execute(client, data) {
    Bot.log(data);
    if (data.args.length > 0 && data.args[0].charAt(0) == '@')
    {
        client.sendMessage(Bot.translate("processors.user_info.plugins.seen.message", {
            user: data.args[0].substr(1),
            seen: userInfo[data.args[0].substr(1)].last_seen
          }));
    }
    else
    {
        client.sendMessage(Bot.translate("processors.user_info.plugins.seen.no_args"));
    }
    
    
  },
  activate() {
    
    userInfo = require(path.join(Bot.data, "users/users.json"));
    Bot.log(Bot.translate("processors.user_info.plugins.seen.activated"))
  },
  deactivate() {
    userInfo = null;
    Bot.log(Bot.translate("processors.user_info.plugins.seen.deactivated"))
  }
};
