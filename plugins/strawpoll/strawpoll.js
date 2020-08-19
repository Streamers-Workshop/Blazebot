const strawpoll = require('strawpoll-lib');

module.exports = {
  name: 'Strawpoll',
  description: 'A basic yes/no poll creator using strawpoll api',
  chat: true, // Defines this as a Chat Command
  event: false, // Is this a Event?
  type: 5004, // Type Event
  command: 'poll', // This is the Command that is typed into Chat!
  permissions: ['moderator', 'creator'], // This is for Permissisons depending on the Platform.
  alias: [], // Alias commands that preform interesting things.
  cooldown: 10, // this is Set in Seconds, how long between the next usage of this command.
  settings: false, // Defining this as false will load the Settings file for this Plugin when the system loads this plugin.
  credits: 'Created by Rehkloos',
  execute(client, data) {
    const args = data.args.join(' ');
    const pTitle = args.split(' ').join(' ');


    strawpoll.createPoll(pTitle, ["Yes", "No"], captcha=false).then(res => {
      const pID = res.id;
      const pURL = `https://www.strawpoll.me/${pID}`;
      client.sendMessage(`New Poll created - ` + pTitle + ` - ` + pURL);
    });

  },
};
