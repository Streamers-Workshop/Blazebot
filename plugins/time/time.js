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
  execute(client) {
    const d = new Date();
    const time = d.toLocaleTimeString();

    client.sendMessage(`Streamer current time is: ${time}`);
  },
};
