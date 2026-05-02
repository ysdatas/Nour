/* ── STATIC DATA ── */
var TAFSIR = [
  {
    ref: 'Al-Fatiha · 1:1',
    ar: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    tx: "Ibn Kathir explique que Bismillah signifie commencer en cherchant la baraka d'Allah. Ar-Rahman désigne Sa miséricorde générale ; Ar-Rahim, Sa miséricorde spéciale réservée aux croyants."
  },
  {
    ref: 'Al-Baqara · 2:255 (Ayat al-Kursi)',
    ar: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
    tx: "Le Prophète ﷺ a déclaré ce verset le plus noble du Coran. Al-Hayy affirme l'éternité absolue d'Allah ; Al-Qayyum indique qu'Il se maintient par Lui-même et soutient toute chose."
  },
  {
    ref: 'Al-Ikhlas · 112:1-4',
    ar: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
    tx: "Cette sourate équivaut à un tiers du Coran. Elle affirme l'unicité absolue d'Allah (Ahad), Son indépendance totale (As-Samad), l'absence de descendance et l'impossibilité de tout équivalent."
  },
  {
    ref: "Al-'Asr · 103:1-3",
    ar: 'وَالْعَصْرِ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ',
    tx: "Al-Shafi'i : « Si les hommes méditaient seulement cette sourate, elle leur suffirait. » Elle enseigne que tout être humain est en perte — sauf celui qui réunit foi, bonne action, et patience."
  }
];

var RAPPELS = [
  {
    ic: '🤲',
    ti: "As-tu fait une sadaqa aujourd'hui ?",
    bo: "Même un sourire est une sadaqa. Un mot bienveillant, enlever une pierre du chemin — tout est compté.",
    hd: '« La sadaqa ne diminue pas une fortune. » — Muslim'
  },
  {
    ic: '🌙',
    ti: 'As-tu dit Bismillah avant de manger ?',
    bo: "Invoquer le nom d'Allah avant tout acte le sanctifie et éloigne le Shaytan.",
    hd: '« Lorsque tu manges, dis Bismillah. » — Abu Dawud'
  },
  {
    ic: '🧎',
    ti: "As-tu prié les sunna rawatib ?",
    bo: "Les deux rak'at avant Fajr valent mieux que le monde entier et ce qu'il contient.",
    hd: "« Les deux rak'at de l'aube valent mieux que le monde. » — Muslim"
  },
  {
    ic: '💭',
    ti: 'As-tu fait dhikr ce matin ?',
    bo: 'Les adhkar du matin et du soir sont une armure spirituelle pour traverser la journée.',
    hd: "« Quel bon serviteur : il se souvient d'Allah debout, assis et couché. » — Bukhari"
  },
  {
    ic: '🪥',
    ti: 'As-tu utilisé le siwak ?',
    bo: "C'est une sunna que le Prophète ﷺ n'abandonnait jamais.",
    hd: "« Le siwak purifie la bouche et est agréable à Allah. » — Nasa'i"
  }
];

var OBLIGS = [
  {
    ic: '🕌',
    ti: 'La Prière — Salat',
    de: "Obligatoire cinq fois par jour, c'est le second pilier de l'Islam.",
    re: '« La prière est une lumière. » — Muslim'
  },
  {
    ic: '🌙',
    ti: 'Le Jeûne — Sawm',
    de: 'Jeûner tout le mois de Ramadan est obligatoire pour tout musulman adulte et sain.',
    re: "« Le jeûne est pour Moi et c'est Moi qui en donne la récompense. » — Bukhari"
  },
  {
    ic: '💛',
    ti: 'La Zakat',
    de: "Purification annuelle de la richesse lorsqu'elle atteint le nisab.",
    re: '« Ceux qui donnent la Zakat auront leur récompense auprès de leur Seigneur. » — 2:277'
  },
  {
    ic: '🕋',
    ti: 'Le Pèlerinage — Hajj',
    de: 'Obligatoire une fois dans la vie pour tout musulman qui en a les moyens.',
    re: "« Le Hajj mabrur n'a d'autre récompense que le Paradis. » — Bukhari · Muslim"
  },
  {
    ic: '📿',
    ti: 'La Shahada',
    de: "« Il n'y a de divinité qu'Allah, et Muhammad est Son Messager. »",
    re: "« Quiconque meurt en sachant qu'il n'y a de divinité qu'Allah entrera au Paradis. » — Muslim"
  }
];

