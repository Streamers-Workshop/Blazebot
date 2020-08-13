var randomWords = require('random-words');

module.exports = {
  name: 'Google Search',
  description: 'Quick google search or search a random word',
  chat: true, // Defines this as a Chat Command
  event: false, // Is this a Event?
  type: 5004, // Type Event
  command: 'google', // This is the Command that is typed into Chat!
  permissions: [], // This is for Permissisons depending on the Platform.
  alias: [], // Alias commands that preform interesting things.
  cooldown: 10, // this is Set in Seconds, how long between the next usage of this command.
  settings: true, // Defining this as false will load the Settings file for this Plugin when the system loads this plugin.
  credits: 'Created by Rehkloos',
  execute(client, data) {

    const input = data.args[0];

    switch (input) {
      case 'search': {
        const args = data.args.join(' ');
        const sTerm = args.split(' ').join('+').slice(7); // slice "7" removes "search+" from args
        const sURL = `https://www.google.com/search?q=${sTerm}`;
        client.sendMessage(`@${data.user} - ${sURL}`);
        break;
      }
      case 'random': {
        const sRandom = randomWords();
        const sURL = `https://www.google.com/search?q=${sRandom}`;
        client.sendMessage(`@${data.user} - ${sURL}`);
        break;
      }
      default:
        client.sendMessage(`Example Usage: = !google search <word> , !google random`);
    }
  },
};
