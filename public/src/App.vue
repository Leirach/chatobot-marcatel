<template >
	<v-container class="fill-height">
		<v-app-bar
				absolute
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
				week: ["Dom", "Lun", "Mar", "Mier", "Jue", "Vie", "Sab"],
				greeting: "",
			};
		},
		methods:{
			updateTime() {
				let today = new Date();
				let hrs = today.getHours();
				this.time = moment().format('h:mm a');
				this.date = moment().format('ddd L');
			},
			zeroPadding(num, digit) {
				let zero = "";
				for (let i = 0; i < digit; i++) {
					zero += "0";
				}
				return (zero + num).slice(-digit);
			}
		},
		mounted() {
			let vm = this;
			moment.locale('Es');
			vm.updateTime();
			setInterval(() => {
				vm.updateTime();
			}, 1000);

			let time = new Date().getHours();
			if (time < 12 && time >= 0) {
				vm.greeting = "Buenos Días";
			} else if (time >= 19) {
				vm.greeting = "Buenas Noches";
			} else if (time >= 12) {
				vm.greeting = "Buenas Tardes";
			} else {
				vm.greeting = "Hola!";
			}

		}
	};
</script>

<style lang="scss">
@import "Chat.scss";
</style>

