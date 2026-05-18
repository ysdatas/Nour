var QCDN_LOCAL = "./data/quran";
var QCDN_CDN   = "https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions";
var QARA = "ara-quranuthmanihaf";
var QFRA = "fra-muhammadhamidul";

function qFetch(edition, n) {
  var local = QCDN_LOCAL + "/" + edition + "/" + n + ".min.json";
  var cdn   = QCDN_CDN   + "/" + edition + "/" + n + ".min.json";
  return fetch(local).then(function(r) {
    return r.ok ? r : fetch(cdn);
  }).catch(function() { return fetch(cdn); });
}
var qCache = {};
var qtCache = {};
var qSurah = 0;
var qMode = 'bilingual'; // 'bilingual' | 'reading' | 'tajweed'

var SURAHS = [
  [1,   "الفاتحة",    "Al-Fatiha — L'Ouverture",              7],
  [2,   "البقرة",     "Al-Baqara — La Vache",                 286],
  [3,   "آل عمران",   "Al-Imran — La Famille d'Imran",        200],
  [4,   "النساء",     "An-Nisa — Les Femmes",                  176],
  [5,   "المائدة",    "Al-Maida — La Table servie",            120],
  [6,   "الأنعام",    "Al-An'am — Les Bestiaux",               165],
  [7,   "الأعراف",    "Al-A'raf — Les Lieux élevés",           206],
  [8,   "الأنفال",    "Al-Anfal — Le Butin",                   75],
  [9,   "التوبة",     "At-Tawba — Le Repentir",                129],
  [10,  "يونس",       "Yunus — Jonas",                         109],
  [11,  "هود",        "Hud — Houd",                            123],
  [12,  "يوسف",       "Yusuf — Joseph",                        111],
  [13,  "الرعد",      "Ar-Ra'd — Le Tonnerre",                 43],
  [14,  "إبراهيم",    "Ibrahim — Abraham",                     52],
  [15,  "الحجر",      "Al-Hijr — Al-Hijr",                     99],
  [16,  "النحل",      "An-Nahl — Les Abeilles",                128],
  [17,  "الإسراء",    "Al-Isra — Le Voyage nocturne",          111],
  [18,  "الكهف",      "Al-Kahf — La Caverne",                  110],
  [19,  "مريم",       "Maryam — Marie",                        98],
  [20,  "طه",         "Ta-Ha — Ta-Ha",                         135],
  [21,  "الأنبياء",   "Al-Anbiya — Les Prophètes",             112],
  [22,  "الحج",       "Al-Hajj — Le Pèlerinage",               78],
  [23,  "المؤمنون",   "Al-Mu'minun — Les Croyants",            118],
  [24,  "النور",      "An-Nur — La Lumière",                   64],
  [25,  "الفرقان",    "Al-Furqan — Le Critère",                77],
  [26,  "الشعراء",    "Ash-Shu'ara — Les Poètes",              227],
  [27,  "النمل",      "An-Naml — Les Fourmis",                 93],
  [28,  "القصص",      "Al-Qasas — Le Récit",                   88],
  [29,  "العنكبوت",   "Al-Ankabut — L'Araignée",               69],
  [30,  "الروم",      "Ar-Rum — Les Romains",                  60],
  [31,  "لقمان",      "Luqman — Luqman",                       34],
  [32,  "السجدة",     "As-Sajda — La Prosternation",           30],
  [33,  "الأحزاب",    "Al-Ahzab — Les Coalisés",               73],
  [34,  "سبأ",        "Saba — Saba",                           54],
  [35,  "فاطر",       "Fatir — Le Créateur",                   45],
  [36,  "يس",         "Ya-Sin — Ya-Sin",                       83],
  [37,  "الصافات",    "As-Saffat — Ceux qui font des rangées", 182],
  [38,  "ص",          "Sad — Sad",                             88],
  [39,  "الزمر",      "Az-Zumar — Les Groupes",                75],
  [40,  "غافر",       "Ghafir — Le Pardonneur",                85],
  [41,  "فصلت",       "Fussilat — Expliqués en détail",        54],
  [42,  "الشورى",     "Ash-Shura — La Consultation",           53],
  [43,  "الزخرف",     "Az-Zukhruf — Les Ornements",            89],
  [44,  "الدخان",     "Ad-Dukhan — La Fumée",                  59],
  [45,  "الجاثية",    "Al-Jathiya — L'Agenouillée",            37],
  [46,  "الأحقاف",    "Al-Ahqaf — Les Dunes",                  35],
  [47,  "محمد",       "Muhammad — Muhammad",                    38],
  [48,  "الفتح",      "Al-Fath — La Victoire",                 29],
  [49,  "الحجرات",    "Al-Hujurat — Les Appartements",         18],
  [50,  "ق",          "Qaf — Qaf",                             45],
  [51,  "الذاريات",   "Adh-Dhariyat — Les Vents dispersants",  60],
  [52,  "الطور",      "At-Tur — Le Mont",                      49],
  [53,  "النجم",      "An-Najm — L'Étoile",                    62],
  [54,  "القمر",      "Al-Qamar — La Lune",                    55],
  [55,  "الرحمن",     "Ar-Rahman — Le Miséricordieux",         78],
  [56,  "الواقعة",    "Al-Waqi'a — L'Événement",               96],
  [57,  "الحديد",     "Al-Hadid — Le Fer",                     29],
  [58,  "المجادلة",   "Al-Mujadila — La Discussion",           22],
  [59,  "الحشر",      "Al-Hashr — L'Exil",                     24],
  [60,  "الممتحنة",   "Al-Mumtahana — L'Éprouvée",             13],
  [61,  "الصف",       "As-Saff — Le Rang",                     14],
  [62,  "الجمعة",     "Al-Jumu'a — Le Vendredi",               11],
  [63,  "المنافقون",  "Al-Munafiqun — Les Hypocrites",         11],
  [64,  "التغابن",    "At-Taghabun — La Tricherie",             18],
  [65,  "الطلاق",     "At-Talaq — Le Divorce",                 12],
  [66,  "التحريم",    "At-Tahrim — La Prohibition",            12],
  [67,  "الملك",      "Al-Mulk — La Royauté",                  30],
  [68,  "القلم",      "Al-Qalam — La Plume",                   52],
  [69,  "الحاقة",     "Al-Haqqa — La Réalité",                 52],
  [70,  "المعارج",    "Al-Ma'arij — Les Degrés",               44],
  [71,  "نوح",        "Nuh — Noé",                             28],
  [72,  "الجن",       "Al-Jinn — Les Djinns",                  28],
  [73,  "المزمل",     "Al-Muzzammil — L'Enveloppé",            20],
  [74,  "المدثر",     "Al-Muddaththir — Le Revêtu",            56],
  [75,  "القيامة",    "Al-Qiyama — La Résurrection",           40],
  [76,  "الإنسان",    "Al-Insan — L'Homme",                    31],
  [77,  "المرسلات",   "Al-Mursalat — Les Envoyés",             50],
  [78,  "النبأ",      "An-Naba — La Nouvelle",                 40],
  [79,  "النازعات",   "An-Nazi'at — Les Arracheurs",           46],
  [80,  "عبس",        "Abasa — Il se renfrogna",               42],
  [81,  "التكوير",    "At-Takwir — L'Enveloppement",           29],
  [82,  "الانفطار",   "Al-Infitar — La Déchirure",             19],
  [83,  "المطففين",   "Al-Mutaffifin — Les Fraudeurs",         36],
  [84,  "الانشقاق",   "Al-Inshiqaq — La Fissure",              25],
  [85,  "البروج",     "Al-Buruj — Les Constellations",         22],
  [86,  "الطارق",     "At-Tariq — L'Astre nocturne",           17],
  [87,  "الأعلى",     "Al-A'la — Le Très-Haut",               19],
  [88,  "الغاشية",    "Al-Ghashiya — L'Enveloppante",          26],
  [89,  "الفجر",      "Al-Fajr — L'Aurore",                    30],
  [90,  "البلد",      "Al-Balad — La Cité",                    20],
  [91,  "الشمس",      "Ash-Shams — Le Soleil",                 15],
  [92,  "الليل",      "Al-Layl — La Nuit",                     21],
  [93,  "الضحى",      "Ad-Duha — La Matinée",                  11],
  [94,  "الشرح",      "Ash-Sharh — L'Expansion",               8],
  [95,  "التين",      "At-Tin — Le Figuier",                   8],
  [96,  "العلق",      "Al-Alaq — L'Adhérence",                 19],
  [97,  "القدر",      "Al-Qadr — La Destinée",                 5],
  [98,  "البينة",     "Al-Bayyina — La Preuve",                8],
  [99,  "الزلزلة",    "Az-Zalzala — Le Séisme",                8],
  [100, "العاديات",   "Al-Adiyat — Les Coureurs",              11],
  [101, "القارعة",    "Al-Qari'a — Le Fracas",                 11],
  [102, "التكاثر",    "At-Takathur — L'Accumulation",          8],
  [103, "العصر",      "Al-Asr — Le Temps",                     3],
  [104, "الهمزة",     "Al-Humaza — Le Calomniateur",           9],
  [105, "الفيل",      "Al-Fil — L'Éléphant",                   5],
  [106, "قريش",       "Quraysh — Quraysh",                     4],
  [107, "الماعون",    "Al-Ma'un — L'Ustensile",                7],
  [108, "الكوثر",     "Al-Kawthar — L'Abondance",              3],
  [109, "الكافرون",   "Al-Kafirun — Les Incroyants",           6],
  [110, "النصر",      "An-Nasr — Le Secours",                  3],
  [111, "المسد",      "Al-Masad — Les Fibres",                 5],
  [112, "الإخلاص",    "Al-Ikhlas — La Sincérité",              4],
  [113, "الفلق",      "Al-Falaq — L'Aurore",                   5],
  [114, "الناس",      "An-Nas — Les Hommes",                   6]
];

