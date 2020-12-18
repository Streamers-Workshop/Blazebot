const Bot = require('../../../../modules/Bot.js');
var path = require('path');
var userInfo = null;


module.exports = {
    name: 'vip', // Name of the Plugin
    description: "Sets given viewer's vip status",
    author: "Praxem",
    license: "Apache-2.0",
    command: 'vip', // This is the Command that is typed into Chat!
    permissions: ['moderator', 'creator'], // This is for Permissisons depending on the Platform. 'moderator' or 'creator'
    cooldown: 1, // this is Set in Seconds, how long between the next usage of this command.
    execute(client, data) {
        var viewer;

        if (data.args.length > 0 && data.args[0].charAt(0) == '@') {
            viewer = data.args[0].substr(1);
            userInfo[viewer].vip = true;

            if (data.args[1] !== undefined && (data.args.length > 1 && data.args[1] === `revoke`)) {
                userInfo[viewer].vip = false;
            }
            Bot.log(`${viewer}`); Bot.log(`${userInfo[viewer].vip}`);
        }
        else {
            Bot.log(`Things did not go well in the vip plugin`);
        }
    },
    activate() {
        userInfo = require(path.join(Bot.data, "users/users.json"));
        Bot.log(Bot.translate("processors.user_info.plugins.vip.activated"))
    },
    deactivate() {
        userInfo = null;
        Bot.log(Bot.translate("processors.user_info.plugins.vip.deactivated"))
    }
};
