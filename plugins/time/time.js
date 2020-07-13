module.exports = {
  name: 'time',
  description: 'local time command',
  chat: true,
  event: false,
  type: 5004,
  command: 'time',
  permissions: [],
  cooldown: 10,
  settings: false,
  credits: `Made by Rehkloos`,
  execute(client, data, modules) {

    var d = new Date();
    var time = d.toLocaleTimeString();

    client.sendMessage(`Streamer current time is: ` + time);
  },
};