function qOut(html) {
  var el = document.getElementById("qlist");
  if (el) el.innerHTML = html;
}

function renderSurahList() {
  qSurah = 0;
  var nav = document.getElementById("qnav");
  if (nav) nav.style.display = "none";
  var html = "";
  for (var i = 0; i < SURAHS.length; i++) {
    var s = SURAHS[i];
    html += '<div class="q-row" onclick="loadSurah(' + s[0] + ')">' +
      '<div class="q-num">' + s[0] + '</div>' +
      '<div class="q-info">' +
        '<div class="q-ar">' + s[1] + '</div>' +
        '<div class="q-fr">' + s[2] + '</div>' +
      '</div>' +
      '<div class="q-vc">' + s[3] + ' v.</div>' +
    '</div>';
  }
  qOut(html);
}

function loadSurah(n) {
  qSurah = n;
  var s = SURAHS[n - 1];
  var lbl = document.getElementById("qnav-lbl");
  if (lbl) lbl.textContent = s[1] + " · " + n + "/114";
  var nav = document.getElementById("qnav");
  if (nav) nav.style.display = "flex";
  var tb = document.getElementById("qtajweed-btn");
  if (tb) tb.style.display = "inline-block";
  if (qMode === 'tajweed') { loadTajweed(n); return; }
  qOut('<div class="msg">Chargement de la sourate ' + n + '…</div>');

  var key = "q" + n;
  if (qCache[key]) { renderVerses(qCache[key]); return; }

  Promise.all([
    qFetch(QARA, n),
    qFetch(QFRA, n)
  ]).then(function(res) {
    return Promise.all([
      res[0].ok ? res[0].json() : Promise.resolve(null),
      res[1].ok ? res[1].json() : Promise.resolve(null)
    ]);
  }).then(function(d) {
    var ara = d[0], fra = d[1];
    if (!ara && !fra) { qOut('<div class="msg">Erreur de chargement.</div>'); return; }
    var base = (ara || fra).chapter;
    var fraArr = fra ? fra.chapter : [];
    var verses = base.map(function(v, i) {
      return {
        id: v.verse,
        ar: ara ? ara.chapter[i].text : "",
        fr: fraArr[i] ? fraArr[i].text : ""
      };
    });
    qCache[key] = { n: n, s: s, verses: verses };
    renderVerses(qCache[key]);
  }).catch(function() {
    qOut('<div class="msg">Erreur réseau. Vérifie ta connexion.</div>');
  });
}

