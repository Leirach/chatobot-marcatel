module.exports = {
    Environment: {
        Debug: false,
        Port: 1707
    },
    Dialogflow: {
        agent: 'marcatel-bot'
    },
    app: {
        muted: true, // <- mute microphone by default
        googleIt: false, // <- ask users to google their request, in case of input.unknown action
        dialogflowUrl: 'https://dialogflow.googleapis.com/v2/projects/marcatel-bot/agent/sessions'
    },
    locale: {
        strings: {
            welcomeTitle: "Chatea conmigo",
            author: "Chatbot Marcatel",
            queryTitle: "Pregunta algo...",
            voiceTitle: "Adelante, te escucho...",
        },
        settings: {
            speechLang: "es-ES", // <- output language
            recognitionLang: "es-ES" // <- input(recognition) language
        }
    },
    token: ""
};