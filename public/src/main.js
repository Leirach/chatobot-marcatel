import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader

Vue.use(Vuetify, {
  iconfont: 'mdi'
})
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
