const Bot = require('../../../../modules/Bot.js');
var path = require('path');
var userInfo = null;

module.exports = {
    name: 'hug',
    description: "Directs the bot who to hug",
    author: "Praxem",
    license: "Apache-2.0",
    command: 'hug', // This is the Command that is typed into Chat!
    permissions: [], // This is for Permissisons depending on the Platform. 'moderator' or 'creator'
    cooldown: 1, // this is Set in Seconds, how long between the next usage of this command.
    execute(client, data) {

        if (data.args.length > 0 && data.args[0].charAt(0) == '@') {
            client.sendMessage(`${data.user} gives a hug to ${data.args[0]}!`);
        }
        else {
            client.sendMessage(`${Bot.settings.trovo.page.substring(Bot.settings.trovo.page.lastIndexOf("/") + 1)} gives ${data.user} a hug!`);
        }
    },
    activate() {
        userInfo = require(path.join(Bot.data, "users/users.json"));
        Bot.log(Bot.translate("processors.user_info.plugins.hug.activated"));
    },
    deactivate() {
        userInfo = null;
        Bot.log(Bot.translate("processors.user_info.plugins.hug.deactivated"));
    }
};
