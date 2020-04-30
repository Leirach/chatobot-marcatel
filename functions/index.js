/** ActionsOnGoogle Responses:
 * https://developers.google.com/assistant/conversational/rich-responses
 * */
/** Dialogflow Context Lifespans {@link https://dialogflow.com/docs/contexts#lifespan} */

'use strict';
const functions = require('firebase-functions');
const {
    dialogflow,
    Suggestions,
    BasicCard,
    Button,
    Image,
    SimpleResponse,
    BrowseCarousel,
    BrowseCarouselItem,
    Carousel,
    CarouselItem
} = require('actions-on-google');

const Lifespans = {
    DEFAULT: 3,
};

const app = dialogflow({
    debug: true,
});

// Para que tenemos 3 de estos si dicen lo mismo????questionmark??
// @valentin
const working_hours = {
    "Monterrey": "Trabajamos de Lunes a Viernes desde las 09:00 hasta las 18:30",
    "Guadalajara": "Trabajamos de Lunes a Viernes desde las 09:00 hasta las 18:30",
    "Ciudad de México": "Trabajamos de Lunes a Viernes desde las 09:00 hasta las 18:30",
}
const address = {
    "Monterrey": "Ave. San Jerónimo 210 Pte. Col. San Jerónimo, Monterrey, N.L. C.P. 64640",
    "Guadalajara": "Ave. Chapultepec 236, Col. Americana, Guadalajara, Jalisco C.P. 44160",
    "Ciudad de México": "Matías Romero No. 216, piso 8 y 9, Col. del Valle, Benito Juárez, CDMX C.P. 03100",
}
const img = {
    "Monterrey": "https://firebasestorage.googleapis.com/v0/b/marcatel-bot.appspot.com/o/MTY.png?alt=media&token=0b893a58-a552-48da-95a9-cb911ccbd0ba",
    "Guadalajara": "https://firebasestorage.googleapis.com/v0/b/marcatel-bot.appspot.com/o/GDL.png?alt=media&token=531104f5-a15e-4120-8b16-20772949aaca",
    "Ciudad de México": "https://firebasestorage.googleapis.com/v0/b/marcatel-bot.appspot.com/o/CDMX.png?alt=media&token=e7590bc6-cf3b-4e05-83ea-6527747f4623",
}

const address_url = {
    "Monterrey": "https://goo.gl/maps/ithzts7q1tPfJvfX9",
    "Guadalajara": "https://goo.gl/maps/f844J47yCCKzzP6E7",
    "Ciudad de México": "https://goo.gl/maps/HBwK8uN26Nb9xrZq9",
}
const FALLBACK_RESPONSE = [
    "Lo siento, no sé cómo ayudarte con eso.",
    "Creo que no entiendo a qué te refieres.",
    "Lo siento, actualmente no puedo ayudarte con eso.",
    "Oops, no entiendo a qué te refieres.",
]
const FEATURES_SAMPLE = [
    "¿Dónde se encuentran?",//Para ubicación
    "¿A qué hora abren las oficinas?",//Para Horario
    "¿Qué es Marcatel?", //Para quienes somos
    "¿Tienen algun número telefónico?"//Para contacto
]
const ALL_CHIPS = ["Ubicación","Quienes somos","¿Qué puedes hacer?"]
const LOCATION_CHIPS = ["Monterrey", "CDMX","Guadalajara"]
const SERVICE_CHIPS = ["Conectividad", "Telefonía","Cloud", "Servicios Administrados"]

function locationCard(city) {
    return new BasicCard({
        title: city,
        subtitle: address[city],
        image: new Image({
            url: img[city],
            alt: 'Mapa de la dirección.',
        }),
        buttons: new Button({
            title: 'Ir a Maps',
            url: address_url[city],
        }),
    });
}

app.intent('Default Welcome Intent', (conv) => {
    conv.ask("¡Hola! Soy tu asistente de Marcatel y estoy aquí para resolver tus dudas!");
    conv.ask("¿Cómo te puedo ayudar?");
    conv.ask(new Suggestions(ALL_CHIPS));
});

app.intent('Default Fallback Intent', (conv) => {
    conv.ask(FALLBACK_RESPONSE.getRandomVal());
    conv.ask("Puedes intentar con las siguientes opciones por ejemplo:");
    conv.ask(new Suggestions(ALL_CHIPS));
});

app.intent('Marcatel.simple.help', (conv) => {
    conv.ask(`Puedes hacer preguntas como: ${FEATURES_SAMPLE.getRandomVal()}, también puedo brindarte información sobre nuestros servicios y contactarte con un operador de ventas.`);
    conv.ask("¿Cómo te puedo ayudar?");
    conv.ask(new Suggestions(ALL_CHIPS));
});

app.intent('Marcatel.simple.aboutus', (conv) => {
    conv.ask("Somos una empresa Líder y Socialmente Responsable con presencia en más de 160 países.");
    conv.ask("¿Te puedo ayudar con algo más?");
    //conv.ask(new Suggestions(ALL_CHIPS));
})

