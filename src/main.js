import Vue from 'vue'
import Buefy from "buefy";
import Embed from 'v-video-embed'
import App from './App.vue'
import router from './router'
import './plugins/axios'

import "./plugins/buefy";

Vue.config.productionTip = false
Vue.use(Buefy);
Vue.use(Embed);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

Vue.config.productionTip = false
