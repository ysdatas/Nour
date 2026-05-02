var LV_CDN_LOCAL = './data/hadith';
var LV_CDN = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions';

function lvFetch(path) {
  return fetch(LV_CDN_LOCAL + '/' + path).then(function(r) {
    return r.ok ? r : fetch(LV_CDN + '/' + path);
  }).catch(function() { return fetch(LV_CDN + '/' + path); });
}
var lvSecCache = {};
var lvFullCache = {};
var lvView = 'books';
var lvBook = null;
var lvTome = null;

function range(a, b) {
  var r = []; for (var i = a; i <= b; i++) r.push(i); return r;
}

var LIVRES = [
  /* ── Hadiths ── */
  {
    id: 'bukhari', ar: 'صحيح البخاري', fr: 'Sahîh Al-Boukhârî', lang: 'fra', group: 'hadith',
    tomes: [
      { n:1, title:'Tome I — Partie 1',  sub:'Ch. 1–25',  secs:range(1,25),  pdf:'sahih_bukhari/Sah%C3%AEh%20Al-Boukh%C3%A2r%C3%AE%20Tome%201%2C%20Partie%201.pdf' },
      { n:2, title:'Tome I — Partie 2',  sub:'Ch. 26–50', secs:range(26,50), pdf:'sahih_bukhari/Sah%C3%AEh%20Al-Boukh%C3%A2r%C3%AE%20Tome%202.pdf' },
      { n:3, title:'Tome II — Partie 1', sub:'Ch. 51–75', secs:range(51,75), pdf:'sahih_bukhari/Sah%C3%AEh%20Al-Boukh%C3%A2r%C3%AE%20Tome%203.pdf' },
      { n:4, title:'Tome II — Partie 2', sub:'Ch. 76–97', secs:range(76,97), pdf:'sahih_bukhari/Sah%C3%AEh%20Al-Boukh%C3%A2r%C3%AE%20Tome%204.pdf' }
    ]
  },
  {
    id: 'muslim', ar: 'صحيح مسلم', fr: 'Sahîh Muslim', lang: 'fra', group: 'hadith',
    tomes: [
      { n:1, title:'Tome I',  sub:'Ch. 1–28',  secs:range(1,28)  },
      { n:2, title:'Tome II', sub:'Ch. 29–56', secs:range(29,56) }
    ]
  },
  {
    id: 'abudawud', ar: 'سنن أبي داود', fr: 'Sunan Abu Dawud', lang: 'fra', group: 'hadith',
    tomes: [
      { n:1, title:'Tome I',  sub:'Ch. 1–22',  secs:range(1,22)  },
      { n:2, title:'Tome II', sub:'Ch. 23–43', secs:range(23,43) }
    ]
  },
  {
    id: 'ibnmajah', ar: 'سنن ابن ماجه', fr: 'Sunan Ibn Majah', lang: 'fra', group: 'hadith',
    tomes: [
      { n:1, title:'Tome I',  sub:'Ch. 1–25',  secs:range(1,25)  },
      { n:2, title:'Tome II', sub:'Ch. 26–50', secs:range(26,50) }
    ]
  },
  {
    id: 'nasai', ar: 'سنن النسائي', fr: 'Sunan An-Nasaï', lang: 'fra', group: 'hadith',
    tomes: [
      { n:1, title:'Tome I',  sub:'Ch. 1–26',  secs:range(1,26)  },
      { n:2, title:'Tome II', sub:'Ch. 27–52', secs:range(27,52) }
    ]
  },
  {
    id: 'tirmidhi', ar: 'جامع الترمذي', fr: 'Jami At-Tirmidhi', lang: 'ara', group: 'hadith',
    tomes: [
      { n:1, title:'Tome I',  sub:'Ch. 1–24',  secs:range(1,24)  },
      { n:2, title:'Tome II', sub:'Ch. 25–46', secs:range(25,46) }
    ]
  },
  {
    id: 'malik', ar: 'موطأ مالك', fr: 'Al-Muwatta — Malik', lang: 'fra', group: 'hadith',
    tomes: [
      { n:1, title:'Tome I',  sub:'Ch. 1–31',  secs:range(1,31)  },
      { n:2, title:'Tome II', sub:'Ch. 32–61', secs:range(32,61) }
    ]
  },
  /* ── Collections courtes (chargement complet) ── */
  { id:'nawawi',  ar:'الأربعون النووية',   fr:'40 Hadiths An-Nawawi',   lang:'fra', full:true, group:'hadith' },
  { id:'qudsi',   ar:'الأحاديث القدسية',    fr:'40 Hadiths Qudsi',       lang:'fra', full:true, group:'hadith' },
  { id:'dehlawi', ar:'أربعون حديثاً',       fr:'40 Hadiths Al-Dehlawi',  lang:'fra', full:true, group:'hadith' },
  /* ── Livres numériques (EPUB → lecteur intégré) ── */
  {
    id: 'prophetes', ar: 'قصص الأنبياء', fr: 'Les Histoires des Prophètes', lang: 'fra',
    epub: 'data/books/prophetes.json', group: 'livre'
  },
  {
    id: 'peche', ar: 'الذنوب وعلاجها', fr: 'Péchés et Guérison', lang: 'fra',
    epub: 'data/books/peche.json', group: 'livre'
  },
  /* ── Tafsir Ibn Kathir (PDF par sourate) ── */
  {
    id: 'tafsir-ibnkathir', ar: 'تفسير ابن كثير', fr: 'Tafsir Ibn Kathir', lang: null, group: 'tafsir',
    surahs: [
      {n:1,   ar:'الفاتحة',      fr:'Al-Fatiha',          pdf:'1 SOURATE LA FATHIA.pdf'},
      {n:2,   ar:'البقرة',       fr:'Al-Baqara',          pdf:'2 SOURATE LA VACHE.pdf'},
      {n:3,   ar:'آل عمران',     fr:'Ali Imran',           pdf:'3 SOURATE IMRAN.pdf'},
      {n:4,   ar:'النساء',       fr:'An-Nisa',            pdf:'4 SOURATE NISA.pdf'},
      {n:5,   ar:'المائدة',      fr:'Al-Ma\'ida',          pdf:'5 SOURATE DE LA TABLE.pdf'},
      {n:6,   ar:'الأنعام',      fr:'Al-An\'am',           pdf:'6 SOURATE DU BETAIL.pdf'},
      {n:7,   ar:'الأعراف',      fr:'Al-A\'raf',           pdf:'7 SOURATE DE L A RAF.pdf'},
      {n:8,   ar:'الأنفال',      fr:'Al-Anfal',           pdf:'8 SOURATE DU BUTIN.pdf'},
      {n:9,   ar:'التوبة',       fr:'At-Tawba',           pdf:'9 SOURATE DU REPENTIR.pdf'},
      {n:10,  ar:'يونس',         fr:'Yunus',              pdf:'10 SOURATE DE JONAS.pdf'},
      {n:11,  ar:'هود',          fr:'Hud',                pdf:'11 SOURATE DE HOUD.pdf'},
      {n:12,  ar:'يوسف',         fr:'Yusuf',              pdf:'12 SOURATE DE JOSEPH.pdf'},
      {n:13,  ar:'الرعد',        fr:'Ar-Ra\'d',            pdf:'13 SOURATE DE LA FOUDRE.pdf'},
      {n:14,  ar:'إبراهيم',      fr:'Ibrahim',            pdf:'14 SOURATE  IBRAHIM.pdf'},
      {n:15,  ar:'الحجر',        fr:'Al-Hijr',            pdf:'15 SOURATE DE HEJR.pdf'},
      {n:16,  ar:'النحل',        fr:'An-Nahl',            pdf:'16 SOURATE DE L ABEILLE.pdf'},
      {n:17,  ar:'الإسراء',      fr:'Al-Isra',            pdf:'17 SOURATE DU VOYAGE NOCTURNE.pdf'},
      {n:18,  ar:'الكهف',        fr:'Al-Kahf',            pdf:'18 SOURATE DE LA CAVERNE.pdf'},
      {n:19,  ar:'مريم',         fr:'Maryam',             pdf:'19 SOURATE MARYAM.pdf'},
      {n:20,  ar:'طه',           fr:'Ta-Ha',              pdf:'20 SOURATE TA-HA.pdf'},
      {n:21,  ar:'الأنبياء',     fr:'Al-Anbiya',          pdf:'21 SOURATE DES PROPHETES.pdf'},
      {n:22,  ar:'الحج',         fr:'Al-Hajj',            pdf:'22 SOURATE DU PELRIGNAGE.pdf'},
      {n:23,  ar:'المؤمنون',     fr:'Al-Mu\'minun',        pdf:'23 SOURATE DES CROYANTS.pdf'},
      {n:24,  ar:'النور',        fr:'An-Nur',             pdf:'24 SOURATE DE LA LUMIERE.pdf'},
      {n:25,  ar:'الفرقان',      fr:'Al-Furqan',          pdf:'25 SOURATE DE LA DISTINCTION.pdf'},
      {n:26,  ar:'الشعراء',      fr:'Ash-Shu\'ara',        pdf:'26 SOURATE DES POETES.pdf'},
      {n:27,  ar:'النمل',        fr:'An-Naml',            pdf:'27 SOURATE DES FOURMIS.pdf'},
      {n:28,  ar:'القصص',        fr:'Al-Qasas',           pdf:'28 SOURATE DU RECIT.pdf'},
      {n:29,  ar:'العنكبوت',     fr:'Al-\'Ankabut',        pdf:'29 SOURATE DE L ARAIGNEE.pdf'},
      {n:30,  ar:'الروم',        fr:'Ar-Rum',             pdf:'30 SOURATE DES ROMAINS.pdf'},
      {n:31,  ar:'لقمان',        fr:'Luqman',             pdf:'31 SOURATE DE LOKMAN.pdf'},
      {n:32,  ar:'السجدة',       fr:'As-Sajda',           pdf:'32  SOURATE DE LA PROSTERNATION.pdf'},
      {n:33,  ar:'الأحزاب',      fr:'Al-Ahzab',           pdf:'33 SOURATE DES COALISES.pdf'},
      {n:34,  ar:'سبأ',          fr:'Saba',               pdf:'34 SOURATE DE SABA.pdf'},
      {n:35,  ar:'فاطر',         fr:'Fatir',              pdf:'35 SOURATE  DES ANGES.pdf'},
      {n:36,  ar:'يس',           fr:'Ya-Sin',             pdf:'36 SOURATE YASIN.pdf'},
      {n:37,  ar:'الصافات',      fr:'As-Saffat',          pdf:'37 SOURATE DES RANGS.pdf'},
      {n:38,  ar:'ص',            fr:'Sad',                pdf:'38 SOURATE SAD.pdf'},
      {n:39,  ar:'الزمر',        fr:'Az-Zumar',           pdf:'39 SOURATE DES TROUPES.pdf'},
      {n:40,  ar:'غافر',         fr:'Ghafir',             pdf:'40 SOURATE DU CROYANT.pdf'},
      {n:41,  ar:'فصلت',         fr:'Fussilat',           pdf:'41 SOURATE DES DEVELOPPEMENTS.pdf'},
      {n:42,  ar:'الشورى',       fr:'Ash-Shura',          pdf:'42 SOURATE DE LA DELIBERATION.pdf'},
      {n:43,  ar:'الزخرف',       fr:'Az-Zukhruf',         pdf:'43 SOURATE DES ORNEMENTS.pdf'},
      {n:44,  ar:'الدخان',       fr:'Ad-Dukhan',          pdf:'44 SOURATE DE LA FUMEE.pdf'},
      {n:45,  ar:'الجاثية',      fr:'Al-Jathiya',         pdf:null},
      {n:46,  ar:'الأحقاف',      fr:'Al-Ahqaf',           pdf:'46 SOURATE D EL-AHQAF.pdf'},
      {n:47,  ar:'محمد',         fr:'Muhammad',           pdf:'47 SOURATE DE MOHAMED.pdf'},
      {n:48,  ar:'الفتح',        fr:'Al-Fath',            pdf:'48 SOURATE DE LA VICTOIRE.pdf'},
      {n:49,  ar:'الحجرات',      fr:'Al-Hujurat',         pdf:'49 - SOURATE DES APPARTEMENTS.pdf'},
      {n:50,  ar:'ق',            fr:'Qaf',                pdf:'50 - SOURATE DE QAF.pdf'},
      {n:51,  ar:'الذاريات',     fr:'Adh-Dhariyat',       pdf:'51 - SOURATE DES VENTS.pdf'},
      {n:52,  ar:'الطور',        fr:'At-Tur',             pdf:'52 - SOURATE DU MONT SINAI.pdf'},
      {n:53,  ar:'النجم',        fr:'An-Najm',            pdf:'53 - SOURATE DE L ETOILE.pdf'},
      {n:54,  ar:'القمر',        fr:'Al-Qamar',           pdf:'54 - SOURATE DE LA LUNE.pdf'},
      {n:55,  ar:'الرحمن',       fr:'Ar-Rahman',          pdf:'55 - SOURATE DU CLEMENT.pdf'},
      {n:56,  ar:'الواقعة',      fr:'Al-Waqi\'a',          pdf:'56 SOURATE DE L ECHEANT.pdf'},
      {n:57,  ar:'الحديد',       fr:'Al-Hadid',           pdf:'57 SOURATE DU FER.pdf'},
      {n:58,  ar:'المجادلة',     fr:'Al-Mujadila',        pdf:'58 SOURATE DE LA PLAIDEUSE.pdf'},
      {n:59,  ar:'الحشر',        fr:'Al-Hashr',           pdf:'59 SOURATE DE L\'EXODE.pdf'},
      {n:60,  ar:'الممتحنة',     fr:'Al-Mumtahina',       pdf:'60 - SOURATE DE L EPREUVE.pdf'},
      {n:61,  ar:'الصف',         fr:'As-Saff',            pdf:'61 - SOURATE DE L ORDRE DE BATAILLE.pdf'},
      {n:62,  ar:'الجمعة',       fr:'Al-Jumu\'a',          pdf:'62 - SOURATE DU VENDREDI.pdf'},
      {n:63,  ar:'المنافقون',    fr:'Al-Munafiqun',       pdf:'63 - SOURATE DES HYPOCRITES.pdf'},
      {n:64,  ar:'التغابن',      fr:'At-Taghabun',        pdf:'64 - SOURATE DE LA DÉCEPTION.pdf'},
      {n:65,  ar:'الطلاق',       fr:'At-Talaq',           pdf:'65 - SOURATE DE LA RÉPUDIATION.pdf'},
      {n:66,  ar:'التحريم',      fr:'At-Tahrim',          pdf:'66 - SOURATE DE LA DÉFENSE.pdf'},
      {n:67,  ar:'الملك',        fr:'Al-Mulk',            pdf:'67 - SOURATE DU POUVOIR.pdf'},
      {n:68,  ar:'القلم',        fr:'Al-Qalam',           pdf:'68 - SOURATE DE LA PLUME.pdf'},
      {n:69,  ar:'الحاقة',       fr:'Al-Haqqa',           pdf:'69 - SOURATE DE LA RÉPARATION.pdf'},
      {n:70,  ar:'المعارج',      fr:'Al-Ma\'arij',         pdf:'70 SOURATE DES MARCHES.pdf'},
      {n:71,  ar:'نوح',          fr:'Nuh',                pdf:'71 - SOURATE DE NOE.pdf'},
      {n:72,  ar:'الجن',         fr:'Al-Jinn',            pdf:'72 - SOURATE DES GENIES.pdf'},
      {n:73,  ar:'المزمل',       fr:'Al-Muzzammil',       pdf:'73 - SOURATE DE L ENVELOPPE.pdf'},
      {n:74,  ar:'المدثر',       fr:'Al-Muddaththir',     pdf:'74 - SOURATE DU COUVERT.pdf'},
      {n:75,  ar:'القيامة',      fr:'Al-Qiyama',          pdf:'75 - SOURATE DE LA RESURRECTION.pdf'},
      {n:76,  ar:'الإنسان',      fr:'Al-Insan',           pdf:'76 - SOURATE DE L HOMME.pdf'},
      {n:77,  ar:'المرسلات',     fr:'Al-Mursalat',        pdf:'77 - SOURATE DES LIVRES REVELES.pdf'},
      {n:78,  ar:'النبأ',        fr:'An-Naba',            pdf:'78 - SOURATE DE L\'EVENEMENT.pdf'},
      {n:79,  ar:'النازعات',     fr:'An-Nazi\'at',         pdf:'79 - SOURATE DES ANGES.pdf'},
      {n:80,  ar:'عبس',          fr:'\'Abasa',             pdf:'80 - SOURATE DU SEVERE.pdf'},
      {n:81,  ar:'التكوير',      fr:'At-Takwir',          pdf:'81 - SOURATE DU SOLEIL QUI.pdf'},
      {n:82,  ar:'الانفطار',     fr:'Al-Infitar',         pdf:'82 - SOURATE DU CIEL QUI SE DECHIRE.pdf'},
      {n:83,  ar:'المطففين',     fr:'Al-Mutaffifin',      pdf:'83 - SOURATE DES FRAUDEURS.pdf'},
      {n:84,  ar:'الانشقاق',     fr:'Al-Inshiqaq',        pdf:'84 - SOURATE DU CIEL QUI SE FEND.pdf'},
      {n:85,  ar:'البروج',       fr:'Al-Buruj',           pdf:'85 - SOURATE DES SIGNES DU ZODIAQUE.pdf'},
      {n:86,  ar:'الطارق',       fr:'At-Tariq',           pdf:'86 - SOURATE DE SATURNE.pdf'},
      {n:87,  ar:'الأعلى',       fr:'Al-A\'la',            pdf:'87 - SOURATE DU TRÈS-HAUT.pdf'},
      {n:88,  ar:'الغاشية',      fr:'Al-Ghashiya',        pdf:'88 - SOURATE DE L\'ÉPREUVE.pdf'},
      {n:89,  ar:'الفجر',        fr:'Al-Fajr',            pdf:'89 - SOURATE DE L\'AURORE.pdf'},
      {n:90,  ar:'البلد',        fr:'Al-Balad',           pdf:'90 sourate du pays.pdf'},
      {n:91,  ar:'الشمس',        fr:'Ash-Shams',          pdf:'91 sourate du soleil.pdf'},
      {n:92,  ar:'الليل',        fr:'Al-Layl',            pdf:'92 sourate de la nuit.pdf'},
      {n:93,  ar:'الضحى',        fr:'Ad-Duha',            pdf:'93 sourate du matin (ad-douha).pdf'},
      {n:94,  ar:'الشرح',        fr:'Ash-Sharh',          pdf:'94 SOURATE DU COEUR DILATE.pdf'},
      {n:95,  ar:'التين',        fr:'At-Tin',             pdf:'95 SOURATE DU FIGUIER.pdf'},
      {n:96,  ar:'العلق',        fr:'Al-\'Alaq',           pdf:'96 SOURATE DU CAILLOT DE SANG.pdf'},
      {n:97,  ar:'القدر',        fr:'Al-Qadr',            pdf:'97 SOURATE DES DECISIONS.pdf'},
      {n:98,  ar:'البينة',       fr:'Al-Bayyina',         pdf:'98 sourate de la verite.pdf'},
      {n:99,  ar:'الزلزلة',      fr:'Az-Zalzala',         pdf:'99 sourate la convultion de la terre.pdf'},
      {n:100, ar:'العاديات',     fr:'Al-\'Adiyat',         pdf:'100 sourate des coursiers.pdf'},
      {n:101, ar:'القارعة',      fr:'Al-Qari\'a',          pdf:'101 sourate du choc.pdf'},
      {n:102, ar:'التكاثر',      fr:'At-Takathur',        pdf:'102 sourate de la passion des richesses.pdf'},
      {n:103, ar:'العصر',        fr:'Al-\'Asr',            pdf:'103 sourate du siécle.pdf'},
      {n:104, ar:'الهمزة',       fr:'Al-Humaza',          pdf:'104 sourate le difamateur.pdf'},
      {n:105, ar:'الفيل',        fr:'Al-Fil',             pdf:'105 sourate de lelephant.pdf'},
      {n:106, ar:'قريش',         fr:'Quraysh',            pdf:'106 sourate Quaraichs.pdf'},
      {n:107, ar:'الماعون',      fr:'Al-Ma\'un',           pdf:'107 Sourate du secours.pdf'},
      {n:108, ar:'الكوثر',       fr:'Al-Kawthar',         pdf:'108 sourate des faveurs.pdf'},
      {n:109, ar:'الكافرون',     fr:'Al-Kafirun',         pdf:'109 sourate les infidéles.pdf'},
      {n:110, ar:'النصر',        fr:'An-Nasr',            pdf:'110 Sourate du triomphe.pdf'},
      {n:111, ar:'المسد',        fr:'Al-Masad',           pdf:'111 Sourate de la Corde.pdf'},
      {n:112, ar:'الإخلاص',      fr:'Al-Ikhlas',          pdf:'112-Sourate de la pureté.pdf'},
      {n:113, ar:'الفلق',        fr:'Al-Falaq',           pdf:'113 - Sourate celui qui fait eclore.pdf'},
      {n:114, ar:'الناس',        fr:'An-Nas',             pdf:'114-sourate des hommes.pdf'}
    ]
  },
  /* ── PDF uniquement ── */
  {
    id: 'ibnbaz', ar: 'فتاوى ابن باز', fr: 'Fatawa — Ibn Baz', lang: null, group: 'livre',
    tomes: [
      { n:1, title:'Volume 1', sub:'Jurisprudence islamique', pdf:'fatawa_ibnbaz/Fatawa_ibnBaz_Volume_1.pdf' },
      { n:2, title:'Volume 2', sub:'Jurisprudence islamique', pdf:'fatawa_ibnbaz/fr-Islamhouse-Fatawa_ibnBaz_Volume_2.pdf' },
      { n:3, title:'Volume 3', sub:'Jurisprudence islamique', pdf:'fatawa_ibnbaz/Fatawa%20V3%20Ibn%20Baz.pdf' },
      { n:4, title:'Volume 4', sub:'Jurisprudence islamique', pdf:'fatawa_ibnbaz/Fatawa%20V4%20Ibn%20Baz.pdf' },
      { n:5, title:'Dictionnaire juridique', sub:'Arabe · Français · Anglais', pdf:'fatawa_ibnbaz/moudjam%20loughat%20al%20fouqaha%20arabe%20francais%20anglais.pdf' }
    ]
  }
];

