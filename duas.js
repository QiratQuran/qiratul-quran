// Qiratul Quran — Duas page
// Content is fetched live from api.islamic.app, which serves the
// Hisn al-Muslim (Fortress of the Muslim) collection. We never type
// or alter this content — only display what the source returns.

(function () {
  const API_BASE = 'https://api.islamic.app/v1/dhikr';

  // Curated, friendly labels for the categories we highlight on the grid.
  // (The API itself has 132 categories; we surface the most commonly used ones,
  // matching the "shortcuts" it documents.)
  const FEATURED = [
    { key: 'morning', label: 'Morning Adhkar', icon: 'sun' },
    { key: 'evening', label: 'Evening Adhkar', icon: 'moon' },
    { key: 'after-prayer', label: 'After Prayer', icon: 'check' },
    { key: 'before-sleep', label: 'Before Sleeping', icon: 'moon' },
    { key: 'waking-up', label: 'Upon Waking', icon: 'sun' },
    { key: 'food', label: 'Food & Drink', icon: 'heart' },
    { key: 'travel', label: 'Travel', icon: 'heart' },
    { key: 'home', label: 'Home', icon: 'heart' },
    { key: 'anxiety', label: 'Anxiety & Distress', icon: 'heart' },
    { key: 'protection', label: 'Protection', icon: 'heart' },
    { key: 'forgiveness', label: 'Forgiveness', icon: 'heart' },
    { key: 'mosque', label: 'Mosque', icon: 'heart' }
  ];

  const params = new URLSearchParams(window.location.search);
  const activeCategory = params.get('cat');

  const categoryGrid = document.getElementById('categoryGrid');
  const categoryIntro = document.getElementById('categoryIntro');
  const duasTitle = document.getElementById('duasTitle');
  const duasBackLink = document.getElementById('duasBackLink');
  const loadingState = document.getElementById('loadingState');
  const errorState = document.getElementById('errorState');
  const duaList = document.getElementById('duaList');
  const retryBtn = document.getElementById('retryBtn');

  function renderCategoryGrid() {
    categoryGrid.innerHTML = FEATURED.map(function (c) {
      return (
        '<a class="dua-category-card" href="duas.html?cat=' + c.key + '">' +
          '<span class="dua-category-label">' + c.label + '</span>' +
        '</a>'
      );
    }).join('');
  }

  function renderDuas(label, duas) {
    duasTitle.textContent = label;
    duaList.innerHTML = duas.map(function (d) {
      return (
        '<li class="dua-item">' +
          '<p class="dua-arabic" lang="ar" dir="rtl">' + d.ar.text + '</p>' +
          '<p class="dua-translation">' + d.en.text + '</p>' +
        '</li>'
      );
    }).join('');
  }

  function loadCategory(key) {
    categoryGrid.hidden = true;
    categoryIntro.hidden = true;
    loadingState.hidden = false;
    errorState.hidden = true;
    duaList.hidden = true;
    duasBackLink.setAttribute('href', 'duas.html');

    fetch(API_BASE + '/' + encodeURIComponent(key))
      .then(function (res) {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(function (json) {
        const data = json.data;
        loadingState.hidden = true;
        duaList.hidden = false;
        renderDuas(data.label || key, data.duas);
      })
      .catch(function () {
        loadingState.hidden = true;
        errorState.hidden = false;
      });
  }

  retryBtn.addEventListener('click', function () {
    if (activeCategory) loadCategory(activeCategory);
  });

  if (activeCategory) {
    loadCategory(activeCategory);
  } else {
    renderCategoryGrid();
  }
})();
