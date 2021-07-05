import Vue from 'vue'
import Buefy from "buefy"
import Embed from 'v-video-embed'
import App from './App.vue'
import router from './router'
import store from "./store"
import { i18n } from './plugins/i18n';
import Clipboard from 'v-clipboard'
import VueCurrencyFilter from 'vue-currency-filter'
import VueMixpanel from 'vue-mixpanel'
import './plugins/axios'

import "./plugins/buefy"

Vue.config.productionTip = false
Vue.use(Buefy);
Vue.use(Embed);
Vue.use(Clipboard)
Vue.use(VueCurrencyFilter, [{
  symbol : '$',
  thousandsSeparator: ',',
  fractionCount: 0,
  fractionSeparator: '.',
  symbolPosition: 'front',
  symbolSpacing: false,
  avoidEmptyDecimals: undefined,
},
{ // default name 'currency_2'
   name: 'currency_ada',
   symbol: '₳',
   thousandsSeparator: ',',
   fractionCount: 0,
   fractionSeparator: '.',
   symbolPosition: 'front',
   symbolSpacing: true,
   avoidEmptyDecimals: undefined,
 }
])

Vue.use(VueMixpanel, {
  token: 'de2b810978910f43259b13c23f39abe1'
})

new Vue({
  router,
  i18n,
  store,
  render: h => h(App),
}).$mount('#app')

Vue.config.productionTip = false
