<template >
	<v-container fluid class="main-container">
		<v-app-bar
				color="#FDD403"
				dense>
			<v-toolbar-title style="font-weight: normal">Asistente Marcatel</v-toolbar-title>
			<div class="ml-auto">
				<p class="time text-right">{{ time }}</p>
				<p class="date text-right">{{ date }}</p>
			</div>

		</v-app-bar>
		<v-flex>
			<app-chat></app-chat>
		</v-flex>
	</v-container>
</template>

<script>
	import config from "../config";
	import Chat from "./views/Chat";
	import moment from 'moment';
	export default {
		components: {
			appChat: Chat
		},
		data() {
			return {
				welcomeTitle: config.locale.strings.welcomeTitle,
				time: "0",
				date: "0",
			};
		},
		methods:{
			// fecha y hora en el header
			updateTime() {
				this.time = moment().format('h:mm a');
				this.date = moment().format('ddd L');
			},
		},
		mounted() {
			let vm = this;
			moment.locale('Es');
			vm.updateTime();
			setInterval(() => {
				vm.updateTime();
			}, 1000);
		}
	};
</script>

<style lang="scss">
@import "Chat.scss";
</style>

