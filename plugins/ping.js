module.exports = {
  name: 'ping',
  description: 'Replies with Pong',
  permissions: [],
  execute(message, args, user, bot) {
    bot.sendMessage(`Pong ${user} I reply.`);
  },
};
