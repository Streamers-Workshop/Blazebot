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

## Tabla de Contenidos

- [Info](#info)
- [Uso del Bot de Chat](#uso-del-bot-de-chat)
- [Contribuir](#contribuir)
- [Desarrollo de Plugins](#desarrollo-de-plugins)
- [Ayuda](#ayuda)

## Info

TrovoBot es un poderoso [Node.js](https://nodejs.org) bot de chat utilizando [Trovo.js](https://), esto te permite crear poderosos bots interactivos rápidamente y fácil con TrovoBot para la plataforma de Trovo.


## Uso del Bot de Chat

> Esto es un bot de Trovo.js, mostrando varios plugins. Porfavor sigue las directrices indicadas abajo para usar este ejemplo para mostrar un funcional bot de chat. :)

Abre `.env` y edita los valores indicados abajo:

* TROVO_EMAIL: Es el e-mail de la cuenta en la que se logueará el bot.
* TROVO_PASSWORD: Es la contraseñad de la cuenta en la que se logueará el bot.
* TROVO_PAGE: Es la página donde el bot funcionará.
* TROVO_BOTNAME: Bioblaze
* TROVO_PREFIX: Es el prefijo de los comandos, por ejemplo: !<comando> o ?<comando>


## Como ejecutar
> Llena los valores dentro del archivo `.env`, después continua.
> Abre la consola de comandos, y escribe lo listado en los pasos de abajo.
> Escribe: `npm install` ~ Una vez que la instalación se haya completado, continua.
> Para iniciar el bot, escribe: `node ./index.js`


## Desarrollo de Plugins

> ¡Todos los desarrollos son bienvenidos para hacer una "Pull Request" con los plugins que hayas creado!

### Ejemplo de Plugin de Comandos
* Estos plugins van dentro de la carpeta `/plugins/`.

```js
module.exports = {
	name: 'nombre',
	description: 'descripción',
	execute(message, args, user, bot) {
		bot.sendMessage(`Envía un mensaje aquí <3`);
	},
};
```
### Ejemplo de Plugin de Eventos
 * Estos plugins van dentro de la carpeta `/events/`. Nombrados: `Nombre.EventType.js`
 * Tipos válidos de eventos: json o text
 * Ejemplo del nombre de un evento en JSON: `viewercount.json.js`
 * Ejemplo del nombre de un evento en Text: `welcomer.text.js`

```js
module.exports = {
	event: 'evento aquí',
	description: 'descripción',
	execute(user, message, bot) {
		bot.sendMessage(`Manda un mensaje aquí <3`);
	},
};
```

## Contribuir

Antes de mandar un "issue", porfavor, primero asegúrate de que no esté ya reportado o sugerido.

## Ayuda

Si no entiendes alguna cosa en la documentación, estás experimentando errores, o simplemente necesitas un amable
empujón en la dirección correcta, porfavor no dudes en unirte a nuestro [Servidor de Trovo.js](https://discord.gg/Kc7fyx2) oficial.

## OBS Plugin

## HTTP Plugin de Overlay

Crea un archivo de datos JSON en: /modules/http/data/<archivoaquí.json>
Los plugins de eventos que muestran cosas están ubicados en: /events/http-overlay-text-*.js

URL http://localhost:<puerto que has elegido>/text/<archivoaquí> <-- archivoaquí es el nombre del archivo JSON que has creado, sin el .json
