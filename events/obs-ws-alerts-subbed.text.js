const settings = require('./obs.Settings.json');

module.exports = {
  name: 'obs-joined-event',
  event: 5001,
  description: 'Welcomes a User, via OBS',
  execute(data, bot, plugins) {
    if (!plugins.obs) return;
    const tobj = {
      source: settings.subbedSource,
      text: `Thanks ${data.user} for Subbing, your awesome and thank you <3`,
    };
    const vobj = {
      'source-name': settings.groupName,
      item: {
        name: settings.subbedSource,
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
      `Thanks ${data.user} for Subbing, your awesome and thank you <3`,
    );
  },
};
