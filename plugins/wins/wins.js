const fs = require('fs');
const path = require('path');
const settings = require('./wins.json');
const Bot = require('../../modules/Bot.js');

const winsFile = path.join(__dirname, 'wins.txt');
module.exports = {
  name: 'Wins',
  description: 'Wins incrementer',
  chat: true, // Defines this as a Chat Command
  event: false, // Is this a Event ?
  type: 5004, // Type Event
  command: 'wins', // This is the Command that is typed into Chat!
  permissions: ['moderator', 'creator'], // This is for Permissisons depending on the Platform.
  alias: [], // Alias commands that preform interesting things.
  cooldown: 5, // this is Set in Seconds, how long between the next usage of this command.
  settings: true, // Defining this as false will load the Settings file for this Plugin when the system loads this plugin.
  credits: 'Created by Rehkloos',
  execute(client, data) {
    const reset = 0;

    const incPlus = ((n) => {
      return () => {
        ++n; // eslint-disable-line no-param-reassign
        return n;
      };
    })(0);

    switch (data.args[0]) {
      case 'count': {
        if (!settings.active) {
          client.sendMessage('Streamer disabled this command');
        } else {
          try {
            if (!fs.existsSync(winsFile)) {
              fs.writeFile(winsFile, '0', (err) => {
                // write increment to text file
                if (err) return Bot.log(err);
                client.sendMessage(`data for wins never existed, so wins reset to 0 as default`);
                return false;
              });
            } else if (fs.existsSync(winsFile)) {
              const currCount = fs.readFileSync(path.join(winsFile), 'utf8');
              client.sendMessage(`Wins🏆: ${currCount}`);
            }
          } catch (err) {
            client.sendMessage(`something went completely wrong`);
          }
        }
        break;
      }
      case '+': {
        if (!settings.active) {
          client.sendMessage('Streamer disabled this command');
        } else {
          const inc = incPlus(); // increase by 1
          fs.writeFile(winsFile, inc, (err) => {
            // write increment to text file
            if (err) return Bot.log(err);
            client.sendMessage(`Wins updated to: ${inc}`);
            return false;
          });
        }
        break;
      }
      case 'reset':
        if (!settings.active) {
          client.sendMessage('Streamer disabled this command');
        } else {
          fs.writeFile(winsFile, reset, (err) => {
            // reset file number to 0
            if (err) return Bot.log(err);
            client.sendMessage(`Wins counter has been reset to 0`);
            return false;
          });
        }
        break;
      default:
        if (!settings.active) {
          client.sendMessage('Streamer disabled this command');
        } else {
          client.sendMessage(`Example Usage: = !wins`);
        }
    }
  },
};
