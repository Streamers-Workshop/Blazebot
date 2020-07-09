module.exports = {
  name: "bot",
  permissions: [],
  description: "Lets the bot introduce himself.",
  cooldown: 60,
  execute(message, args, user, bot, event) {
    bot.sendMessage("Hey beautiful, you can find me on https://github.com/Bioblaze/TrovoBot .");
    bot.sendMessage("If you would like to meet me in person or have other questions, feel free to contact me at https://discord.gg/Kc7fyx2 .");
  }
};
