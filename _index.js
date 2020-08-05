const path = require('path');

global.appRoot = path.resolve(__dirname); // Hack to know the root of the Project.

const trovojs = require('trovo.js');

// Loading the Base Settings from this point on.
const settings = require(path.join(__dirname, 'modules', 'Settings.js'));
settings.loadSettings(path.join(__dirname, 'settings.json'));

// Loading Modules
const services = require(path.join(__dirname, 'modules', 'Services.js'));
services.loadServices(path.join(__dirname, 'services'));

const bot = new trovojs.Client();

const cooldowns = new Map();

const plugins = require(path.join(__dirname, 'modules', 'Plugins.js'));
plugins.loadPlugins(path.join(__dirname, 'plugins'));

const processors = require(path.join(__dirname, 'modules', 'Processors.js'));
processors.loadProcessors(path.join(__dirname, 'processors'));

bot.on('jsonData', () => {
  // Currently we do not have anything using this data.
  // console.log(util.inspect(data, false, null, true /* enable colors */))
});

bot.on('chatEvent', (type, data) => {
  // console.log(util.inspect(data, false, null, true /* enable colors */))
  if (data.user === settings.settings.trovo.name && type === 'userJoined') return;

  plugins.triggerEvents(data.chatType, bot, data, services.getServicesOutput());
});

bot.on('chatMessage', (message) => {
  // console.log(util.inspect(data, false, null, true /* enable colors */))
  if (!message || message.user === undefined) return;
  if (message.user === settings.settings.trovo.name) return;
  if (!message.content) return;

  const args = message.content.slice(settings.settings.prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = plugins.getChatCommand(commandName);
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
      bot.sendMessage(
        `Holdon for ${timeLeft.toFixed(1)} more second(s) before reusing the \`${
          command.name
        }\` command.`,
        bot,
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
    bot.sendMessage('You do not have permission to use this command. Sorry.');
    return;
  }

  try {
    message.args = args;
    message.prefix = settings.settings.prefix;
    message.command = commandName;
    command.execute(bot, message, services.getServicesOutput());
  } catch (err) {
    console.error(err);
    bot.sendMessage(
      'There was a error with processing your Command. Please Contact Bioblaze Payne#6459 and let him know.',
    );
  }
});

bot.on('ready', () => {
  console.log('\nBot loaded and ready to mod!');
});

bot.login(
  settings.settings.trovo.page,
  settings.settings.trovo.email,
  settings.settings.trovo.password,
);