const fs = require('fs');
const money = require('../casino/money.json');
const cFunctions = require('../casino/cfunctions.js');

<<<<<<< HEAD
const Bot = require('../../modules/Bot.js');

=======
>>>>>>> 2f65a93002ab79a360af452a75d6731abb743d3e
module.exports = {
  name: 'points',
  description: 'Showing user total points.',
  chat: true,
  event: false,
  type: 5004,
  command: 'points',
  permissions: [],
  alias: [],
  cooldown: 0,
  settings: false,
  credits: `Made by Ulash`,
  execute(client, data) {
    // Check points
    if (data.args[0] === undefined) {
      if (!money[data.user]) {
        client.sendMessage(
          `You don't have any account. Please type !casino register to open an account. @${data.user}`,
        );
        return;
      }

      if (cFunctions.checkBanned(data.user) === true) {
        return client.sendMessage(
          `We are sorry, you have been banned from our casino. @${data.user}`,
        );
      }
      client.sendMessage(`You have ${money[data.user].points} Points. @${data.user}`);
    }

    // Send (Lend) Poins
    if (data.args[0] === `send`) {
      if (!money[data.user]) {
        client.sendMessage(
          `You don't have any account. Please type !casino register to open an account. @${data.user}`,
        );
        return;
      }

      if (cFunctions.checkBanned(`${data.user}`) === true)
        return client.sendMessage(
          `We are sorry, you have been banned from our casino. @${data.user}`,
        );

      if (!data.args[1]) {
        client.sendMessage(
          `Please mention someone! \n Correct Usage: !points send @Username <amount>`,
        );
        return;
      }

      if (!data.args[2]) {
        return;
      }

      if (cFunctions.isNumeric(data.args[2]) === false) {
        client.sendMessage(`Please enter a valid number!`);
        return;
      }

      if (money[data.user].points < parseInt(data.args[2])) {
        client.sendMessage(`You don't have enough money to send :cry `);
        return;
      }
      if (money[data.user].points < 1) {
        client.sendMessage(`Please enter a valid amount`);
        return;
      }
      if (!money[data.args[1].substring(1)]) {
        client.sendMessage(
          `The person you want to transfer money does not have an account at our casino.`,
        );
        return;
      }

      money[data.user].points -= parseInt(data.args[2], 10);
      money[data.args[1].substring(1)].points += parseInt(data.args[2], 10);
      client.sendMessage(
        `Dear @${data.args[1].substring(1)} ${
          data.args[2]
        } points has been transferred to your account by @${data.user}`,
      );
      fs.writeFile('./plugins/casino/money.json', JSON.stringify(money, null, 4), function (err) {
        if (err) {
<<<<<<< HEAD
          Bot.log(err);
=======
          console.log(err);
>>>>>>> 2f65a93002ab79a360af452a75d6731abb743d3e
        }
      });
      return;
    }

    // Points Claim command when points is 0
    if (data.args[0] === `claim`) {
      if (!money[data.user]) {
        return client.sendMessage(
          `You don't have any account. Please type !casino register to open an account. @${data.user}`,
        );
      }

      if (cFunctions.checkBanned(data.user) === true)
        return client.sendMessage(
          `We are sorry, you have been banned from our casino. @${data.user}`,
        );

      if (money[data.user].points > 0) {
        return client.sendMessage(`Your points must be 0 to use this command.`);
      }

      money[data.user].points += 500;
      client.sendMessage(`500 points has been added to your account.`);
      fs.writeFile('./plugins/casino/money.json', JSON.stringify(money, null, 4), function (err) {
        if (err) {
<<<<<<< HEAD
          Bot.log(err);
=======
          console.log(err);
>>>>>>> 2f65a93002ab79a360af452a75d6731abb743d3e
        }
      });

      return;
    }

    // Points set command. Only Owner of the casino run this command so the streamer
    if (data.args[0] === `set`) {
      if (data.badges != 'creator')
        return client.sendMessage(`This command can only run by casino owner.`);

      if (!data.args[1]) {
        client.sendMessage(
          `Please mention someone! \n Correct Usage: !points set @Username <amount>`,
        );
        return;
      }

      if (!data.args[2]) {
        return;
      }

      if (cFunctions.isNumeric(data.args[2]) === false) {
        client.sendMessage(`Please enter a valid number!`);
        return;
      }

      money[data.args[1].substring(1)].points = parseInt(data.args[2], 10);
      fs.writeFile('./plugins/casino/money.json', JSON.stringify(money, null, 4), function (err) {
        if (err) {
<<<<<<< HEAD
          Bot.log(err);
=======
          console.log(err);
>>>>>>> 2f65a93002ab79a360af452a75d6731abb743d3e
        }
      });
    }
  },
};
