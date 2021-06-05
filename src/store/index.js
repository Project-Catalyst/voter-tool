import Vue from 'vue'
import Vuex from 'vuex'
import createPersist from 'vuex-localstorage'
import proposals from './modules/proposals'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

let localStorage = createPersist({
    namespace: 'voter-tool-f4',
    initialState: {},
    expires: 30 * 24 * 60 * 60 * 1e3 // 30 days
})

export default new Vuex.Store({
  modules: {
    proposals,
  },
  strict: debug,
  plugins: [localStorage]
})
