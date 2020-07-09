let bJson = JSON.parse(fs.readFileSync("./chatmessagefilters/bannedWords.json", "utf8"));
const bst = bJson.data[0];
const bWords = bst.words[process.env.BADWORDS_LANG];
const bLinks = bst.links;

module.exports = {
  name: 'swears_and_links',
  excludeBadges: ['moderator', 'creator'],
  description: 'Deletes messages that contain bad words',
  execute(message, bot, plugins, settings) {

    if (!settings.BADWORDS || settings.BADWORDS == 0)
      return false;

    if (bLinks.some(word => message.content.includes(word))) {
      bot.sendMessage(`@${message.user} Please don\'t make advertise :) !`);
      bot.sendMessage(`/ban @${message.user} 10`);
      return true;
    } else if (bWords.some(word => message.content.includes(word))) {
      bot.sendMessage(`@${message.user} Please be respectful in the chat!`);
      bot.sendMessage(`/ban @${message.user} 10`);
      return true;
    }
  }
};
