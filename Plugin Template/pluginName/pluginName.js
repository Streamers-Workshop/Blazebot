const Bot = require('../../../../modules/Bot.js');
var path = require('path');
var userInfo = null;


//This template comes from Praxem's gamble plugin
module.exports = {
  name: 'namePlugin', // Name of the Plugin
  description: "Tell us what is does",
  author: "You",
  license: "Apache-2.0",
  command: 'namePluginCommand', // This is the Command that is typed into Chat!
  permissions: [], // This is for Permissisons depending on the Platform. 'moderator' or 'creator'
  cooldown: 1, // this is Set in Seconds, how long between the next usage of this command.
  execute(client, data) {
    if (data.args.length > 0)
    {
		//Is capable of gambling
        if (userInfo[data.user].points > 0)
        {
			var bet = 0;
			//data.args is a string array containing everything after the command so, "!gamble all" the data.args only contains "all"
			if (data.args[0] === `all`) { data.args[0] = (userInfo[data.user].points).toString(); }
			
			//Is capable of gambling with declared points
			if(userInfo[data.user].points >= parseInt(data.args[0]) && parseInt(data.args[0]) > 0) 
			{
				if(bet == 0) { bet = parseInt(data.args[0]); }
				
				//remove bet from user's points
				userInfo[data.user].points = userInfo[data.user].points - bet;
				
				//outcome of the bet
				var result = ( Math.random() - Math.random() ); //min, max                           
				
				//limit to just the bet
				if ( (result) <= 0.11) { client.sendMessage(`${data.user}, you lost your bet of ${bet}. You have, ${userInfo[data.user].points} points left.`); }
				else if (result > 0.11) //~39.5% chance to win // ran scenario 100 million iterations for this number
				{
				//combining outcomes		
				userInfo[data.user].points = userInfo[data.user].points + (bet * 2);

				//Gets the bot to say something
				client.sendMessage(`Congratulations ${data.user}, you won: ${(bet * 2)}. Current points: ${userInfo[data.user].points}`);
				}			
			}
			else if (userInfo[data.user].points < parseInt(data.args[0]) && parseInt(data.args[0]) > 0) 
			{
				//user doesn't have enough points as their intended bet
				client.sendMessage(`${data.user}, you do not have enough points.`);	
			}
			//if the bet is a negative number or 0
			else if (parseInt(data.args[0]) < 1) 
			{
				client.sendMessage(`${data.user}, you need to be above 0 points.`);	
			}
			 else
			{
				client.sendMessage(Bot.translate("processor.user_info.plugins.gamble.error_user"));
			}			       
        }
		 else
			{
				client.sendMessage(`You need more points to gamble.`);
			}	
    }
  },
  activate() {
    userInfo = require(path.join(Bot.data, "users/users.json"));
    Bot.log(Bot.translate("processors.user_info.plugins.give.activated"))
  },
  deactivate() {
    userInfo = null;
    Bot.log(Bot.translate("processors.user_info.plugins.give.deactivated"))
  }
};
