const fs = require('fs');
const path = require('path');
const util = require('util'); // eslint-disable-line

const Bot = require('../../modules/Bot.js');

module.exports = {
  name: 'chatlog',
  activate() {
    return true;
  },
  process(data, callback) {
    let _date = new Date();
    let store = [_date.toISOString(), data.accountName, data.content];
    let date = [_date.getMonth(), _date.getDate(), _date.getFullYear()];
    fs.appendFile(path.join(__dirname, `ChatLogs.${date.join('-')}.log`), store.join(", "), 'utf8', function (err) {
      callback(err);
    });
  },
};