/* ────────────────────────────────── */

function lvOut(html) { var el = document.getElementById('lvlist'); if (el) el.innerHTML = html; }

function lvSetNav(html) {
  var nav = document.getElementById('lv-nav');
  nav.style.display = 'flex'; nav.innerHTML = html;
}

/* ── 1. Liste des livres ── */
var LV_GROUPS = [
  { key: 'hadith', ar: 'الحديث',  label: 'Hadiths' },
  { key: 'tafsir', ar: 'التفسير', label: 'Tafsir'  },
  { key: 'livre',  ar: 'الكتب',   label: 'Livres'  }
];

function lvBookCard(b) {
  var badge = b.epub ? '<span class="lv-badge lv-badge-epub">Livre</span>'
            : b.full ? '<span class="lv-badge">40&nbsp;h.</span>'
            : b.lang === null ? '<span class="lv-badge lv-badge-pdf">PDF</span>'
            : b.lang === 'ara' ? '<span class="lv-badge lv-badge-ar">AR</span>'
            : '';
  var count = b.epub ? (b._chapCount ? b._chapCount + ' ch.' : '')
            : b.full ? ''
            : (b.surahs ? b.surahs.length + ' s.' : (b.tomes ? b.tomes.length + ' t.' : ''));
  return '<div class="lv-book" onclick="lvOpen(\'' + b.id + '\')">' +
    '<div class="lv-spine"></div>' +
    '<div class="lv-info">' +
      '<div class="lv-book-ar">' + b.ar + '</div>' +
      '<div class="lv-book-fr">' + b.fr + '</div>' +
      badge +
      (count ? '<div class="lv-count">' + count + '</div>' : '') +
    '</div>' +
  '</div>';
}

