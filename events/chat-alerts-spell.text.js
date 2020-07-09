module.exports = {
  name: 'chat-spell-event',
  event: 5,
  description: 'Thanks a user for Triggering a Spell.',
  execute(data, bot) {
    bot.sendMessage(
      `Thanks @${data.user} your amazing, and awesome and thank you <3`,
    );
  },
};
