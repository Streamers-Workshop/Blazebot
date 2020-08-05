const path = require('path');

global.appRoot = path.resolve(__dirname); // Hack to know the root of the Project.

const trovojs = require('trovo.js');

const client = new trovojs.BrowserClient();

const Bot = require(path.join(__dirname, 'modules', 'Bot.js'));

Bot.loadSettings(path.join(__dirname, 'settings.json'));
Bot.loadServices(path.join(__dirname, 'services'));
Bot.loadPlugins(path.join(__dirname, 'plugins'));
Bot.loadProcessors(path.join(__dirname, 'processors'));


const cooldowns = new Map();

client.on('chatEvent', (type, data) => {
  // Bot.log(util.inspect(data, false, null, true /* enable colors */))
  if (data.user === Bot.settings.trovo.name && type === 'userJoined') return;

  Bot.triggerEvents(data.chatType, client, data, Bot.getServicesOutput());
});

client.on('chatMessage', (message) => {
  Bot.processProcessors().then((process) => {
    // Bot.log(util.inspect(data, false, null, true /* enable colors */))
    if (!message || message.user === undefined) return;
    if (message.user === Bot.settings.trovo.name) return;
    if (!message.content) return;

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
        client.sendMessage(
          `Holdon for ${timeLeft.toFixed(1)} more second(s) before reusing the \`${
            command.name
          }\` command.`,
          client,
        );
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
      client.sendMessage('You do not have permission to use this command. Sorry.');
      return;
    }

    try {
      message.args = args;
      message.prefix = Bot.settings.prefix;
      message.command = commandName;
      command.execute(client, message, Bot.getServicesOutput(), Bot.log);
    } catch (err) {
      Bot.log(`Command Error(${commandName}): ${err}`);
      client.sendMessage(
        'There was a error with processing your Command. Please Contact Bioblaze Payne#6459 and let him know.',
      );
    }
  }).catch((e) => {
    Bot.log(`Processing Error... ${e}`);
    client.sendMessage(
      'There was a error with processing your Command. Please Contact Bioblaze Payne#6459 and let him know.',
    );
  });
});

client.on('ready', () => {
  Bot.log('\nBot loaded and ready to mod!');
});

client.login(
  Bot.settings.trovo.page,
  Bot.settings.trovo.email,
  Bot.settings.trovo.password,
);