function lvShowBooks() {
  lvView = 'books'; lvBook = null; lvTome = null;
  document.getElementById('lv-nav').style.display = 'none';
  var html = '';
  LV_GROUPS.forEach(function(g) {
    var books = LIVRES.filter(function(b) { return b.group === g.key; });
    if (!books.length) return;
    html += '<div class="lv-section-hd">' +
      '<span class="lv-section-ar">' + g.ar + '</span>' +
      '<span class="lv-section-fr">' + g.label + '</span>' +
    '</div>' +
    '<div class="lv-grid">' +
    books.map(lvBookCard).join('') +
    '</div>';
  });
  lvOut(html);
}

/* ── 2. Dispatch selon type de livre ── */
function lvOpen(bookId) {
  for (var i = 0; i < LIVRES.length; i++) {
    if (LIVRES[i].id === bookId) { lvBook = LIVRES[i]; break; }
  }
  if (!lvBook) return;
  if (lvBook.epub) { lvLoadEpub(); return; }
  if (lvBook.surahs) { lvShowSurahs(); return; }
  if (lvBook.full) { lvLoadFull(); return; }
  lvShowTomes();
}

/* ── 3. Tomes ── */
function lvShowTomes() {
  lvView = 'tomes';
  lvSetNav('<button class="lv-nav-btn" onclick="lvShowBooks()">&#x2190; Biblioth&egrave;que</button>' +
           '<span class="lv-nav-sep">&#x203A;</span>' +
           '<span class="lv-nav-cur">' + lvBook.fr + '</span>');
  var html = '<div class="lv-tomes">';
  lvBook.tomes.forEach(function(t) {
    var hasSecs = t.secs && t.secs.length;
    var onclick = hasSecs ? 'lvShowChapters(' + t.n + ')'
                : (t.pdf ? 'window.open(\'' + t.pdf + '\',\'_blank\')' : '');
    var sub = hasSecs ? t.sub : '&#x1F4D6; Lire &middot; ' + t.sub;
    html += '<div class="lv-tome" onclick="' + onclick + '">' +
      '<div class="lv-tome-num">T' + t.n + '</div>' +
      '<div class="lv-tome-info">' +
        '<div class="lv-tome-title">' + t.title + '</div>' +
        '<div class="lv-tome-sub">' + sub + '</div>' +
      '</div>' +
      (t.pdf ? '<a class="lv-dl" href="' + t.pdf + '" download onclick="event.stopPropagation()" title="T&eacute;l&eacute;charger">&#x21E9;</a>' : '') +
      '<div class="lv-arrow">&#x203A;</div>' +
    '</div>';
  });
  html += '</div>';
  lvOut(html);
}

