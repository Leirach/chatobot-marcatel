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

/** Dialogflow Context Lifespans {@link https://dialogflow.com/docs/contexts#lifespan} */
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

app.intent('Default Welcome Intent', (conv) => {
    conv.ask("Hola desde Webhook!");
    conv.ask(new BrowseCarousel({
        items: [
            new BrowseCarouselItem({
                title: 'Title of item 1',
                url: 'https://example.com',
                description: 'Description of item 1',
                image: new Image({
                    url: 'https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png',
                    alt: 'Image alternate text',
                }),
                footer: 'Item 1 footer',
            }),
            new BrowseCarouselItem({
                title: 'Title of item 2',
                url: 'https://example.com',
                description: 'Description of item 2',
                image: new Image({
                    url: 'https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png',
                    alt: 'Image alternate text',
                }),
                footer: 'Item 2 footer',
            }),
        ],
    }));
});

app.intent('quienes_somos', (conv) => {
    conv.ask("Somos una empresa Líder y Socialmente Responsable con presencia en más de 160 países.  \n¿Te puedo ayudar con algo más?");
});

// ubicacion -> ubicacion_followup
// contexto: ubicacion_followup
app.intent('ubicacion', (conv) => {
    conv.ask("Estamos ubicados en Monterrey, CDMX y Guadalajara.  \n");
    conv.ask("¿De cuál sucursal necesitas la dirección?");
});

// retorna la BasicCard con la direccion de la ciudad,
// adjunta una imagen del mapa en la carta
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

//
app.intent('ubicacion_followup', (conv) => {
    conv.ask("Ok. Aquí está la dirección.");
    let parsedCity = conv.parameters.location.city;
    if (address[parsedCity]){
        conv.ask(locationCard(parsedCity));
        conv.ask("¿Te puedo ayudar con algo más?");
    }
    else {
        conv.ask("Oops, no estamos ubicados en esa ciudad")
    }
});

app.intent('Default Fallback Intent', (conv) => {
    conv.ask("¿Podrías repetirlo, por favor?");
    //conv.contexts.output = conv.contexts.input;
});

// The entry point to handle a http request
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
// For testing purposes