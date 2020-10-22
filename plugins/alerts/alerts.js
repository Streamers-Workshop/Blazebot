const Bot = require('../../modules/Bot.js');
const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const { type } = require('os');

const obsSetting = require("../../services/obs/obs.json");
const slobsSettting = require("../../services/slobs/slobs.json");
var settings = null;
var followCount = 0;
var subCount = 0;
//EVENT TYPES
const FOLLOW = 5003;
const SUBS = 5001;
const JOINED = 5004;
const RAID = 5008;
const SPELL = 5;

function write2File(fileName, data) {
  if (typeof (data) !== "string") {
    data = data.toString();
  }
  fs.writeFileSync(path.join(Bot.root, 'labels', fileName), data, (err) => {
    if (err) {
      Bot.log(Bot.translate("plugins.alerts.error_writing", {
        fileName: fileName,
        error: err
      }));
    }
  });
}

function append2File(fileName, data) {
  if (typeof (data) !== "string") {
    data = data.toString();
  }
  fs.appendFileSync(path.join(Bot.root, 'labels', fileName), data + "\n", (err) => {
    if (err) {
      Bot.log(Bot.translate("plugins.alerts.error_writing", {
        fileName: fileName,
        error: err
      }));
    }
  });
}

function obsToggle(scene, source, delay) {
  const obs = Bot.getService('obs-controller');
  if (obsSetting.active) {
    if (obs.output() !== null)
      obs.toggleSource(scene, source);
    setTimeout(function a() { obs.toggleSource(scene, source); }
      , delay * 1000);
  }

}
function slobsToggle(source, delay) {
  const slobs = Bot.getService('slobs-controller').output();
  if (slobsSettting.active) {
    if(slobs !== null) {
      slobs.toggleSource(null, source);
      Bot.log(`Hiding after ${delay} seconds`)
      setTimeout(() => {
        slobs.toggleSource(null, source);
      }, delay * 1000);
    }
  }
}
function https(_page, _user, _message) {
  const service = Bot.getService('http-overlay-controller');
  if (service) {
    service.output().notifyAll({
      type: "text",
      page: _page,
      name: _user,
      message: _message
    });
  }
}