/* ── 4. Chapitres d'un tome (API sections) ── */
function lvShowChapters(tomeN) {
  lvTome = null;
  for (var j = 0; j < lvBook.tomes.length; j++) {
    if (lvBook.tomes[j].n === tomeN) { lvTome = lvBook.tomes[j]; break; }
  }
  if (!lvTome) return;
  lvView = 'chapters';
  var bk = lvBook; var tm = lvTome;
  lvSetNav(
    '<button class="lv-nav-btn" onclick="lvShowBooks()">&#x2190; Biblioth&egrave;que</button>' +
    '<span class="lv-nav-sep">&#x203A;</span>' +
    '<button class="lv-nav-btn" onclick="lvShowTomes()">' + bk.fr + '</button>' +
    '<span class="lv-nav-sep">&#x203A;</span>' +
    '<span class="lv-nav-cur">' + tm.title + '</span>'
  );
  var dlBtn = tm.pdf ? '<a class="lv-dl-bar" href="' + tm.pdf + '" download>&#x21E9;&nbsp; T&eacute;l&eacute;charger ce tome (PDF)</a>' : '';
  lvOut(dlBtn + '<div class="msg">Chargement des chapitres&hellip;</div>');

  var secs = tm.secs, results = new Array(secs.length), pending = secs.length;
  secs.forEach(function(secN, idx) {
    lvFetchSec(bk.id, secN, bk.lang, function(data) {
      results[idx] = { n: secN, data: data };
      if (--pending === 0) lvRenderChapters(results, dlBtn);
    });
  });
}

