<template >
	<v-container fluid style="adding:0px; margin-right: 0px; margin-left: 0px;">
		<v-app-bar
				color="primary"
				absolute
				dense
				dark><v-toolbar-title>Asistente Marcatel</v-toolbar-title>
		</v-app-bar>
		<v-flex>
			<app-chat></app-chat>
		</v-flex>
	</v-container>
</template>

<script>
	import config from "../config";
	import Chat from "./views/Chat";
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
</style>

