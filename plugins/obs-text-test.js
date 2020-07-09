const settings = require('../events/obs.Settings.json');

module.exports = {
  name: 'obs-test',
  description: 'Tests OBS Websocket Functionality',
  permissions: [],
  execute(message, args, user, bot, event, plugins) {
    if (!plugins.obs) return;
    const tobj = {
      source: settings.joinedSource,
      text: `Welcome ${user} remember to follow, your awesome and thank you <3`,
    };
    const vobj = {
      'source-name': settings.groupName,
      item: {
        name: settings.joinedSource,
      },
      visible: true,
    };
    plugins.obs
      .send('SetTextGDIPlusProperties', tobj)
      .then(() => {
        return plugins.obs.send('SetSceneItemProperties', vobj).then(() => {
          setTimeout(() => {
            vobj.visible = false;
            plugins.obs
              .send('SetSceneItemProperties', vobj)
              .then(() => {})
              .catch(() => {});
          }, settings.disappearDelay);
        });
      })
      .catch((e) => {
        console.error(e);
      });
    bot.sendMessage(
      `Welcome ${user} remember to follow, your awesome and thank you <3`,
    );
  },
};
