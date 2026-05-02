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