function lvFetchSec(bookId, secN, lang, cb) {
  var key = bookId + '-s' + secN;
  if (lvSecCache[key]) { cb(lvSecCache[key]); return; }
  var frKey = (lang === 'ara' ? 'ara' : 'fra') + '-' + bookId;
  var arKey = 'ara-' + bookId;
  Promise.all([
    lvFetch(frKey + '/sections/' + secN + '.min.json'),
    lang !== 'ara' ? lvFetch(arKey + '/sections/' + secN + '.min.json') : Promise.resolve({ ok: false })
  ]).then(function(res) {
    if (!res[0].ok) { cb(null); return; }
    Promise.all([res[0].json(), res[1].ok ? res[1].json() : Promise.resolve(null)]).then(function(d) {
      var main = d[0], ara = d[1];
      var hadiths = (main.hadiths || []).map(function(h, i) {
        var arText = ara && ara.hadiths && ara.hadiths[i] ? (ara.hadiths[i].text || '').trim() : '';
        var frText = lang === 'ara' ? '' : (h.text || '').trim();
        var arMain = lang === 'ara' ? (h.text || '').trim() : arText;
        return { no: h.hadithnumber, fr: frText, ar: arMain };
      }).filter(function(h) { return h.fr.length > 5 || h.ar.length > 5; });
      var r = { name: (main.metadata || {}).name || ('Chapitre ' + secN), hadiths: hadiths };
      lvSecCache[key] = r;
      cb(r);
    });
  }).catch(function() { cb(null); });
}

