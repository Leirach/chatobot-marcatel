const {conectividad_response} = require('./objects.js');

// Puse 3 para eventualmente cambiar los horarios de cara uno de ellos.
// como no los tengo aún decidí dejar la estructura lista para cundo se tengan que cambiar
const working_hours = {
    "Monterrey": "Trabajamos de Lunes a Viernes desde las 09:00 hasta las 18:30",
    "Guadalajara": "Trabajamos de Lunes a Viernes desde las 09:00 hasta las 18:30",
    "Ciudad de México": "Trabajamos de Lunes a Viernes desde las 09:00 hasta las 18:30",
};

const address = {
    "Monterrey": "Ave. San Jerónimo 210 Pte. Col. San Jerónimo, Monterrey, N.L. C.P. 64640",
    "Guadalajara": "Ave. Chapultepec 236, Col. Americana, Guadalajara, Jalisco C.P. 44160",
    "Ciudad de México": "Matías Romero No. 216, piso 8 y 9, Col. del Valle, Benito Juárez, CDMX C.P. 03100",
};

const mapImg = {
    "Monterrey": "https://firebasestorage.googleapis.com/v0/b/marcatel-bot.appspot.com/o/MTY.png?alt=media&token=0b893a58-a552-48da-95a9-cb911ccbd0ba",
    "Guadalajara": "https://firebasestorage.googleapis.com/v0/b/marcatel-bot.appspot.com/o/GDL.png?alt=media&token=531104f5-a15e-4120-8b16-20772949aaca",
    "Ciudad de México": "https://firebasestorage.googleapis.com/v0/b/marcatel-bot.appspot.com/o/CDMX.png?alt=media&token=e7590bc6-cf3b-4e05-83ea-6527747f4623",
};

const address_url = {
    "Monterrey": "https://goo.gl/maps/ithzts7q1tPfJvfX9",
    "Guadalajara": "https://goo.gl/maps/f844J47yCCKzzP6E7",
    "Ciudad de México": "https://goo.gl/maps/HBwK8uN26Nb9xrZq9",
};

/* 
// IMAGENES ORIGINALES
const serviceImg = {
    "ADMINISTRADOS": 'https://firebasestorage.googleapis.com/v0/b/marcatel-bot.appspot.com/o/services%2FADMINISTRADOS.png?alt=media&token=b468fc38-d47e-4f01-a21b-e4f7003c13ed',
    "CONECTIVIDAD": 'https://firebasestorage.googleapis.com/v0/b/marcatel-bot.appspot.com/o/services%2FCONECTIVIDAD.png?alt=media&token=eaa63ac2-5f79-41e5-9257-61aebbb0e311',
    "TELEFONIA": 'https://firebasestorage.googleapis.com/v0/b/marcatel-bot.appspot.com/o/services%2FTELEFONIA.png?alt=media&token=d7fa2a05-4f96-4fb0-ba63-db5829bd5e59',
    "CLOUD": 'https://firebasestorage.googleapis.com/v0/b/marcatel-bot.appspot.com/o/services%2FCLOUD.png?alt=media&token=83b67ca0-80a6-4790-a306-0c39ceb8c324',
};
*/
// IMAGENES NUEVAS
const serviceImg = {
    "ADMINISTRADOS": 'https://firebasestorage.googleapis.com/v0/b/marcatel-bot.appspot.com/o/services%2FADMINISTRADOS_ALT.jpg?alt=media&token=106b038f-2c0f-4e62-96bf-343c0bcafbd8',
    "CONECTIVIDAD":'https://firebasestorage.googleapis.com/v0/b/marcatel-bot.appspot.com/o/services%2FCONECTIVIDAD_ALT.jpg?alt=media&token=bac8ac57-a454-4135-8be9-52a43975c1cc',
    "TELEFONIA": 'https://firebasestorage.googleapis.com/v0/b/marcatel-bot.appspot.com/o/services%2FTELEFONIA_ALT.jpg?alt=media&token=9b92136c-f894-47a7-a79e-57be1b42e3fe',
    "CLOUD": 'https://firebasestorage.googleapis.com/v0/b/marcatel-bot.appspot.com/o/services%2FCLOUD_ALT.jpg?alt=media&token=450d8fb0-56a6-48f9-89b5-e7d197a1b30a',
};

const FALLBACK_RESPONSE = [
    "Lo siento, no sé cómo ayudarte con eso.",
    "Creo que no entiendo a qué te refieres.",
    "Lo siento, actualmente no puedo ayudarte con eso.",
    "Oops, no entiendo a qué te refieres.",
];

const FEATURES_SAMPLE = [
    "¿Dónde están ubicados?",//Para ubicación
    "¿A qué hora abren las oficinas?",//Para Horario
    "¿Qué es Marcatel?", //Para quienes somos
    "¿Cómo puedo ponerme en contacto?" //para contacto
];

const ALL_CHIPS = ["Servicios", "Ubicación", "Horarios", "Contacto", "Quienes somos", "¿Qué puedes hacer?"];
const LOCATION_CHIPS = ["Monterrey", "CDMX","Guadalajara"];
const SERVICE_CHIPS = ["Conectividad", "Telefonía","Cloud", "Servicios Administrados"];

const SMALLTALK_ADIOS = [
    "¡Hasta luego!",
    "¡Nos vemos, fue un gusto atenderte!",
    "¡Adios! Espero haber resuleto todas tus dudas.",
]

const SMALLTALK_GRACIAS = [
    "¡De nada!",
    "¡De nada, fue un gusto atenderte!",
    "¡Estoy para ayudar!",
    "¡De nada! Espero haber resuelto tus dudas."
]

const SIMPLE_CANCEL = [
    "Ok. ¿Necesitas ayuda con algo más?",
    "Entendido. ¿Necesitas ayuda con algo más?"
]

module.exports = {
    working_hours,
    address,
    mapImg,
    address_url,
    serviceImg,
    FALLBACK_RESPONSE,
    FEATURES_SAMPLE,
    ALL_CHIPS,
    LOCATION_CHIPS,
    SERVICE_CHIPS,
    SIMPLE_CANCEL,
    SMALLTALK_ADIOS,
    SMALLTALK_GRACIAS,
};