const Bot = require('../../../../modules/Bot.js');
var path = require('path');
var userInfo = null;

module.exports = {
    name: 'add',
    description: "Returns how many points a user has",
    author: "Krammy, Revised by: Praxem",
    license: "Apache-2.0",
    command: 'add', // This is the Command that is typed into Chat!
    permissions: ['creator'], // This is for Permissisons depending on the Platform. 'creator', 'moderator'
    cooldown: 10, // this is Set in Seconds, how long between the next usage of this command.
    execute(client, data) {
        if (data.args.length > 0 && data.args[0].charAt(0) == '@') {
            if (data.args[1] !== undefined) {

                var userPoints = userInfo[data.args[0].substr(1)].points;
                userInfo[data.args[0].substr(1)].points = userPoints + parseInt(data.args[1]);

                client.sendMessage(Bot.translate("processors.user_info.plugins.adding.success",
                    {
                        user: data.user,
                        receiver: data.args[0],
                        ammount: data.args[1],
                        points: userPoints
                    }));
                Bot.log(`${data.user} gave ${data.args[0].substr(1)} ${data.args[1]} points`);
            }
        }
        else {
            client.sendMessage(Bot.translate("processors.user_info.plugins.adding.error_user"));
        }
    },
    activate() {
        userInfo = require(path.join(Bot.data, "users/users.json"));
        Bot.log(Bot.translate("processors.user_info.plugins.adding.activated"))
    },
    deactivate() {
        userInfo = null;
        Bot.log(Bot.translate("processors.user_info.plugins.adding.deactivated"))
    }
};
