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

// The entry point to handle a http request
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
// For testing purposes
