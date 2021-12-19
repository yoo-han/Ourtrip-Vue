import Vue from 'vue'
import App from './App.vue'
import vuetify from "@/plugins/vuetify";
import router from "./router";
import axios from 'axios';
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';

Vue.component('vue-phone-number-input', VuePhoneNumberInput);

Vue.config.productionTip = false;

Vue.prototype.$http = axios;
Vue.prototype.$api = 'https://api.ourtrip.xyz/api'

new Vue({
    vuetify,
    router,
    render: h => h(App),
}).$mount('#app')
