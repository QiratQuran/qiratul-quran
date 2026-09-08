// Qiratul Quran — Quran list page
// Surah data is fetched live from AlQuran Cloud (api.alquran.cloud),
// a verified, widely-used Quran data source. We never type or store
// this data ourselves, so numbers and names always stay accurate.

(function () {
  const SURAH_API = 'https://api.alquran.cloud/v1/surah';

  const loadingState = document.getElementById('loadingState');
  const errorState = document.getElementById('errorState');
  const noResults = document.getElementById('noResults');
  const surahListEl = document.getElementById('surahList');
  const juzListEl = document.getElementById('juzList');
  const searchInput = document.getElementById('searchInput');
  const tabSurah = document.getElementById('tabSurah');
  const tabJuz = document.getElementById('tabJuz');
  const retryBtn = document.getElementById('retryBtn');

  let allSurahs = [];
  let activeTab = 'surah';

  function renderSurahList(surahs) {
    surahListEl.innerHTML = surahs.map(function (s) {
      const typeLabel = s.revelationType === 'Meccan' ? 'Makki' : 'Madani';
      return (
        '<li class="item-row">' +
          '<a class="item-link" href="#">' +
            '<span class="item-number">' + s.number + '</span>' +
            '<span class="item-main">' +
              '<span class="item-title">' + s.englishName + '</span>' +
              '<span class="item-meta">' + typeLabel + ' · ' + s.numberOfAyahs + ' Ayahs</span>' +
            '</span>' +
            '<span class="item-arabic" lang="ar" dir="rtl">' + s.name + '</span>' +
          '</a>' +
        '</li>'
      );
    }).join('');
  }

  function renderJuzList() {
    let html = '';
    for (let i = 1; i <= 30; i++) {
      html +=
        '<li class="item-row">' +
          '<a class="item-link" href="#">' +
            '<span class="item-number">' + i + '</span>' +
            '<span class="item-main">' +
              '<span class="item-title">Juz ' + i + '</span>' +
            '</span>' +
          '</a>' +
        '</li>';
    }
    juzListEl.innerHTML = html;
  }

  function applySearch() {
    const query = searchInput.value.trim().toLowerCase();

    if (activeTab !== 'surah') return;

    if (!query) {
      renderSurahList(allSurahs);
      surahListEl.hidden = false;
      noResults.hidden = true;
      return;
    }

    const filtered = allSurahs.filter(function (s) {
      return (
        s.englishName.toLowerCase().includes(query) ||
        s.englishNameTranslation.toLowerCase().includes(query) ||
        String(s.number) === query
      );
    });

    renderSurahList(filtered);
    surahListEl.hidden = filtered.length === 0;
    noResults.hidden = filtered.length !== 0;
  }

  function switchTab(tab) {
    activeTab = tab;
    const isSurah = tab === 'surah';

    tabSurah.classList.toggle('is-active', isSurah);
    tabJuz.classList.toggle('is-active', !isSurah);
    tabSurah.setAttribute('aria-selected', String(isSurah));
    tabJuz.setAttribute('aria-selected', String(!isSurah));

    surahListEl.hidden = !isSurah || allSurahs.length === 0;
    juzListEl.hidden = isSurah;
    noResults.hidden = true;
    searchInput.style.display = isSurah ? '' : 'none';

    if (!isSurah) {
      renderJuzList();
    } else {
      applySearch();
    }
  }

  function loadSurahs() {
    loadingState.hidden = false;
    errorState.hidden = true;
    surahListEl.hidden = true;

    fetch(SURAH_API)
      .then(function (res) {
        if (!res.ok) throw new Error('Network response was not OK');
        return res.json();
      })
      .then(function (json) {
        allSurahs = json.data;
        loadingState.hidden = true;
        renderSurahList(allSurahs);
        surahListEl.hidden = false;
      })
      .catch(function () {
        loadingState.hidden = true;
        errorState.hidden = false;
      });
  }

  searchInput.addEventListener('input', applySearch);
  tabSurah.addEventListener('click', function () { switchTab('surah'); });
  tabJuz.addEventListener('click', function () { switchTab('juz'); });
  retryBtn.addEventListener('click', loadSurahs);

  loadSurahs();
})();
