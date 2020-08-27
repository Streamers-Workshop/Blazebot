const fs = require('fs');
const path = require('path');
const util = require('util'); // eslint-disable-line

const http = require('http');
const https = require('https');


var instance = null;

function Tool() {

}

// http.get and https.get
Tool.prototype.httpGet = (url) => {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(JSON.parse(data));
      });
    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
  });
};


Tool.prototype.httpsGet = (url) => {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(JSON.parse(data));
      });
    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
  });
};

Tool.prototype.httpPost = (url, post) => {
  return new Promise((resolve, reject) => {
    const req = http.request(new URL(url), res => {
      const chunks = [];
      res.on('data', data => chunks.push(data));
      res.on('end', () => {
        let body = Buffer.concat(chunks);
        switch (res.headers['content-type']) {
          case 'application/json':
            body = JSON.parse(body);
            break;
        }
        resolve(body);
      });
    });
    req.on('error', reject);
    req.write(post);
    req.end();
  });
};

Tool.prototype.httpsPost = (url, post) => {
  return new Promise((resolve, reject) => {
    const req = https.request(new URL(url), res => {
      const chunks = [];
      res.on('data', data => chunks.push(data));
      res.on('end', () => {
        let body = Buffer.concat(chunks);
        switch (res.headers['content-type']) {
          case 'application/json':
            body = JSON.parse(body);
            break;
        }
        resolve(body);
      });
    });
    req.on('error', reject);
    req.write(post);
    req.end();
  });
};

module.exports = (() => {
  if (!instance) instance = new Tool();
  return instance;
})();
