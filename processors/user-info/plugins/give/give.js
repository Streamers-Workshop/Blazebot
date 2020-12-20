const Bot = require('../../../../modules/Bot.js');
var path = require('path');
var userInfo = null;

module.exports = {
    name: 'give',
    description: "Gives points from one user to another",
    author: "Krammy, Revised by: Praxem",
    license: "Apache-2.0",
    command: 'give',
    permissions: [], // This is for Permissisons depending on the Platform.
    cooldown: 10, // this is Set in Seconds, how long between the next usage of this command.
    execute(client, data) {
        if (data.args.length > 0 && data.args[0].charAt(0) == '@') {
            if (data.args[1] !== undefined) {
                var pointsGave = parseInt(data.args[1]);

                if ( !isNaN(pointsGave) && userInfo[data.user].points >= pointsGave && pointsGave > 0 ) {

                    userInfo[data.user].points = userInfo[data.user].points - pointsGave;

                    userInfo[data.args[0].substr(1)].points = userInfo[data.args[0].substr(1)].points + pointsGave;

                    client.sendMessage(Bot.translate("processors.user_info.plugins.give.success",
                        {
                            user: data.user,
                            receiver: data.args[0],
                            ammount: data.args[1]
                        }));
                }
                else if (pointsGave < 1) {
                    client.sendMessage(Bot.translate("processors.user_info.plugins.give.negative"));
                }
                else if (pointsGave < userInfo[data.user].points) {
                    client.sendMessage(Bot.translate("processors.user_info.plugins.give.insufficient_funds", {
                        user: data.user[0]
                    }));
                }
            }
        }
        else {
            client.sendMessage(Bot.translate("processor.user_info.plugins.give.error_user"));
        }
    },
    activate() {
        userInfo = require(path.join(Bot.data, "users/users.json"));
        Bot.log(Bot.translate("processors.user_info.plugins.give.activated"))
    },
    deactivate() {
        userInfo = null;
        Bot.log(Bot.translate("processors.user_info.plugins.give.deactivated"))
    }
};
