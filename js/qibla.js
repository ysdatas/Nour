var _qibla = 0, _hdg = 0, _ob = false;
var _la = null, _lo = null;
var _ptimes = null, _ptDate = null;

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

/* ── Prayer Times ── */
var PT_KEYS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
var PT_API  = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

function updateActivePrayer() {
  if (!_ptimes) return;
  var nowMin = new Date().getHours() * 60 + new Date().getMinutes();
  var mins = PT_API.map(function (k) {
    var p = (_ptimes[k] || '00:00').split(':');
    return parseInt(p[0]) * 60 + parseInt(p[1]);
  });
  var current = -1;
  for (var i = mins.length - 1; i >= 0; i--) {
    if (nowMin >= mins[i]) { current = i; break; }
  }
  PT_KEYS.forEach(function (k, i) {
    var row = document.getElementById('pt-' + k);
    if (row) row.classList.toggle('pt-active', i === current);
  });
}

function fetchPrayerTimes(la, lo) {
  _la = la; _lo = lo;
  var url = 'https://api.aladhan.com/v1/timings?latitude=' + la +
            '&longitude=' + lo + '&method=3';
  fetch(url).then(function (r) { return r.json(); }).then(function (d) {
    if (!d.data || !d.data.timings) return;
    _ptimes = d.data.timings;
    _ptDate = new Date().toDateString();
    var card = document.getElementById('ptimes');
    if (!card) return;
    PT_KEYS.forEach(function (k, i) {
      var row = document.getElementById('pt-' + k);
      if (!row) return;
      row.querySelector('.pt-time').textContent = _ptimes[PT_API[i]] || '--:--';
    });
    updateActivePrayer();
  }).catch(function () {});
}

setInterval(function () {
  if (_la === null) return;
  if (new Date().toDateString() !== _ptDate) {
    fetchPrayerTimes(_la, _lo);
  } else {
    updateActivePrayer();
  }
}, 60000);

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
    fetchPrayerTimes(la, lo);
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
