// =====================================================================
//  site-data.js — DATOS DEL SITIO, EN UN SOLO LUGAR
//  Todas las páginas (inicio, cada lugar, y el mapa) leen este mismo
//  archivo. Edita aquí — no hace falta tocar nada más.
// =====================================================================

// ---------- UBICACIONES PROPIAS ----------
// Solo el administrador las edita aquí, en el código. Los visitantes no
// pueden agregar, editar ni borrar lugares — solo verlos.
//
// Para agregar un lugar nuevo, copia un bloque y cambia los valores:
// {
//   name: 'Nombre visible',
//   desc:  'Descripción corta (aparece en el pin, la lista y el botón).',
//   lat: 0, lng: 0,
//   photos: ['fotos/carpeta/foto1.jpg'],   // opcional, 0 o más
//   video:  'https://www.youtube.com/watch?v=XXXXXXXXXXX',  // opcional
//   info:   'Texto largo: historia, horarios, recomendaciones, etc.' // opcional
// }
const PLACES = [
  { name: 'Cerro de la Virgen', desc: 'Virgen situada en la montaña de Tausa.', lat: 5.194494, lng: -73.884281,
    photos: [], video: '', info: '' },
  { name: 'Iglesia principal Santa Maria Magdalena', desc: 'Sucursal zona norte de la ciudad.', lat: 5.195967, lng: -73.885814,
    photos: [], video: '', info: '' },
  { name: 'Los Cuascos', desc: 'Mirador de Tausa Viejo.', lat: 5.195922, lng: -73.893061,
    photos: [], video: '', info: '' },
  { name: 'Templo Doctrinario Tausa Viejo', desc: 'Antiguo Templo deL Municipio de Tausa.', lat: 5.195194, lng: -73.893144,
    photos: [], video: '', info: '' },
  { name: 'Templo del Alto de Quita', desc: 'Templo y mirador de las Montañas.', lat: 5.205669, lng: -73.892617,
    photos: [], video: '', info: '' },
  { name: 'Mirador Neusa', desc: 'Mirador del Lago de Neusa.', lat: 5.185258, lng: -73.926000,
    photos: [], video: '', info: '' },
  { name: 'Zona de Camping Parque Neusa', desc: 'Zona para acampar en familia.', lat: 5.135742, lng: -73.966061,
    photos: [], video: '', info: '' },
  { name: 'Laguna Verde', desc: 'Laguna conocida por sus aguas frías y color verde esmeralda.', lat: 5.215278, lng: -73.999167,
    photos: [], video: '', info: '' },
  { name: 'Posos de sal', desc: 'Manantiales naturales de agua salina ubicados en el sector histórico de Tausa Viejo.', lat: 5.195242, lng: -73.897772,
    photos: [], video: '', info: '' }
];
;

// genera automáticamente el identificador de URL (slug) de cada lugar a
// partir de su nombre, por ejemplo "Cerro de la Virgen" → "cerro-de-la-virgen"
function slugify(text){
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quita tildes
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
PLACES.forEach(function(p){ p.slug = slugify(p.name); });

function getPlaceBySlug(slug){
  return PLACES.find(function(p){ return p.slug === slug; });
}

// ---------- FIREBASE ----------
// Pega aquí tu configuración real (pídeme el tutorial de Firebase si no
// lo tienes). Se usa en la página de cada lugar para el inicio de sesión
// del administrador y para guardar/mostrar las fotos que suba. Mientras
// diga "TU_...", esa función queda desactivada sin romper el resto.
const FIREBASE_CONFIG = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};