/* ── INIT ── */
window.addEventListener('load', function () {
  setTimeout(function () {
    document.getElementById('splash').classList.add('gone');
  }, 1000);

  try {
    document.getElementById('hdate').textContent =
      new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  } catch (e) {}

  buildTicks();

  document.querySelectorAll('.ni').forEach(function (el) {
    el.addEventListener('click', function () {
      document.querySelectorAll('.ni').forEach(function (i) { i.classList.remove('on'); });
      document.querySelectorAll('.page').forEach(function (p) { p.classList.remove('on'); });
      el.classList.add('on');
      var pg = document.getElementById('p-' + el.dataset.p);
      if (pg) pg.classList.add('on');
      if (el.dataset.p === 'hadith' && !window._hLoaded) {
        window._hLoaded = true;
        loadSec(1);
      }
    });
  });

  renderTafsir('');
  renderRappels();
  renderObligs();
});

/* ── QIBLA ── */
var _qibla = 0, _hdg = 0, _ob = false;

function buildTicks() {
  var g = document.getElementById('ticks');
  if (!g) return;
  for (var i = 0; i < 36; i++) {
    var a = i * 10, r = (a - 90) * Math.PI / 180, maj = i % 9 === 0;
    var ln = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    ln.setAttribute('x1', 136 + 118 * Math.cos(r));
    ln.setAttribute('y1', 136 + 118 * Math.sin(r));
    ln.setAttribute('x2', 136 + (maj ? 108 : 113) * Math.cos(r));
    ln.setAttribute('y2', 136 + (maj ? 108 : 113) * Math.sin(r));
    ln.setAttribute('stroke', maj ? 'rgba(201,168,76,.55)' : 'rgba(201,168,76,.2)');
    ln.setAttribute('stroke-width', maj ? '1' : '.5');
    g.appendChild(ln);
  }
}

function calcQ(la, lo) {
  var mla = 21.3891 * Math.PI / 180, mlo = 39.8579 * Math.PI / 180,
      phi = la * Math.PI / 180, dl = mlo - lo * Math.PI / 180;
  return ((Math.atan2(Math.sin(dl), Math.cos(phi) * Math.tan(mla) - Math.sin(phi) * Math.cos(dl)) * 180 / Math.PI) + 360) % 360;
}

function rotN(d) {
  var n = document.getElementById('needle');
  if (n) n.style.transform = 'rotate(' + d + 'deg)';
}

function bindOr(ev) {
  window.addEventListener(ev, function (e) {
    var a = e.alpha || 0;
    if (e.webkitCompassHeading) a = 360 - e.webkitCompassHeading;
    _hdg = a;
    rotN((_qibla - _hdg + 360) % 360);
  }, true);
}

function initQibla() {
  var btn = document.getElementById('qbtn'), st = document.getElementById('qstat');
  btn.textContent = '⟳ Localisation…';
  btn.disabled = true;
  if (!navigator.geolocation) { st.textContent = 'Non supporté.'; return; }
  navigator.geolocation.getCurrentPosition(function (pos) {
    var la = pos.coords.latitude, lo = pos.coords.longitude;
    _qibla = calcQ(la, lo);
    document.getElementById('qdeg').textContent = Math.round(_qibla) + '° depuis le Nord';
    st.textContent = la.toFixed(3) + '° N · ' + lo.toFixed(3) + '° E';
    btn.textContent = '✦ Qibla trouvée';
    if (!_ob) {
      _ob = true;
      var ev = ('ondeviceorientationabsolute' in window) ? 'deviceorientationabsolute' : 'deviceorientation';
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission().then(function (r) { if (r === 'granted') bindOr(ev); });
      } else {
        bindOr(ev);
      }
      setTimeout(function () { if (_hdg === 0) rotN(_qibla); }, 1500);
    }
  }, function () {
    st.textContent = 'Localisation impossible.';
    btn.textContent = '✦ Réessayer';
    btn.disabled = false;
  });
}

