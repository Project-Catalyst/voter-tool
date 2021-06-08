// initial state
const getDefaultState = () => ({
  challengeOrder: {},
  challengeSearch: {},
  challengeSeed: {},
  dialogAccepted: false
})

const state = getDefaultState()

// getters
const getters = {
  getChallengeOrder: (state) => (challenge) => {
    return state.challengeOrder[challenge]
  },
  getChallengeSearch: (state) => (challenge) => {
    return state.challengeSearch[challenge]
  },
  challengeSeed: (state) => (challenge) => {
    return state.challengeSeed[challenge]
  },
  dialogAccepted: (state) => state.dialogAccepted
}

// actions
const actions = {
}

// mutations
const mutations = {
  setOrder(state, {challenge, order}) {
    state.challengeOrder = {
      ...state.challengeOrder,
      [challenge]: order
    }
  },
  setSearch(state, {challenge, search}) {
    state.challengeSearch = {
      ...state.challengeSearch,
      [challenge]: search
    }
  },
  setSeed(state, {challenge,seed}) {
    state.challengeSeed = {
      ...state.challengeSeed,
      [challenge]: seed
    }
  },
  setDialog(state, val) {
    state.dialogAccepted = val
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
