'use strict';
const functions = require('firebase-functions');
const {
    dialogflow,
    Suggestions,
    BasicCard,
    Button,
    SimpleResponse,
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
});

// The entry point to handle a http request
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
// For testing purposes
