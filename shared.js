// Toast
function toast(msg, type = 'default', duration = 2500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span class="toast-dot"></span>${msg}`;
  container.appendChild(el);
  setTimeout(() => {
    el.classList.add('out');
    el.addEventListener('animationend', () => el.remove());
  }, duration);
}

// Settings
function getSettings() {
  return JSON.parse(localStorage.getItem('settings') || '{"name":"","accent":"#a8c5a0"}');
}

function applyAccent() {
  const s = getSettings();
  if (s.accent) document.documentElement.style.setProperty('--accent', s.accent);
  // Derive dark version
  document.documentElement.style.setProperty('--accent-dark', hexToRgba(s.accent, 0.15));
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// Data export
function exportData() {
  const data = {
    exported: new Date().toISOString(),
    settings: getSettings(),
    journalEntries: JSON.parse(localStorage.getItem('journalEntries') || '{}'),
    habits: JSON.parse(localStorage.getItem('habits') || '[]'),
    checks: JSON.parse(localStorage.getItem('checks') || '{}'),
  };
  // Tasks (all days)
  const tasks = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('tasks_')) tasks[key.replace('tasks_','')] = JSON.parse(localStorage.getItem(key));
  }
  data.tasks = tasks;

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `my-journal-export-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  toast('Data exported', 'success');
}

// Keyboard shortcut hint
function showShortcut(el, key) {
  const kbd = document.createElement('kbd');
  kbd.textContent = key;
  kbd.style.cssText = `
    font-size:0.65rem;color:var(--text-dim);background:var(--surface2);
    border:1px solid var(--border);border-radius:4px;padding:1px 5px;
    font-family:inherit;margin-left:6px;
  `;
  el.appendChild(kbd);
}

// Apply accent on every page load
document.addEventListener('DOMContentLoaded', applyAccent);
