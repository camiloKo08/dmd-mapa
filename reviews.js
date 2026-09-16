// =====================================================================
//  reviews.js — reseñas y calificaciones (estrellas 1 a 5 + puntaje 1.0 a 5.0)
//
//  Se usa en:
//   - lugar.html   → una reseña por cada lugar turístico (experiencia en el sitio visitado)
//   - acerca.html  → una reseña sobre la experiencia usando la página web de DMD
//   - mapa.html    → solo el RESUMEN (estrellas + puntaje), sin formulario ni lista,
//                    dentro del popup de cada marcador
//
//  NOTA HONESTA: si ya configuraste FIREBASE_CONFIG en site-data.js, las
//  reseñas se guardan en Firestore y las ve cualquier visitante de la
//  página. Si todavía no lo configuras, se guardan solo en este navegador
//  (localStorage) — sirve para probar cómo se ve y funciona, pero cada
//  persona vería solo las reseñas que ella misma escriba, hasta que actives
//  Firebase. En cuanto lo actives, este mismo código empieza a compartirlas
//  con todos automáticamente, sin tocar nada más.
// =====================================================================
(function(){

  function firebaseReady(){
    return !!(window.fb && window.fb.ready && window.fb.db);
  }

  function localKey(key){ return 'dmd_reviews::' + key; }

  function getLocalReviews(key){
    try{
      return JSON.parse(localStorage.getItem(localKey(key))) || [];
    } catch(e){ return []; }
  }

  function saveLocalReview(key, item){
    const items = getLocalReviews(key);
    items.push(item);
    try{ localStorage.setItem(localKey(key), JSON.stringify(items)); } catch(e){}
  }

  function getReviews(key){
    if(firebaseReady()){
      return window.fb.db.collection('reviews').doc(key).get().then(function(doc){
        return (doc.exists && doc.data().items) || [];
      }).catch(function(){ return getLocalReviews(key); });
    }
    return Promise.resolve(getLocalReviews(key));
  }

  function addReview(key, stars, comment){
    const item = { stars: stars, comment: (comment || '').trim(), ts: Date.now() };
    if(firebaseReady()){
      return window.fb.db.collection('reviews').doc(key).set({
        items: firebase.firestore.FieldValue.arrayUnion(item)
      }, { merge: true }).catch(function(){ saveLocalReview(key, item); });
    }
    saveLocalReview(key, item);
    return Promise.resolve();
  }

  function computeSummary(items){
    if(!items.length) return { avg: 0, count: 0 };
    const sum = items.reduce(function(a, r){ return a + r.stars; }, 0);
    return { avg: sum / items.length, count: items.length };
  }

  function starsHtml(count, sizePx, color, emptyColor){
    let html = '';
    for(let i = 1; i <= 5; i++){
      html += '<span style="font-size:' + sizePx + 'px; line-height:1; color:' + (i <= count ? color : emptyColor) + ';">★</span>';
    }
    return html;
  }

  function timeAgo(ts){
    const diff = Date.now() - ts;
    const day = 86400000;
    if(diff < 3600000) return 'hace un momento';
    if(diff < day) return 'hoy';
    const days = Math.floor(diff / day);
    if(days === 1) return 'ayer';
    if(days < 30) return 'hace ' + days + ' días';
    const months = Math.floor(days / 30);
    if(months < 12) return 'hace ' + months + (months === 1 ? ' mes' : ' meses');
    return 'hace ' + Math.floor(months / 12) + ' años';
  }

  function escapeHtml(s){
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  // =====================================================================
  //  WIDGET COMPLETO — resumen + formulario para calificar + lista con
  //  botón de "mostrar más / mostrar menos". Se usa en lugar.html y acerca.html.
  // =====================================================================
  window.renderReviewsWidget = function(containerEl, key, opts){
    opts = opts || {};
    const placeholder = opts.placeholder || 'Cuéntanos qué te pareció… (opcional)';
    const VISIBLE_COUNT = 3;
    let expanded = false;

    containerEl.innerHTML = '<div class="reviews-loading">Cargando reseñas…</div>';

    getReviews(key).then(function(items){
      items = items.slice().sort(function(a, b){ return b.ts - a.ts; });

      function build(){
        const summary = computeSummary(items);
        const avgLabel = summary.count ? summary.avg.toFixed(1) : '—';
        const visibleItems = expanded ? items : items.slice(0, VISIBLE_COUNT);

        containerEl.innerHTML =
          '<div class="reviews-summary">' +
            '<div class="reviews-score">' + avgLabel + '</div>' +
            '<div class="reviews-summary-text">' +
              '<div class="reviews-stars">' + starsHtml(Math.round(summary.avg), 18, '#FFB020', '#D8DEE6') + '</div>' +
              '<div class="reviews-count">' + summary.count + (summary.count === 1 ? ' reseña' : ' reseñas') + '</div>' +
            '</div>' +
          '</div>' +
          '<div class="reviews-form">' +
            '<div class="reviews-form-label">Deja tu calificación</div>' +
            '<div class="reviews-form-stars" id="reviewStarsPicker"></div>' +
            '<textarea class="reviews-textarea" id="reviewComment" placeholder="' + placeholder + '" rows="2"></textarea>' +
            '<button class="reviews-submit" id="reviewSubmit" disabled>Enviar</button>' +
          '</div>' +
          (items.length
            ? ('<div class="reviews-list">' + visibleItems.map(renderItem).join('') + '</div>' +
               (items.length > VISIBLE_COUNT
                 ? '<button class="reviews-toggle" id="reviewsToggle">' + (expanded ? 'Mostrar menos ▲' : 'Mostrar más (' + (items.length - VISIBLE_COUNT) + ') ▼') + '</button>'
                 : ''))
            : '<div class="reviews-empty">Todavía no hay reseñas. ¡Sé el primero en opinar!</div>');

        // ---------- selector de estrellas (formulario) ----------
        let selected = 0;
        const picker = document.getElementById('reviewStarsPicker');
        function renderPicker(){
          picker.innerHTML = '';
          for(let i = 1; i <= 5; i++){
            const s = document.createElement('span');
            s.className = 'reviews-pick-star';
            s.textContent = '★';
            s.style.color = i <= selected ? '#FFB020' : '#D8DEE6';
            s.addEventListener('click', function(){
              selected = i;
              renderPicker();
              document.getElementById('reviewSubmit').disabled = false;
            });
            picker.appendChild(s);
          }
        }
        renderPicker();

        document.getElementById('reviewSubmit').addEventListener('click', function(){
          if(!selected) return;
          const commentEl = document.getElementById('reviewComment');
          const btn = document.getElementById('reviewSubmit');
          btn.disabled = true;
          btn.textContent = 'Enviando…';
          addReview(key, selected, commentEl.value).then(function(){
            items.unshift({ stars: selected, comment: commentEl.value.trim(), ts: Date.now() });
            expanded = true;
            build();
          });
        });

        if(items.length > VISIBLE_COUNT){
          document.getElementById('reviewsToggle').addEventListener('click', function(){
            expanded = !expanded;
            build();
          });
        }
      }

      function renderItem(r){
        const safeComment = r.comment ? escapeHtml(r.comment) : '';
        return '<div class="review-item">' +
          '<div class="review-item-stars">' + starsHtml(r.stars, 13, '#FFB020', '#D8DEE6') +
            '<span class="review-item-date">' + timeAgo(r.ts) + '</span>' +
          '</div>' +
          (safeComment ? '<div class="review-item-comment">' + safeComment + '</div>' : '') +
        '</div>';
      }

      build();
    });
  };

  // =====================================================================
  //  RESUMEN COMPACTO — solo estrellas + puntaje, para los popups del mapa.
  //  Devuelve una promesa con el HTML ya armado.
  // =====================================================================
  window.getReviewsSummaryHtml = function(key){
    return getReviews(key).then(function(items){
      const summary = computeSummary(items);
      if(!summary.count){
        return '<span class="map-rating-empty">Sin reseñas todavía</span>';
      }
      return '<span class="map-rating-score">' + summary.avg.toFixed(1) + '</span>' +
             '<span class="map-rating-stars">' + starsHtml(Math.round(summary.avg), 13, '#FFB020', 'rgba(255,255,255,0.25)') + '</span>' +
             '<span class="map-rating-count">(' + summary.count + ')</span>';
    });
  };
})();
