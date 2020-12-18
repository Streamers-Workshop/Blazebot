const OBSWebSocket = require("obs-websocket-js");
const settings = require("./obs.json");
const Bot = require("../../modules/Bot.js");

var obs = null;
var timeout = null;
var count = 1;
var connected = false;

function connect() {
  obs
    .connect({
      address: `${settings.address}:${settings.port}`,
      password: settings.password,
    })
    .then(() => {
      Bot.log(Bot.translate("services.obs.connected"));
      connected = true;
    })
    .catch((e) => {
      if (count <= settings.retry_count) {
        Bot.log(
          Bot.translate("services.obs.retry_attempt", {
            count: count,
            max: settings.retry_count,
          })
        );
        timeout = setTimeout(function () {
          module.exports.reconnectOBS();
          ++count;
        }, 5000);
      } else {
        Bot.log(Bot.translate("services.obs.stopping_retry"));
        Bot.log(Bot.translate("services.obs.solutionOBS"));
      }
    });
}

module.exports = {
  name: "obs-controller",
  description: "Provides a OBS Intergration & Control to Trovobot.",
  author:
    "Bioblaze Payne <bioblazepayne@gmail.com> (https://github.com/Bioblaze)",
  license: "Apache-2.0",
  output() {
    return obs;
  },
  toggleSource(scene, source) {
    var m_visible = false;
    obs
      .send("GetSceneItemProperties", {
        "scene-name": scene,
        item: { name: source },
      })
      .then(function a(data, err) {
        if (err) {
          Bot.log(Bot.translate("services.obs.no_source"), {
            source: source,
            scene: scene,
          });
        }
        m_visible = !data.visible;

        const tobj = {
          "scene-name": scene,
          item: { name: source },
          visible: m_visible,
        };

        obs.send("SetSceneItemProperties", tobj).catch((err) => {
          Bot.log(Bot.translate("services.obs.no_source"), {
            source: source,
            scene: scene,
          });
        });
      });
  },
  uptime() {
    return obs.send("GetStreamingStatus");
  },
  reconnectOBS() {
    if (!obs) {
      obs = new OBSWebSocket();
    }
    connect();
  },
  activate() {
    if (!obs) {
      obs = new OBSWebSocket();
    }
    connect();
    Bot.log(Bot.translate("services.obs.activated"));
  },
  deactivate() {
    if (timeout) {
      clearTimeout(timeout);
    }
    obs = null;
    Bot.log(Bot.translate("services.obs.deactivated"));
  },
};
