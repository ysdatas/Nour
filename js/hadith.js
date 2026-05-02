var CDN_LOCAL = './data/hadith';
var CDN = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions';

function hFetch(path) {
  return fetch(CDN_LOCAL + '/' + path).then(function(r) {
    return r.ok ? r : fetch(CDN + '/' + path);
  }).catch(function() { return fetch(CDN + '/' + path); });
}
var hBook = 'muslim', hNum = 1, hMode = false;
var hAllCache = {};
var hSecCache = {};
var PAGE_SIZE = 10;
var BMAX = { bukhari: 7563, muslim: 7563, abudawud: 5274, ibnmajah: 4341 };
var BLBL = { bukhari: 'Bukhari', muslim: 'Muslim', abudawud: 'Abu Dawud', ibnmajah: 'Ibn Majah' };
var BSEC = { bukhari: 97, muslim: 56, abudawud: 43, ibnmajah: 50 };
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

function loadBook(book, cb) {
  if (hAllCache[book]) { cb(hAllCache[book]); return; }
  hOut('<div class="msg">Chargement de ' + BLBL[book] + '&hellip; (1&ndash;2 min)</div>');
  hFetch('fra-' + book + '.min.json')
    .then(function(r) { return r.json(); })
    .then(function(d) {
      var map = {};
      (d.hadiths || []).forEach(function(h) {
        if (h.text && h.text.length > 5)
          map[h.hadithnumber] = { no: h.hadithnumber, fr: h.text.trim(), ar: '' };
      });
      hAllCache[book] = map;
      cb(map);
    })
    .catch(function() { hOut('<div class="msg">Erreur r&eacute;seau.</div>'); });
}

function fetchSec(book, n, cb) {
  var key = book + '-s' + n;
  if (hSecCache[key]) { cb(hSecCache[key]); return; }
  Promise.all([
    hFetch('fra-' + book + '/sections/' + n + '.min.json'),
    hFetch('ara-' + book + '/sections/' + n + '.min.json')
  ]).then(function(res) {
    if (!res[0].ok) { cb(null); return; }
    Promise.all([res[0].json(), res[1].ok ? res[1].json() : null]).then(function(d) {
      var fra = d[0], ara = d[1];
      var r = {
        hadiths: (fra.hadiths || []).map(function(h, i) {
          return {
            no: h.hadithnumber,
            fr: (h.text || '').trim(),
            ar: ara && ara.hadiths && ara.hadiths[i] ? (ara.hadiths[i].text || '').trim() : ''
          };
        }).filter(function(h) { return h.fr.length > 5; })
      };
      hSecCache[key] = r;
      cb(r);
    });
  }).catch(function() { cb(null); });
}

function hOut(html) { document.getElementById('hout').innerHTML = html; }

function card(h, lbl) {
  return '<div class="card"><div class="h-no">' + lbl + ' &middot; n&deg;' + h.no + '</div>' +
    (h.ar ? '<div class="h-ar">' + h.ar + '</div>' : '') +
    '<div class="h-fr">&laquo;&nbsp;' + h.fr + '&nbsp;&raquo;</div></div>';
}

function showCards(list, lbl, sub) {
  if (!list || !list.length) { hOut('<div class="msg">Aucun hadith trouv&eacute;.</div>'); return; }
  var bk = hMode ? '<button class="bk-btn" onclick="goBack()">&#x2190; Parcourir</button>' : '';
  var sb = sub ? '<div style="font-size:.7rem;letter-spacing:.1em;color:var(--gold);text-transform:uppercase;margin-bottom:.75rem;opacity:.8">' + sub + '</div>' : '';
  hOut(bk + sb + list.map(function(h) { return card(h, lbl); }).join(''));
}

function loadByNum(start) {
  var max = BMAX[hBook] || 7563;
  hNum = Math.max(1, Math.min(start, max));
  var end = Math.min(hNum + PAGE_SIZE - 1, max);
  hMode = false;
  var lbl = BLBL[hBook];
  document.getElementById('stitle').textContent = 'n°' + hNum + ' — ' + end + ' / ' + max;

  loadBook(hBook, function(map) {
    var list = [];
    for (var n = hNum; n <= end; n++) {
      if (map[n]) list.push(map[n]);
    }
    showCards(list, lbl);
  });
}

function prevNum() { loadByNum(hNum - PAGE_SIZE); }
function nextNum() { loadByNum(hNum + PAGE_SIZE); }
function goBack() { document.getElementById('hq').value = ''; loadByNum(hNum); }

function hSearch() {
  var q = (document.getElementById('hq').value || '').trim();
  if (!q) { loadByNum(hNum); return; }
  var lbl = BLBL[hBook];

  if (/^\d+$/.test(q)) {
    var n = parseInt(q, 10);
    hMode = true;
    loadBook(hBook, function(map) {
      if (map[n]) showCards([map[n]], lbl, 'Hadith n°' + q);
      else hOut('<div class="msg">Hadith n°' + q + ' introuvable dans ' + lbl + '.</div>');
    });
    return;
  }

  var secs = findSecs(q);
  if (secs.length > 0) {
    hMode = true;
    hOut('<div class="msg">Chargement&hellip;</div>');
    var all = [], done = 0, max2 = Math.min(secs.length, 2);
    for (var i = 0; i < max2; i++) {
      (function(sec) {
        fetchSec(hBook, sec, function(d) {
          if (d) all = all.concat(d.hadiths.slice(0, 8));
          if (++done === max2) showCards(all, lbl, 'Thème · ' + q);
        });
      })(secs[i]);
    }
    return;
  }

  if (!hAllCache[hBook]) {
    hOut('<div class="msg">Thème « ' + q + ' » non reconnu. Essaie un mot-clé ou un numéro.</div>');
    return;
  }
  hMode = true;
  var qn = nrm(q);
  var map = hAllCache[hBook];
  var matches = [];
  var ks = Object.keys(map);
  for (var i = 0; i < ks.length && matches.length < 15; i++) {
    if (nrm(map[ks[i]].fr).indexOf(qn) >= 0) matches.push(map[ks[i]]);
  }
  showCards(matches, lbl, 'Recherche · ' + q);
}

function qs(t) { document.getElementById('hq').value = t; hSearch(); }

function setBook(b, el) {
  hBook = b;
  hNum = 1;
  document.querySelectorAll('.bt').forEach(function(x) { x.classList.remove('on'); });
  el.classList.add('on');
  document.getElementById('hq').value = '';
  loadByNum(1);
}
