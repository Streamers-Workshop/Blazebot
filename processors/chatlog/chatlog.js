const fs = require('fs');
const path = require('path');
const util = require('util'); // eslint-disable-line

const Bot = require('../../modules/Bot.js');

//APACHE 2.0 LICENSE: https://spdx.org/licenses/Apache-2.0.html#licenseText

module.exports = {
  name: 'chatlog',
  description: "Records all Chat to a Textfile.",
  author: "Bioblaze Payne <bioblazepayne@gmail.com> (https://github.com/Bioblaze)",
  license: "Apache-2.0",
  activate() {
    Bot.log(Bot.translate("processors.chatlog.activated"));
  },
  deactivate() {
    Bot.log(Bot.translate("processors.chatlog.deactivated"));
  },
  process(data, callback) {
    let _date = new Date();
    let store = [_date.toISOString(), data.accountName, data.content];
    let date = [_date.getMonth(), _date.getDate(), _date.getFullYear()];
    fs.appendFile(path.join(__dirname, `ChatLogs.${date.join('-')}.log`), `${store.join(", ")}\r\n`, 'utf8', function (err) {
      callback(err, false);
    });
  },
};
