const SockJS = require('sockjs-client');

const settings = require('./slobs.json');

const slobs = new SockJS('http://127.0.0.1:59650/api');

var isOpen = false;
// SEND AUTH WHEN SOCKET OPENS
slobs.onopen = (d) => {
  const connectMessage = JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'auth',
    params: {
      resource: 'TcpServerService',
      args: [settings.token],
    },
  });
  slobs.send(connectMessage);
};

// HANDLE MESSAGES RECEIVED
slobs.onmessage = (d) => {
  console.log(d);
};

// EVENT TRIGGERED IF LOOSE CONNECTION TO SLOBS
slobs.onclose = (d) => {
  console.log('slobs closed connection');
};

module.exports = {
  name: 'slobs-controller-module',
  varname: 'slobs',
  output: slobs,
  activate() {
    console.log('active');
  },
  
  streamStatusChange() {
	  const message = JSON.stringify(
	  {
		  "id":26,
		  "jsonrpc":"2.0",
		  "method":"streamingStatusChange",
		  "params":{"resource":"StreamingService"}
	  })
	  slobs.send(message);
  },
};
