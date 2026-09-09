// Qiratul Quran — basic app behavior
// This file will grow as we add more features (audio, bookmarks, etc.)

(function () {
  const root = document.documentElement;

  /* ---------------------------------------------------------
     Theme (light / dark)
  --------------------------------------------------------- */
  const toggleBtn = document.getElementById('themeToggle');

  const saved = localStorage.getItem('qq-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = saved || (systemPrefersDark ? 'dark' : 'light');

  if (initialTheme === 'dark') {
    root.setAttribute('data-theme', 'dark');
  }

  if (toggleBtn) {
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
  }

  /* ---------------------------------------------------------
     Font size preferences (applied on every page)
  --------------------------------------------------------- */
  const arabicSize = localStorage.getItem('qq-arabic-size') || '28';
  const translationSize = localStorage.getItem('qq-translation-size') || '16';
  root.style.setProperty('--reader-arabic-size', arabicSize + 'px');
  root.style.setProperty('--reader-translation-size', translationSize + 'px');

  /* ---------------------------------------------------------
     Bookmarks — stored locally on this device for now.
     Once accounts are added, these will sync to your account.
  --------------------------------------------------------- */
  function getBookmarks() {
    try {
      return JSON.parse(localStorage.getItem('qq-bookmarks') || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveBookmarks(list) {
    localStorage.setItem('qq-bookmarks', JSON.stringify(list));
  }

  window.QQBookmarks = {
    list: getBookmarks,
    isBookmarked: function (surah, ayah) {
      return getBookmarks().some(function (b) { return b.surah === surah && b.ayah === ayah; });
    },
    add: function (bookmark) {
      const list = getBookmarks();
      if (!list.some(function (b) { return b.surah === bookmark.surah && b.ayah === bookmark.ayah; })) {
        list.unshift(Object.assign({ savedAt: Date.now() }, bookmark));
        saveBookmarks(list);
      }
    },
    remove: function (surah, ayah) {
      saveBookmarks(getBookmarks().filter(function (b) {
        return !(b.surah === surah && b.ayah === ayah);
      }));
    }
  };

  /* ---------------------------------------------------------
     Last read position — used by the Home screen's
     "Continue Reading" card.
  --------------------------------------------------------- */
  window.QQLastRead = {
    get: function () {
      try {
        return JSON.parse(localStorage.getItem('qq-last-read') || 'null');
      } catch (e) {
        return null;
      }
    },
    set: function (data) {
      localStorage.setItem('qq-last-read', JSON.stringify(Object.assign({ savedAt: Date.now() }, data)));
    }
  };

  /* ---------------------------------------------------------
     Preferred reciter + translation language (set in Settings)
  --------------------------------------------------------- */
  window.QQPrefs = {
    getReciter: function () {
      return localStorage.getItem('qq-reciter') || 'ar.alafasy';
    },
    setReciter: function (id) {
      localStorage.setItem('qq-reciter', id);
    },
    getTranslationLang: function () {
      return localStorage.getItem('qq-translation-lang') || 'en';
    },
    setTranslationLang: function (lang) {
      localStorage.setItem('qq-translation-lang', lang);
    }
  };
})();

