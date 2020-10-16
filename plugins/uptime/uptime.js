const Handlebars = require('handlebars');
const Bot = require('../../modules/Bot.js');
const obsSetting = require('../../services/obs/obs.json');
const uptimeSetting = require('./uptime.json');

module.exports = {
    name: 'uptime',
    description: "Gets how long you've been streaming for. Requires OBS Websocket plugin installed.",
    permissions: [],
    chat: true, // Defines this as a Chat Command
    event: false, // Is this a Event?
    command: 'uptime', // This is the Command that is typed into Chat!
    permissions: [], // This is for Permissisons depending on the Platform.
    cooldown: 10, // this is Set in Seconds, how long between the next usage of this command.
    credits: `Made by Wasfun based on Krammy's code.`, // MAKE SURE YOU FILL THIS IN GOD DAMNIT!
    execute(client) {
        if (obsSetting.active) {
            const obs = Bot.getService('obs-controller');
            obs.uptime().then(data => {
                if (data.streaming === true) {
                    const time = data.streamTimecode.split(':');
                    const uptime = `${time[0]}h, ${time[1]}min, ${time[2].substr(0, 2)}secs`;

                    var template = Handlebars.compile(uptimeSetting.message);
                    client.sendMessage(template({
                        uptime: uptime
                    }));
                }
                else {
                    client.sendMessage(`Not LIVE`);
                }
            }).catch(console.error);
        } else {
            Bot.log(Bot.translate("plugins.uptime.error"))
        }
    },
    activate() {
        Bot.log(Bot.translate("plugins.uptime.activated"))
    },
    deactivate() {
        Bot.log(Bot.translate("plugins.uptime.deactivated"))
    }
};