/* ── HADITH ENGINE ── */
var CDN = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions';
var hBook = 'bukhari', hSec = 1, hMode = false;
var hCache = {};
var BSEC = { bukhari: 97, muslim: 56, abudawud: 43, ibnmajah: 50 };
var BLBL = { bukhari: 'Bukhari', muslim: 'Muslim', abudawud: 'Abu Dawud', ibnmajah: 'Ibn Majah' };
var TMAP = {
  'foi':          { bukhari: [2],           muslim: [1],      abudawud: [],       ibnmajah: [] },
  'iman':         { bukhari: [2],           muslim: [1],      abudawud: [],       ibnmajah: [] },
  'science':      { bukhari: [3],           muslim: [],       abudawud: [],       ibnmajah: [] },
  'connaissance': { bukhari: [3],           muslim: [],       abudawud: [],       ibnmajah: [] },
  'purete':       { bukhari: [4, 5],        muslim: [2],      abudawud: [1],      ibnmajah: [1] },
  'wudu':         { bukhari: [4, 5],        muslim: [2],      abudawud: [1],      ibnmajah: [1] },
  'priere':       { bukhari: [8, 9, 10],    muslim: [4, 5],   abudawud: [2],      ibnmajah: [4] },
  'salat':        { bukhari: [8, 9, 10],    muslim: [4, 5],   abudawud: [2],      ibnmajah: [4] },
  'funeraille':   { bukhari: [23],          muslim: [11],     abudawud: [20],     ibnmajah: [6] },
  'mort':         { bukhari: [23],          muslim: [11],     abudawud: [20],     ibnmajah: [6] },
  'zakat':        { bukhari: [17, 18],      muslim: [12],     abudawud: [9],      ibnmajah: [8] },
  'aumone':       { bukhari: [17, 18],      muslim: [12],     abudawud: [9],      ibnmajah: [8] },
  'sadaqa':       { bukhari: [17, 18],      muslim: [12],     abudawud: [9],      ibnmajah: [8] },
  'jeune':        { bukhari: [20, 21, 22],  muslim: [13],     abudawud: [14],     ibnmajah: [7] },
  'ramadan':      { bukhari: [20, 21, 22],  muslim: [13],     abudawud: [14],     ibnmajah: [7] },
  'hajj':         { bukhari: [24, 25, 26],  muslim: [15],     abudawud: [11],     ibnmajah: [25] },
  'pelerinage':   { bukhari: [24, 25, 26],  muslim: [15],     abudawud: [11],     ibnmajah: [25] },
  'commerce':     { bukhari: [34, 35],      muslim: [],       abudawud: [22],     ibnmajah: [12] },
  'jihad':        { bukhari: [52, 54, 56],  muslim: [33],     abudawud: [15],     ibnmajah: [] },
  'mariage':      { bukhari: [62, 67],      muslim: [16],     abudawud: [6],      ibnmajah: [9] },
  'famille':      { bukhari: [67, 68, 78],  muslim: [16, 17], abudawud: [6],      ibnmajah: [9] },
  'divorce':      { bukhari: [63, 68],      muslim: [18],     abudawud: [13],     ibnmajah: [10] },
  'prophete':     { bukhari: [57, 58, 61],  muslim: [],       abudawud: [],       ibnmajah: [] },
  'coran':        { bukhari: [65, 66],      muslim: [],       abudawud: [],       ibnmajah: [] },
  'medecine':     { bukhari: [73, 74],      muslim: [],       abudawud: [28],     ibnmajah: [31] },
  'maniere':      { bukhari: [76, 78],      muslim: [45],     abudawud: [43],     ibnmajah: [33] },
  'comportement': { bukhari: [76, 78],      muslim: [45],     abudawud: [43],     ibnmajah: [33] },
  'invocation':   { bukhari: [79, 80],      muslim: [48],     abudawud: [8],      ibnmajah: [] },
  'dhikr':        { bukhari: [79, 80],      muslim: [48],     abudawud: [8],      ibnmajah: [] },
  'paradis':      { bukhari: [81, 82],      muslim: [51],     abudawud: [],       ibnmajah: [] },
  'tawhid':       { bukhari: [97],          muslim: [1],      abudawud: [],       ibnmajah: [] }
};

function nrm(s) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, ' ').trim();
}

