/*
PLUGIN BY: Krammy
Trovo Link: https://trovo.live/krammy
Discord: Krammy#0001

Description: Function to toggle on and off visibility of a source.
Date: 07/07/2020
*/

var settings = require('../events/obs.Settings.json');
var isVisible = false;
module.exports = {
    name: 'toggle', //CHANGE COMMAND HERE (ie: !toggle-source, !toggle , !source-visible)
    description: 'Toggles OBS Source',
    execute(message, args, user, bot, event, service) {
        if (service.obs != null)
        {
            //console.log(service.obs);

            var sourceName = "Media Source";  //SET SOURCE NAME HERE
            var sceneName = "Recording Gameplay"; //SET SCENE NAME HERE
            var delay = 4; //DELAY IN SECONDS BEFORE TURNING BACK OFF
            
            const tobj = {
                'scene-name': sceneName,
                item: { name: sourceName },
                visible: true,
            };
            
            service.obs.send('SetSceneItemProperties', tobj).then(() => {
                if (delay > 0) {
                  setTimeout(function a() {
                    tobj.visible = false;
                    service.obs
                      .send('SetSceneItemProperties', tobj)
                      .then(() => {})
                      .catch((e) => {
                        console.log(e);
                      });
                  }, delay * 1000);
                }
              });
        }
        else
        {
            bot.sendMessage("OBS not Connected");
        }    
    }
};