app.intent('Marcatel.simple.location_followup', (conv) => {
    conv.ask("Aquí tienes la dirección.");
    let parsedCity = conv.parameters.sucursales;
    if (address[parsedCity]) {
        conv.ask(locationCard(parsedCity));
        conv.ask("¿Te puedo ayudar con algo más?");
        //conv.ask(new Suggestions(ALL_CHIPS));
    } else {
        conv.ask("Lo siento, actualmente no estamos ubicados en esta ciudad.")
        conv.ask("¿Puedo ayudarte en algo más?")
        //conv.ask(new Suggestions(ALL_CHIPS));
    }
});

app.intent('Marcatel.simple.location', (conv) => {
    conv.ask("Estamos ubicados en Monterrey, CDMX y Guadalajara.");
    conv.ask("¿De cuál sucursal te interesa la ubicación?");
    conv.ask(new Suggestions(LOCATION_CHIPS));
});

// Igual para que esto si los 3 son lo mismo? o aun no esta definido
app.intent('Marcatel.simple.working_hours', (conv) => {
    let parsedCity = conv.parameters.sucursales;
    conv.ask("Estamos ubicados en Monterrey, CDMX y Guadalajara.");
    conv.ask("¿De cuál sucursal te interesa el horario?");
    conv.ask(new Suggestions(LOCATION_CHIPS));
});

app.intent('Marcatel.simple.working_hours_followup', (conv) => {
    let parsedCity = conv.parameters.sucursales;
    if (working_hours[parsedCity]) {
        conv.ask(working_hours[parsedCity]);
        conv.ask("¿Te puedo ayudar con algo más?");
        //conv.ask(new Suggestions(ALL_CHIPS));
    } else {
        conv.ask("Lo siento, actualmente no estamos ubicados en esta ciudad.")
        conv.ask("¿Puedo ayudarte en algo más?")
        //conv.ask(new Suggestions(ALL_CHIPS));
    }
});

app.intent('Marcatel.dynamic.services', (conv) => {

    conv.ask('Contamos con 4 servicios principales: Conectividad, Telefonia, Cloud y Servicios Administrados');
    conv.ask("¿Sobre qué servicio te gustaría información?");
    conv.ask(new BrowseCarousel({
        items: [
            //Add the first item to the carousel
            /*'Conectividad': {
                synonyms: [
                    'conectividad',
                    'opcion  1',
                    'la primera',
                    'access',
                    'line',
                    'lan',
                    'internet',
                    'opción 2',
                    'conexion'
                ], */
            new BrowseCarouselItem({
                title: 'Conectividad',
                description: 'Proveemos conexiones virtuales, tales como E-Access, E-Lan, E-Line y Internet Dedicado',
                image: new Image({
                    url: 'https://firebasestorage.googleapis.com/v0/b/marcatel-bot.appspot.com/o/services%2FCONECTIVIDAD.png?alt=media&token=eaa63ac2-5f79-41e5-9257-61aebbb0e311',
                    alt: 'Imagen de Conectividad',
                }),
            }),
            // Add the second item to the carousel
            /*'Telefonia': {
                synonyms: [
                    'Telefonia',
                    'Telefonía',
                    'opcion 2',
                    'la segunda',
                    'videoconferencia',
                    'vpn'
                ],*/
            new BrowseCarouselItem({
                title: 'Telefonía',
                description: 'Te ofrecemos servicios como: Servicio Troncal SIP, Troncales Digitales, DID\'S, ' +
                    'Videoconferencia, VPN y Terminación WS',
                image: new Image({
                    url: 'https://firebasestorage.googleapis.com/v0/b/marcatel-bot.appspot.com/o/services%2FTELEFONIA.png?alt=media&token=d7fa2a05-4f96-4fb0-ba63-db5829bd5e59',
                    alt: 'Imagen de Telefonia',
                }),
            }),
            // Add the third item to the carousel
            /*'Cloud': {
                synonyms: [
                    'cloud',
                    'nube',
                    'la nube',
                    'la tercera',
                    'tercera opcion',
                    'Maquinas virtuales',
                    'Storage',
                    'TI'

                ], */
            new BrowseCarouselItem({
                title: 'Cloud',
                description: 'Conjunto de servicios como : Media Cloud, Storage, Cloud PBX, Virtual Machines, ' +
                    'CCaaS y Servicios TI.',
                image: new Image({
                    url: 'https://firebasestorage.googleapis.com/v0/b/marcatel-bot.appspot.com/o/services%2FCLOUD.png?alt=media&token=83b67ca0-80a6-4790-a306-0c39ceb8c324',
                    alt: 'Imagen Cloud',
                }),
            }),
            /*'Administrados': {
                synonyms: [
                    'Google Pixel XL',
                    'Pixel',
                    'Pixel XL',
                ],*/
            new BrowseCarouselItem({
                title: 'Servicios Administrados',
                description: 'Proveemos servicios de: Firewall, Conmutador SIP y Router.',
                image: new Image({
                    url: 'https://firebasestorage.googleapis.com/v0/b/marcatel-bot.appspot.com/o/services%2FADMINISTRADOS.png?alt=media&token=b468fc38-d47e-4f01-a21b-e4f7003c13ed',
                    alt: 'Imagen Servicios Administrados',
                }),
            }),
        ],
    }));
    conv.ask(new Suggestions(SERVICE_CHIPS));


});

Array.prototype.getRandomVal = function () {
    return this[Math.floor(Math.random() * this.length)];
}
// The entry point to handle a http request
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
// For testing purposes

