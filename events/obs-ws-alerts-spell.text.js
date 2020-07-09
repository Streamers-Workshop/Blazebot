const settings = require('./obs.Settings.json');

module.exports = {
  name: 'obs-spell-event',
  event: 5,
  description: 'Thanks a user for Triggering a Spell, via OBS',
  execute(data, bot, plugins) {
    if (!plugins.obs) return;
    const tobj = {
      source: settings.spellsSource,
      text: `Thanks ${data.user} for your amazing spell casting, your awesome and thank you <3`,
    };
    const vobj = {
      'source-name': settings.groupName,
      item: {
        name: settings.spellsSource,
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
