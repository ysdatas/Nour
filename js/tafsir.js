function renderTafsir(q) {
  var d = q
    ? TAFSIR.filter(function (t) {
        return t.ref.toLowerCase().indexOf(q.toLowerCase()) >= 0 ||
               t.tx.toLowerCase().indexOf(q.toLowerCase()) >= 0;
      })
    : TAFSIR;
  document.getElementById('tlist').innerHTML = d.length
    ? d.map(function (t) {
        return '<div class="card">' +
               '<div class="v-ref">' + t.ref + '</div>' +
               '<div class="v-ar">' + t.ar + '</div>' +
               '<div class="v-tx">' + t.tx + '</div>' +
               '</div>';
      }).join('')
    : '<div class="msg">Aucun r&eacute;sultat.</div>';
}
