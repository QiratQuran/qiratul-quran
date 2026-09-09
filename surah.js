// Qiratul Quran — Quran Reader page
// Arabic text, translations, and audio are fetched live from
// AlQuran Cloud (api.alquran.cloud), a verified Quran data source.
// Nothing here is typed or altered by us — we only display what
// the source returns, exactly as received.

(function () {
  const params = new URLSearchParams(window.location.search);
  const surahNumber = parseInt(params.get('surah'), 10) || 1;
  const jumpToAyah = parseInt(params.get('ayah'), 10) || null;

  const ARABIC_EDITION = 'quran-uthmani';
  const TAJWEED_EDITION = 'quran-tajweed';
  const translationLang = window.QQPrefs.getTranslationLang();
  const TRANSLATION_EDITION = translationLang === 'ur' ? 'ur.jalandhry' : 'en.sahih';
  const reciter = window.QQPrefs.getReciter();

  const API_URL =
    'https://api.alquran.cloud/v1/surah/' + surahNumber +
    '/editions/' + ARABIC_EDITION + ',' + TAJWEED_EDITION + ',' + TRANSLATION_EDITION + ',' + reciter;

  const loadingState = document.getElementById('loadingState');
  const errorState = document.getElementById('errorState');
  const surahHeader = document.getElementById('surahHeader');
  const ayahList = document.getElementById('ayahList');
  const surahTitle = document.getElementById('surahTitle');
  const surahArabicName = document.getElementById('surahArabicName');
  const surahMeta = document.getElementById('surahMeta');
  const bismillah = document.getElementById('bismillah');
  const retryBtn = document.getElementById('retryBtn');
  const audioBar = document.getElementById('audioBar');
  const audioPlayer = document.getElementById('audioPlayer');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const prevAyahBtn = document.getElementById('prevAyahBtn');
  const nextAyahBtn = document.getElementById('nextAyahBtn');
  const audioLabel = document.getElementById('audioLabel');
  const fontSizeBtn = document.getElementById('fontSizeBtn');
  const fontPopover = document.getElementById('fontPopover');
  const arabicSizeSlider = document.getElementById('arabicSizeSlider');
  const translationSizeSlider = document.getElementById('translationSizeSlider');
  const tajweedBtn = document.getElementById('tajweedBtn');

  let ayahs = [];
  let currentAyahIndex = 0;
  let isPlaying = false;
  let surahData = null;
  let tajweedOn = localStorage.getItem('qq-tajweed-on') !== 'false';

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function renderAyahs() {
    ayahList.innerHTML = ayahs.map(function (a, i) {
      const bookmarked = window.QQBookmarks.isBookmarked(surahNumber, a.numberInSurah);
      const arabicHtml = tajweedOn && a.tajweedText
        ? window.QQTajweed.render(a.tajweedText)
        : escapeHtml(a.arabicText);
      return (
        '<li class="ayah-item" data-index="' + i + '" data-ayah="' + a.numberInSurah + '">' +
          '<div class="ayah-arabic-row">' +
            '<p class="ayah-arabic" lang="ar" dir="rtl">' + arabicHtml + ' ' +
              '<span class="ayah-number-badge">' + a.numberInSurah + '</span>' +
            '</p>' +
          '</div>' +
          '<p class="ayah-translation">' + escapeHtml(a.translationText) + '</p>' +
          '<div class="ayah-actions">' +
            '<button class="ayah-action-btn bookmark-btn' + (bookmarked ? ' is-active' : '') + '" data-action="bookmark" aria-label="Bookmark this Ayah">' +
              '<svg viewBox="0 0 24 24" fill="' + (bookmarked ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="1.5"><path d="M6 3.5h9a1.5 1.5 0 0 1 1.5 1.5v16l-6-4-6 4V5A1.5 1.5 0 0 1 6 3.5Z"/></svg>' +
            '</button>' +
            '<button class="ayah-action-btn" data-action="copy" aria-label="Copy this Ayah">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="8" y="8" width="12" height="12" rx="1.5"/><path d="M5 15.5H4.5A1.5 1.5 0 0 1 3 14V5.5A1.5 1.5 0 0 1 4.5 4H13a1.5 1.5 0 0 1 1.5 1.5V6"/></svg>' +
            '</button>' +
            '<button class="ayah-action-btn" data-action="share" aria-label="Share this Ayah">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="18" cy="5" r="2.3"/><circle cx="6" cy="12" r="2.3"/><circle cx="18" cy="19" r="2.3"/><path d="m8.1 10.8 7.8-4.2M8.1 13.2l7.8 4.2"/></svg>' +
            '</button>' +
            '<button class="ayah-action-btn" data-action="play" aria-label="Play this Ayah">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M9.7 8.3v7.4l6-3.7-6-3.7Z"/></svg>' +
            '</button>' +
          '</div>' +
        '</li>'
      );
    }).join('');
  }

  function loadSurah() {
    loadingState.hidden = false;
    errorState.hidden = true;
    surahHeader.hidden = true;
    ayahList.hidden = true;
    audioBar.hidden = true;

    fetch(API_URL)
      .then(function (res) {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(function (json) {
        const editions = json.data;
        const arabicData = editions[0];
        const tajweedData = editions[1];
        const translationData = editions[2];
        const audioData = editions[3];

        surahData = arabicData;

        ayahs = arabicData.ayahs.map(function (a, i) {
          return {
            numberInSurah: a.numberInSurah,
            arabicText: a.text,
            tajweedText: tajweedData.ayahs[i] ? tajweedData.ayahs[i].text : null,
            translationText: translationData.ayahs[i].text,
            audioUrl: audioData.ayahs[i].audio
          };
        });

        surahTitle.textContent = arabicData.englishName;
        surahArabicName.textContent = arabicData.name;
        surahMeta.textContent =
          (arabicData.revelationType === 'Meccan' ? 'Makki' : 'Madani') +
          ' · ' + arabicData.numberOfAyahs + ' Ayahs';
        document.getElementById('translationSource').textContent =
          'Translation: ' + translationData.englishName + ' · Recitation: ' + audioData.englishName;

        // Surah 9 (At-Tawbah) traditionally has no opening Bismillah
        bismillah.style.display = (surahNumber === 9) ? 'none' : '';

        loadingState.hidden = true;
        surahHeader.hidden = false;
        ayahList.hidden = false;
        audioBar.hidden = false;

        renderAyahs();

        // Scroll to a specific ayah if requested (from bookmarks/last-read)
        if (jumpToAyah) {
          const target = ayahList.querySelector('[data-ayah="' + jumpToAyah + '"]');
          if (target) {
            setTimeout(function () {
              target.scrollIntoView({ behavior: 'smooth', block: 'center' });
              target.classList.add('is-highlighted');
              setTimeout(function () { target.classList.remove('is-highlighted'); }, 2200);
            }, 200);
          }
        }
      })
      .catch(function () {
        loadingState.hidden = true;
        errorState.hidden = false;
      });
  }

  /* ---------------------------------------------------------
     Ayah actions: bookmark / copy / share / play-single
  --------------------------------------------------------- */
  ayahList.addEventListener('click', function (e) {
    const btn = e.target.closest('.ayah-action-btn');
    if (!btn) return;

    const li = btn.closest('.ayah-item');
    const index = parseInt(li.getAttribute('data-index'), 10);
    const ayah = ayahs[index];
    const action = btn.getAttribute('data-action');

    if (action === 'bookmark') {
      const isBookmarked = window.QQBookmarks.isBookmarked(surahNumber, ayah.numberInSurah);
      if (isBookmarked) {
        window.QQBookmarks.remove(surahNumber, ayah.numberInSurah);
        btn.classList.remove('is-active');
        btn.querySelector('svg').setAttribute('fill', 'none');
      } else {
        window.QQBookmarks.add({
          surah: surahNumber,
          ayah: ayah.numberInSurah,
          surahName: surahData.englishName,
          arabicSnippet: ayah.arabicText.slice(0, 60),
          translationSnippet: ayah.translationText.slice(0, 90)
        });
        btn.classList.add('is-active');
        btn.querySelector('svg').setAttribute('fill', 'currentColor');
      }
    }

    if (action === 'copy') {
      const text = ayah.arabicText + '\n\n' + ayah.translationText +
        '\n\n(' + surahData.englishName + ' ' + surahNumber + ':' + ayah.numberInSurah + ' — Qiratul Quran)';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
      }
      btn.classList.add('is-flashed');
      setTimeout(function () { btn.classList.remove('is-flashed'); }, 900);
    }

    if (action === 'share') {
      const shareText = ayah.arabicText + '\n\n' + ayah.translationText +
        '\n\n(' + surahData.englishName + ' ' + surahNumber + ':' + ayah.numberInSurah + ')';
      if (navigator.share) {
        navigator.share({ text: shareText }).catch(function () {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText);
        btn.classList.add('is-flashed');
        setTimeout(function () { btn.classList.remove('is-flashed'); }, 900);
      }
    }

    if (action === 'play') {
      playAyah(index);
    }
  });

  /* ---------------------------------------------------------
     Audio playback
  --------------------------------------------------------- */
  function setActiveAyah(index) {
    ayahList.querySelectorAll('.ayah-item').forEach(function (li) {
      li.classList.remove('is-playing');
    });
    const li = ayahList.querySelector('[data-index="' + index + '"]');
    if (li) li.classList.add('is-playing');
    audioLabel.textContent = 'Ayah ' + ayahs[index].numberInSurah;

    window.QQLastRead.set({
      surah: surahNumber,
      surahName: surahData.englishName,
      ayah: ayahs[index].numberInSurah,
      totalAyahs: surahData.numberOfAyahs
    });
  }

  function playAyah(index) {
    if (index < 0 || index >= ayahs.length) return;
    currentAyahIndex = index;
    setActiveAyah(index);
    audioPlayer.src = ayahs[index].audioUrl;
    audioPlayer.play();
    isPlaying = true;
    updatePlayButton();
  }

  function updatePlayButton() {
    playPauseBtn.querySelector('.icon-play').hidden = isPlaying;
    playPauseBtn.querySelector('.icon-pause').hidden = !isPlaying;
  }

  playPauseBtn.addEventListener('click', function () {
    if (!audioPlayer.src) {
      playAyah(0);
      return;
    }
    if (isPlaying) {
      audioPlayer.pause();
      isPlaying = false;
    } else {
      audioPlayer.play();
      isPlaying = true;
    }
    updatePlayButton();
  });

  prevAyahBtn.addEventListener('click', function () { playAyah(currentAyahIndex - 1); });
  nextAyahBtn.addEventListener('click', function () { playAyah(currentAyahIndex + 1); });

  audioPlayer.addEventListener('ended', function () {
    if (currentAyahIndex < ayahs.length - 1) {
      playAyah(currentAyahIndex + 1);
    } else {
      isPlaying = false;
      updatePlayButton();
    }
  });

  /* ---------------------------------------------------------
     Font size popover
  --------------------------------------------------------- */
  arabicSizeSlider.value = localStorage.getItem('qq-arabic-size') || '28';
  translationSizeSlider.value = localStorage.getItem('qq-translation-size') || '16';

  fontSizeBtn.addEventListener('click', function () {
    fontPopover.hidden = !fontPopover.hidden;
  });

  arabicSizeSlider.addEventListener('input', function () {
    document.documentElement.style.setProperty('--reader-arabic-size', this.value + 'px');
    localStorage.setItem('qq-arabic-size', this.value);
  });

  translationSizeSlider.addEventListener('input', function () {
    document.documentElement.style.setProperty('--reader-translation-size', this.value + 'px');
    localStorage.setItem('qq-translation-size', this.value);
  });

  retryBtn.addEventListener('click', loadSurah);

  tajweedBtn.classList.toggle('is-active', tajweedOn);
  tajweedBtn.addEventListener('click', function () {
    tajweedOn = !tajweedOn;
    localStorage.setItem('qq-tajweed-on', String(tajweedOn));
    tajweedBtn.classList.toggle('is-active', tajweedOn);
    if (ayahs.length) renderAyahs();
  });

  loadSurah();
})();
