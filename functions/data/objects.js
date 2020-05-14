const functions = require('firebase-functions');
const {
    dialogflow,
    Suggestions,
    BasicCard,
    Button,
    Image,
    BrowseCarousel,
    BrowseCarouselItem,
} = require('actions-on-google');

const {
    address,
    address_url,
    mapImg,
} = require('./array.js');


function locationCard(city) {
    return new BasicCard({
        title: city,
        subtitle: address[city],
        image: new Image({
            url: mapImg[city],
            alt: 'Mapa de la dirección.',
        }),
        buttons: new Button({
            title: 'Ir a Maps',
            url: address_url[city],
        }),
    });
}


module.exports = {locationCard}