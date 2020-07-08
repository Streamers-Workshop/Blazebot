const fs = require('fs'), path = require('path'), util = require('util');

require('dotenv').config({ path: path.join(__dirname, ".env") });

global.appRoot = path.resolve(__dirname); // Hack to know the root of the Project.

/*
This is for the OBS Plugin to allow OBS functionality in Plugins and Events.
*/

const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();
if (process.env.OBS_ACTIVE > 0) {
  var obs_settings = require('./events/obs.Settings.json');

  obs.connect({ address: obs_settings.address, password: obs_settings.password });
}

var ws = null;
if (process.env.HTTP_OVERLAY > 0) {
  ws = require(path.join(__dirname, 'modules', 'http.js'));
}


var trovojs = require('trovo.js');

var bot = new trovojs.Client();

var cooldowns = new Map();

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
bot.chat_message_filters = new Map();
const messageFilterFiles = fs.readdirSync(path.join(__dirname, 'chatmessagefilters')).filter(file => file.endsWith('.js'));
for (const file of messageFilterFiles) {
  const filter = require(path.join(path.join(__dirname, 'chatmessagefilters'), file));
  bot.chat_message_filters.set(filter.name, filter);
}

bot.on("jsonData", (name, data) => {
  const command = bot.json_events.get(name);

  if (!command) return;
  //console.log(name, data);
  try {
    command.execute(name, data, bot, {
      obs: (process.env.OBS_ACTIVE > 0) ? obs : null,
      ws: (process.env.HTTP_OVERLAY > 0) ? ws : null
    });
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
        trigger.execute(data, bot, {
          obs: (process.env.OBS_ACTIVE > 0) ? obs : null,
          ws: (process.env.HTTP_OVERLAY > 0) ? ws : null
        });
      } catch(e) {
        console.log("chatEvent", key,e)
      }
    }
  });
});


bot.on("chatMessage", (message) => {

  if (!message || message.user == undefined) return;
  if (message.user == process.env.TROVO_BOTNAME) return;
  if (!message.content) return;

  if (process.env.HTTP_OVERLAY > 0) {
    ws.server.clients.forEach(function(client) {
			client.send(JSON.stringify({
        type: "chat",
        page: "trovo",
				name: message.user,
				message: message.content,
        icon: message.iconURL,
        badges: message.badges || null
			}));
		});
  }

  if (process.env.TROVO_PREFIX && message.content.startsWith(process.env.TROVO_PREFIX)) {
    //it's a command

    const args = message.content.slice(process.env.TROVO_PREFIX.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = bot.commands.get(commandName);

    if (!command)
      return;

    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Map());
    }


    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.user) && (message.badges == undefined || (message.badges.indexOf('moderator') <= -1 || message.badges.indexOf('creator') <= -1))) {
      const expirationTime = timestamps.get(message.user) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return bot.sendMessage(`Holdon for ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`, bot);
      }
    }

    timestamps.set(message.user, now);

    setTimeout(() => timestamps.delete(message.user), cooldownAmount);

    if (command.permissions != undefined && command.permissions.length != 0 &&
            (!message.badges || command.permissions.filter(value => message.badges.includes(value)).length === 0)) {
      return bot.sendMessage("You do not have permission to use this command. Sorry.")
    }

    try {
      command.execute(message.content, args, message.user, bot, message, {
        obs: (process.env.OBS_ACTIVE > 0) ? obs : null,
        ws: (process.env.HTTP_OVERLAY > 0) ? ws : null
      });
    } catch (err) {
      console.error(err);
      return bot.sendMessage('There was a error with processing your Command. Please Contact Bioblaze Payne#6459 and let him know.');
    }
  } else {
    //it's a regular chat message

    for (var [key, filter] of bot.chat_message_filters) {
      try {
        if (!message.badges || filter.excludeBadges.filter(value => message.badges.includes(value)).length === 0) {
          if (filter.execute(message, bot, {
            obs: (process.env.OBS_ACTIVE > 0) ? obs : null,
            ws: (process.env.HTTP_OVERLAY > 0) ? ws : null
          }, process.env)) {
            //When the first filter has been applied, don't apply any more filters
            break;
          }
        }
      } catch (e) {
        console.log("chatMessage", key, e);
      }
    }

  }

});

bot.on("ready", () => {
  console.log("Bot loaded");
});


bot.login(process.env.TROVO_PAGE, process.env.TROVO_EMAIL, process.env.TROVO_PASSWORD);
