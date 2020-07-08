<div align="center">
  <br />
  <p>
    <img src="https://static.trovo.live/cat/img/f4bf211.png" width="200" alt="trovo.js Bot" />
  </p>
  <br />
  <p>
    <a href="https://discord.gg/Kc7fyx2"><img src="https://discord.com/api/guilds/728527921504845884/embed.png" alt="Discord server" /></a>
    <a href="https://www.patreon.com/BioblazePayne"><img src="https://img.shields.io/badge/donate-patreon-F96854.svg" alt="Patreon" /></a>
  </p>
</div>

## Table of contents

- [About](#about)
- [Chatbot Usage](#chatbot-usage)
- [Contributing](#contributing)
- [Plugin Development](#plugin-development)
- [Help](#help)

## About

TrovoBot is a powerful [Node.js](https://nodejs.org) Chatbot utilizing [Trovo.js](https://) this allows you to create powerful interactive bots quickly and easily with TrovoBot for the Trovo Platform.


## Chatbot Usage

> This is a Trovo.js bot, showcasing all the various plugins. Please follow the directions listed below in order to use this example to showcase a working functioning chatbot. :)

Open the `.env` and edit the values listed within.

* TROVO_EMAIL: Is the Email of the Account you will be logging into.
* TROVO_PASSWORD: Is the Password of the Account you will be loggin into.
* TROVO_PAGE: Will be the Page the Bot will be operating in.
* TROVO_BOTNAME: Bioblaze
* TROVO_PREFIX: This is the Prefix your bot will respond too i.e. !pong so '!' is the prefix


## How to Run
> Fill in the Values inside of the `.env` file then continue.
> Open Commandline Console, and type the steps listed below.
> Type: `npm install` ~ Once installation has completed continue.
> To start the Bot type: `node ./index.js`


## Plugin Development

> All develops are welcome to make Pull Requests with Plugin's you've created!

### Chat Command Plugin Example
* These plugins go into the `/plugins/` Folder.

```js
module.exports = {
	name: 'name',
	description: 'Description',
	execute(message, args, user, bot) {
		bot.sendMessage(`Send a Message Here <3`);
	},
};
```
### Event Plugin Example
 * These plugins go into the `/events/` Folder. Named like `Name.EventType.js`
 * Valid event Types: json or text
 * Example of JSON event name: `viewercount.json.js`
 * Example of Text event name: `welcomer.text.js`

```js
module.exports = {
	event: 'event here',
	description: 'Description',
	execute(user, message, bot) {
		bot.sendMessage(`Send a Message Here <3`);
	},
};
```

## Contributing

Before creating an issue, please ensure that it hasn't already been reported/suggested.

## Help

If you don't understand something in the documentation, you are experiencing problems, or you just need a gentle
nudge in the right direction, please don't hesitate to join our official [Trovo.js Server](https://discord.gg/Kc7fyx2).

## OBS Plugin

## HTTP Overlay Plugin

Create a Data JSON file in /modules/http/data/<filehere.json>
Event plugins showcasing stuff are located in /events/http-overlay-text-*.js

URL http://localhost:<port you selected>/text/<filehere> <-- filehere is the name of the json file you created, without .json
