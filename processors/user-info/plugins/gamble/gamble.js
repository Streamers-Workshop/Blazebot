const Bot = require('../../../../modules/Bot.js');
var path = require('path');
var userInfo = null;

function outcome() {
    var result = (Math.random() - Math.random());                        

    if (result <= 0.11) { return false; }
    //39.5% chance to win
    else if (result > 0.11) { return true; }
}

module.exports = {
    name: 'gamble',
    description: "Takes a given amount of points from user to gamble them",
    author: "Praxem",
    license: "Apache-2.0",
    command: 'gamble',
    permissions: [],
    cooldown: 1, // this is Set in Seconds, how long between the next usage of this command.
    execute(client, data) {
        if (data.args.length > 0) {
            var userPoints = userInfo[data.user].points;
            var bet = 0;

            if (data.args[0] === `all`) { bet = userInfo[data.user].points; }
            else { bet = parseInt(data.args[0]); }

            if (!isNaN(bet) && bet > 0 && userPoints >= bet) {
                userInfo[data.user].points = userPoints - bet;

                if (!outcome()) {
                    client.sendMessage(`${data.user}, you lost your bet of ${bet}. You have, ${userInfo[data.user].points} points left.`);
                }
                else if (outcome()) {
                    userInfo[data.user].points = userPoints + (bet * 2);
                    client.sendMessage(`Congratulations ${data.user}, you won: ${bet * 2}. Current points: ${userInfo[data.user].points}`);
                }
            } else if (userPoints < bet) { client.sendMessage(`${data.user}, you cannot bet more than you have.`); }
            else { client.sendMessage(`${data.user}, you are unable to bet with ${data.args[0]}.`); }
        }
        else { client.sendMessage(`Unable to bet with the void.`); }
    },
    activate() {
        userInfo = require(path.join(Bot.data, "users/users.json"));
        Bot.log(Bot.translate("processors.user_info.plugins.gambler.activated"))
    },
    deactivate() {
        userInfo = null;
        Bot.log(Bot.translate("processors.user_info.plugins.gambler.deactivated"))
    }
};