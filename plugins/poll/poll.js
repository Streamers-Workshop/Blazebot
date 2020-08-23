const Bot = require('../../modules/Bot.js');
const settings = require("./poll.json");
const pfunction = require("./pollFunction.js");

module.exports = {
    name: 'poll', // Name of the Plugin
    description: "Little Poll system",
    author: "Made by Bulllox",
    license: "Apache-2.0",
    command: 'poll', // This is the Command that is typed into Chat!
    permissions: [], // This is for Permissisons depending on the Platform.
    cooldown: 0, // this is Set in Seconds, how long between the next usage of this command.
    execute(client, data) {
        var adminCommands = ["start", "stop", "reset"];
        var userCommands = ["getList"];
        if (!data.args[0]) {
            var commands = "";
            adminCommands.forEach(element => {
                commands += `${element}, `;
            });
            commands = commands.substring(0, commands.length - 2);
            client.sendMessage(Bot.translate("plugins.poll.missingargs", {
                commandlist: commands
            }));
        }
        var cmd = data.args[0];
        switch (cmd) {
            case "start":
                if(pfunction.hasPermission(data)) {
                    if (data.args.length == 1) {
                        client.sendMessage(Bot.translate("plugins.poll.startUsage"));
                        return false;
                    }
                    if (!pfunction.isPollActive()) {
                        var arg = [];
                        var prevArg = "";
                        var voteItems = "";
                        var notTheSame = true;
                        data.args.forEach(element => {
                            if (!adminCommands.includes(element) && !userCommands.includes(element)) {
                                if(element != prevArg) {
                                    arg.push(element);
                                    voteItems += `${element} | `;
                                    prevArg = element;
                                } else {
                                    notTheSame = false;
                                }
                            }
                        });
                        if(notTheSame) {
                            voteItems = voteItems.substring(0, voteItems.length - 3);
                            if (pfunction.startVote(arg)) {
                                client.sendMessage(Bot.translate("plugins.poll.pollstarted", {
                                    votelist: voteItems
                                }));
                            }
                        } else {
                            client.sendMessage(Bot.translate("plugins.poll.sameValues"));
                            pfunction.resetVote();
                        }
                    } else {
                        client.sendMessage(Bot.translate("plugins.poll.pollRunning"));
                    }
                } else {
                    client.sendMessage(Bot.translate("plugins.poll.permissions"));
                }
                break;
            case "stop":
                if(pfunction.hasPermission(data)) {
                if(pfunction.isPollActive()) {
                    var winner = pfunction.getWinner();
                    var res = winner.split("|");
                    client.sendMessage(Bot.translate("plugins.poll.pollstopped"));
                    client.sendMessage(Bot.translate("plugins.poll.winner", {
                        name: res[0],
                        votes: res[1]
                    }))
                    pfunction.resetVote();
                } else {
                    client.sendMessage(Bot.translate("plugins.poll.pollNotRunning"));
                }
                } else {
                    client.sendMessage(Bot.translate("plugins.poll.permissions"));
                }
                break;
            case "reset":
                if(pfunction.hasPermission(data)) {
                    pfunction.resetVote();
                    client.sendMessage(Bot.translate("plugins.poll.voteReseted"));
                } else {
                    client.sendMessage(Bot.translate("plugins.poll.permissions"));
                }
                break;
            case "getList":
                if(pfunction.isPollActive()) {
                    client.sendMessage("Vote List: ");
                    client.sendMessage(pfunction.getList());
                } else {
                    client.sendMessage(Bot.translate("plugins.poll.pollNotRunning"));
                }
                break;
            default:
                if (!adminCommands.includes(cmd) && !userCommands.includes(cmd)) {
                    if (pfunction.isPollActive()) {
                       if(!pfunction.hasUserVoted(data.user)) {
                           if(pfunction.isItemInList(cmd)) {
                                if(pfunction.placeVote(cmd, data.user)) {
                                    if(settings.showUserVoting) {
                                        client.sendMessage(Bot.translate("plugins.poll.uservoted", {
                                            user: data.user
                                        }))
                                    }
                                } else {
                                    client.sendMessage(Bot.sendMessage("plugins.poll.somethingsWrong"));
                                }
                            } else {
                                client.sendMessage(Bot.translate("plugins.poll.itemNotInList", {
                                    item:cmd
                                }));
                            }
                       } else {
                           client.sendMessage(Bot.translate("plugins.poll.alreadyVoted", {
                               user: data.user
                           }))
                       } 
                    } else {
                        client.sendMessage(Bot.translate("plugins.poll.pollNotRunning"));
                        return false;
                    }
                }
                break;
        }

    },
    activate() {
        Bot.log(Bot.translate("plugins.poll.activated"))
    },
    deactivate() {
        Bot.log(Bot.translate("plugins.poll.deactivated"))
    }
};
