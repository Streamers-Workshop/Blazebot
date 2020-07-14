const fs = require('fs');

module.exports = {
  name: 'alert-joined', // Name of the Plugin
  description:
    'Sends a message to chat of new follower. Saves latest follower to text file for obs&slobs.', // Description
  chat: false, // Defines this as a Chat Command
  event: true, // Is this a Event?
  type: 5004, // Type Event
  command: '', // This is the Command that is typed into Chat!
  permissions: [], // This is for Permissisons depending on the Platform.
  alias: [], // Alias commands that preform interesting things.
  cooldown: 0, // this is Set in Seconds, how long between the next usage of this command.
  settings: false, // Defining this as false will load the Settings file for this Plugin when the system loads this plugin.
  credits: `New joined system by Krammy. Original by Bioblaze Payne.`, // MAKE SURE YOU FILL THIS IN GOD DAMNIT!
  execute(client, data) {
    client.sendMessage(`Welcome ${data.user}`);

    fs.writeFile('./plugins/alert-joined/latest-join.txt', data.user, (err) => {
      if (err) {
        return console.log(err);
      }

      return true;
    });
  },
};
