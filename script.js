// Qiratul Quran — basic app behavior
// This file will grow as we add more features (audio, bookmarks, etc.)

(function () {
  const root = document.documentElement;
  const toggleBtn = document.getElementById('themeToggle');

  // 1. On load: use saved preference, or fall back to the device's system setting
  const saved = localStorage.getItem('qq-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = saved || (systemPrefersDark ? 'dark' : 'light');

  if (initialTheme === 'dark') {
    root.setAttribute('data-theme', 'dark');
  }

  // 2. Toggle button: switch theme and remember the choice
  toggleBtn.addEventListener('click', function () {
    const isDark = root.getAttribute('data-theme') === 'dark';
    if (isDark) {
      root.removeAttribute('data-theme');
      localStorage.setItem('qq-theme', 'light');
    } else {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('qq-theme', 'dark');
    }
  });
})();
