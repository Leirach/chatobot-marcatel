/** ActionsOnGoogle Responses:
 * https://developers.google.com/assistant/conversational/rich-responses
 * */
/** Dialogflow Context Lifespans {@link https://dialogflow.com/docs/contexts#lifespan} */

'use strict';
const {db} = require('./data/firebase.js');
const {postUserIntoFirestore} = require('./data/database');
const functions = require('firebase-functions');
const {dialogflow, Suggestions, BasicCard, Button, Image, SimpleResponse,
    BrowseCarousel, BrowseCarouselItem, RichResponse} = require('actions-on-google');
const {locationCard} = require('./data/objects.js');
const {working_hours, address, serviceImg, FALLBACK_RESPONSE, FEATURES_SAMPLE, 
    ALL_CHIPS, LOCATION_CHIPS, SERVICE_CHIPS, SMALLTALK_ADIOS, SMALLTALK_GRACIAS,
    SIMPLE_CANCEL} = require('./data/array.js');

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
});

/* ===== CONTACTO ===== */
app.intent('Marcatel.simple.contact', (conv) => {
    conv.ask("¿Eres cliente marcatel actualmente?");
});

app.intent('Marcatel.simple.contact_Cliente', (conv) => {
    conv.ask("¿Cuál es tu nombre?");
});

app.intent('Marcatel.simple.contact_Nombre', (conv) => {
    let nombre = conv.parameters.name
    conv.ask(`Perfecto ${nombre}. Por favor, brindarnos un email donde podamos contactarte.`);
});

app.intent('Marcatel.simple.contact_Email', (conv) => {
    conv.ask("Por favor, bríndame tú número de telefono de 10 dígitos.");
});

app.intent('Marcatel.simple.contact_Numero', (conv) => {
    conv.ask("Finalmente. Brindame un mensaje que deseees agregar para hacerle llegar a nuestro equipo de soporte.");
    /* Nel no jala
    if (!conv.screen) {
        conv.ask('Puedes empezar a dictar en: 3, 2, 1, Ahora.');
    }*/
});

app.intent('Marcatel.simple.contact_Numero - Message', (conv) => {
    conv.ask("Perfecto. Te hemos envíado un correo. Pronto te pondremos en contacto con un representante Marcatel.");
    conv.ask(
        new BasicCard({
            title: "Whatsapp Marcatel",
            subtitle: "Lee el siguiente QR para dirigirte a nuestro Whatsapp u oprime el botón.",
            image: new Image({
                url: "https://firebasestorage.googleapis.com/v0/b/marcatel-bot.appspot.com/o/images%2Fqr_prueba.png?alt=media&token=c71ccd42-3604-441c-a924-7ae9acd55d4c",
                alt: 'QR',
            }),
            buttons: new Button({
                title: 'Ir a Whatsapp',
                url: "https://api.whatsapp.com/send?phone=9212040105&text=&source=&data=",
            }),
        })
    );
    conv.ask("¿Puedo ayudarte en algo más?");
    conv.ask(new Suggestions(ALL_CHIPS));
    try {
        let data = conv.body.queryResult.outputContexts[0].parameters;
        postUserIntoFirestore(data);
    } catch (error) {
        console.error("Error with params in request:", error);
    }

});


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
                    url: serviceImg['CONECTIVIDAD'],
                    alt: 'Imagen de Conectividad',
                }),
            }),
            new BrowseCarouselItem({
                title: 'Telefonía',
                description: 'Te ofrecemos servicios como: Servicio Troncal SIP, Troncales Digitales, DID\'S, ' +
                    'Videoconferencia, VPN y Terminación WS',
                url: 'https://www.marcatel.com/servicios',
                image: new Image({
                    url: serviceImg['TELEFONIA'],
                    alt: 'Imagen de Telefonia',
                }),
            }),
            new BrowseCarouselItem({
                title: 'Cloud',
                description: 'Conjunto de servicios como : Media Cloud, Storage, Cloud PBX, Virtual Machines, ' +
                    'CCaaS y Servicios TI.',
                url: 'https://www.marcatel.com/servicios',
                image: new Image({
                    url: serviceImg['CLOUD'],
                    alt: 'Imagen Cloud',
                }),
            }),
            new BrowseCarouselItem({
                title: 'Servicios Administrados',
                description: 'Proveemos servicios de: Firewall, Conmutador SIP y Router.',
                url: 'https://www.marcatel.com/servicios',
                image: new Image({
                    url: serviceImg['ADMINISTRADOS'],
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
            }
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
            
            /* No vi que esto funcionara, no detectaba la pantalla en web.
            if (!conv.screen) {
                conv.ask('Para regresar al inicio Di: Inicio o si deseas más información Di: Contacto de Ventas');
            }else{
                conv.ask('¿Te gustaría ponerte en contacto con alguien de ventas o tienes otra pregunta?');
            }
            */
            conv.ask('¿Te gustaría ponerte en contacto con alguien de ventas o tienes otra pregunta?');
            conv.ask(new Suggestions(["Contacto", "Tengo otra pregunta"]));
            return ""
        }).catch((e) => {
            console.log('error:', e);
            conv.close('Lo siento. Creo que no puedo responder a eso. ¿Hay algo más en lo que te pueda ayudar?');
            conv.ask(new Suggestions(ALL_CHIPS));
            return ""
        });

});

app.intent('Marcatel.simple.another_question', (conv) => {
    conv.ask("Claro, con gusto resuelvo tu duda.");
    conv.ask("¿Cómo puedo ayudarte?");
    conv.ask(new Suggestions(LOCATION_CHIPS));
});

app.intent('Marcatel.simple.cancel', (conv) => {
    console.log(conv.contexts.get())
    conv.ask(SIMPLE_CANCEL.getRandomVal());
});


// SMALLTALK
app.intent('Marcatel.smalltalk.gracias', (conv) => {
    conv.ask(SMALLTALK_GRACIAS.getRandomVal());
});

app.intent('Marcatel.smalltalk.existential', (conv) => {
    conv.ask('Soy un asistente virtual creado para ayudarte a resolver tus dudas. Intenta hacerme una pregunta.');
});

app.intent('Marcatel.smalltalk.adios', (conv) => {
    conv.close(SMALLTALK_ADIOS.getRandomVal());
});

Array.prototype.getRandomVal = function () {
    return this[Math.floor(Math.random() * this.length)];
};

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