function lvRenderChapters(results, dlBtn) {
  var html = dlBtn + '<div class="lv-chapters">';
  results.forEach(function(r) {
    if (!r || !r.data || !r.data.hadiths.length) return;
    var id = 'lvc-' + r.n;
    html += '<div class="lv-chap" id="' + id + '">' +
      '<div class="lv-chap-hd" onclick="lvToggleChap(\'' + id + '\')">' +
        '<div class="lv-chap-n">' + r.n + '</div>' +
        '<div class="lv-chap-title">' + r.data.name + '</div>' +
        '<div class="lv-chap-ico">&#x203A;</div>' +
      '</div><div class="lv-chap-body">';
    r.data.hadiths.forEach(function(h) {
      html += '<div class="card" style="margin-bottom:.6rem">' +
        '<div class="h-no">n&deg;' + h.no + '</div>' +
        (h.ar ? '<div class="h-ar">' + h.ar + '</div>' : '') +
        (h.fr ? '<div class="h-fr">&laquo;&nbsp;' + h.fr + '&nbsp;&raquo;</div>' : '') +
        '</div>';
    });
    html += '</div></div>';
  });
  html += '</div>';
  lvOut(html);
}

/* ── 5. Collections courtes (chargement complet) ── */
function lvLoadFull() {
  lvView = 'full';
  var bk = lvBook;
  lvSetNav('<button class="lv-nav-btn" onclick="lvShowBooks()">&#x2190; Biblioth&egrave;que</button>' +
           '<span class="lv-nav-sep">&#x203A;</span>' +
           '<span class="lv-nav-cur">' + bk.fr + '</span>');
  lvOut('<div class="msg">Chargement&hellip;</div>');

  if (lvFullCache[bk.id]) { lvRenderFull(lvFullCache[bk.id]); return; }

  Promise.all([
    lvFetch('fra-' + bk.id + '.min.json'),
    lvFetch('ara-' + bk.id + '.min.json')
  ]).then(function(res) {
    return Promise.all([res[0].ok ? res[0].json() : null, res[1].ok ? res[1].json() : null]);
  }).then(function(d) {
    var fra = d[0], ara = d[1];
    if (!fra && !ara) { lvOut('<div class="msg">Erreur de chargement.</div>'); return; }
    var base = fra || ara;
    var hadiths = (base.hadiths || []).map(function(h, i) {
      return {
        no: h.hadithnumber,
        fr: fra ? (h.text || '').trim() : '',
        ar: ara ? (ara.hadiths[i] ? (ara.hadiths[i].text || '').trim() : '') : ''
      };
    }).filter(function(h) { return h.fr.length > 5 || h.ar.length > 5; });
    lvFullCache[bk.id] = hadiths;
    lvRenderFull(hadiths);
  }).catch(function() { lvOut('<div class="msg">Erreur r&eacute;seau.</div>'); });
}

