const KEY = 'percia_iptv_profiles_v1';
const ACTIVE = 'percia_iptv_active_v1';
export function getProfiles() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } }
export function saveProfile(profile) {
  const profiles = getProfiles().filter(p => p.id !== profile.id);
  profiles.push(profile); localStorage.setItem(KEY, JSON.stringify(profiles));
}
export function getActiveProfile() {
  const id = localStorage.getItem(ACTIVE);
  return getProfiles().find(p => p.id === id) || null;
}
export function setActiveProfile(id) { localStorage.setItem(ACTIVE, id); }
