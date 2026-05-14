var _adhkarCat = 'matin';
var NOTIF_KEY = 'adhkar_notif';

/* ── Rappels ── */
function renderRappels() {
  document.getElementById('rlist').innerHTML = RAPPELS.map(function (r) {
    return '<div class="rc">' +
           '<div class="rc-ic">' + r.ic + '</div>' +
           '<div class="rc-ti">' + r.ti + '</div>' +
           '<div class="rc-bo">' + r.bo + '</div>' +
           '<div class="rc-hd">' + r.hd + '</div>' +
           '</div>';
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

/* ── Adhkar tabs ── */
function renderAdhkarTabs() {
  var tabs = document.getElementById('adhkar-tabs');
  if (!tabs) return;
  var s = _loadNotif();
  tabs.innerHTML = Object.keys(ADHKAR).map(function (k) {
    var cat = ADHKAR[k];
    var on = s[k] && s[k].enabled;
    return '<button class="ak-tab' + (k === _adhkarCat ? ' ak-tab-on' : '') + '" onclick="switchAdhkar(\'' + k + '\')">' +
           cat.icon + '<span>' + cat.label + '</span>' +
           (on ? '<span class="ak-tab-bell">🔔</span>' : '') +
           '</button>';
  }).join('');
}

function renderAdhkarList() {
  var list = document.getElementById('adhkar-list');
  if (!list) return;
  var cat = ADHKAR[_adhkarCat];
  list.innerHTML = cat.list.map(function (d) {
    return '<div class="ak-card">' +
           '<div class="ak-rep">' + d.rep + '</div>' +
           '<div class="ak-ar">' + d.ar + '</div>' +
           '<div class="ak-fr">' + d.fr + '</div>' +
           '<div class="ak-ref">' + d.ref + '</div>' +
           '</div>';
  }).join('');
}

function switchAdhkar(k) {
  _adhkarCat = k;
  renderAdhkarTabs();
  renderNotifPanel();
  renderAdhkarList();
}

/* ── Notification settings ── */
function _loadNotif() {
  try { return JSON.parse(localStorage.getItem(NOTIF_KEY) || '{}'); } catch (e) { return {}; }
}

function _saveNotif(s) {
  localStorage.setItem(NOTIF_KEY, JSON.stringify(s));
}

function _getNotifForCat(cat) {
  var s = _loadNotif();
  var cat_data = ADHKAR[cat];
  return s[cat] || { enabled: false, time: cat_data.defaultTime || '08:00', count: 1 };
}

function renderNotifPanel() {
  var panel = document.getElementById('ak-notif-panel');
  if (!panel) return;
  var n = _getNotifForCat(_adhkarCat);
  var cat = ADHKAR[_adhkarCat];

  panel.innerHTML =
    '<div class="ak-np-row">' +
      '<span class="ak-np-label">🔔 ' + cat.icon + ' ' + cat.label + '</span>' +
      '<label class="ak-toggle">' +
        '<input type="checkbox" id="ak-notif-chk" ' + (n.enabled ? 'checked' : '') + ' onchange="toggleCatNotif(this.checked)">' +
        '<span class="ak-toggle-sl"></span>' +
      '</label>' +
    '</div>' +
    (n.enabled ?
      '<div class="ak-np-opts">' +
        '<label class="ak-np-opt">Heure' +
          '<input type="time" value="' + n.time + '" onchange="updateNotifTime(this.value)">' +
        '</label>' +
        '<label class="ak-np-opt">Rappels / jour' +
          '<select onchange="updateNotifCount(this.value)">' +
            [1, 2, 3, 4, 5].map(function (i) {
              return '<option value="' + i + '"' + (n.count === i ? ' selected' : '') + '>' + i + '×</option>';
            }).join('') +
          '</select>' +
        '</label>' +
        '<div class="ak-np-hint">Les rappels sont espacés de 1h à partir de l\'heure choisie.</div>' +
      '</div>'
    : '');
}

function toggleCatNotif(enabled) {
  if (enabled) {
    if (!('Notification' in window)) { alert('Notifications non supportées.'); return; }
    if (Notification.permission === 'granted') {
      _applyNotifToggle(true);
    } else {
      Notification.requestPermission().then(function (p) {
        if (p !== 'granted') {
          var chk = document.getElementById('ak-notif-chk');
          if (chk) chk.checked = false;
          return;
        }
        _applyNotifToggle(true);
      });
    }
  } else {
    _applyNotifToggle(false);
  }
}

function _applyNotifToggle(enabled) {
  var s = _loadNotif();
  var cat_data = ADHKAR[_adhkarCat];
  if (!s[_adhkarCat]) s[_adhkarCat] = { time: cat_data.defaultTime || '08:00', count: 1 };
  s[_adhkarCat].enabled = enabled;
  _saveNotif(s);
  renderAdhkarTabs();
  renderNotifPanel();
}

function updateNotifTime(val) {
  var s = _loadNotif();
  if (!s[_adhkarCat]) s[_adhkarCat] = { enabled: true, time: val, count: 1 };
  else s[_adhkarCat].time = val;
  _saveNotif(s);
}

function updateNotifCount(val) {
  var s = _loadNotif();
  var cat_data = ADHKAR[_adhkarCat];
  if (!s[_adhkarCat]) s[_adhkarCat] = { enabled: true, time: cat_data.defaultTime || '08:00', count: parseInt(val) };
  else s[_adhkarCat].count = parseInt(val);
  _saveNotif(s);
}

/* ── Notification engine ── */
function _addMinutes(timeStr, mins) {
  var p = timeStr.split(':');
  var total = parseInt(p[0]) * 60 + parseInt(p[1]) + mins;
  total = ((total % 1440) + 1440) % 1440;
  return String(Math.floor(total / 60)).padStart(2, '0') + ':' + String(total % 60).padStart(2, '0');
}

function startNotifEngine() {
  setInterval(function () {
    if (Notification.permission !== 'granted') return;
    var s = _loadNotif();
    var now = new Date();
    var cur = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

    Object.keys(s).forEach(function (cat) {
      var n = s[cat];
      if (!n.enabled || !ADHKAR[cat]) return;
      var count = n.count || 1;
      for (var i = 0; i < count; i++) {
        if (_addMinutes(n.time, i * 60) === cur) {
          var catData = ADHKAR[cat];
          var dhikr = catData.list[Math.floor(Math.random() * catData.list.length)];
          new Notification('نور · ' + catData.icon + ' ' + catData.label, {
            body: dhikr.ar.substring(0, 60) + '\n' + dhikr.fr.substring(0, 80) + (dhikr.fr.length > 80 ? '…' : '')
          });
          break;
        }
      }
    });
  }, 60000);
}
