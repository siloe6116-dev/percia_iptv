PERCIA IPTV HTML — versión inicial

ORIENTACIÓN
- Interfaz y reproductor pensados para celulares Android.
- Abre index.html desde un servidor web local o publica la carpeta en un hosting HTTPS.
- Para instalar como PWA, sirve el proyecto por HTTPS y usa el menú del navegador "Instalar aplicación".

ESTRUCTURA
- index.html: estructura principal.
- css/style.css: estilos visuales.
- js/app.js: navegación y eventos.
- js/profiles.js: almacenamiento local de perfiles.
- js/playlist.js: lectura M3U y conexión Xtream.
- js/player.js: reproducción HTML5/HLS.

IMPORTANTE
1. En esta primera base, Xtream obtiene TV en vivo mediante M3U y películas/series desde la API.
2. La reproducción de VOD requiere que el servidor permita acceso directo desde el navegador.
3. Algunos servidores bloquean peticiones del navegador mediante CORS. En ese caso se necesitará un pequeño proxy/backend propio; no es un error del diseño.
4. Los datos de perfil se guardan en LocalStorage del navegador. La contraseña queda local sin cifrado en esta versión de prueba; no reutilices contraseñas sensibles.
5. La lista M3U genérica se clasifica por extensión de URL; series M3U se incorporarán con parser de temporadas/episodios en la siguiente fase.
6. HLS.js se carga desde CDN; requiere conexión a Internet. Para uso sin conexión, colocar hls.min.js en libs y cambiar la referencia en index.html.
Usa únicamente listas y servicios con autorización.
