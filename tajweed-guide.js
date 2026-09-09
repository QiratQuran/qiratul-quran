// Qiratul Quran — Tajweed Guide / Lesson Book
// Rule names, letters, and classifications below reflect the
// standard, widely-taught Tajweed curriculum (the same system
// used to build the Reader's color-coding). Nothing here relates
// to Quran verse text itself — this is general pronunciation science,
// well established and non-disputed across schools of recitation.

(function () {
  const legend = document.getElementById('tajweedLegend');
  const lessonsContainer = document.getElementById('lessonsContainer');

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

  const lessons = [
    {
      title: 'Introduction to Tajweed',
      intro: 'Tajweed means giving every Arabic letter its correct articulation point and characteristics, and applying the rules that govern how letters interact with each other during recitation. It is not a change to the words of the Quran — it is the standard, correct way of pronouncing them.',
      rules: [],
      quiz: [
        {
          q: 'What does "Tajweed" refer to?',
          options: ['A translation style', 'Correct pronunciation rules for reciting the Quran', 'A style of Arabic calligraphy'],
          correct: 1,
          explain: 'Tajweed is the set of rules governing correct pronunciation and articulation during Quran recitation.'
        }
      ]
    },
    {
      title: 'Noon Sakinah & Tanween',
      intro: 'When a noon with sukoon (\u0646\u0652) or tanween (\u064B \u064D \u064C) is followed by another letter, one of four rules applies, based on which letter comes next.',
      rules: [
        { name: 'Izhar (Clear pronunciation)', letters: '\u0621 \u0647 \u0639 \u062D \u063A \u062E', desc: 'The noon/tanween is pronounced clearly, with no nasal sound, before these six throat letters.' },
        { name: 'Idgham with Ghunnah (Merging, nasalized)', letters: '\u064A \u0646 \u0645 \u0648', desc: 'The noon/tanween merges into the following letter, held with a 2-count nasal sound.' },
        { name: 'Idgham without Ghunnah (Merging, no nasal)', letters: '\u0644 \u0631', desc: 'The noon/tanween merges fully into the following letter, with no nasal sound.' },
        { name: 'Iqlab (Conversion)', letters: '\u0628', desc: 'The noon/tanween sound converts into a light meem sound, held with a nasal sound, only before this letter.' },
        { name: 'Ikhfa (Concealment)', letters: '\u062A \u062B \u062C \u062F \u0630 \u0632 \u0633 \u0634 \u0635 \u0636 \u0637 \u0638 \u0641 \u0642 \u0643', desc: 'The noon/tanween sound is concealed \u2014 between clear and merged \u2014 held with a 2-count nasal sound, before these 15 letters.' }
      ],
      quiz: [
        {
          q: 'Which single letter triggers the Iqlab rule?',
          options: ['\u0645', '\u0628', '\u0644'],
          correct: 1,
          explain: 'Iqlab only occurs before the letter Baa, converting the noon/tanween sound into a light meem.'
        },
        {
          q: 'How many letters trigger the Ikhfa rule?',
          options: ['6', '15', '2'],
          correct: 1,
          explain: 'The 15 Ikhfa letters are every letter not already assigned to Izhar, Idgham, or Iqlab.'
        }
      ]
    },
    {
      title: 'Meem Sakinah Rules',
      intro: 'A meem with sukoon (\u0645\u0652) follows three rules, based on the letter that comes after it.',
      rules: [
        { name: 'Ikhfa Shafawi (Labial concealment)', letters: '\u0628', desc: 'The meem is concealed with a 2-count nasal sound, only before the letter Baa.' },
        { name: 'Idgham Shafawi (Labial merging)', letters: '\u0645', desc: 'The meem merges into a following meem, held with a nasal sound.' },
        { name: 'Izhar Shafawi (Labial clarity)', letters: 'All other letters', desc: 'The meem is pronounced clearly with no nasal sound, before any letter other than Baa or Meem.' }
      ],
      quiz: [
        {
          q: 'A silent meem followed by Baa is an example of:',
          options: ['Idgham Shafawi', 'Ikhfa Shafawi', 'Izhar Shafawi'],
          correct: 1,
          explain: 'Ikhfa Shafawi applies only when meem sakinah is followed by Baa.'
        }
      ]
    },
    {
      title: 'Qalqalah (Echoing Letters)',
      intro: 'Five letters produce a distinct bouncing echo whenever they carry a sukoon (no vowel), remembered by the mnemonic "Qutb Jad".',
      rules: [
        { name: 'Qalqalah letters', letters: '\u0642 \u0637 \u0628 \u062C \u062F', desc: 'When any of these five letters carry a sukoon, a slight echoing bounce is added to the sound.' }
      ],
      quiz: [
        {
          q: 'Which of these is NOT a Qalqalah letter?',
          options: ['\u0642', '\u0633', '\u062F'],
          correct: 1,
          explain: 'The five Qalqalah letters are Qaf, Taa, Baa, Jeem, and Dal. Seen is not among them.'
        }
      ]
    },
    {
      title: 'Madd (Prolongation)',
      intro: 'Madd refers to prolonging the sound of certain letters (alif, waw, yaa) for a set number of counts (harakat), depending on the type.',
      rules: [
        { name: 'Madd Tabee\u2019i (Natural)', letters: '\u2014', desc: 'The basic prolongation, held for 2 counts, occurring whenever a madd letter appears with no additional cause for lengthening.' },
        { name: 'Madd Muttasil (Connected, obligatory)', letters: '\u2014', desc: 'Occurs when a madd letter is followed by a hamza within the same word; held for 4\u20135 counts.' },
        { name: 'Madd Munfasil (Separated)', letters: '\u2014', desc: 'Occurs when a madd letter at the end of one word is followed by a hamza at the start of the next word; held for 4\u20135 counts.' },
        { name: 'Madd Lazim (Necessary)', letters: '\u2014', desc: 'Occurs when a madd letter is followed by a sukoon; held for 6 counts, the longest prolongation.' }
      ],
      quiz: [
        {
          q: 'Madd Tabee\u2019i (the basic, natural prolongation) is held for how many counts?',
          options: ['2', '6', '4'],
          correct: 0,
          explain: 'Madd Tabee\u2019i, the natural/basic prolongation, is held for 2 counts (harakat).'
        }
      ]
    },
    {
      title: 'Ghunnah (Nasalization)',
      intro: 'Ghunnah is a nasal sound produced from the nasal cavity, most prominently when meem or noon carry a shaddah.',
      rules: [
        { name: 'Ghunnah', letters: '\u0645 \u0646 (with shaddah)', desc: 'Held for approximately 2 counts, this nasal resonance also appears within Idgham with Ghunnah, Iqlab, and Ikhfa.' }
      ],
      quiz: [
        {
          q: 'Ghunnah is most prominent on which two letters when they carry a shaddah?',
          options: ['Ba and Ta', 'Meem and Noon', 'Alif and Waw'],
          correct: 1,
          explain: 'Ghunnah (nasalization) is most prominent on meem and noon when doubled with a shaddah.'
        }
      ]
    }
  ];

  function renderLessons() {
    lessonsContainer.innerHTML = lessons.map(function (lesson, li) {
      const rulesHtml = lesson.rules.map(function (r) {
        return (
          '<div class="tajweed-rule-card">' +
            '<div class="tajweed-rule-head">' +
              '<span class="tajweed-rule-name">' + r.name + '</span>' +
              (r.letters !== '\u2014' ? '<span class="tajweed-rule-letters" lang="ar" dir="rtl">' + r.letters + '</span>' : '') +
            '</div>' +
            '<p class="tajweed-rule-desc">' + r.desc + '</p>' +
          '</div>'
        );
      }).join('');

      const quizHtml = lesson.quiz.map(function (q, qi) {
        const optionsHtml = q.options.map(function (opt, oi) {
          return '<button class="quiz-option" data-lesson="' + li + '" data-q="' + qi + '" data-opt="' + oi + '">' + opt + '</button>';
        }).join('');
        return (
          '<div class="quiz-question" data-lesson="' + li + '" data-q="' + qi + '">' +
            '<p class="quiz-prompt">' + q.q + '</p>' +
            '<div class="quiz-options">' + optionsHtml + '</div>' +
            '<p class="quiz-feedback" hidden></p>' +
          '</div>'
        );
      }).join('');

      return (
        '<details class="lesson-card"' + (li === 0 ? ' open' : '') + '>' +
          '<summary class="lesson-title">' + lesson.title + '</summary>' +
          '<div class="lesson-body">' +
            '<p class="lesson-intro">' + lesson.intro + '</p>' +
            rulesHtml +
            (lesson.quiz.length ? '<div class="quiz-block"><p class="quiz-heading">Practice</p>' + quizHtml + '</div>' : '') +
          '</div>' +
        '</details>'
      );
    }).join('');
  }

  renderLessons();

  lessonsContainer.addEventListener('click', function (e) {
    const btn = e.target.closest('.quiz-option');
    if (!btn) return;

    const lessonIndex = parseInt(btn.dataset.lesson, 10);
    const qIndex = parseInt(btn.dataset.q, 10);
    const optIndex = parseInt(btn.dataset.opt, 10);
    const question = lessons[lessonIndex].quiz[qIndex];
    const questionBlock = btn.closest('.quiz-question');
    const feedback = questionBlock.querySelector('.quiz-feedback');
    const allOptions = questionBlock.querySelectorAll('.quiz-option');

    if (questionBlock.classList.contains('is-answered')) return;
    questionBlock.classList.add('is-answered');

    allOptions.forEach(function (opt, i) {
      opt.disabled = true;
      if (i === question.correct) opt.classList.add('is-correct');
      else if (i === optIndex) opt.classList.add('is-incorrect');
    });

    feedback.hidden = false;
    feedback.textContent = (optIndex === question.correct ? 'Correct. ' : 'Not quite. ') + question.explain;
    feedback.classList.toggle('is-correct-text', optIndex === question.correct);
  });
})();