function renderVerses(data) {
  if (qMode === 'reading') { renderReading(data); return; }
  if (qMode === 'tajweed') { loadTajweed(data.n); return; }
  var s = data.s;
  var html = '<div class="q-header">' +
    '<div class="q-h-ar">' + s[1] + '</div>' +
    '<div class="q-h-fr">' + s[2] + '</div>' +
    (data.n !== 9 ? '<div class="q-bsm">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>' : "") +
  '</div>';
  for (var i = 0; i < data.verses.length; i++) {
    var v = data.verses[i];
    html += '<div class="q-verse">' +
      '<div class="q-v-num">' + v.id + '</div>' +
      '<div class="q-v-body">' +
        (v.ar ? '<div class="q-v-ar">' + v.ar + '</div>' : "") +
        (v.fr ? '<div class="q-v-fr">' + v.fr + '</div>' : "") +
      '</div>' +
    '</div>';
  }
  qOut(html);
  var page = document.querySelector(".content");
  if (page) page.scrollTop = 0;
}

function renderReading(data) {
  var s = data.s;
  var html = '<div class="q-header">' +
    '<div class="q-h-ar">' + s[1] + '</div>' +
    (data.n !== 9 ? '<div class="q-bsm">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>' : "") +
  '</div>';
  html += '<div class="q-read">';
  for (var i = 0; i < data.verses.length; i++) {
    var v = data.verses[i];
    html += (v.ar || '') + ' <span class="q-read-n">&#x06DD;' + v.id + '</span> ';
  }
  html += '</div>';
  qOut(html);
  var page = document.querySelector(".content");
  if (page) page.scrollTop = 0;
}

