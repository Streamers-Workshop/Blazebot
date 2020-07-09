console.log("loaded say")

module.exports = {
	name: 'say',
    	description: 'Says a message by the bot.',
    	permissions: ['moderator', 'creator'],
    	credits: "Made by Friext#6935",
	execute(message, args, user, bot, event) {
        	/**IF THE ARGS ARE MISSING TELL TO THE USER THAT HE HAS TO PUT THE ARGS **/
        	if (args.length < 1) {
			bot.sendMessage("You have to put a message.");
            	return;
        	}
        
        	/**IF THE USER IS MOD/CREATOR, SAYS THE THING HE SAYS **/
        	if (args[0].charAt(0)) {
        	bot.sendMessage(`${args.join(" ")}`);
        	}
    	},
};
