module.exports = {
  name: 'caps',
  excludeBadges: ['moderator', 'creator'],
  description: 'Deletes messages with too many caps characters',
  execute(message, bot, plugins, settings) {
    if (
      !settings.CAPS_RATE_BAN ||
      settings.CAPS_RATE_BAN == 0 ||
      !settings.CAPS_RATE_BAN_THRESHOLD
    )
      return false;

    let msgLength = message.content.length;
    let numCaps = (message.content.match(/[A-Z]/g) || []).length;
    if (numCaps / msgLength >= settings.CAPS_RATE_BAN_THRESHOLD) {
      bot.sendMessage(`Too much caps @${message.user}`);
      bot.sendMessage(`/ban @${message.user} 10`);
      return true;
    }
  }
};