module.exports = {
  name: 'alerts', // Name of the Plugin
  description: "Trigger for all the alerts.",
  author: "Made by Krammy",
  license: "Apache-2.0",
  permissions: ['creator'], // This is for Permissisons depending on the Platform.
  event: [FOLLOW, SUBS, JOINED, SPELL, RAID], // Type Event
  command: 'alerts', // This is the Command that is typed into Chat!
  cooldown: 10, // this is Set in Seconds, how long between the next usage of this command.
  execute(client, data) {
    Bot.log("Triggering");
    
    if ((data.chatType === FOLLOW ||
      (data.args !== undefined && data.args[0] === "follow" && settings.test))
      && settings.alerts.follow.active) {
      Bot.log("Following");
      ++followCount;
      write2File("latest-follow.txt", data.user);
      append2File("latest-followers.txt", data.user)
      write2File("follow-count.txt", followCount);
      var scene = settings.alerts.follow.scene;
      var source = settings.alerts.follow.source;
      var delay = settings.alerts.follow.delay;
      var message = settings.alerts.follow.message;
      var template = Handlebars.compile(message);
      client.sendMessage(template({
        user: data.user,
      }));
      obsToggle(scene, source, delay);
      slobsToggle(source, delay);
      https("follow", data.user, settings.alerts.follow.httpMessage);
    }
    else if ((data.chatType === SUBS ||
      (data.args !== undefined && data.args[0] === "sub" && settings.test)) &&
      settings.alerts.sub.active) {
      ++subCount;
      write2File("latest-sub.txt", data.user);
      write2File("sub-count.txt", subCount);
      var scene = settings.alerts.sub.scene;
      var source = settings.alerts.sub.source;
      var delay = settings.alerts.sub.delay;
      var message = settings.alerts.sub.message;
      var template = Handlebars.compile(message);
      client.sendMessage(template({
        user: data.user,
      }));
      obsToggle(scene, source, delay);
      slobsToggle(source, delay);
      https("sub", data.user, settings.alerts.sub.httpMessage);
    }
    else if ((data.chatType === RAID ||
      (data.args !== undefined && data.args[0] === "raid" && settings.test)) &&
      settings.alerts.raid.active) {
      write2File("latest-raid.txt", data.user);
      var scene = settings.alerts.raid.scene;
      var source = settings.alerts.raid.source;
      var delay = settings.alerts.raid.delay;
      var message = settings.alerts.raid.message;
      var template = Handlebars.compile(message);
      client.sendMessage(template({
        user: data.user,
      }));
      obsToggle(scene, source, delay);
      slobsToggle(source, delay);
      https("raid", data.user, settings.alerts.raid.httpMessage);
    }
    else if ((data.chatType === JOINED ||
      (data.args !== undefined && data.args[0] === "joined" && settings.test)) &&
      settings.alerts.joined.active) {
      write2File("latest-join.txt", data.user);
      if (data['live.viewers' !== undefined]) {
        write2File("view-count.txt", data['live.viewers']);
      }

      var scene = settings.alerts.joined.scene;
      var source = settings.alerts.joined.source;
      var delay = settings.alerts.joined.delay;
      var message = settings.alerts.joined.message;
      var template = Handlebars.compile(message);
      client.sendMessage(template({
        user: data.user,
      }));
      obsToggle(scene, source, delay);
      slobsToggle(source, delay);
      https("joined", data.user, settings.alerts.joined.httpMessage);
    }
    else if ((data.chatType === SPELL ||
      (data.args !== undefined && data.args[0] === "spell" && settings.test))
      && settings.alerts.spell.active) {
      Bot.log("activating");
      write2File("latest-spell.txt", data.user);
      const spellSettings = JSON.parse(fs.readFileSync(path.join(__dirname, 'spells.json'), "utf8"));
      var scene = "";
      var source = "";
      var delay = "";
      var message = "";
      var httpMessage = "";

      //If seperateSpells = true user will be able to use Alerts for each spell
      if (settings.alerts.spell.seperateSpells) {
        if (spellSettings.spelltest) {
          var spellname = spellSettings.testspellName;
          
          if (spellSettings.spells.hasOwnProperty(spellname)) {
            scene = spellSettings.spells[spellname].scene;
            source = spellSettings.spells[spellname].source;
            delay = spellSettings.spells[spellname].delay;
            message = spellSettings.spells[spellname].message;
            httpMessage = spellSettings.spells[spellname].httpMessage;
          } else {
            scene = settings.alerts.spell.scene;
            source = settings.alerts.spell.source;
            delay = settings.alerts.spell.delay;
            message = settings.alerts.spell.message;
            httpMessage = settings.alerts.spell.httpMessage;
          }
        } else {
          var spellName = data['content'].name;
          if (spellSettings.spells.hasOwnProperty(spellName)) {
            scene = spellSettings.spells[spellName].scene;
            source = spellSettings.spells[spellName].source;
            delay = spellSettings.spells[spellName].delay;
            message = spellSettings.spells[spellName].message;
            httpMessage = spellSettings.spells[spellname].httpMessage;
          } else {
            scene = settings.alerts.spell.scene;
            source = settings.alerts.spell.source;
            delay = settings.alerts.spell.delay;
            message = settings.alerts.spell.message;
            httpMessage = settings.alerts.spell.httpMessage;
          }
        }
      } else {
        scene = settings.alerts.spell.scene;
        source = settings.alerts.spell.source;
        delay = settings.alerts.spell.delay;
        message = settings.alerts.spell.message;
        httpMessage = settings.alerts.spell.httpMessage;
      }
      var template = Handlebars.compile(message);
      client.sendMessage(template({
        user: data.user,
      }));
      obsToggle(scene, source, delay);
      slobsToggle(source, delay);
      https("spell", data.user, httpMessage);
    }
  },
  activate() {
    settings = require('./alerts.json');
    followCount = fs.readFileSync(path.join(Bot.root, 'labels', 'follow-count.txt')).toString();
    subCount = fs.readFileSync(path.join(Bot.root, 'labels', 'sub-count.txt')).toString();
    Bot.log(Bot.translate("plugins.alerts.activated"));
  },
  deactivate() {
    settings = null;
    followCount = null;
    subCount = null;
    Bot.log(Bot.translate("plugins.alerts.deactivated"))
  }
};
