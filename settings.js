// Qiratul Quran — Settings page

(function () {
  const root = document.documentElement;

  const themeSegmented = document.getElementById('themeSegmented');
  const langSegmented = document.getElementById('langSegmented');
  const arabicSizeSlider = document.getElementById('arabicSizeSlider');
  const translationSizeSlider = document.getElementById('translationSizeSlider');
  const reciterSelect = document.getElementById('reciterSelect');

  function setSegmentedActive(group, value) {
    group.querySelectorAll('button').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.dataset.value === value);
    });
  }

  // Initialize from saved preferences
  const currentTheme = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  setSegmentedActive(themeSegmented, currentTheme);

  const currentLang = window.QQPrefs.getTranslationLang();
  setSegmentedActive(langSegmented, currentLang);

  arabicSizeSlider.value = localStorage.getItem('qq-arabic-size') || '28';
  translationSizeSlider.value = localStorage.getItem('qq-translation-size') || '16';
  reciterSelect.value = window.QQPrefs.getReciter();

  // Theme
  themeSegmented.addEventListener('click', function (e) {
    const btn = e.target.closest('button');
    if (!btn) return;
    const value = btn.dataset.value;
    if (value === 'dark') {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('qq-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
      localStorage.setItem('qq-theme', 'light');
    }
    setSegmentedActive(themeSegmented, value);
  });

  // Translation language
  langSegmented.addEventListener('click', function (e) {
    const btn = e.target.closest('button');
    if (!btn) return;
    const value = btn.dataset.value;
    window.QQPrefs.setTranslationLang(value);
    setSegmentedActive(langSegmented, value);
  });

  // Font sizes
  arabicSizeSlider.addEventListener('input', function () {
    root.style.setProperty('--reader-arabic-size', this.value + 'px');
    localStorage.setItem('qq-arabic-size', this.value);
  });

  translationSizeSlider.addEventListener('input', function () {
    root.style.setProperty('--reader-translation-size', this.value + 'px');
    localStorage.setItem('qq-translation-size', this.value);
  });

  // Reciter
  reciterSelect.addEventListener('change', function () {
    window.QQPrefs.setReciter(this.value);
  });
})();
