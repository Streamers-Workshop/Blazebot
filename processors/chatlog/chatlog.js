const fs = require('fs');
const path = require('path');
const util = require('util'); // eslint-disable-line


module.exports = {
  name: 'chatlog',
  process(data, callback, logger) {
    let store = [Date.toGMTString(), data.accountName, data.content];
    let date = [Date.getMonth(), Date.getDate(), Date.getFullYear()];
    fs.appendFile(path.join(__dirname, `ChatLogs.${date.join('-')}.log`), store.join(", "), function (err) {
      callback(err);
    });
  },
};
