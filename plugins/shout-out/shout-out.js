module.exports = {
  name: 'shout-out',
  description: 'Shout out command',
  chat: true,
  event: false,
  type: 5004,
  command: 'so',
  permissions: ['moderator', 'creator'],
  cooldown: 10,
  settings: false,
  credits: `Made by ssrjazz, updated by Bioblaze & Krammy`,
  execute(client, data) {
    const soUsername = data.args[0];
    if (soUsername.charAt(0) === '@') {
      client.sendMessage(
        `Check out ${data.args[0]} at https://trovo.live/${data.args[0].substr(
          1,
        )} - They are an awesome streamer and deserve some community love!`,
      );
    } else {
      client.sendMessage(
        `Check out @${data.args[0]} at https://trovo.live/${data.args[0]} - They are an awesome streamer and deserve some community love!`,
      );
    }
  },
};
