// initial state
const getDefaultState = () => ({
  challenges: {}
})

const move = function(array, from, to, on = 1) {
  return array.splice(to, 0, ...array.splice(from, on)), array
}

const state = getDefaultState()

// getters
const getters = {
  isPicked: (state) => (proposal) => {
    const present = Object.prototype.hasOwnProperty.call(state.challenges, proposal.category)
    if (present) {
      const found = state.challenges[proposal.category].find(p => p.id === proposal.id)
      return (found)
    }
    return false
  }
}

// actions
const actions = {
}

// mutations
const mutations = {
  calcAmounts(state) {
    Object.keys(state.challenges).forEach((k) => {
      let acc = 0
      state.challenges[k].map((p) => {
        p.pAmount = acc + p.amount
        acc = p.pAmount
        return p
      })
    })
  },
  addProposal(state, proposal) {
    const present = Object.prototype.hasOwnProperty.call(state.challenges, proposal.category)
    if (present) {
      state.challenges[proposal.category].push(proposal)
    } else {
      state.challenges[proposal.category] = [proposal]
    }
    this.commit('proposals/calcAmounts')
  },
  removeProposal(state, proposal) {
    state.challenges[proposal.category] = state.challenges[proposal.category].filter(
      (p) => p.id !== proposal.id
    )
    if (state.challenges[proposal.category].length === 0) {
      delete state.challenges[proposal.category]
    }
    this.commit('proposals/calcAmounts')
  },
  moveProposal(state, {proposal, from, to}) {
    const challenge = proposal.category
    state.challenges[challenge] = move(state.challenges[challenge], from, to)
    this.commit('proposals/calcAmounts')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
