// =====================================================================
//  site-data.js — DATOS DEL SITIO, EN UN SOLO LUGAR
//  Todas las páginas (inicio, cada lugar, y el mapa) leen este mismo
//  archivo. Edita aquí — no hace falta tocar nada más.
// =====================================================================

// ---------- UBICACIONES PROPIAS ----------
// Solo el administrador las edita aquí, en el código. Los visitantes no
// pueden agregar, editar ni borrar lugares — solo verlos.
//
// Campos de cada lugar:
//   name          Nombre visible
//   desc          Descripción corta (pin, lista, botón)
//   lat, lng      Coordenadas
//   photos        Lista de rutas o links a imágenes (opcional, [] si no hay)
//   video         Link de YouTube o .mp4 (opcional, '' si no hay)
//   historia      Origen del lugar, quién lo construyó/fundó, cuándo
//   acontecimientos  Hechos importantes asociados (opcional, '' si no hay)
//   cultura       Pueblos/culturas que habitaron la zona (opcional, '' si no hay)
//   leyenda       Relato o leyenda tradicional (opcional, '' si no hay —
//                 siempre se muestra aclarando que es tradición oral)
//   destacado     Recuadro especial opcional: { titulo, texto } o null
//   actividades   Lista de cosas que sí se pueden hacer ahí
//   prohibiciones Lista de cosas que no se deben hacer ahí
//   guia          'no_requerido' | 'recomendado' | 'requerido'
//   permiso       'no_requerido' | 'consultar' | 'requerido'
//   info          Nota corta adicional (opcional, '' si no hay)
//
// NOTA HONESTA: donde no hay una fuente oficial confirmada (horarios
// exactos, dificultad exacta, etc.) se deja indicado "por confirmar" o
// "consultar previamente" en vez de inventar el dato.
const PLACES = [
  {
    name: 'Cerro de la Virgen',
    desc: 'Mirador natural junto al casco urbano de Tausa.',
    lat: 5.194494, lng: -73.884281,
    photos: [], video: '',
    historia: 'Mirador natural ubicado junto al casco urbano de Tausa, tradicionalmente vinculado a la devoción religiosa del municipio. Con el paso del tiempo se habilitó como sendero ecológico, desde donde se observa gran parte del pueblo y de la sabana que lo rodea.',
    acontecimientos: '',
    cultura: 'La zona hace parte del territorio que históricamente ocupó el pueblo muisca, presente en buena parte del altiplano cundinamarqués.',
    leyenda: '',
    destacado: null,
    actividades: ['Senderismo', 'Fotografía', 'Observación panorámica', 'Turismo religioso'],
    prohibiciones: ['No salirse del sendero marcado', 'No arrojar basura', 'No dañar la vegetación del cerro'],
    guia: 'recomendado',
    permiso: 'no_requerido',
    info: 'Lleva agua y calzado adecuado — algunos tramos de la subida son exigentes.'
  },
  {
    name: 'Iglesia principal Santa Maria Magdalena',
    desc: 'Templo religioso del casco urbano de Tausa.',
    lat: 5.195967, lng: -73.885814,
    photos: [], video: '',
    historia: 'Es el templo religioso del casco urbano actual de Tausa, heredero de una larga tradición que en el municipio se remonta a la época colonial. Es uno de los puntos de encuentro más importantes de la comunidad.',
    acontecimientos: '',
    cultura: 'La evangelización de la región estuvo profundamente ligada a las comunidades muiscas que habitaban el territorio antes de la llegada española.',
    leyenda: '',
    destacado: null,
    actividades: ['Visita religiosa', 'Fotografía exterior', 'Turismo histórico', 'Celebraciones religiosas'],
    prohibiciones: ['Guardar silencio y respeto durante las celebraciones', 'No ingresar durante actos litúrgicos sin autorización'],
    guia: 'no_requerido',
    permiso: 'no_requerido',
    info: 'Consulta los horarios de misa con la parroquia antes de tu visita.'
  },
  {
    name: 'Los Cuascos',
    desc: 'Sendero peatonal recreativo de Tausa Viejo.',
    lat: 5.195922, lng: -73.893061,
    photos: [], video: '',
    historia: 'Sendero peatonal recreativo del municipio, habilitado con iluminación de energía renovable para permitir recorridos seguros incluso en horas de menor luz.',
    acontecimientos: '',
    cultura: 'Como gran parte del territorio de Tausa, la zona estuvo históricamente habitada por comunidades muiscas.',
    leyenda: '',
    destacado: null,
    actividades: ['Senderismo', 'Fotografía', 'Observación del paisaje'],
    prohibiciones: ['No arrojar basura', 'No apartarse del sendero señalizado'],
    guia: 'recomendado',
    permiso: 'consultar',
    info: 'La dificultad y duración exactas del recorrido están por confirmar — consulta con la Alcaldía antes de ir.'
  },
  {
    name: 'Templo Doctrinario Tausa Viejo',
    desc: 'Sitio histórico y patrimonial del siglo XVI.',
    lat: 5.195194, lng: -73.893144,
    photos: [], video: '',
    historia: 'Uno de los sitios históricos más importantes del municipio. Existen registros de un templo en este sector desde 1594, y el 2 de agosto de 1600 el oidor Luis Henríquez ordenó la construcción de una edificación más duradera. Ha sido objeto de procesos de recuperación patrimonial impulsados por la Gobernación de Cundinamarca.',
    acontecimientos: 'Construcción original registrada en 1594 · orden de reconstrucción en 1600 · intervenciones recientes de restauración patrimonial.',
    cultura: 'El templo estuvo directamente relacionado con el proceso de evangelización de las comunidades muiscas que habitaban Tausa Viejo antes de la fundación del actual casco urbano.',
    leyenda: '',
    destacado: null,
    actividades: ['Recorrido histórico', 'Fotografía', 'Interpretación cultural', 'Turismo religioso'],
    prohibiciones: ['No tocar ni alterar los elementos arquitectónicos', 'No ingresar a zonas cerradas o en restauración', 'No rayar ni escribir sobre las paredes'],
    guia: 'recomendado',
    permiso: 'consultar',
    info: 'Por ser un bien patrimonial, el acceso a ciertas zonas puede estar restringido según el estado de las obras de restauración.'
  },
  {
    name: 'Templo del Alto de Quita',
    desc: 'Templo y mirador en las alturas de Tausa.',
    lat: 5.205669, lng: -73.892617,
    photos: [], video: '',
    historia: 'Templo religioso situado en las alturas de Tausa, integrado en la llamada "Ruta de la Fe", un recorrido que lo conecta con el Cerro de la Virgen.',
    acontecimientos: '',
    cultura: '',
    leyenda: '',
    destacado: { titulo: '🥾 Ruta de la Fe', texto: 'Conecta el Cerro de la Virgen con el Alto de Quita: cerca de 6,7 km, un ascenso de unos 353 m y una duración mínima aproximada de dos horas. Una experiencia que combina senderismo, espiritualidad, paisaje e historia.' },
    actividades: ['Senderismo', 'Turismo espiritual', 'Fotografía panorámica'],
    prohibiciones: ['No apartarse de la ruta señalizada', 'No arrojar basura en el camino'],
    guia: 'recomendado',
    permiso: 'no_requerido',
    info: ''
  },
  {
    name: 'Mirador Neusa',
    desc: 'Mirador natural cerca del Embalse del Neusa.',
    lat: 5.185258, lng: -73.926000,
    photos: [], video: '',
    historia: 'Mirador ubicado cerca del Embalse del Neusa, un cuerpo de agua administrado por la CAR entre los municipios de Tausa y Cogua, rodeado de bosque nativo.',
    acontecimientos: '',
    cultura: '',
    leyenda: '',
    destacado: null,
    actividades: ['Fotografía', 'Observación de paisaje', 'Observación de biodiversidad', 'Caminatas de baja dificultad'],
    prohibiciones: ['No dejar residuos', 'No alimentar ni perturbar la fauna'],
    guia: 'no_requerido',
    permiso: 'no_requerido',
    info: 'Las caminatas cercanas son de baja dificultad, ideales para toda la familia.'
  },
  {
    name: 'Zona de Camping Parque Neusa',
    desc: 'Zona recreativa del Parque Forestal Embalse del Neusa.',
    lat: 5.135742, lng: -73.966061,
    photos: [], video: '',
    historia: 'Sector del Parque Forestal Embalse del Neusa habilitado para actividades recreativas y de turismo de naturaleza.',
    acontecimientos: '',
    cultura: '',
    leyenda: '',
    destacado: { titulo: '⚠️ Antes de ir', texto: 'Las actividades, horarios, zonas habilitadas y condiciones de ingreso pueden cambiar. Consulta previamente con la administración del Parque Forestal Embalse del Neusa.' },
    actividades: ['Camping', 'Asados en zonas autorizadas', 'Pesca deportiva', 'Alquiler de botes', 'Caminatas', 'Restaurantes cercanos'],
    prohibiciones: ['No encender fogatas fuera de zonas autorizadas', 'No arrojar basura', 'No pescar fuera de las temporadas o zonas permitidas'],
    guia: 'no_requerido',
    permiso: 'consultar',
    info: ''
  },
  {
    name: 'Laguna Verde',
    desc: 'Laguna de páramo de aguas verde esmeralda.',
    lat: 5.215278, lng: -73.999167,
    photos: [], video: '',
    historia: 'Laguna de alta montaña asociada al Complejo de Páramos de Guerrero, un ecosistema clave para la regulación y producción de agua en la región. En 2026 se anunció un proyecto para desarrollar aquí el primer jardín botánico de ecosistemas de alta montaña de Cundinamarca.',
    acontecimientos: '',
    cultura: '',
    leyenda: 'Según relatos transmitidos de forma oral en la región, alrededor de Laguna Verde existen historias tradicionales sobre una laguna encantada y un ser conocido como "el mohán".',
    destacado: { titulo: '🌱 Protege el páramo', texto: 'Laguna Verde hace parte de un ecosistema de páramo esencial para el agua de la región. Cuidarlo depende de cada visitante: no arranques frailejones, no contamines el agua y mantente en las rutas autorizadas.' },
    actividades: ['Senderismo', 'Fotografía', 'Observación de flora', 'Observación de fauna', 'Contemplación de la naturaleza'],
    prohibiciones: ['No arrancar frailejones ni otras plantas de páramo', 'No arrojar basura', 'No contaminar el agua', 'No salirse de las rutas autorizadas'],
    guia: 'recomendado',
    permiso: 'consultar',
    info: ''
  },
  {
    name: 'Posos de sal',
    desc: 'Manantiales de agua salina de valor histórico.',
    lat: 5.195242, lng: -73.897772,
    photos: [], video: '',
    historia: 'Tausa formó parte, junto con Nemocón y Zipaquirá, de una región históricamente salinera. La sal fue un recurso de gran importancia económica y cultural para las comunidades que habitaron este territorio.',
    acontecimientos: '',
    cultura: 'Las comunidades muiscas ya explotaban la sal de esta región antes de la llegada española, y este recurso mantuvo su importancia durante buena parte de la historia del municipio.',
    leyenda: '',
    destacado: null,
    actividades: ['Interpretación histórica', 'Fotografía', 'Turismo cultural', 'Recorrido por el entorno'],
    prohibiciones: ['No ingresar a zonas no habilitadas', 'No extraer materiales del sitio'],
    guia: 'recomendado',
    permiso: 'consultar',
    info: 'La existencia de un recorrido turístico formal, horarios y condiciones de acceso está por confirmar — consulta previamente.'
  }
];

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

// ---------- CONTACTOS DE AYUDA (se muestran en la ficha de cada lugar) ----------
// Datos oficiales de la Alcaldía — reemplaza si cambian.
const MUNICIPIO_CONTACTO = {
  nombre: 'Alcaldía Municipal de Tausa',
  telefono: '(1) 858 3015',
  correo: 'contactenos@tausa-cundinamarca.gov.co',
  direccion: 'Carrera 3 # 3-24, Tausa, Cundinamarca'
};
// Datos de contacto de la propia página DMD — los mismos del pie de página del inicio.
const DMD_CONTACTO = {
  telefono: '+57 312 548 9961',
  correo: 'dmd.tausa@gmail.com'
};

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
