<template>
	<div id="app" class="container-fluid">
		<div class="justify-content-center main">
				<div :style="{'background-image': 'url(' + require('./assets/chatBackground.svg') + ')'}"
					class="bg">
				</div>
				<div class="row text-center heading">
					<div class="col heading">{{welcomeTitle}}</div>
				</div>
				<app-chat></app-chat>

		</div>
	</div>
</template>

<script>
import Chat from "./views/Chat";
import config from "../config";

export default {
	components: {
		appChat: Chat
	},
	data() {
		return {
			welcomeTitle: config.locale.strings.welcomeTitle
		};
	},
};
</script>

<style lang="scss">
@import "Chat.scss";
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
