import key from './marcatel-bot.json';
const { GoogleToken } = require('gtoken');

const gtoken = new GoogleToken({
    email: key.client_email,
    key: key.private_key,
    scope: [
        "https://www.googleapis.com/auth/cloud-platform",
        "https://www.googleapis.com/auth/dialogflow",
    ]
});

function getToken(callback) {
    gtoken.getToken(callback);
}

export { getToken }
