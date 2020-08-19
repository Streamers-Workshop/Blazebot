const fs = require('fs');
const path = require('path');
const util = require('util'); // eslint-disable-line

const http = require('http');
const https = require('https');


var instance = null;

function Tool() {

}


Tool.prototype.httpGet = (url) => {
  return new Promise((resolve, reject) => {
      const req = http.get(url, res => {
        const chunks = [];
        res.on('data', data => chunks.push(data))
        res.on('end', () => {
          let body = Buffer.concat(chunks);
          switch (res.headers['content-type']) {
            case 'application/json':
              resolve(JSON.parse(body));
              break;
          }
          resolve(body)
        })
      })
      req.on('error', reject);
    })
};

Tool.prototype.httpsGet = (url) => {
  return new Promise((resolve, reject) => {
      const req = https.get(url, res => {
        const chunks = [];
        res.on('data', data => chunks.push(data))
        res.on('end', () => {
          let body = Buffer.concat(chunks);
          switch (res.headers['content-type']) {
            case 'application/json':
              resolve(JSON.parse(body));
              break;
          }
          resolve(body)
        })
      })
      req.on('error', reject);
    })
};

Tool.prototype.httpPost = (url, post) => {
  return new Promise((resolve, reject) => {
      const req = http.request(new URL(url), res => {
        const chunks = [];
        res.on('data', data => chunks.push(data))
        res.on('end', () => {
          let body = Buffer.concat(chunks);
          switch (res.headers['content-type']) {
            case 'application/json':
              body = JSON.parse(body);
              break;
          }
          resolve(body)
        })
      })
      req.on('error', reject);
      req.write(post);
      req.end();
    })
}

Tool.prototype.httpsPost = (url, post) => {
  return new Promise((resolve, reject) => {
      const req = https.request(new URL(url), res => {
        const chunks = [];
        res.on('data', data => chunks.push(data))
        res.on('end', () => {
          let body = Buffer.concat(chunks);
          switch (res.headers['content-type']) {
            case 'application/json':
              body = JSON.parse(body);
              break;
          }
          resolve(body)
        })
      })
      req.on('error', reject);
      req.write(post);
      req.end();
    })
}

module.exports = (() => {
  if (!instance) instance = new Tool();
  return instance;
})();
