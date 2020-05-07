/** ActionsOnGoogle Responses:
 * https://developers.google.com/assistant/conversational/rich-responses
 * */
/** Dialogflow Context Lifespans {@link https://dialogflow.com/docs/contexts#lifespan} */

'use strict';
const admin = require('firebase-admin');
let serviceAccount = require('./credentials/marcatel-bot-firebase-adminsdk-4jvz8-2fb01dc55e');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const functions = require('firebase-functions');
const {dialogflow, Suggestions, BasicCard, Button, Image, SimpleResponse, BrowseCarousel, BrowseCarouselItem,} = require('actions-on-google');
const {locationCard} = require('./constants/objects.js');
const {working_hours, address, FALLBACK_RESPONSE, FEATURES_SAMPLE, ALL_CHIPS, LOCATION_CHIPS, SERVICE_CHIPS} = require('./constants/array.js');
let db = admin.firestore();

const Lifespans = {
    DEFAULT: 3,
};

db.settings({timestampsInSnapshots: true});

const app = dialogflow({
    debug: false,
});

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
    conv.ask(new Suggestions(ALL_CHIPS));
})

app.intent('Marcatel.simple.location_followup', (conv) => {
    conv.ask("Aquí tienes la dirección.");
    let parsedCity = conv.parameters.sucursales;
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

app.intent('Marcatel.simple.location', (conv) => {
    conv.ask("Estamos ubicados en Monterrey, CDMX y Guadalajara.");
    conv.ask("¿De cuál sucursal te interesa la ubicación?");
    conv.ask(new Suggestions(LOCATION_CHIPS));
});

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
        conv.ask(new Suggestions(ALL_CHIPS));
    } else {
        conv.ask("Lo siento, actualmente no estamos ubicados en esta ciudad.")
        conv.ask("¿Puedo ayudarte en algo más?")
        conv.ask(new Suggestions(ALL_CHIPS));
    }
});

app.intent('Marcatel.dynamic.services', (conv) => {
    if (!conv.screen) {
        conv.ask('Contamos con 4 servicios principales: Conectividad, Telefonia, Cloud y Servicios Administrados');
    }
    conv.ask("¿Sobre qué servicio te gustaría información?");
    conv.ask(new BrowseCarousel({
        items: [
            new BrowseCarouselItem({
                title: 'Conectividad',
                description: 'Proveemos conexiones virtuales, tales como E-Access, E-Lan, E-Line y Internet Dedicado',
                url: 'https://www.marcatel.com/servicios',
                image: new Image({
                    url: 'https://firebasestorage.googleapis.com/v0/b/marcatel-bot.appspot.com/o/services%2FCONECTIVIDAD.png?alt=media&token=eaa63ac2-5f79-41e5-9257-61aebbb0e311',
                    alt: 'Imagen de Conectividad',
                }),
            }),
            new BrowseCarouselItem({
                title: 'Telefonía',
                description: 'Te ofrecemos servicios como: Servicio Troncal SIP, Troncales Digitales, DID\'S, ' +
                    'Videoconferencia, VPN y Terminación WS',
                url: 'https://www.marcatel.com/servicios',
                image: new Image({
                    url: 'https://firebasestorage.googleapis.com/v0/b/marcatel-bot.appspot.com/o/services%2FTELEFONIA.png?alt=media&token=d7fa2a05-4f96-4fb0-ba63-db5829bd5e59',
                    alt: 'Imagen de Telefonia',
                }),
            }),
            new BrowseCarouselItem({
                title: 'Cloud',
                description: 'Conjunto de servicios como : Media Cloud, Storage, Cloud PBX, Virtual Machines, ' +
                    'CCaaS y Servicios TI.',
                url: 'https://www.marcatel.com/servicios',
                image: new Image({
                    url: 'https://firebasestorage.googleapis.com/v0/b/marcatel-bot.appspot.com/o/services%2FCLOUD.png?alt=media&token=83b67ca0-80a6-4790-a306-0c39ceb8c324',
                    alt: 'Imagen Cloud',
                }),
            }),
            new BrowseCarouselItem({
                title: 'Servicios Administrados',
                description: 'Proveemos servicios de: Firewall, Conmutador SIP y Router.',
                url: 'https://www.marcatel.com/servicios',
                image: new Image({
                    url: 'https://firebasestorage.googleapis.com/v0/b/marcatel-bot.appspot.com/o/services%2FADMINISTRADOS.png?alt=media&token=b468fc38-d47e-4f01-a21b-e4f7003c13ed',
                    alt: 'Imagen Servicios Administrados',
                }),
            }),
        ],
    }));
    conv.ask(new Suggestions(SERVICE_CHIPS));
});



app.intent('Marcatel.dynamic.services_selection', async (conv, param, option) => {
    let servicio = conv.parameters.services;
    var items = []
    var chips = []
    return await db.collection('subservices').where('parent', '==', servicio).get()
        .then((snapshot) => {
           snapshot.forEach((doc) => {
                var service = doc.data()
                chips.push(service.name)
                items.push(new BrowseCarouselItem({
                    title: service.name,
                    description: service.description,
                    url: service.img_url,
                    image: new Image({
                        url: service.img_url,
                        alt: service.name,
                    })
                }))
            });
            if (!conv.screen) {
                conv.ask(`Contamos con ${items.length} servicios de ${servicio}. Tales como: ${chips[0]}, ${chips[1]} y ${chips[2]}.`);
            }
            conv.ask("¿Sobre qué servicio deseas información?")
            conv.ask(new BrowseCarousel({items}));
            conv.ask(new Suggestions(chips));
            return ""
            }).catch((e) => {
                console.log('error:', e);
                conv.close('Lo siento. Creo que no puedo responder esto. ¿Hay algo más en lo que te pueda ayudar?');
                conv.ask(new Suggestions(ALL_CHIPS));
            return ""
            });

});
app.intent('Marcatel.dynamic.services_selection_[card]', async (conv, param, option) => {
    let subservice = conv.parameters.subservices;
    var items = []
    return await db.collection('subservices').where('name', '==', subservice).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                items.push(doc.data())
            });
            var service = items[0]
            if (!conv.screen) {
                conv.ask(`${service.name}, ${service.description}`)
            }else{
                conv.ask(`Esta es la información sobre${service.name}.`)
                conv.ask(
                    new BasicCard({
                        title: service.name,
                        subtitle: service.description,
                        image: new Image({
                            url: service.img_url,
                            alt: 'service.name',
                        })
                    })
                );
            }
            conv.ask('¿Te gustaría que te contactemos con alguien de ventas?');
            conv.ask(new Suggestions(["Si","No", "Ir al Inicio"]));
            return ""
        }).catch((e) => {
            console.log('error:', e);
            conv.close('Lo siento. Creo que no puedo responder esto. ¿Hay algo más en lo que te pueda ayudar?');
            conv.ask(new Suggestions(ALL_CHIPS));
            return ""
        });

});



Array.prototype.getRandomVal = function () {
    return this[Math.floor(Math.random() * this.length)];
};



exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

