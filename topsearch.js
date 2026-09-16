// =====================================================================
//  topsearch.js — buscador de la barra superior, compartido por todas
//  las páginas. Filtra PLACES (definido en site-data.js) por nombre y
//  lleva a la ficha del lugar (lugar.html?p=<slug>) elegido.
// =====================================================================
(function(){
  const input = document.getElementById('topSearchInput');
  const list = document.getElementById('topSearchResults');
  if(!input || !list) return;

  function normalize(s){
    return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function render(query){
    const q = normalize(query.trim());
    list.innerHTML = '';
    if(!q){ list.classList.remove('open'); return; }

    const matches = PLACES.filter(function(p){ return normalize(p.name).includes(q); });

    if(!matches.length){
      const li = document.createElement('li');
      li.className = 'empty';
      li.textContent = 'Sin resultados para "' + query + '"';
      list.appendChild(li);
    } else {
      matches.slice(0, 8).forEach(function(p){
        const li = document.createElement('li');
        li.textContent = p.name;
        li.addEventListener('click', function(){
          window.location.href = 'lugar.html?p=' + p.slug;
        });
        list.appendChild(li);
      });
    }
    list.classList.add('open');
  }

  input.addEventListener('input', function(){ render(input.value); });
  input.addEventListener('focus', function(){ if(input.value.trim()) render(input.value); });
  input.addEventListener('keydown', function(e){
    if(e.key === 'Enter'){
      const q = normalize(input.value.trim());
      const first = PLACES.find(function(p){ return normalize(p.name).includes(q); });
      if(first) window.location.href = 'lugar.html?p=' + first.slug;
    }
  });
  document.addEventListener('click', function(e){
    if(!e.target.closest('.site-search')) list.classList.remove('open');
  });
})();
