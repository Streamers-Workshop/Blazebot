const fs = require('fs'), path = require('path'), util = require('util');

require('dotenv').config({ path: path.join(__dirname, ".env-dev") });

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
  const event = require(path.join(path.join(__dirname, 'events'), file));
  if (name == 'json') {
    bot.json_events.set(event.name, event);
  } else {
    bot.text_events.set(event.name, event);
  }
}

bot.on("jsonData", (name, data) => {
  const command = bot.json_events.get(name);

  if (!command) return;
  console.log(name, data);
  try {
    command.execute(name, data, bot);
  } catch (err) {
    console.error(err);
    return bot.sendMessage('There was a error with processing your Command. Please Contact Bioblaze Payne#6459 and let him know.');
  }
})

bot.on("chatMessage", (message) => {
  if (!message || message.user == undefined) return;
  if (message.user == process.env.TROVO_BOTNAME) return;
  if (!message.content.startsWith(process.env.TROVO_PREFIX)) {
    const command = bot.text_events.get(message.content);

    if (!command) return;

    try {
      command.execute(message.user, message.content, bot);
    } catch (err) {
      console.error(err);
      return bot.sendMessage('There was a error with processing your Command. Please Contact Bioblaze Payne#6459 and let him know.');
    }
  } else {

    const args = message.content.slice(process.env.TROVO_PREFIX.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = bot.commands.get(commandName);

    if (!command) return;

    if (command.args && !args.length) {
      let reply = `You didn't provide any arguments, ${message.user}!`;

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
        command.execute(message.content, args, message.user, bot);
      } catch (err) {
        console.error(err);
        return bot.sendMessage('There was a error with processing your Command. Please Contact Bioblaze Payne#6459 and let him know.');
      }

  }
})

bot.login(process.env.TROVO_PAGE, process.env.TROVO_EMAIL, process.env.TROVO_PASSWORD);
