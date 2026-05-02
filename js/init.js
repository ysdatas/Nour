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
        loadByNum(1);
      }
      if (el.dataset.p === 'quran') {
        renderSurahList();
      }
      if (el.dataset.p === 'livres' && !window._lvLoaded) {
        window._lvLoaded = true;
        renderLivres();
      }
    });
  });

  renderRappels();
  // Auto-demander la localisation pour la qibla et les horaires
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(pos) {
      var la = pos.coords.latitude, lo = pos.coords.longitude;
      _qibla = calcQ(la, lo);
      document.getElementById('qdeg').textContent = Math.round(_qibla) + '° depuis le Nord';
      document.getElementById('qstat').textContent = la.toFixed(3) + '° N · ' + lo.toFixed(3) + '° E';
      var btn = document.getElementById('qbtn');
      if (btn) { btn.textContent = '✦ Actualiser'; btn.disabled = false; }
      fetchPrayerTimes(la, lo);
      setTimeout(function() { if (_hdg === 0) rotN(_qibla); }, 800);
    }, function() {});
  }
});
