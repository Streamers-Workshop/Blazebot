const fs = require('fs'), path = require('path'), util = require('util');

require('dotenv').config({ path: path.join(__dirname, ".env") });

const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();
if (process.env.OBS_ACTIVE > 0) {
  var obs_settings = require('./events/obs.Settings.json');

  obs.connect({ address: obs_settings.address, password: obs_settings.password });
}

var trovojs = require('trovo.js');

var bot = new trovojs.Client();

var cooldowns = new Map();

let isBlocked = JSON.parse(fs.readFileSync("./plugins/blockAds.json", "utf8"));

bot.commands = new Map();
const commandFiles = fs.readdirSync(path.join(__dirname, 'plugins')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(path.join(path.join(__dirname, 'plugins'), file));
  bot.commands.set(command.name, command);
}
bot.text_events = new Map();
bot.json_events = new Map();
const eventFiles = fs.readdirSync(path.join(__dirname, 'events')).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  var name = file.split(".")[1];
  const _event = require(path.join(__dirname, 'events', file));
  if (name == 'json') {
    bot.json_events.set(_event.name, _event);
  } else {
    bot.text_events.set(_event.name, _event);
  }
}

bot.on("jsonData", (name, data) => {
  const command = bot.json_events.get(name);

  if (!command) return;
  //console.log(name, data);
  try {
    command.execute(name, data, bot);
  } catch (err) {
    console.error(err);
    return bot.sendMessage('There was a error with processing your Command. Please Contact Bioblaze Payne#6459 and let him know.');
  }
})

bot.on("chatEvent", (type, data) => {

  bot.text_events.forEach(function(value, key, map) {
    if (!value.event) return
    if (value.event == data.chatType) {
      var trigger = bot.text_events.get(key);
      try {
        if (process.env.OBS_ACTIVE > 0) {
          trigger.execute(data, bot, obs);
        } else {
          trigger.execute(data, bot);
        }
      } catch(e) {
        console.log(key, e)
        console.log("FAILED");
      }
    }
  });
});


bot.on("chatMessage", (message) => {
  if (!Object.keys(isBlocked).length > 0) {
    console.log('blockAds.json is empty. Please type !block-ad enable Then restart the bot.');
  }
  else {
    if (!isBlocked[process.env.TROVO_PAGE]) {} // Check for Trovo url is contains or not in blockAds.json file
    if (isBlocked[process.env.TROVO_PAGE].blocked === 'false') {} // Checking for our adblocker is enabled or not
    if (isBlocked[process.env.TROVO_PAGE].blocked === 'true') {
      const ad = [".com", ".net", ".xyz", ".tk", ".pw", ".io", ".me", ".gg", "www.", "https", "http", ".gl", ".org", ".com.tr", ".biz", "net", ".rf.gd", ".az", ".party", "discord.gg" , "trovo.live"];
      if (ad.some(word => message.content.includes(word))) {
        if (message.badges !== undefined ) { if (message.badges.indexOf("moderator") <= -1 && message.badges.indexOf("creator") <= -1) { } }
        else {
          bot.sendMessage(`@${message.user} Please don\'t make advertise :) !`);
          setTimeout(() => {  bot.sendMessage(`/ban @${message.user} 10`); }, 1500);
        }
      }
    }
  }
  //console.log(message);
  if (!message || message.user == undefined) return;
  if (message.user == process.env.TROVO_BOTNAME) return;
  if (!message.content) return;
  if (!message.content.startsWith(process.env.TROVO_PREFIX)) return;

    const args = message.content.slice(process.env.TROVO_PREFIX.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = bot.commands.get(commandName);

    if (!command) return;

    if (command.args && !args.length) {
      let reply = `You didn't provide any arguments, ${message.user.name}!`;

      if (command.usage) {
        reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
      }

      if (command.options) {
        reply += `\nThe Valid Options are: \`${command.options.join(", ")}\``
      }

      return tools.sendMessage(reply, bot);
    }

    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Map());
    }


      const now = Date.now();
      const timestamps = cooldowns.get(command.name);
      const cooldownAmount = (command.cooldown || 3) * 1000;

      if (timestamps.has(message.user)) {
        const expirationTime = timestamps.get(message.user) + cooldownAmount;

        if (now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000;
          return bot.sendMessage(`Holdon for ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`, bot);
        }
      }

      timestamps.set(message.user, now);

      setTimeout(() => timestamps.delete(message.user), cooldownAmount);

      try {
        command.execute(message.content, args, message.user, bot, message);
      } catch (err) {
        console.error(err);
        return bot.sendMessage('There was a error with processing your Command. Please Contact Bioblaze Payne#6459 and let him know.');
      }


})


bot.login(process.env.TROVO_PAGE, process.env.TROVO_EMAIL, process.env.TROVO_PASSWORD);
