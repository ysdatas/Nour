function renderObligs() {
  document.getElementById('olist').innerHTML = OBLIGS.map(function (o) {
    return '<div class="oc">' +
      '<div class="oh">' +
        '<span style="font-size:1rem">' + o.ic + '</span>' +
        '<span style="font-family:\'Amiri\',serif;font-size:1.05rem;color:var(--gold)">' + o.ti + '</span>' +
      '</div>' +
      '<div class="ob">' +
        '<div class="od">' + o.de + '</div>' +
        '<div class="or-l">R&eacute;compense</div>' +
        '<div class="or-t">' + o.re + '</div>' +
      '</div>' +
      '</div>';
  }).join('');
}
