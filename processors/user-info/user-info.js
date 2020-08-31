const fs = require('fs');
const path = require('path');
const util = require('util'); // eslint-disable-line

const Bot = require('./../../modules/Bot.js');

//APACHE 2.0 LICENSE: https://spdx.org/licenses/Apache-2.0.html#licenseText
var users = null;
var saveTimer = null;

function write2file()
{
  fs.writeFileSync(path.join(Bot.data, "users/users.json"), JSON.stringify(users, undefined, 4), (err) => {
    Bot.log(err)
    if (err) {
        Bot.log(Bot.translate("processors.users.error_writing", {
            fileName: 'users.json',
            error: err
          }));
    }
  });
}

module.exports = {
  name: 'user-info',
  description: "Handles adding XP & Points to users on message & other information.",
  author: "Krammy",
  license: "Apache-2.0",
  activate() {
    if (fs.existsSync(path.join(__dirname, 'plugins'))) {
      Bot.loadPlugins(path.join(__dirname, 'plugins'));
    }
    users = require(path.join(Bot.data, "users/users.json"));
    Bot.log(Bot.translate("processors.user_info.activated"));
    
    saveTimer = setInterval(write2file , 60000);
  },
  deactivate() {
    if (fs.existsSync(path.join(__dirname, 'plugins'))) {
      Bot.unloadPlugins(path.join(__dirname, 'plugins'));
    }
    users = {};
    clearInterval(saveTimer);
    Bot.log(Bot.translate("processors.user_info.deactivated"));
  },
  process(data, client, callback) {
    
    //Bot.log(users[data.user]);
    var time = new Date();
    if (users[data.user] === undefined)
    {
      users[data.user] = {
        "points" : 1000,
        "xp" : 0,
        "last_message" : data.content,
        "last_seen" : time.toString(),
        "level" : 1,
        "vip": false,
        "playingBlackjack": false,
        "blackjackHand": [],
        "blackjackDealerHand": [],
        "blackjackBet": 0,
      }
    }
    else
    {
      var level = users[data.user].level;
      var goal = users[data.user].level * 50;
      var xp = users[data.user].xp + (Math.floor(Math.random() * 5) + 1)
      if (users[data.user].xp > goal)
      {
        level = level+ 1;
        xp = 0
        client.sendMessage(`Congratulations ${data.user}, you levelled up: ${parseInt(level)}`);
      }
      users[data.user] = {
        "points" : users[data.user].points + Math.floor(Math.random() * 10) + 1,
        "xp" : xp,
        "last_message" : data.content,
        "last_seen" : time.toString(),
        "level" : level,
        "vip": users[data.user].vip,
        "playingBlackjack": users[data.user].playingBlackjack,
        "blackjackHand": users[data.user].blackjackHand,
        "blackjackDealerHand": users[data.user].blackjackDealerHand,
        "blackjackBet": users[data.user].blackjackBet,
      }
    }
    
    //Bot.log(users);
    callback(null,false);
  },
};
// "Hello, @{{data.user}} how are you?"
