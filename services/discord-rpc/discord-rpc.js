const Bot = require('../../modules/Bot.js');

const DiscordRPC = require('discord-rpc');

const settings = require('./discord-rpc.json');

var streamStarted = null;
var viewers = 1;
var total = 2;
var streamTitle = null;

module.exports = {
  name: 'discord-rpc',
  description: "Provides a Discord Activity for Trovo.live provided by Trovobot.",
  author: "Bioblaze Payne <bioblazepayne@gmail.com> (https://github.com/Bioblaze)",
  license: "Apache-2.0",
  activate() {
    DiscordRPC.register(settings.clientID);
    this.rpc = new DiscordRPC.Client({ transport: 'ipc' });
    this.rpc.on('ready', () => {
      this.setActivity()
      this.timer = setInterval(() => {
        this.setActivity()
      }, 15e3)
    })
    this.rpc.on('error', (err) => {
      Bot.log(Bot.translate("services.discordrpc.rpcerror", {
        error: err
      }));
    });

    Bot.log(Bot.translate("services.discordrpc.activated"));
  },
  deactivate() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.rpc) {
      this.rpc.clearActivity().then(() => {
        this.rpc.destroy();
      }).catch((err) => {
        Bot.log(Bot.translate("services.discordrpc.clearerr", {
          error: err
        }));
      })
    }
    Bot.log(Bot.translate("services.discordrpc.deactivated"));
  },
  setActivity() {
    if (this.rpc) {

      if (!this.obs) {
        if (Bot.getService('obs-controller')) {
          this.obs = Bot.getService('obs-controller');
          if (this.obs.settings.active) {
            this.obs.output().on('StreamStarted', () => {
              streamStarted = Date.now() / 1000;
            });
            this.obs.output().on('StreamStopped', () => {
              streamStarted = null;
              this.rpc.clearActivity().then(() => {
                Bot.log(Bot.translate("services.discordrpc.streamstopped"));
              }).catch((err) => {
                Bot.log(Bot.translate("services.discordrpc.clearerr", {
                  error: err
                }));
              })
            });
          }
        }
      }

      if (streamStarted) {
        const data = {
          state: 'Viwers: ',
          startTimestamp: streamStarted,
          partySize: viewers > 1 ? viewers : 1,
          partyMax: total,
          largeImageKey: '1_2',
          largeImageText: settings.player ? settings.player : 'Trovobot',
          instance: false,
          details: streamTitle ? streamTitle : settings.title
        }

        this.rpc.setActivity(data).catch((err) => {
          Bot.log(Bot.translate("services.discordrpc.seterr", {
            error: err
          }));
        });
      }
    }
  },
  setViewers(_viewers) {
    viewers = _viewers > 1 ? _viewers : 1;
    if (viewers > total) {
      total = viewers + 1;
    }
  },
  output() {
    return this.rpc;
  },
};