function qToggleMode() {
  qMode = qMode === 'bilingual' ? 'reading' : 'bilingual';
  var btn = document.getElementById('qmode-btn');
  if (btn) btn.textContent = qMode === 'reading' ? '❖ Bilingue' : '❁ Lecture';
  if (qSurah) {
    if (qCache['q' + qSurah]) renderVerses(qCache['q' + qSurah]);
    else loadSurah(qSurah);
  }
}

function qSetTajweed() {
  if (qMode === 'tajweed') {
    qMode = 'bilingual';
    var tb = document.getElementById('qtajweed-btn');
    if (tb) { tb.style.background = ''; tb.style.color = ''; }
    if (qSurah) {
      if (qCache['q' + qSurah]) renderVerses(qCache['q' + qSurah]);
      else loadSurah(qSurah);
    }
  } else {
    qMode = 'tajweed';
    var tb = document.getElementById('qtajweed-btn');
    if (tb) { tb.style.background = 'var(--gold-dim)'; tb.style.color = 'var(--gold)'; }
    if (qSurah) loadTajweed(qSurah);
  }
}

function loadTajweed(n) {
  var key = 'qt' + n;
  if (qtCache[key]) { renderTajweed(qtCache[key]); return; }
  qOut('<div class="msg">Chargement Tajwid…</div>');
  fetch('https://api.quran.com/api/v4/verses/by_chapter/' + n +
        '?fields=text_uthmani_tajweed&per_page=300')
    .then(function(r) { return r.json(); })
    .then(function(d) {
      if (!d.verses || !d.verses.length) {
        qOut('<div class="msg">Erreur chargement Tajwid.</div>');
        return;
      }
      qtCache[key] = { n: n, s: SURAHS[n - 1], verses: d.verses };
      renderTajweed(qtCache[key]);
    })
    .catch(function() {
      qOut('<div class="msg">Erreur réseau. Vérifie ta connexion.</div>');
    });
}

function renderTajweed(data) {
  var s = data.s;
  var html = '<div class="q-header">' +
    '<div class="q-h-ar">' + s[1] + '</div>' +
    '<div class="q-h-fr">' + s[2] + '</div>' +
    (data.n !== 9 ? '<div class="q-bsm">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>' : '') +
  '</div>';
  html += '<div class="q-tajweed">';
  for (var i = 0; i < data.verses.length; i++) {
    html += data.verses[i].text_uthmani_tajweed + ' ';
  }
  html += '</div>';
  html += '<div class="tj-legend">' +
    '<div class="tj-legend-title">Guide des couleurs Tajwid</div>' +
    '<div class="tj-leg"><span class="tj-dot" style="background:#4da6ff"></span><div><span class="tj-rule">Madd</span> Prolonge la voyelle (2 temps minimum)</div></div>' +
    '<div class="tj-leg"><span class="tj-dot" style="background:#3ddc84"></span><div><span class="tj-rule">Idghaam</span> La lettre se fond dans la suivante — elles se fusionnent en une seule</div></div>' +
    '<div class="tj-leg"><span class="tj-dot" style="background:#ffc107"></span><div><span class="tj-rule">Qalqalah</span> Légère vibration/rebond sur les lettres ق ط ب ج د quand elles sont sans voyelle</div></div>' +
    '<div class="tj-leg"><span class="tj-dot" style="background:#e040fb"></span><div><span class="tj-rule">Ikhfâ</span> Le nûn/tanwîn disparaît à moitié avant certaines lettres — son nasal voilé</div></div>' +
    '<div class="tj-leg"><span class="tj-dot" style="background:#00e5ff"></span><div><span class="tj-rule">Iqlab</span> Le nûn/tanwîn se transforme en mîm nasalisé avant la lettre ب</div></div>' +
    '<div class="tj-leg"><span class="tj-dot" style="background:#69f0ae"></span><div><span class="tj-rule">Ghunna</span> Son nasal tenu 2 temps sur le nûn ou le mîm avec chadda</div></div>' +
  '</div>';
  qOut(html);
  var page = document.querySelector('.content');
  if (page) page.scrollTop = 0;
}

function qPrev() { if (qSurah > 1) loadSurah(qSurah - 1); }
function qNext() { if (qSurah < 114) loadSurah(qSurah + 1); }
function qBack() {
  var tb = document.getElementById('qtajweed-btn');
  if (tb) { tb.style.display = 'none'; tb.style.background = ''; tb.style.color = ''; }
  qMode = 'bilingual';
  var btn = document.getElementById('qmode-btn');
  if (btn) btn.textContent = '📖 Lecture';
  renderSurahList();
}
