const DiscordRPC = require('discord-rpc');
const Modules = require('../../modules/Services.js');

const settings = require('./discord-rpc.json');

DiscordRPC.register(settings.clientID);

const rpc = new DiscordRPC.Client({ transport: 'ipc' });

let started = false;
let linked = false;
let maxCount = 2;
let curCount = 1;
let streamTitle = 'Streaming Starting...';
let streamStarted = Date.now() / 1000;

function onStreamStarted() {
  started = true;
  streamStarted = Date.now() / 1000;
  streamTitle = settings.streamTitle;
}

async function setActivity() {
  if (!rpc) {
    return;
  }
  if (!Modules.getService('obs-controller-module')) {
    return;
  }
  const mod = Modules.getService('obs-controller-module');
  if (!mod.settings) return;
  if (!mod.settings.active) return;
  if (!linked) {
    mod.output.on('StreamStarted', onStreamStarted);
    linked = true;
  }

  const data = {
    details: settings.streamTitle,
    state: 'Viwers: ',
    startTimestamp: streamStarted,
    partySize: curCount,
    partyMax: maxCount,
    largeImageKey: '1_2',
    largeImageText: 'Powered by TrovoBot',
    instance: false,
  };

  if (started) {
    data.startTimestamp = streamStarted;
    data.details = streamTitle;
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
    rpc.login({ clientId: settings.clientID }).catch(console.error);
  },
  setCount(count) {
    if (count > maxCount) {
      maxCount = count + 1;
      curCount = count;
    } else {
      curCount = count > 0 ? count : 1;
    }	
  },
};
