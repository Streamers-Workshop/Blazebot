const path = require('path');
const util = require('util');

const trovojs = require('trovo.js');
const BottomBar = require('inquirer/lib/ui/bottom-bar');

var DEV = false;

const Bot = require(path.join(__dirname, 'modules', 'Bot.js'));

const client = new trovojs.BrowserClient({ logger: Bot.log });

Bot.setClient(client);
Bot.setRoot(path.resolve(__dirname));
Bot.setData(path.join(__dirname, 'data'));

if (DEV) {
  Bot.loadSettings(path.join(__dirname, "..", 'settings.dev.json'));
} else {
  Bot.loadSettings(path.join(__dirname, 'settings.json'));
}

Bot.loadLocalizationFiles(path.resolve(__dirname, 'localization')).then(() => {
  Bot.loadServices(path.join(__dirname, 'services'));
  Bot.loadPlugins(path.join(__dirname, 'plugins'));
  Bot.loadProcessors(path.join(__dirname, 'processors'));
  if (Bot.settings.console) {
    Bot.loadConsoleCommands();
  }
}).catch((e) => {
  Bot.log("Utilizing Fallback Language: en");
  Bot.defaultFallbackLocalization();
  Bot.loadServices(path.join(__dirname, 'services'));
  Bot.loadPlugins(path.join(__dirname, 'plugins'));
  Bot.loadProcessors(path.join(__dirname, 'processors'));
  if (Bot.settings.console) {
    Bot.loadConsoleCommands();
  }
});


const cooldowns = new Map();

client.on('chatEvent', (type, data) => {
   //Bot.log(util.inspect(data, false, null, true /* enable colors */))
  if (data.user === Bot.settings.trovo.name && type === 'userJoined') return;

  Bot.triggerEvents(data.chatType, client, data);
});

client.on('chatMessage', (message) => {
  //Bot.log(util.inspect(message, false, null, true /* enable colors */))
  Bot.processProcessors(message, client).then((skip) => {
    if (skip) return;
    if (!message || message.user === undefined) return;
    if (message.user === Bot.settings.trovo.name) return;
    if (!message.content) return;
    if (!message.content.startsWith(Bot.settings.prefix, 0)) return;

    const args = message.content.slice(Bot.settings.prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
   
    const command = Bot.getChatCommand(commandName);
    if (!command) return;

    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Map());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (
      timestamps.has(message.user) &&
      (message.badges === undefined ||
        message.badges.indexOf('moderator') <= -1 ||
        message.badges.indexOf('creator') <= -1)
    ) {
      const expirationTime = timestamps.get(message.user) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;

        client.sendMessage(Bot.translate("bot.cooldown", {
          timeLeft: timeLeft.toFixed(1),
          name: command.name
        }));
        return;
      }
    }

    timestamps.set(message.user, now);

    setTimeout(() => timestamps.delete(message.user), cooldownAmount);

    if (
      command.permissions !== undefined &&
      command.permissions.length !== 0 &&
      (!message.badges ||
        command.permissions.filter((value) => message.badges.includes(value)).length === 0)
    ) {
      client.sendMessage(Bot.translate("bot.missing_permissions"));
      return;
    }

    try {
      message.args = args;
      message.prefix = Bot.settings.prefix;
      message.command = commandName;
      command.execute(client, message);
    } catch (err) {
      client.sendMessage(Bot.translate("bot.cmd_error", {
        name: commandName,
        err: err
      }));
      client.sendMessage(Bot.translate("bot.contact_creator"));
    }
  }).catch((e) => {
    console.log(e);
    if (e) {
      client.sendMessage(Bot.translate("bot.process_error", {
        err: e
      }));
      client.sendMessage(Bot.translate("bot.contact_creator"));
    }
  });
});

client.on('ready', () => {
  Bot.log(Bot.translate("bot.ready"));
});

client.login(
  Bot.settings.trovo.page,
  Bot.settings.trovo.email,
  Bot.settings.trovo.password,
);
