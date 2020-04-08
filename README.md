# chatobot-marcatel
Para crear una llamara a la V2 de Dialogflow:
https://dialogflow.com/docs/reference/v2-auth-setup
pero hay que instalar el Cloud SDK.


endpoint:
https://dialogflow.googleapis.com/v2/projects/marcatel-bot/agent/sessions/123456789:detectIntent

Comandos usados:

`export GOOGLE_APPLICATION_CREDENTIALS="Downloads/marcatel-bot-b327280e8379.json"`

`gcloud auth application-default print-access-token`
