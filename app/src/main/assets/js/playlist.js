// Carga listas M3U/M3U8 y catálogos Xtream Codes.
export async function loadProfileContent(profile) {
  let text;
  if (profile.type === 'xtream') {
    const base = profile.server.replace(/\/+$/,'');
    const auth = `username=${encodeURIComponent(profile.username)}&password=${encodeURIComponent(profile.password)}`;
    const [live, movies, series] = await Promise.all([
      fetchText(`${base}/get.php?${auth}&type=m3u_plus&output=ts`),
      fetchJson(`${base}/player_api.php?${auth}&action=get_vod_streams`),
      fetchJson(`${base}/player_api.php?${auth}&action=get_series`)
    ]);
    return {
      live: parseM3U(live),
      movies: (movies || []).map(x => ({id:x.stream_id,name:x.name || 'Película',logo:x.stream_icon || '',url:`${base}/movie/${encodeURIComponent(profile.username)}/${encodeURIComponent(profile.password)}/${x.stream_id}.${x.container_extension || 'mp4'}`,category:x.category_name || 'Películas'})),
      series: (series || []).map(x => ({id:x.series_id,name:x.name || 'Serie',logo:x.cover || '',category:x.category_name || 'Series',seriesId:x.series_id}))
    };
  }
  text = profile.fileText || await fetchText(profile.url);
  return splitContent(parseM3U(text));
}
async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.text();
}
async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}
export function parseM3U(text) {
  const lines = text.replace(/^\uFEFF/,'').split(/\r?\n/);
  const items = [];
  let current = null;
  for (const line of lines) {
    if (line.startsWith('#EXTINF:')) {
      const name = line.split(',').slice(1).join(',').trim() || 'Sin título';
      const attr = (key) => (line.match(new RegExp(`${key}="([^"]*)"`,'i')) || [])[1] || '';
      current = {name, logo:attr('tvg-logo'), category:attr('group-title') || 'General', id:attr('tvg-id'), url:''};
    } else if (line.trim() && !line.trim().startsWith('#') && current) {
      current.url = line.trim(); items.push(current); current = null;
    }
  }
  return items;
}
function splitContent(items) {
  return {
    live: items.filter(x => /\.(m3u8|ts)(\?|$)/i.test(x.url) || !/\.(mp4|mkv|avi)(\?|$)/i.test(x.url)),
    movies: items.filter(x => /\.(mp4|mkv|avi)(\?|$)/i.test(x.url)),
    series: []
  };
}
