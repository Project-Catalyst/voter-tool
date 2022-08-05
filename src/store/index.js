import Vue from 'vue'
import Vuex from 'vuex'
import createPersist from 'vuex-localstorage'
import createMutationsSharer from "vuex-shared-mutations";
import proposals from './modules/proposals'
import user from './modules/user'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

let localStorage = createPersist({
    namespace: 'voter-tool-f9',
    initialState: {},
    expires: 60 * 24 * 60 * 60 * 1e3 // 30 days
})

let mutationSharer = createMutationsSharer({
  predicate: [
    'proposals/addProposal',
    'proposals/removeProposal',
    'proposals/downAddProposal',
    'proposals/downRemoveProposal',
    'proposals/moveProposal',
  ]
})

export default new Vuex.Store({
  modules: {
    proposals,
    user
  },
  strict: debug,
  plugins: [localStorage, mutationSharer]
})