function findSecs(q) {
  var qn = nrm(q), out = [], ks = Object.keys(TMAP);
  for (var i = 0; i < ks.length; i++) {
    var k = nrm(ks[i]);
    if (qn === k || qn.indexOf(k) >= 0 || k.indexOf(qn) >= 0) {
      var a = TMAP[ks[i]][hBook] || [];
      for (var j = 0; j < a.length; j++) if (out.indexOf(a[j]) < 0) out.push(a[j]);
    }
  }
  return out;
}

function fetchSec(book, n, cb) {
  var key = book + '-' + n;
  if (hCache[key]) { cb(hCache[key]); return; }
  Promise.all([
    fetch(CDN + '/fra-' + book + '/sections/' + n + '.min.json'),
    fetch(CDN + '/ara-' + book + '/sections/' + n + '.min.json')
  ]).then(function (res) {
    if (!res[0].ok) { cb(null); return; }
    Promise.all([res[0].json(), res[1].ok ? res[1].json() : null]).then(function (d) {
      var fra = d[0], ara = d[1];
      var r = {
        title: (fra.metadata && fra.metadata.name) ? fra.metadata.name : ('Section ' + n),
        hadiths: (fra.hadiths || []).map(function (h, i) {
          return {
            no: h.hadithnumber,
            fr: (h.text || '').trim(),
            ar: ara && ara.hadiths && ara.hadiths[i] ? (ara.hadiths[i].text || '').trim() : ''
          };
        }).filter(function (h) { return h.fr.length > 5; })
      };
      hCache[key] = r;
      cb(r);
    });
  }).catch(function () { cb(null); });
}

function fetchOne(book, n, cb) {
  Promise.all([
    fetch(CDN + '/fra-' + book + '/' + n + '.min.json'),
    fetch(CDN + '/ara-' + book + '/' + n + '.min.json')
  ]).then(function (res) {
    if (!res[0].ok) { cb(null); return; }
    Promise.all([res[0].json(), res[1].ok ? res[1].json() : null]).then(function (d) {
      cb({ no: d[0].hadithnumber || n, fr: (d[0].text || '').trim(), ar: d[1] ? (d[1].text || '').trim() : '' });
    });
  }).catch(function () { cb(null); });
}

function hOut(html) { document.getElementById('hout').innerHTML = html; }

function card(h, lbl) {
  return '<div class="card"><div class="h-no">' + lbl + ' &middot; n&deg;' + h.no + '</div>' +
    (h.ar ? '<div class="h-ar">' + h.ar + '</div>' : '') +
    '<div class="h-fr">&laquo;&nbsp;' + h.fr + '&nbsp;&raquo;</div></div>';
}

function showCards(list, lbl, sub) {
  if (!list || !list.length) { hOut('<div class="msg">Aucun hadith trouvé.</div>'); return; }
  var bk = hMode ? '<button class="bk-btn" onclick="goBack()">&#x2190; Parcourir</button>' : '';
  var sb = sub ? '<div style="font-size:.7rem;letter-spacing:.1em;color:var(--gold);text-transform:uppercase;margin-bottom:.75rem;opacity:.8">' + sub + '</div>' : '';
  hOut(bk + sb + list.map(function (h) { return card(h, lbl); }).join(''));
}

function loadSec(n) {
  var max = BSEC[hBook] || 97;
  if (n < 1) n = 1;
  if (n > max) n = max;
  hSec = n;
  hMode = false;
  var lbl = BLBL[hBook];
  document.getElementById('stitle').textContent = 'Section ' + n + ' / ' + max;
  hOut('<div class="msg">Chargement&hellip;</div>');
  fetchSec(hBook, n, function (d) {
    if (!d) { if (n < max) loadSec(n + 1); else hOut('<div class="msg">Fin du livre.</div>'); return; }
    document.getElementById('stitle').textContent = d.title + ' · ' + n + '/' + max;
    showCards(d.hadiths, lbl);
  });
}

function prevSec() { loadSec(hSec - 1); }
function nextSec() { loadSec(hSec + 1); }
function goBack() { document.getElementById('hq').value = ''; loadSec(hSec); }

