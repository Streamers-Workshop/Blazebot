const fs = require('fs');
const path = require('path');
const util = require('util'); // eslint-disable-line

const Bot = require('./../../modules/Bot.js');

var msgCounter = [];
var timer = [];
var canTrigger = 1;

//APACHE 2.0 LICENSE: https://spdx.org/licenses/Apache-2.0.html#licenseText
const nodifications = require("../../data/nodifications/nodifications.json");

function startMessageTimer(client, id, message, delay) {
    timer[id] = setTimeout(() => {
        client.sendMessage(message);
        canTrigger = 1;
        msgCounter[id] = 0;
        clearTimeout(timer[id]);
    }, delay * 1000);
}
for (var i = 0; i < nodifications.nodifications.length; i++) {
    msgCounter[i] = 0;
}

module.exports = {
    name: 'nodifications',
    description: "Handles adding XP & Points to users on message & other information.",
    author: "Bulllox",
    license: "Apache-2.0",
    activate() {
        Bot.log("Nodifications Activated");
    },
    deactivate() {
        Bot.log("Nodifications Deactivated");
    },
    process(data, client, callback) {
        if (data.badges != "moderator") {
            for (var i = 0; i < nodifications.nodifications.length; i++) {
                if (canTrigger = 1 && msgCounter[i] == nodifications.nodifications[i].msgCounter) {
                    Bot.log("Triggering Nodification")
                    canTrigger = 0;
                    startMessageTimer(client, i, nodifications.nodifications[i].message, nodifications.nodifications[i].delay);
                } else {
                    msgCounter[i] = msgCounter[i] + 1;
                }
            }
        }
        //Bot.log(users);
        callback(null, false);
    },
};
// "Hello, @{{data.user}} how are you?"
