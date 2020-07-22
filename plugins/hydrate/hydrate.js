const settings = require('./hydrate.json');

module.exports = {
  name: 'Hydrate',
  description: 'Remind the streamer to hydrate',
  chat: true,
  event: false,
  type: 5004,
  command: 'hydrate',
  permissions: [],
  cooldown: 60,
  settings: true,
  credits: `Made by Rehkloos`,
  execute(client) {
    const minutes = 30;
    const TIME_BETWEEN_DRINKS = minutes * 60 * 1000;
    const startDate = Date().toString();

    if (!settings.active) {
      console.log('Please change active to true for command to work');
      client.sendMessage('Streamer disabled this command');
    } else {
      console.log(`starting hydration messages at ${startDate}`);
      client.sendMessage('Great, I will make sure the streamer stays hydrated! 💧 ');
      setInterval(() => {
        const dateTime = Date().toString();
        console.log(`sending message at ${dateTime}`);
        client.sendMessage(
          `Streamer, I recommend you drink 240ml (8 oz) of water! I will remind you again in 30 minutes`,
        );
      }, TIME_BETWEEN_DRINKS); // wait this many milliseconds before reminding again
    }
  },
};
