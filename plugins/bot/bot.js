module.exports = {
  name: 'Bot',
  description: 'Lets the bot introduce himself',
  chat: true, // Defines this as a Chat Command
  event: false, // Is this a Event?
  type: 5004, // Type Event
  command: 'bot', // This is the Command that is typed into Chat!
  permissions: [], // This is for Permissisons depending on the Platform.
  alias: [], // Alias commands that preform interesting things.
  cooldown: 60, // this is Set in Seconds, how long between the next usage of this command.
  settings: false, // Defining this as false will load the Settings file for this Plugin when the system loads this plugin.
  credits: 'Created by Takkes, Updated by Rehkloos',
  execute(client, data) {
    client.sendMessage(
      `@${data.user} Hey!, you can find me on https://github.com/Bioblaze/TrovoBot .`,
    );
    client.sendMessage(
      `@${data.user} If you would like to meet me in person or have other questions, feel free to contact us at https://discord.gg/Kc7fyx2 .`,
    );
  },
};
