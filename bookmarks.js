// Qiratul Quran — Bookmarks page

(function () {
  const emptyState = document.getElementById('emptyState');
  const bookmarkList = document.getElementById('bookmarkList');

  function render() {
    const bookmarks = window.QQBookmarks.list();

    if (bookmarks.length === 0) {
      emptyState.hidden = false;
      bookmarkList.hidden = true;
      return;
    }

    emptyState.hidden = true;
    bookmarkList.hidden = false;

    bookmarkList.innerHTML = bookmarks.map(function (b) {
      return (
        '<li class="item-row">' +
          '<a class="item-link" href="surah.html?surah=' + b.surah + '&ayah=' + b.ayah + '">' +
            '<span class="item-main">' +
              '<span class="item-title">' + b.surahName + ' — Ayah ' + b.ayah + '</span>' +
              '<span class="item-meta">' + b.translationSnippet + '…</span>' +
            '</span>' +
            '<span class="item-arabic" lang="ar" dir="rtl">' + b.arabicSnippet + '…</span>' +
          '</a>' +
          '<button class="remove-bookmark-btn" data-surah="' + b.surah + '" data-ayah="' + b.ayah + '" aria-label="Remove bookmark">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
          '</button>' +
        '</li>'
      );
    }).join('');
  }

  bookmarkList.addEventListener('click', function (e) {
    const btn = e.target.closest('.remove-bookmark-btn');
    if (!btn) return;
    e.preventDefault();
    window.QQBookmarks.remove(parseInt(btn.dataset.surah, 10), parseInt(btn.dataset.ayah, 10));
    render();
  });

  render();
})();
