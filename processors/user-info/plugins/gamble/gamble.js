const Bot = require('../../../../modules/Bot.js');
var path = require('path');
var userInfo = null;

module.exports = {
    name: 'gamble', // Name of the Plugin
    description: "Takes a given amount of points from user to gamble them",
    author: "Krammy:Source, Praxem:Mutation into gamble",
    license: "Apache-2.0",
    command: 'gamble', // This is the Command that is typed into Chat!
    permissions: [], // This is for Permissisons depending on the Platform.
    cooldown: 1, // this is Set in Seconds, how long between the next usage of this command.
    execute(client, data) {
        //non empty and a number
        if (data.args.length > 0 && (typeof data.args[0] === 'number' && isFinite(parseInt(data.args[0])))) {
            var userPoints = userInfo[data.user].points;

            var bet = 0;
            if (data.args[0] === `all`) { bet = userInfo[data.user].points; }
            else { bet = parseInt(data.args[0]); }

            if (bet > 0) {
                if (userPoints > 0) { //Is capable of gambling
                    if (userPoints >= bet) { //Is capable of gambling with declared points
                        userInfo[data.user].points = userPoints - bet; //remove bet from user

                        var result = (Math.random() - Math.random()); //outcome of the bet                          

                        if ((result) <= 0.11) { client.sendMessage(`${data.user}, you lost your bet of ${bet}. You have, ${userInfo[data.user].points} points left.`); }
                        else if (result > 0.11) //39.5% chance to win
                        {
                            userInfo[data.user].points = userPoints + (bet * 2); //combining outcomes

                            client.sendMessage(`Congratulations ${data.user}, you won: ${bet * 2}. Current points: ${userInfo[data.user].points}`);
                        }
                    }
                    else if (userPoints < bet) { client.sendMessage(`${data.user}, you cannot bet more than you have.`); }
                }
                else { //unable to bet
                    client.sendMessage(`${data.user}, you need to be above 0 points.`);
                }
            }
            else {
                client.sendMessage(`Can only bet a positive amount of points.`);
            }
        }
        else {
            if (data.args.length <= 0) {
                client.sendMessage(`Can only bet points, not air.`);
            } else {
                client.sendMessage(`Can only bet points.`);
            }
        }
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