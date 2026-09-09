// Qiratul Quran — Home screen
// The Daily Ayah is fetched live from AlQuran Cloud, chosen
// deterministically by today's date (so it's the same for everyone
// all day), never typed or invented by us.

(function () {
  const TOTAL_AYAHS = 6236; // Total Ayahs in the Quran (fixed, well-established count)

  /* ---------------------------------------------------------
     Continue Reading
  --------------------------------------------------------- */
  const continuePanel = document.getElementById('continuePanel');
  const continueSurah = document.getElementById('continueSurah');
  const continueAyah = document.getElementById('continueAyah');
  const continueBtn = document.getElementById('continueBtn');
  const continueProgress = document.getElementById('continueProgress');

  const lastRead = window.QQLastRead.get();

  if (lastRead) {
    continuePanel.hidden = false;
    continueSurah.textContent = lastRead.surahName;
    continueAyah.textContent = 'Ayah ' + lastRead.ayah + ' of ' + lastRead.totalAyahs;
    continueBtn.href = 'surah.html?surah=' + lastRead.surah + '&ayah=' + lastRead.ayah;
    const pct = Math.min(100, Math.round((lastRead.ayah / lastRead.totalAyahs) * 100));
    continueProgress.style.width = pct + '%';
  } else {
    continuePanel.hidden = false;
    continueSurah.textContent = 'Al-Fatihah';
    continueAyah.textContent = 'Start your first reading';
    continueBtn.href = 'surah.html?surah=1';
    continueProgress.style.width = '0%';
  }

  /* ---------------------------------------------------------
     Daily Ayah — same Ayah for everyone, all day, chosen by date
  --------------------------------------------------------- */
  const ayahLoading = document.getElementById('ayahLoading');
  const ayahContent = document.getElementById('ayahContent');
  const dailyAyahArabic = document.getElementById('dailyAyahArabic');
  const dailyAyahTranslation = document.getElementById('dailyAyahTranslation');
  const dailyAyahRef = document.getElementById('dailyAyahRef');

  function dayOfYear() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  const ayahNumber = (dayOfYear() % TOTAL_AYAHS) + 1;

  fetch('https://api.alquran.cloud/v1/ayah/' + ayahNumber + '/editions/quran-uthmani,en.sahih')
    .then(function (res) {
      if (!res.ok) throw new Error('Network error');
      return res.json();
    })
    .then(function (json) {
      const arabic = json.data[0];
      const translation = json.data[1];

      dailyAyahArabic.textContent = arabic.text;
      dailyAyahTranslation.textContent = translation.text;
      dailyAyahRef.textContent = arabic.surah.englishName + ' ' + arabic.surah.number + ':' + arabic.numberInSurah;

      ayahLoading.hidden = true;
      ayahContent.hidden = false;
    })
    .catch(function () {
      ayahLoading.querySelector('p').textContent = "Couldn't load today's Ayah. Please check your connection.";
    });
})();
