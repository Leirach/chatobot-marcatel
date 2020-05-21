const functions = require('firebase-functions');
const nodemailer = require("nodemailer");
const {db} = require('./firebase.js');
const fs = require('fs');

require.extensions['.html'] = function(module, filename){
    module.exports = fs.readFileSync(filename, 'utf8');
};

const mailClient = require("./mailClient.html");
console.log(mailClient);

function postUserIntoFirestore(userdata) {
    console.log(userdata);
    let docRef = db.collection('users').add({
        name : userdata.name,
        mail: userdata.email,
        phone: userdata.phone_number,
        message: userdata.message

    }).then(ref => {
        console.log('Added document with ID: ', ref.id);
        sendMailtoCustomer(userdata.email)
        sendMailToMarcatel("samuel-1998@live.com",userdata.message,userdata.email, userdata.phone_number, userdata.name)
        return 1;
    }).catch((err)=>{
      console.err("Error agregando usuario:", err);
    });
}


function sendMailtoCustomer( email){
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',//Agregar correo no seguro
        port: 465,
        secure: true,
        auth: {
            user: 'chatbot.marcatel@gmail.com',
            pass: 'chatbot2020marcatel'
        }
    });
    var userOptions = {
        from: "Marcatel | Mensaje Automático <chatbot.marcatel@gmail.com>",
        to: email,
        subject: "Marcatel | ",
        text: `Texto del mail` ,
        html:  mailClient
   };
    transporter.sendMail(userOptions, (err, info) => {
        if(err){
            console.log(err)
        } else {
            console.log(info);
        }
    });
}

function sendMailToMarcatel( email ,message, usermail, usernumber, username ){
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',//Agregar correo no seguro
        port: 465,
        secure: true,
        auth: {
            user: 'chatbot.marcatel@gmail.com',
            pass: 'chatbot2020marcatel'
        }
    });
    var userOptions = {
        from: "Marcatel | Mensaje Automático desde Bot <chatbot.marcatel@gmail.com>",
        to: email,
        subject: "Mensaje Automático desde Bot",
        text: `Mensaje de ${username} para Soporte Marcatel.` ,
        html: `<p style="font-size:medium">
                Nombre de usuario: ${username}<br>
                </p>
                <p style="font-size:large">
                email: ${usermail}<br>
                </p>
                <p style="font-size:medium">
                Mensaje: ${message}<br>
                </p>
                </p>
                <p style="font-size:medium">
                Número: ${usernumber}<br>
                </p>`
    };
    transporter.sendMail(userOptions, (err, info) => {
        if(err){
            console.log(err)
        } else {
            console.log(info);
        }
    });
}


module.exports = {postUserIntoFirestore}
