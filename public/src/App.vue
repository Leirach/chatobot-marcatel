<template>
	<div id="app" class="container-fluid">
		<div class="row justify-content-center main">
			<div class="col-md-8 no-padding">
				<div
					class="bg"
					:style="{'background-image': 'url(' + require('./assets/chatBackground.svg') + ')'}"
				></div>
				<app-header></app-header>
				<app-chat></app-chat>
			</div>
		</div>
	</div>
</template>

<script>
import Header from "./views/Header";
import Chat from "./views/Chat";

import key from './credentials/marcatel-bot.json';
const { GoogleToken } = require('gtoken');
export default {
	components: {
		appHeader: Header,
		appChat: Chat
	},

	created: function () {
		console.log(key);
		const gtoken = new GoogleToken({
			email: key.client_email,
			key: key.private_key,
			scope: [
				"https://www.googleapis.com/auth/cloud-platform",
				"https://www.googleapis.com/auth/dialogflow",
			]
		});


		gtoken.getToken((err, token) => {
			if (err) {
				console.log("ERROR")
				console.log(err);
				return;
			}
			console.log(token.access_token);
		});

	}
};
</script>

<style lang="scss">
.main {
	position: relative;
	z-index: 1;
	font-family: "Avenir", Helvetica, Arial, sans-serif;
}
.main .bg {
	position: absolute;
	z-index: -1;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	opacity: 0.1;
	width: 100%;
	height: 100%;
}
.no-padding {
	padding: 0px;
}
</style>
