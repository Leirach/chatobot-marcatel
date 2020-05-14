# chatbot-marcatel
## Para compilar
El front se compila desde /public

Para desarrollo:

`npm run serve`

Para compilar:

`npm run build`

Los archivos compilados de build se encuentran en /public/dist

Para compilar el back y subirlo a firebase se necesita instalar el cli de Firebase 
y hacer login con la cuenta que tenga acceso al proyecto.

Para actualizar los cambios en Firebase: 

`firebase deploy`

Solo se sube el directorio de /functions (back):

`firebase deploy --only functions`

Solo se suben el directorio de /public/dist (front):

`firebase deploy --only hosting`


## Otras cosas
Para crear una llamara a la V2 de Dialogflow:
https://dialogflow.com/docs/reference/v2-auth-setup
pero hay que instalar el Cloud SDK.


endpoint:
https://dialogflow.googleapis.com/v2/projects/marcatel-bot/agent/sessions/123456789:detectIntent

Comandos usados:

`export GOOGLE_APPLICATION_CREDENTIALS="Downloads/marcatel-bot-b327280e8379.json"`

`gcloud auth application-default print-access-token`
