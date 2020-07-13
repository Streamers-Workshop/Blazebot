module.exports = {
  name: 'say',
  description: 'Says a message by the bot.',
  chat: true,
  event: false,
  type: 5004,
  command: 'say',
  permissions: ['moderator', 'creator'],
  alias: ['say'],
  settings: false,
  credits: 'Made by Friext#6935',
  execute(client, data) {
    if (data.args.length < 1) {
      client.sendMessage('You have to put a message.');
    } else {
      client.sendMessage(`${data.args.join(' ')}`);
    }
  },
};
