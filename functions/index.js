
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
    BrowseCarouselItem
} = require('actions-on-google');


const Lifespans = {
    DEFAULT: 5,
};

const app = dialogflow({
    debug: true,
});

const address = {
    "Monterrey": "Ave. San Jerónimo 210 Pte. Col. San Jerónimo, Monterrey, N.L. C.P. 64640",
    "Guadalajara": "Ave. Chapultepec 236, Col. Americana, Guadalajara, Jalisco C.P. 44160",
    "Ciudad de México": "Matías Romero No. 216, piso 8 y 9, Col. del Valle, Benito Juárez, CDMX C.P. 03100",
}

const img = {
    "Monterrey": "https://raw.githubusercontent.com/Leirach/chatobot-marcatel/master/assets/MTY.png",
    "Guadalajara": "https://raw.githubusercontent.com/Leirach/chatobot-marcatel/master/assets/GDL.png",
    "Ciudad de México": "https://raw.githubusercontent.com/Leirach/chatobot-marcatel/master/assets/CDMX.png",
}

const FALLBACK_RESPONSE = [
    "Lo siento, no sé cómo ayudarte con ésto.",
    "Creo que entiendo a qué te refieres.",
    "Lo siento, actualmente no puedo ayudarte con esto."
]
const FEATURES_SAMPLE = [
    "¿Dónde se encuentran?",//Para ubicación
    "¿A qué hora abren las oficinas?",//Para Horario
    "¿Qué es Marcatel?", //Para quienes somos
    "¿Tienen algun número telefónico?"//Para contacto
]

const ALL_CHIPS = ["¿Qué puedes hacer?", "Servicios", "Ubicación", "Horarios", "Contacto","Quienes somos"]
const LOCATION_CHIPS = ["Monterrey", "CDMX","Guadalajara"]


app.intent('Default Welcome Intent', (conv) => {
    conv.ask("¡Hola! Soy el asistente de Marcatel y estoy aquí para resolver tus dudas!");
    conv.ask("¿Cómo te puedo ayudar?");
    conv.ask(new Suggestions(ALL_CHIPS));
});

app.intent('Default Fallback Intent', (conv) => {
    conv.ask(FALLBACK_RESPONSE.getRandomVal());
    conv.ask("¿Puedo ayudarte en algo más?");
    conv.ask(new Suggestions(ALL_CHIPS));
});

app.intent('Marcatel.simple.help', (conv) => {
    conv.ask(`Puedes hacer preguntas como: ${FEATURES_SAMPLE.getRandomVal()}, también puedo brindarte información sobre nuestros servicios y contactarte con un operador de ventas.`);
    conv.ask("Ahora dime. ¿Cómo te puedo ayudar?");
    conv.ask(new Suggestions(ALL_CHIPS));
});

app.intent('Marcatel.simple.aboutus', (conv) => {
    conv.ask("Somos una empresa Líder y Socialmente Responsable con presencia en más de 160 países.");
    conv.ask("¿Te puedo ayudar con algo más?");
    conv.ask(new Suggestions(ALL_CHIPS));
})
// ubicacion -> ubicacion_followup
// contexto: ubicacion_followup
    app.intent('Marcatel.simple.location', (conv) => {
        conv.ask("Estamos ubicados en Monterrey, CDMX y Guadalajara.");
        conv.ask("¿De cuál sucursal necesitas la dirección?");
        conv.ask(new Suggestions(LOCATION_CHIPS));
    });


    function locationCard(city) {
        return new BasicCard({
            title: city,
            text: address[city],
            image: new Image({
                url: img[city],
                alt: 'Mapa de la dirección.',
            }),
        });
    }

    app.intent('Marcatel.simple.location_followup', (conv) => {
        conv.ask("Ok. Aquí está la dirección.");
        let parsedCity = conv.parameters.location.city;
        if (address[parsedCity]) {
            conv.ask(locationCard(parsedCity));
            conv.ask("¿Te puedo ayudar con algo más?");
            conv.ask(new Suggestions(ALL_CHIPS));

        } else {
            conv.ask("Lo siento, actualmente no estamos ubicados en esta ciudad.")
            conv.ask("¿Puedo ayudarte en algo más?")
            conv.ask(new Suggestions(ALL_CHIPS));
        }
    });

    Array.prototype.getRandomVal = function () {
        return this[Math.floor(Math.random() * this.length)];
    }

// The entry point to handle a http request
    exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
// For testing purposes
