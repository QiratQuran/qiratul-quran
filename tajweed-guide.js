// Qiratul Quran — Tajweed Guide page
// Renders the same rule/color data used by the Reader's Tajweed
// mode (window.QQTajweed, defined in script.js), sourced from
// AlQuran Cloud's standard Tajweed rule mapping.

(function () {
  const legend = document.getElementById('tajweedLegend');
  const colorMap = {
    h: '#9C9C9C', s: '#9C9C9C', l: '#9C9C9C',
    n: '#537FFF', p: '#4050FF', m: '#000EBC',
    q: '#DD0008', o: '#2144C1', c: '#D500B7',
    f: '#9400A8', w: '#58B800', i: '#26BFFD',
    a: '#169777', u: '#169200', d: '#A1A1A1',
    b: '#A1A1A1', g: '#FF7E1E'
  };

  const rules = window.QQTajweed.rules;

  legend.innerHTML = Object.keys(rules).map(function (code) {
    const rule = rules[code];
    return (
      '<li class="tajweed-legend-item">' +
        '<span class="tajweed-swatch" style="background:' + colorMap[code] + ';"></span>' +
        '<span class="tajweed-legend-text">' +
          '<p class="tajweed-legend-name">' + rule.name + '</p>' +
          '<p class="tajweed-legend-desc">' + rule.desc + '</p>' +
        '</span>' +
      '</li>'
    );
  }).join('');
})();
