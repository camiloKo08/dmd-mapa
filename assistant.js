// =====================================================================
//  assistant.js — asistente virtual del sitio DMD.
//  No usa ninguna IA externa ni claves de API (el sitio es estático y
//  no tiene servidor propio, así que una clave en este archivo quedaría
//  expuesta a cualquiera). En su lugar, entiende preguntas en lenguaje
//  natural buscando coincidencias contra los datos que ya existen en
//  site-data.js (PLACES, MUNICIPIO_CONTACTO, DMD_CONTACTO) y responde
//  con información real del sitio: buscar lugares, resumir su historia
//  y actividades, explicar cómo usar el mapa/buscador, y dar contacto.
//
//  Compartido por index.html, mapa.html y lugar.html. Requiere que la
//  página tenga cargado site-data.js antes que este archivo, y el HTML
//  del widget (#assistantToggle, #assistantPanel, etc. — ver site.css).
// =====================================================================
(function(){
  const toggleBtn = document.getElementById('assistantToggle');
  const panel = document.getElementById('assistantPanel');
  const closeBtn = document.getElementById('assistantClose');
  const messagesEl = document.getElementById('assistantMessages');
  const suggestionsEl = document.getElementById('assistantSuggestions');
  const inputEl = document.getElementById('assistantInput');
  const sendBtn = document.getElementById('assistantSend');
  if(!toggleBtn || !panel) return;

  // ---------- la "cara" del asistente (mascota SVG, sin imágenes externas) ----------
  const MASCOT_SVG = '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">' +
    '<circle cx="32" cy="36" r="24" fill="#00C2A8"/>' +
    '<path d="M32 4C25.4 4 20 9.4 20 16c0 8.5 12 24 12 24s12-15.5 12-24c0-6.6-5.4-12-12-12z" fill="#00967F"/>' +
    '<circle cx="32" cy="15.5" r="3.6" fill="#fff"/>' +
    '<circle cx="23" cy="34" r="4.4" fill="#fff"/>' +
    '<circle cx="41" cy="34" r="4.4" fill="#fff"/>' +
    '<circle cx="24" cy="35" r="2" fill="#0B1622"/>' +
    '<circle cx="42" cy="35" r="2" fill="#0B1622"/>' +
    '<path d="M22 44c3.2 4.2 16.6 4.2 20 0" stroke="#0B1622" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
  '</svg>';

  toggleBtn.innerHTML = MASCOT_SVG;
  const headerAvatar = document.getElementById('assistantHeaderAvatar');
  if(headerAvatar) headerAvatar.innerHTML = MASCOT_SVG;

  // ---------- utilidades ----------
  function normalize(s){
    return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function addMessage(html, sender){
    const row = document.createElement('div');
    row.className = 'msg-row ' + (sender === 'bot' ? 'bot-row' : 'user-row');
    row.innerHTML = (sender === 'bot' ? '<div class="msg-avatar">' + MASCOT_SVG + '</div>' : '') +
      '<div class="msg ' + sender + '">' + html + '</div>';
    messagesEl.appendChild(row);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function addBotMessage(html){
    // pequeño retraso para que se sienta como una respuesta, no un salto brusco
    setTimeout(function(){ addMessage(html, 'bot'); }, 350);
  }

  function setSuggestions(list){
    suggestionsEl.innerHTML = '';
    list.forEach(function(s){
      const btn = document.createElement('button');
      btn.textContent = s.label;
      btn.addEventListener('click', function(){
        addMessage(s.label, 'user');
        handleQuery(s.query || s.label);
      });
      suggestionsEl.appendChild(btn);
    });
  }

  function defaultSuggestions(){
    setSuggestions([
      { label: '¿Qué lugares hay?' },
      { label: '¿Cómo uso el mapa?' },
      { label: 'Contacto' },
      { label: PLACES[0] ? PLACES[0].name : '¿Qué es DMD?' }
    ]);
  }

  // ---------- construir respuestas ----------
  function placesListHtml(){
    const items = PLACES.map(function(p){
      return '<li><a href="lugar.html?p=' + p.slug + '">' + p.name + '</a></li>';
    }).join('');
    return 'Estos son los lugares que tenemos en Tausa:<ul>' + items + '</ul>Escribe el nombre de cualquiera y te cuento más.';
  }

  function findPlaceInText(text){
    const q = normalize(text);
    // primero intenta una coincidencia de nombre completo, luego por palabras sueltas (min 4 letras, para evitar falsos positivos con palabras cortas)
    let match = PLACES.find(function(p){ return q.indexOf(normalize(p.name)) !== -1; });
    if(match) return match;
    const words = q.split(/\s+/).filter(function(w){ return w.length >= 4; });
    match = PLACES.find(function(p){
      const pname = normalize(p.name);
      return words.some(function(w){ return pname.indexOf(w) !== -1; });
    });
    return match || null;
  }

  function summarizePlace(place){
    let html = '<strong>' + place.name + '</strong><br>' + (place.desc || '');
    if(place.historia){
      const resumen = place.historia.length > 220 ? place.historia.slice(0, 220).trim() + '…' : place.historia;
      html += '<br><br>' + resumen;
    }
    if(place.actividades && place.actividades.length){
      html += '<br><br><em>Se puede:</em> ' + place.actividades.join(', ') + '.';
    }
    if(place.destacado){
      html += '<br><br>⚠️ <em>' + place.destacado.titulo + ':</em> ' + place.destacado.texto;
    }
    html += '<br><br><a href="lugar.html?p=' + place.slug + '">Ver ficha completa →</a>';
    return html;
  }

  function contactHtml(){
    return 'Datos de contacto:<br><br>' +
      '<strong>' + MUNICIPIO_CONTACTO.nombre + '</strong><br>' +
      '☎ ' + MUNICIPIO_CONTACTO.telefono + '<br>' +
      '✉ ' + MUNICIPIO_CONTACTO.correo + '<br>' +
      '📍 ' + MUNICIPIO_CONTACTO.direccion + '<br><br>' +
      '<strong>DMD (esta página)</strong><br>' +
      '☎ ' + DMD_CONTACTO.telefono + '<br>' +
      '✉ ' + DMD_CONTACTO.correo;
  }

  function photosAuthorHtml(place){
    if(place && place.fotosCredito){
      return 'Las fotos de <strong>' + place.name + '</strong> fueron tomadas por ' + place.fotosCredito + '.';
    }
    if(place){
      return 'Todavía no tengo registrado quién tomó las fotos de ' + place.name + '.';
    }
    const authors = Array.from(new Set(PLACES.map(function(p){ return p.fotosCredito; }).filter(Boolean)));
    if(!authors.length) return 'Todavía no tengo el crédito de las fotos registrado.';
    return 'Las fotos del sitio fueron tomadas por ' + authors.join(' y ') + '.';
  }

  // ---------- entender la pregunta ----------
  function handleQuery(rawText){
    const q = normalize(rawText);

    // saludo
    if(/^(hola|buenas|hey|ola|buenos dias|buenas tardes|buenas noches)/.test(q)){
      addBotMessage('¡Hola! Soy el asistente de DMD 👋 Puedo ayudarte a encontrar un lugar, resumirte su historia, explicarte cómo usar el mapa, o darte el contacto de la Alcaldía. ¿Qué necesitas?');
      setTimeout(defaultSuggestions, 400);
      return;
    }

    // qué es DMD / el sitio
    if(q.indexOf('que es dmd') !== -1 || q.indexOf('que es esta pagina') !== -1 || q.indexOf('que es esto') !== -1){
      addBotMessage('DMD (Directorio y Mapa Digital) es un proyecto turístico y digital creado para dar a conocer la riqueza de Tausa, Cundinamarca: conecta a visitantes y comunidad con sus lugares, paisajes, historia, cultura y naturaleza a través de un mapa virtual, fotos, videos y contenido con dron. <a href="acerca.html">Conoce más sobre el proyecto →</a>');
      return;
    }

    // listar lugares
    if(/lugares|sitios|que hay|destinos|donde puedo ir/.test(q)){
      addBotMessage(placesListHtml());
      return;
    }

    // cómo usar el mapa
    if(q.indexOf('mapa') !== -1 && /como|usar|funciona|sirve/.test(q)){
      addBotMessage('El mapa (<a href="mapa.html">ábrelo aquí</a>) te muestra tu ubicación en vivo y todos los lugares turísticos marcados. Toca cualquier marcador para ver su nombre, foto y descripción, y presiona "Cómo llegar" para trazar la ruta desde donde estás.');
      return;
    }

    // cómo buscar
    if(/como busco|como encuentro|como funciona la busqueda|buscador/.test(q)){
      addBotMessage('Puedes usar la barra de búsqueda de arriba (escribe el nombre del lugar), o simplemente pregúntamelo aquí mismo — por ejemplo escribe "Laguna Verde" y te cuento de qué se trata.');
      return;
    }

    // contacto
    if(/contacto|telefono|correo|email|alcaldia/.test(q)){
      addBotMessage(contactHtml());
      return;
    }

    // cómo llegar
    if(/como llego|como llegar|direccion|ruta/.test(q)){
      const place = findPlaceInText(q);
      if(place){
        addBotMessage('Para llegar a <strong>' + place.name + '</strong>, abre su <a href="lugar.html?p=' + place.slug + '">ficha</a> y presiona el botón "Cómo llegar" — te va a llevar al mapa con la ruta ya trazada desde tu ubicación.');
      } else {
        addBotMessage('¿A qué lugar quieres llegar? Dime el nombre, o abre directamente el <a href="mapa.html">mapa</a> y elige uno de los marcadores.');
      }
      return;
    }

    // quién hizo esto / quién programó al asistente
    if(/quien (hizo|creo|desarrollo|programo)|creador|autor del sitio|quien te (creo|hizo|programo)/.test(q)){
      addBotMessage('Esta página (y yo) fuimos creados por DMD Studio, como proyecto de grado 11 del SENA.');
      return;
    }

    // quién tomó las fotos
    if(/quien tomo|fotografo|autor de las fotos|credito de las fotos|quien es el fotografo/.test(q)){
      const place = findPlaceInText(q);
      addBotMessage(photosAuthorHtml(place));
      return;
    }

    // para qué fue creada la página / objetivo / propósito
    if(/para que (fue creada|sirve|se hizo)|objetivo (de|del) sitio|proposito|por que se hizo|por que existe esta pagina/.test(q)){
      addBotMessage('El propósito de DMD es promover el turismo de Tausa mediante herramientas digitales, facilitando que los visitantes encuentren, conozcan y lleguen a los diferentes lugares turísticos, culturales e históricos del municipio — y de paso, apoyar la visibilidad de los comercios y comunidades locales. También es el proyecto de grado 11 de DMD Studio para el SENA. <a href="acerca.html">Ver el objetivo completo →</a>');
      return;
    }

    // qué significan las siglas DMD
    if(/que significa dmd|significado de dmd|siglas de dmd/.test(q)){
      addBotMessage('DMD significa <strong>Directorio y Mapa Digital</strong> — así se llama este proyecto de turismo digital para Tausa.');
      return;
    }

    // misión
    if(/mision de dmd|cual es la mision/.test(q)){
      addBotMessage('Nuestra misión es promover el reconocimiento de los lugares turísticos de Tausa mediante un mapa virtual y una página web que faciliten a los visitantes encontrar información sobre los destinos, conocer su historia y descubrir la riqueza cultural, natural e histórica del municipio. <a href="acerca.html">Leer más →</a>');
      return;
    }

    // visión
    if(/vision de dmd|cual es la vision/.test(q)){
      addBotMessage('Nuestra visión es convertir a DMD, en un plazo de 5 años, en una herramienta de referencia para que habitantes y visitantes puedan ubicar y conocer fácilmente los principales sitios turísticos de Tausa, mediante un mapa virtual moderno, práctico y fácil de utilizar. <a href="acerca.html">Leer más →</a>');
      return;
    }

    // valores
    if(/valores de dmd|cuales son los valores/.test(q)){
      addBotMessage('Nuestros valores son: <strong>Innovación</strong> (usar tecnología para promocionar Tausa), <strong>Identidad</strong> (valorar su historia y cultura), <strong>Compromiso</strong> (ofrecer información de calidad), <strong>Creatividad</strong> (contenido visual atractivo) y <strong>Desarrollo local</strong> (apoyar comercios y comunidades). <a href="acerca.html">Ver más →</a>');
      return;
    }

    // objetivos específicos
    if(/objetivos de dmd|cuales son los objetivos/.test(q)){
      addBotMessage('Entre nuestros objetivos están: mantener un mapa virtual GPS de Tausa, dar a conocer sus sitios turísticos por la web y redes sociales, crear contenido con fotografía, video y dron, facilitar cómo llegar a cada destino, y apoyar a los comercios y emprendimientos locales. <a href="acerca.html">Ver la lista completa →</a>');
      return;
    }

    // manejar el botón directo "ver ficha completa"
    if(q.indexOf('__link__') === 0){
      window.location.href = 'lugar.html?p=' + rawText.replace('__link__', '');
      return;
    }

    // pregunta por un lugar específico (historia, actividades, leyenda, resumen, o solo el nombre)
    const place = findPlaceInText(q);
    if(place){
      if(q.indexOf('leyenda') !== -1){
        addBotMessage(place.leyenda ? '📖 ' + place.leyenda + ' (recuerda que esto es tradición oral, no un hecho histórico confirmado).' : 'No tengo registrada ninguna leyenda para ' + place.name + '.');
        return;
      }
      if(q.indexOf('actividad') !== -1 || q.indexOf('que se puede hacer') !== -1){
        addBotMessage(place.actividades && place.actividades.length ? 'En ' + place.name + ' se puede: ' + place.actividades.join(', ') + '.' : 'Todavía no tengo actividades registradas para ' + place.name + '.');
        return;
      }
      if(q.indexOf('prohibi') !== -1){
        addBotMessage(place.prohibiciones && place.prohibiciones.length ? 'En ' + place.name + ' ten en cuenta: ' + place.prohibiciones.join(', ') + '.' : 'No tengo prohibiciones específicas registradas para ' + place.name + '.');
        return;
      }
      addBotMessage(summarizePlace(place));
      setTimeout(function(){
        setSuggestions([
          { label: 'Ver ficha completa', query: '__link__' + place.slug },
          { label: '¿Cómo llego?', query: 'como llego a ' + place.name },
          { label: 'Otro lugar', query: '¿qué lugares hay?' }
        ]);
      }, 500);
      return;
    }

    // no se entendió nada
    addBotMessage('No estoy seguro de haber entendido 🤔 Puedo ayudarte a buscar un lugar (dime su nombre), resumir su historia, explicarte el mapa, o darte el contacto de la Alcaldía.');
    setTimeout(defaultSuggestions, 400);
  }

  // ---------- eventos del widget ----------
  let started = false;
  function openPanel(){
    panel.classList.add('open');
    if(!started){
      started = true;
      addMessage('¡Hola! Soy el asistente de DMD 👋 Puedo ayudarte a encontrar un lugar, resumir su historia, o explicarte cómo usar el mapa. ¿Qué necesitas?', 'bot');
      defaultSuggestions();
    }
    inputEl.focus();
  }
  function closePanel(){ panel.classList.remove('open'); }

  toggleBtn.addEventListener('click', function(){
    panel.classList.contains('open') ? closePanel() : openPanel();
  });
  closeBtn.addEventListener('click', closePanel);

  function send(){
    const text = inputEl.value.trim();
    if(!text) return;
    addMessage(text, 'user');
    inputEl.value = '';
    suggestionsEl.innerHTML = '';
    handleQuery(text);
  }
  sendBtn.addEventListener('click', send);
  inputEl.addEventListener('keydown', function(e){
    if(e.key === 'Enter') send();
  });
})();
