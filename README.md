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
- [Setup](#setup)
- [Contributing](#contributing)
- [Plugin Development](#plugin-development)
- [Help](#help)

## About

TrovoBot is a powerful [Node.js](https://nodejs.org) Chatbot utilizing [Trovo.js](https://github.com/Bioblaze/Trovo.js) this allows you to create powerful interactive bots quickly and easily with TrovoBot for the Trovo Platform.


## Chatbot Usage

> This is a Trovo.js bot, showcasing all the various plugins. Please follow the directions listed below in order to use this example to showcase a working functioning chatbot. :)

Open the `settings.json` and edit the values listed within.

* prefix: This is the Prefix your bot will respond too i.e. !pong so '!' is the prefix
* trovo.email: Is the Email of the Account you will be logging into.
* trovo.password: Is the Password of the Account you will be loggin into.
* trovo.page: Will be the Page the Bot will be operating in. Needs to be in the format `https://trovo.live/<username>`
* trovo.name: Account name of your bot


## Setup

Video: [How to Setup TrovoBot](https://www.youtube.com/watch?v=iqK9VnynclM)

> Fill in the Values inside of the `settings.json` file then continue.
> Open Commandline Console, and type the steps listed below.
> Type: `npm install` ~ Once installation has completed continue.
> To start the Bot type: `node ./index.js`
> Alternately in the "bat" folder, after you setup the`.env` file, run `install-deps.bat` then run `startup-bot.bat`

## Reporting a bug

Before creating an issue, please ensure that it hasn't already been reported/suggested.

## Plugin Development / Contributing

All develops are welcome to make Pull Requests with Plugins you've created!

The following infos are meant for developers. If you have any questions feel free to join our Discord (link above) and ask questions.
If you would like to contribute in any way (bugfixes, features, etc.) please adhere to the following points

* Fork this repository, create a feature branch, do your changes in this feature branch and then create a Pull Request from that. Your pull request needs to be auto-mergeable. Therefore if there were any intermediate commits on the project since you created the feature branch, please resolve the conflicts by e.g. rebasing your branch.
* The project exploded in the first couple of days (feature and commit wise) which resulted in a messy code base. That's why we decided to use Prettier & ESLint. Before creating a Pull Request your code has to match these requirements. To display any errors run
`node ./node_modules/eslint/bin/eslint.js .`

This will display all errors and warnings. Most of these things can probably be fixed automatically (like code formatting). To do this, run
`node ./node_modules/eslint/bin/eslint.js . --fix`

### Chat Command Plugin Example
* The folder structure for plugins is the following: `plugins/<pluginname>`. Inside the `<pluginname>` folder you need to put a file caled `<pluginname>.js` with your plugin. Optionally you can add a `settings.json` and a `README.md` file.

TODO: Add plugin template

## Help

If you don't understand something in the documentation, you are experiencing problems, or you just need a gentle
nudge in the right direction, please don't hesitate to join our official [Trovo.js Server](https://discord.gg/Kc7fyx2).

## OBS Plugin

## HTTP Overlay Plugin

Create a Data JSON file in /modules/http/data/<filehere.json>
Event plugins showcasing stuff are located in /events/http-overlay-text-*.js

URL http://localhost:<port you selected>/text/<filehere> <-- filehere is the name of the json file you created, without .json
