const Bot = require("../../modules/Bot.js");

module.exports = {
    name: 'hug',
    description: "Directs the bot who to hug",
    author: "Praxem",
    license: "Apache-2.0",
    command: 'hug', 
    permissions: [], 
    cooldown: 1,
    execute(client, data) {

        if (data.args.length > 0 && data.args[0].charAt(0) == '@') {
            client.sendMessage(`@${data.user} gives a hug to @${data.args[0]}!`);
        }
        else {
            client.sendMessage(`${Bot.settings.trovo.page.substring(Bot.settings.trovo.page.lastIndexOf("/") + 1)} gives @${data.user} a hug!`);
        }
    },
    activate() {
        Bot.log(Bot.translate("processors.user_info.plugins.hug.activated"));
    },
    deactivate() {
        Bot.log(Bot.translate("processors.user_info.plugins.hug.deactivated"));
    }
};
