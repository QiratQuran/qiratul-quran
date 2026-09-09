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
  /* ---------------------------------------------------------
     Tajweed parser — converts AlQuran Cloud's "quran-tajweed"
     edition markup into color-coded HTML spans. Rule codes and
     colors follow the standard mapping used by AlQuran Cloud's
     own parser libraries (see alquran.cloud/tajweed-guide).
  --------------------------------------------------------- */
  window.QQTajweed = {
    rules: {
      h: { name: 'Hamzat ul Wasl', desc: 'A connecting hamza that is dropped in continuous recitation.' },
      s: { name: 'Silent', desc: 'A letter that is written but not pronounced.' },
      l: { name: 'Lam Shamsiyyah', desc: 'A silent "laam" before a sun letter, which is instead doubled into the following letter.' },
      n: { name: 'Normal Prolongation', desc: 'Madd of 2 vowel counts (harakat).' },
      p: { name: 'Permissible Prolongation', desc: 'Madd of 2, 4, or 6 vowel counts, reciter\u2019s choice.' },
      m: { name: 'Necessary Prolongation', desc: 'Madd of 6 vowel counts.' },
      q: { name: 'Qalqalah', desc: 'A slight bounce/echo added to certain letters when they carry a sukoon.' },
      o: { name: 'Obligatory Prolongation', desc: 'Madd of 4 to 5 vowel counts.' },
      c: { name: 'Ikhfa Shafawi', desc: 'Concealment of a silent meem before the letter baa.' },
      f: { name: 'Ikhfa', desc: 'Concealment of noon sakinah or tanween before certain letters.' },
      w: { name: 'Idgham Shafawi', desc: 'Merging a silent meem into a following meem.' },
      i: { name: 'Iqlab', desc: 'Converting noon sakinah or tanween into a meem sound before baa.' },
      a: { name: 'Idgham (with Ghunnah)', desc: 'Merging noon sakinah or tanween into a following letter, with a nasal sound.' },
      u: { name: 'Idgham (without Ghunnah)', desc: 'Merging noon sakinah or tanween into a following letter, without a nasal sound.' },
      d: { name: 'Idgham Mutajanisayn', desc: 'Merging two letters that share the same articulation point.' },
      b: { name: 'Idgham Mutaqaribayn', desc: 'Merging two letters with close articulation points.' },
      g: { name: 'Ghunnah', desc: 'A nasal sound held for 2 vowel counts on meem or noon with shaddah.' }
    },
    render: function (text) {
      if (!text) return '';
      return text.replace(/\[(\w+)(?::\d+)?\[([^\]]+)\]/g, function (match, code, content) {
        return '<span class="tw-' + code + '">' + content + '</span>';
      });
    }
  };
})();

