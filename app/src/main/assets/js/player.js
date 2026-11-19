let hls = null;
const dialog = document.getElementById('playerDialog');
const video = document.getElementById('videoPlayer');
export function openPlayer(item) {
  const title = document.getElementById('playingTitle');
  const meta = document.getElementById('playingMeta');
  const message = document.getElementById('playerMessage');
  title.textContent = item.name;
  meta.textContent = item.category || 'PERCIA IPTV';
  message.textContent = '';
  if (!item.url) { message.textContent = 'Este elemento no tiene una URL de reproducción directa.'; dialog.showModal(); return; }
  stopPlayer();
  dialog.showModal();
  const url = item.url;
  if (window.Hls && Hls.isSupported() && /\.m3u8($|\?)/i.test(url)) {
    hls = new Hls({enableWorker:true});
    hls.loadSource(url); hls.attachMedia(video);
    hls.on(Hls.Events.ERROR, (_, data) => { if (data.fatal) message.textContent = 'Error de reproducción. Comprueba la URL, el acceso y CORS del servidor.'; });
  } else {
    video.src = url;
  }
  video.play().catch(() => { message.textContent = 'Pulsa reproducir. Si no inicia, el formato o el servidor podría no ser compatible.'; });
}
function stopPlayer() {
  if (hls) { hls.destroy(); hls = null; }
  video.pause(); video.removeAttribute('src'); video.load();
}
document.getElementById('closePlayer').addEventListener('click', () => { stopPlayer(); dialog.close(); });
dialog.addEventListener('close', stopPlayer);
