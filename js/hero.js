(function(){
  const words = ["dans ta prière","dans tes invocations","dans le Rappel","dans la lecture"];
  let current = 0;
  let timer = null;

  function advance(){
    const items = document.querySelectorAll('.hero-word');
    if(!items.length) return;

    // mark current as exiting upward
    items[current].classList.remove('active');
    items[current].classList.add('exit-up');

    current = (current + 1) % words.length;

    // small delay so exit animation starts before enter
    setTimeout(function(){
      items.forEach(function(el, i){
        el.classList.remove('exit-up');
        if(i === current) el.classList.add('active');
      });
    }, 60);
  }

  function startCycle(){
    if(timer) clearInterval(timer);
    timer = setInterval(advance, 2200);
  }

  function stopCycle(){
    if(timer){ clearInterval(timer); timer = null; }
  }

  // Build word elements once DOM is ready
  function buildWords(){
    const container = document.getElementById('hero-cycle');
    if(!container) return;
    container.innerHTML = '';
    words.forEach(function(w, i){
      const span = document.createElement('span');
      span.className = 'hero-word' + (i === 0 ? ' active' : '');
      span.textContent = w;
      container.appendChild(span);
    });
  }

  // Navigation hook: start/stop cycle based on active page
  function onPageChange(pageId){
    if(pageId === 'hero'){
      buildWords();
      startCycle();
    } else {
      stopCycle();
    }
  }

  // Expose for init.js
  window.heroOnPageChange = onPageChange;

  // Auto-init if hero page is the first shown
  document.addEventListener('DOMContentLoaded', function(){
    buildWords();
    const heroPage = document.getElementById('p-hero');
    if(heroPage && heroPage.classList.contains('on')) startCycle();
  });
})();
