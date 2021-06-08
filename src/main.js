import Vue from 'vue'
import Buefy from "buefy"
import Embed from 'v-video-embed'
import App from './App.vue'
import router from './router'
import store from "./store"
import Clipboard from 'v-clipboard'
import VueCurrencyFilter from 'vue-currency-filter'
import './plugins/axios'

import "./plugins/buefy"

Vue.config.productionTip = false
Vue.use(Buefy);
Vue.use(Embed);
Vue.use(Clipboard)
Vue.use(VueCurrencyFilter, {
  symbol : '$',
  thousandsSeparator: '.',
  fractionCount: 2,
  fractionSeparator: ',',
  symbolPosition: 'front',
  symbolSpacing: false,
  avoidEmptyDecimals: undefined,
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

Vue.config.productionTip = false
