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

## Tabla de contenido

- [Info](#info)
- [Uso del Bot de Chat](#uso-del-bot-de-chat)
- [Contribuir](#contribuir)
- [Desarrollo de Plugins](#desarrollo-de-plugins)
- [Ayuda](#ayuda)

## Info

TrovoBot es un poderoso [Node.js](https://nodejs.org) Bot de Chat utilizando [Trovo.js](https://github.com/Bioblaze/Trovo.js) esto permite crear bots interactivos rápidamente y fácilmente con TrovoBot para la plataforma de Trovo.

## Uso del Bot de Chat
> Esto es un bot de Trovo.js, mostrando varios plugins. Porfavor, sigue las directrices listadas debajo para usar este ejemplo del bot.

Abre el archivo `.env` y edita los valores listados.

*  TROVO_EMAIL: Es el Email de la Cuenta con al que vas a iniciar sesión.
*  TROVO_PASSWORD: Es la Contraseña de la Cuenta con la que vas a iniciar sesión.
*  TROVO_PAGE: Será la Página en la que el Bot estará operando.
*  TROVO_BOTNAME: Friext
*  TROVO_PREFIX: Es el Prefijo al que tu bot va a responder ej. !pong es decir '!' es el prefijo
*  OBS_ACTIVE=0 // Opcional para Activar el WebSocket Support de OBS Pon OBS_ACTIVE=0 a OBS_ACTIVE=1
*  HTTP_OVERLAY=0 // Opcional para Activar el Overlay Support del Navegador Pon HTTP_OVERLAY=0 a HTTP_OVERLAY=1
*  HTTP_PORT=9999
*  FILTERSYSTEM=0
*  CAPS_RATE_BAN_THRESHOLD=0.4
*  BADWORDS_LANG=es

## Instalación

Video: [¿Cómo instalar TrovoBot?](https://www.youtube.com/watch?v=iqK9VnynclM)

> Llena los Valores de dentro del archivo `.env` para continuar.> Abre la Línea de comandos de la Consola, y escribe los pasos listados debajo.
> Escribe: `npm install` ~ Una vez que la instalación ha sido completada, continúa.> Para abrir el Bot escribe: `node ./index.js`
> Alternativamente, en la carpeta <q>bat</q>, después de completar el archivo`.env`, ejecuta `install-deps.bat` después ejecuta `startup-bot.bat`

## Desarrollo de Plugin

> ¡Todos los desarrollos son bienvenidos a hacer "Pull Requestes" con los plugins que hayas creado!

### Ejemplo de Plugin de Comando de Chat
*Estos plugins van dentro de la carpeta `/plugins/`

```js
module.exports = {
	name: 'name',
	description: 'Description',
	execute(message, args, user, bot) {
		bot.sendMessage(`Send a Message Here <3`);
	},
};
```

### Ejemplo de Plugin de Evento
* Estos plugins van dentro de la carpeta `/events/` Llamados `Name.EventType.js`
* Tipos de eventos válidos: json o text
* Ejemplo del nombre de un evento de JSON: `viewercount.json.js`
* Ejemplo del nombre de un evento de Text: `welcomer.text.js`

```js
module.exports = {
	event: 'event here',
	description: 'Description',
	execute(user, message, bot) {
		bot.sendMessage(`Send a Message Here <3`);
	},
};
```

## Contribuir

Antes de crear una "issue", porfavor asegúrate de que no haya alguna ya creada.

## Ayuda

Si no entiendes algo en la documentación, o estás experimentando problemas, o simplemente necesitas un amable

empujón en dirección correcta, porfavor, no dudes en unirte a nuestro [Servidor de Trovo.js](https://discord.gg/Kc7fyx2) oficial.

## Plugin de OBS

## Plugin de Overlay vía HTTP

Crea un archivo de Datos JSO en /modules/http/data/<filehere></filehere>

Los plugins de Eventos que muestran cosas se localizan en /events/http-overlay-text-\*.js

URL http://localhost:<port you selected>/text/<filehere> &lt;-- El filehere es el nombre del archivo json que has creado sin .json</filehere></port>

