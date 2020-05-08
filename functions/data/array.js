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

const img = {
    "Monterrey": "https://firebasestorage.googleapis.com/v0/b/marcatel-bot.appspot.com/o/MTY.png?alt=media&token=0b893a58-a552-48da-95a9-cb911ccbd0ba",
    "Guadalajara": "https://firebasestorage.googleapis.com/v0/b/marcatel-bot.appspot.com/o/GDL.png?alt=media&token=531104f5-a15e-4120-8b16-20772949aaca",
    "Ciudad de México": "https://firebasestorage.googleapis.com/v0/b/marcatel-bot.appspot.com/o/CDMX.png?alt=media&token=e7590bc6-cf3b-4e05-83ea-6527747f4623",
};

const address_url = {
    "Monterrey": "https://goo.gl/maps/ithzts7q1tPfJvfX9",
    "Guadalajara": "https://goo.gl/maps/f844J47yCCKzzP6E7",
    "Ciudad de México": "https://goo.gl/maps/HBwK8uN26Nb9xrZq9",
};

const FALLBACK_RESPONSE = [
    "Lo siento, no sé cómo ayudarte con eso.",
    "Creo que no entiendo a qué te refieres.",
    "Lo siento, actualmente no puedo ayudarte con eso.",
    "Oops, no entiendo a qué te refieres.",
];

const FEATURES_SAMPLE = [
    "¿Dónde se encuentran?",//Para ubicación
    "¿A qué hora abren las oficinas?",//Para Horario
    "¿Qué es Marcatel?", //Para quienes somos
    "¿Tienen algun número telefónico?"//Para contacto
];

const ALL_CHIPS = ["Servicios", "Ubicación","Horarios","Contacto","Quienes somos","¿Qué puedes hacer?"];
const LOCATION_CHIPS = ["Monterrey", "CDMX","Guadalajara"];
const SERVICE_CHIPS = ["Conectividad", "Telefonía","Cloud", "Servicios Administrados"];

module.exports = {
    working_hours,
    address,
    img,
    address_url,
    FALLBACK_RESPONSE,
    FEATURES_SAMPLE,
    ALL_CHIPS,
    LOCATION_CHIPS,
    SERVICE_CHIPS
};