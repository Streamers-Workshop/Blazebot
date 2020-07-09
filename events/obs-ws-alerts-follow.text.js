const settings = require('./obs.Settings.json');

module.exports = {
  name: 'obs-follow-event',
  event: 5003,
  description: 'Thanks a user for Following, via OBS',
  execute(data, bot, plugins) {
    if (!plugins.obs) return;
    const tobj = {
      source: settings.followSource,
      text: `Thanks ${data.user} for following, your awesome and thank you <3`,
    };
    const vobj = {
      'source-name': settings.groupName,
      item: {
        name: settings.followSource,
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
      `Thanks @${data.user} your amazing, and awesome and thank you <3`,
    );
  },
};
