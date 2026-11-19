import { getProfiles, saveProfile, getActiveProfile, setActiveProfile } from './profiles.js';
import { loadProfileContent } from './playlist.js';
import { openPlayer } from './player.js';

const $ = (id) => document.getElementById(id);
const views = ['welcomeView','homeView','catalogView'];
let content = { live: [], movies: [], series: [] };
let currentSection = 'live';
let currentCategory = 'Todos';

function showView(id) {
  views.forEach(v => $(v).classList.toggle('active', v === id));
  document.querySelectorAll('[data-nav]').forEach(b => b.classList.toggle('selected', b.dataset.nav === (id === 'catalogView' ? currentSection : 'home')));
}
function openProfiles() { $('profileDialog').showModal(); }
function updateConnectionFields() {
  const xtream = $('connectionType').value === 'xtream';
  $('xtreamFields').hidden = !xtream;
  $('m3uFields').hidden = xtream;
}
function renderHome() {
  const profile = getActiveProfile();
  if (!profile) { showView('welcomeView'); return; }
  $('activeProfileName').textContent = profile.name;
  showView('homeView');
}
function renderCatalog() {
  const titles = {live:'TV EN VIVO',movies:'PELÍCULAS',series:'SERIES'};
  $('catalogTitle').textContent = titles[currentSection];
  $('catalogEyebrow').textContent = 'PERCIA / ' + currentSection.toUpperCase();
  const items = content[currentSection] || [];
  const categories = ['Todos', ...new Set(items.map(x => x.category || 'General'))];
  $('categoryStrip').innerHTML = categories.map(c => `<button class="category-pill ${c===currentCategory?'active':''}" data-category="${escapeHtml(c)}">${escapeHtml(c)}</button>`).join('');
  const query = $('searchInput').value.trim().toLowerCase();
  const filtered = items.filter(x => (currentCategory === 'Todos' || (x.category || 'General') === currentCategory) && x.name.toLowerCase().includes(query));
  $('catalogStatus').textContent = items.length ? `${filtered.length} elementos` : 'No hay contenido cargado en esta sección.';
  $('catalogGrid').innerHTML = filtered.map((item, i) => `<button class="media-card" data-item="${i}" data-id="${escapeHtml(item.id || '')}">${item.logo ? `<img src="${escapeHtml(item.logo)}" loading="lazy" onerror="this.style.display='none'">` : `<span class="poster-placeholder">${escapeHtml(item.name.slice(0,1).toUpperCase())}</span>`}<strong>${escapeHtml(item.name)}</strong></button>`).join('');
  // Guardar la selección filtrada para abrir el elemento correcto.
  window.__visibleItems = filtered;
  showView('catalogView');
}
function escapeHtml(value='') { return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

async function connectProfile(profile) {
  $('catalogStatus').textContent = 'Cargando contenido…';
  try {
    content = await loadProfileContent(profile);
    renderHome();
  } catch (error) {
    alert(`No se pudo cargar la lista: ${error.message}`);
    renderHome();
  }
}

$('profileButton').addEventListener('click', openProfiles);
$('addFirstProfile').addEventListener('click', openProfiles);
$('connectionType').addEventListener('change', updateConnectionFields);
document.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => $(b.dataset.close).close()));
$('profileForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const type = $('connectionType').value;
  const profile = { id: crypto.randomUUID(), name: $('profileName').value.trim(), type, createdAt: Date.now() };
  if (type === 'xtream') {
    profile.server = $('serverUrl').value.trim().replace(/\/+$/,'');
    profile.username = $('username').value.trim();
    profile.password = $('password').value;
    if (!profile.server || !profile.username || !profile.password) return alert('Completa servidor, usuario y contraseña.');
  } else {
    profile.url = $('playlistUrl').value.trim();
    const file = $('playlistFile').files[0];
    if (!profile.url && !file) return alert('Introduce una URL o selecciona un archivo M3U.');
    if (file) profile.fileText = await file.text();
  }
  saveProfile(profile);
  setActiveProfile(profile.id);
  $('profileDialog').close();
  await connectProfile(profile);
});
document.querySelectorAll('[data-section],[data-nav]').forEach(button => button.addEventListener('click', () => {
  const section = button.dataset.section || button.dataset.nav;
  if (section === 'home') return renderHome();
  currentSection = section; currentCategory = 'Todos'; $('searchInput').value = ''; renderCatalog();
}));
$('backHome').addEventListener('click', renderHome);
$('searchInput').addEventListener('input', renderCatalog);
$('categoryStrip').addEventListener('click', e => {
  const b = e.target.closest('[data-category]'); if (!b) return;
  currentCategory = b.dataset.category; renderCatalog();
});
$('catalogGrid').addEventListener('click', e => {
  const card = e.target.closest('[data-item]'); if (!card) return;
  const item = window.__visibleItems?.[Number(card.dataset.item)];
  if (item) openPlayer(item);
});

updateConnectionFields();
const active = getActiveProfile();
if (active) connectProfile(active); else showView('welcomeView');
