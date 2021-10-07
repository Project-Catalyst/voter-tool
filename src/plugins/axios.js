import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import AxiosPlugin from 'vue-axios-cors';

Vue.use(VueAxios, axios)
Vue.use(AxiosPlugin)

Vue.axios.defaults.baseURL = process.env.VUE_APP_API_URL