function lvRenderFull(hadiths) {
  var html = '<div class="lv-chapters">';
  hadiths.forEach(function(h) {
    html += '<div class="card" style="margin-bottom:.6rem">' +
      '<div class="h-no">' + lvBook.fr + ' &middot; n&deg;' + h.no + '</div>' +
      (h.ar ? '<div class="h-ar">' + h.ar + '</div>' : '') +
      (h.fr ? '<div class="h-fr">&laquo;&nbsp;' + h.fr + '&nbsp;&raquo;</div>' : '') +
    '</div>';
  });
  html += '</div>';
  lvOut(html);
}

/* ── 6. Lecteur EPUB ── */
var lvEpubCache = {};
var lvEpubChap = 0;
var lvEpubPage = 0;

function lvLoadEpub() {
  lvView = 'epub-toc';
  var bk = lvBook;
  lvSetNav('<button class="lv-nav-btn" onclick="lvShowBooks()">&#x2190; Biblioth&egrave;que</button>' +
           '<span class="lv-nav-sep">&#x203A;</span>' +
           '<span class="lv-nav-cur">' + bk.fr + '</span>');
  if (lvEpubCache[bk.id]) { lvShowToc(lvEpubCache[bk.id]); return; }
  lvOut('<div class="msg">Chargement&hellip;</div>');
  fetch(bk.epub)
    .then(function(r) { return r.json(); })
    .then(function(d) {
      lvEpubCache[bk.id] = d;
      bk._chapCount = d.chapters.length;
      lvShowToc(d);
    })
    .catch(function() { lvOut('<div class="msg">Erreur de chargement.</div>'); });
}

function lvShowToc(book) {
  lvEpubChap = 0; lvEpubPage = 0;
  var html = '<div class="lv-epub-meta">' +
    '<div class="lv-epub-title">' + book.title + '</div>' +
    '<div class="lv-epub-author">' + book.author + '</div>' +
  '</div>' +
  '<div class="lv-toc">';
  book.chapters.forEach(function(ch) {
    html += '<div class="lv-toc-row" onclick="lvReadChap(' + (ch.n - 1) + ')">' +
      '<div class="lv-toc-n">' + ch.n + '</div>' +
      '<div class="lv-toc-title">' + ch.title + '</div>' +
      '<div class="lv-arrow">&#x203A;</div>' +
    '</div>';
  });
  html += '</div>';
  lvOut(html);
}

function lvReadChap(chapIdx) {
  var book = lvEpubCache[lvBook.id];
  if (!book) return;
  lvEpubChap = chapIdx;
  lvEpubPage = 0;
  lvRenderPage(book);
}

