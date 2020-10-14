const Bot = require("../../modules/Bot.js");

module.exports = {
    name: "Flip Coin",
    description: "Flip to either get heads or tails",
    author: "Made by chiLee98",
    license: "Apache-2.0",
    command: "flip",
    permission: ["creator", "moderator"],
    cooldown: 0,

    execute(client){
        if (Math.random() < 0.5){
            const heads = "Heads"
            client.sendMessage(Bot.translate("plugins.flip.outcome", { outcome : heads})); 
            console.log("Heads");
        }
        else {
            const tails = "Tails"
            client.sendMessage(Bot.translate("plugins.flip.outcome", { outcome : tails}));
            console.log("Tails");
        }        
    },activate() {
        Bot.log(Bot.translate("plugins.flip.activated"));
      },
      deactivate() {
        Bot.log(Bot.translate("plugins.flip.deactivated"));
      }
};