function hSearch() {
  var q = (document.getElementById('hq').value || '').trim();
  if (!q) { loadSec(hSec); return; }
  var lbl = BLBL[hBook];

  if (/^\d+$/.test(q)) {
    hMode = true;
    hOut('<div class="msg">Chargement n&deg;' + q + '&hellip;</div>');
    fetchOne(hBook, parseInt(q, 10), function (h) {
      if (h) showCards([h], lbl, 'Hadith n°' + q);
      else hOut('<div class="msg">Hadith n°' + q + ' introuvable dans ' + lbl + '.</div>');
    });
    return;
  }

  var secs = findSecs(q);
  if (secs.length > 0) {
    hMode = true;
    hOut('<div class="msg">Chargement&hellip;</div>');
    var all = [], done = 0, max = Math.min(secs.length, 2);
    for (var i = 0; i < max; i++) {
      (function (sec) {
        fetchSec(hBook, sec, function (d) {
          if (d) all = all.concat(d.hadiths.slice(0, 8));
          done++;
          if (done === max) showCards(all, lbl, 'Thème · ' + q);
        });
      })(secs[i]);
    }
    return;
  }

  var cached = [], ks = Object.keys(hCache);
  for (var i = 0; i < ks.length; i++) {
    if (ks[i].indexOf(hBook + '-') === 0 && hCache[ks[i]].hadiths)
      cached = cached.concat(hCache[ks[i]].hadiths);
  }
  if (!cached.length) {
    hOut('<div class="msg">Thème « ' + q + ' » non reconnu. Essaie un mot-clé ou un numéro.</div>');
    return;
  }
  hMode = true;
  var qn = nrm(q);
  var res = cached.filter(function (h) { return nrm(h.fr).indexOf(qn) >= 0; }).slice(0, 15);
  showCards(res, lbl, 'Recherche · ' + q);
}

function qs(t) { document.getElementById('hq').value = t; hSearch(); }

function setBook(b, el) {
  hBook = b;
  hSec = 1;
  document.querySelectorAll('.bt').forEach(function (x) { x.classList.remove('on'); });
  el.classList.add('on');
  document.getElementById('hq').value = '';
  loadSec(1);
}

/* ── TAFSIR ── */
function renderTafsir(q) {
  var d = q
    ? TAFSIR.filter(function (t) {
        return t.ref.toLowerCase().indexOf(q.toLowerCase()) >= 0 ||
               t.tx.toLowerCase().indexOf(q.toLowerCase()) >= 0;
      })
    : TAFSIR;
  document.getElementById('tlist').innerHTML = d.length
    ? d.map(function (t) {
        return '<div class="card"><div class="v-ref">' + t.ref + '</div>' +
               '<div class="v-ar">' + t.ar + '</div>' +
               '<div class="v-tx">' + t.tx + '</div></div>';
      }).join('')
    : '<div class="msg">Aucun r&eacute;sultat.</div>';
}

/* ── RAPPELS ── */
function renderRappels() {
  document.getElementById('rlist').innerHTML = RAPPELS.map(function (r) {
    return '<div class="rc"><div class="rc-ic">' + r.ic + '</div>' +
           '<div class="rc-ti">' + r.ti + '</div>' +
           '<div class="rc-bo">' + r.bo + '</div>' +
           '<div class="rc-hd">' + r.hd + '</div></div>';
  }).join('');
}

function reqNotif() {
  if (!('Notification' in window)) { alert('Non supporté.'); return; }
  Notification.requestPermission().then(function (p) {
    if (p === 'granted') {
      document.getElementById('nb').style.display = 'block';
      var idx = 0;
      setInterval(function () {
        var r = RAPPELS[idx % RAPPELS.length];
        new Notification('نور · ' + r.ti, { body: r.bo });
        idx++;
      }, 6 * 60 * 60 * 1000);
    }
  });
}

/* ── OBLIGATIONS ── */
function renderObligs() {
  document.getElementById('olist').innerHTML = OBLIGS.map(function (o) {
    return '<div class="oc">' +
      '<div class="oh"><span style="font-size:1rem">' + o.ic + '</span>' +
      '<span style="font-family:\'Amiri\',serif;font-size:1.05rem;color:var(--gold)">' + o.ti + '</span></div>' +
      '<div class="ob"><div class="od">' + o.de + '</div>' +
      '<div class="or-l">R&eacute;compense</div>' +
      '<div class="or-t">' + o.re + '</div></div></div>';
  }).join('');
}