function lvRenderPage(book) {
  var ch = book.chapters[lvEpubChap];
  var totalPages = ch.pages.length;
  var pageText = ch.pages[lvEpubPage] || '';
  var bk = lvBook;

  lvSetNav(
    '<button class="lv-nav-btn" onclick="lvShowBooks()">&#x2190; Biblioth&egrave;que</button>' +
    '<span class="lv-nav-sep">&#x203A;</span>' +
    '<button class="lv-nav-btn" onclick="lvLoadEpub()">' + bk.fr + '</button>' +
    '<span class="lv-nav-sep">&#x203A;</span>' +
    '<span class="lv-nav-cur">' + ch.title + '</span>'
  );

  var prevPageBtn = lvEpubPage > 0
    ? '<button class="lv-page-btn" onclick="lvPageNav(-1)">&#x2190;</button>' : '<span class="lv-page-btn lv-page-btn-dis">&#x2190;</span>';
  var nextPageBtn = lvEpubPage < totalPages - 1
    ? '<button class="lv-page-btn" onclick="lvPageNav(1)">&#x2192;</button>' : '<span class="lv-page-btn lv-page-btn-dis">&#x2192;</span>';

  // Prev/next chapter
  var prevChap = lvEpubChap > 0
    ? '<button class="lv-chap-nav-btn" onclick="lvReadChap(' + (lvEpubChap - 1) + ')">&#x2190; ' + book.chapters[lvEpubChap - 1].title + '</button>' : '';
  var nextChap = lvEpubChap < book.chapters.length - 1
    ? '<button class="lv-chap-nav-btn" onclick="lvReadChap(' + (lvEpubChap + 1) + ')">' + book.chapters[lvEpubChap + 1].title + ' &#x2192;</button>' : '';

  var pct = totalPages > 1 ? Math.round((lvEpubPage / (totalPages - 1)) * 100) : 100;

  var html =
    '<div class="lv-reader">' +
      '<div class="lv-reader-hd">' +
        '<div class="lv-reader-chap-title">' + ch.title + '</div>' +
        '<div class="lv-reader-nav">' +
          prevPageBtn +
          '<span class="lv-reader-pager">' + (lvEpubPage + 1) + '&nbsp;/&nbsp;' + totalPages + '</span>' +
          nextPageBtn +
        '</div>' +
      '</div>' +
      '<div class="lv-reader-progress"><div class="lv-reader-bar" style="width:' + pct + '%"></div></div>' +
      '<div class="lv-reader-body">' + lvFormatText(pageText) + '</div>' +
      '<div class="lv-reader-foot">' +
        prevPageBtn +
        '<span class="lv-reader-pager">' + (lvEpubPage + 1) + '&nbsp;/&nbsp;' + totalPages + '</span>' +
        nextPageBtn +
      '</div>' +
      (lvEpubPage === totalPages - 1
        ? '<div class="lv-chap-nav">' + prevChap + nextChap + '</div>' : '') +
    '</div>';

  lvOut(html);
  var el = document.getElementById('lvlist');
  if (el) el.scrollTop = 0;
}

function lvFormatText(text) {
  // Split on double spaces after sentence-ending punctuation
  var parts = text.split(/([.!?»])\s{2,}/);
  // Reassemble with punctuation
  var sentences = [];
  for (var i = 0; i < parts.length; i += 2) {
    var seg = parts[i] + (parts[i + 1] || '');
    if (seg.trim()) sentences.push(seg.trim());
  }
  // Group into paragraphs of ~3 sentences
  var paras = [];
  for (var j = 0; j < sentences.length; j += 3) {
    var chunk = sentences.slice(j, j + 3).join(' ').trim();
    if (chunk) paras.push(chunk);
  }
  if (!paras.length) paras = [text];

  return paras.map(function(p) {
    if (!p) return '';
    p = p.replace(/«\s*([^«»]{10,300}?)\s*»/g, '<span class="lv-verse">« $1 »</span>');
    p = p.replace(/\[(\d+)\]/g, '<sup class="lv-fn">$1</sup>');
    return '<p>' + p + '</p>';
  }).join('');
}

function lvPageNav(dir) {
  var book = lvEpubCache[lvBook.id];
  if (!book) return;
  var ch = book.chapters[lvEpubChap];
  lvEpubPage = Math.max(0, Math.min(ch.pages.length - 1, lvEpubPage + dir));
  lvRenderPage(book);
}

/* ── 7. Sourates (Tafsir Ibn Kathir) ── */
function lvShowSurahs() {
  lvView = 'surahs';
  var bk = lvBook;
  lvSetNav('<button class="lv-nav-btn" onclick="lvShowBooks()">&#x2190; Biblioth&egrave;que</button>' +
           '<span class="lv-nav-sep">&#x203A;</span>' +
           '<span class="lv-nav-cur">' + bk.fr + '</span>');
  var html = '<div class="lv-surah-list">';
  bk.surahs.forEach(function(s) {
    var pdfPath = s.pdf ? 'tafsir_ibn_kathir/' + s.pdf.split('').map(function(c) {
      var code = c.charCodeAt(0);
      if (code > 127 || ' #%?&=+'.indexOf(c) >= 0) return encodeURIComponent(c);
      return c;
    }).join('') : null;
    html += '<div class="lv-surah' + (!pdfPath ? ' lv-surah-na' : '') + '">' +
      '<div class="lv-surah-n">' + s.n + '</div>' +
      '<div class="lv-surah-info">' +
        '<div class="lv-surah-ar">' + s.ar + '</div>' +
        '<div class="lv-surah-fr">' + s.fr + '</div>' +
      '</div>' +
      (pdfPath
        ? '<a class="lv-surah-read" href="' + pdfPath + '" target="_blank" onclick="event.stopPropagation()">&#x1F4D6;</a>' +
          '<a class="lv-dl" href="' + pdfPath + '" download onclick="event.stopPropagation()" title="T&eacute;l&eacute;charger">&#x21E9;</a>'
        : '<span class="lv-surah-na-lbl">bient&ocirc;t</span>') +
    '</div>';
  });
  html += '</div>';
  lvOut(html);
}

function lvToggleChap(id) {
  var el = document.getElementById(id);
  if (el) el.classList.toggle('open');
}

function renderLivres() { lvShowBooks(); }
