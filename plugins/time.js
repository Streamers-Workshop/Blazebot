console.log("loaded current time")
module.exports = {
  name: 'time',
  description: 'Replies with streamer current time',
  credits: "Created by Rehkloos",
  permissions: [],
  execute(message, args, user, bot, event, plugins) {

    var d = new Date();
    var time = d.toLocaleTimeString();




    bot.sendMessage(`Streamer current time is: ` + time);


  },
};
