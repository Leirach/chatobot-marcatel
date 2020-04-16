const key = './marcatel-bot-029633e6e46c.json';
const { GoogleToken } = require('gtoken');

const gtoken = new GoogleToken({
    email: 'dialogflow-service-acount@marcatel-bot.iam.gserviceaccount.com',
    scope: [
        "https://www.googleapis.com/auth/cloud-platform",
        "https://www.googleapis.com/auth/dialogflow",
    ], // or space-delimited string of scopes
    key: key
});


gtoken.getToken((err, token) => {
    if (err) {
        console.log("ERROR")
        console.log(err);
        return;
    }
    console.log(token.access_token);
    // gtoken.rawToken value is also set
});



export {gtoken}
