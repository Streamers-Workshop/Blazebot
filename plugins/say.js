module.exports = {
	name: "say'",
	description: "Says a message by the bot.",
  credits: "Made by Friext#6935",
	execute(message, args, user, bot, event) {
        /**IF THE ARGS ARE MISSING TELL TO THE USER THAT HE HAS TO PUT THE TEXT **/
        if (args.length < 1) {
			bot.sendMessage("You have to put a message.");
            return;
        }
        /**IF THE USER IS MOD/CREATOR, SAYS THE THING HE SAYS **/
        if (event.badges == undefined || (event.badges.indexOf("moderator") <= -1 && event.badges.indexOf("creator") <= -1)) return;
        bot.sendMessage(`${args.join(" ")}`);
    },
};
