var Modules = require('./../../modules/Modules.js');

var settings = require('./discord-rpc.json');

const DiscordRPC = require('discord-rpc');
DiscordRPC.register(settings.clientID);

const rpc = new DiscordRPC.Client({ transport: 'ipc' });

var started = false;
var linked = false;
var max_count = 1;
var cur_count = 0;
var stream_title = "Streaming Starting...";
var stream_started = Date.now()/1000;

function onStreamStarted() {
  started = true;
  stream_started = Date.now()/1000;
  stream_title = settings.streamTitle;
}

async function setActivity() {
  if (!rpc) {
    return;
  }
  if (!Modules.getModule('obs')) {
    return;
  } else {
    if (!linked) {
      obs.on('StreamStarted', onStreamStarted);
      linked = true;
    }
  }

  var data = {
    details: "Streaming Starting...",
    state: 'Livestreaming to',
    startTimestamp: stream_started,
    partySize: cur_count,
    partyMax: max_count,
    largeImageKey: '1_2',
    largeImageText: 'Powered by TrovoBot',
    instance: false,
  };

  if (started) {
    data["startTimestamp"] = stream_started;
    data["details"] = stream_title;
  }

  rpc.setActivity(data);
}

rpc.on('ready', () => {

  setActivity();


  // activity can only be set every 15 seconds
  setInterval(() => {
    setActivity();
  }, 15e3);
});


module.exports = {
  name: 'discord-rpc',
  varname: 'discordRpc',
  output: rpc,
  activate() {
    rpc.login({ settings.clientID }).catch(console.error);
  },
  setCount(count) {
    if (count > max_count) {
      max_count = count;
      cur_count = count;
    } else {
      cur_count = count;
    }
  }
};
