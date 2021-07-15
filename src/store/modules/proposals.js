// initial state
const getDefaultState = () => ({
  challenges: {},
  downChallenges: {},
  rationales: {},
  title: '',
  version: ''
})

const move = function(array, from, to, on = 1) {
  return array.splice(to, 0, ...array.splice(from, on)), array
}

const state = getDefaultState()

const getLightProposal = function(proposal) {
  return {
    id: proposal.id,
    title: proposal.title,
    category: proposal.category,
    amount: proposal.amount,
    url: proposal.url
  }
}

const checkPicked = function(localState, proposal) {
  const present = Object.prototype.hasOwnProperty.call(localState, proposal.category)
  if (present) {
    const found = localState[proposal.category].find(p => p.id === proposal.id)
    return (found)
  }
  return false
}

const challengePicked = function(state, challenge) {
  const upPresent = Object.prototype.hasOwnProperty.call(state.challenges, challenge)
  const downPresent = Object.prototype.hasOwnProperty.call(state.downChallenges, challenge)
  return (upPresent || downPresent)
}

// getters
const getters = {
  isPicked: (state) => (proposal) => {
    return checkPicked(state.challenges, proposal)
  },
  isDownPicked: (state) => (proposal) => {
    return checkPicked(state.downChallenges, proposal)
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
    const challengeId = proposal.category
    const lightProposal = getLightProposal(proposal)
    if (present) {
      state.challenges[challengeId].push(lightProposal)
    } else {
      state.challenges = {
        ...state.challenges,
        [challengeId]: [{...lightProposal}]
      }
    }
    this.commit('proposals/calcAmounts')
    if (checkPicked(state.downChallenges, proposal)) {
      this.commit("proposals/downRemoveProposal", proposal);
    }
    if (!challengePicked(state, proposal.category)) {
      state.rationales = {
        ...state.rationales,
        challengeId: ''
      }
    }
  },
  removeProposal(state, proposal) {
    state.challenges[proposal.category] = state.challenges[proposal.category].filter(
      (p) => p.id !== proposal.id
    )
    if (state.challenges[proposal.category].length === 0) {
      delete state.challenges[proposal.category]
    }
    this.commit('proposals/calcAmounts')
    if (!challengePicked(state, proposal.category)) {
      delete state.rationales[proposal.category]
    }
  },
  downAddProposal(state, proposal) {
    const present = Object.prototype.hasOwnProperty.call(state.downChallenges, proposal.category)
    const challengeId = proposal.category
    const lightProposal = getLightProposal(proposal)
    if (present) {
      state.downChallenges[challengeId].push(lightProposal)
    } else {
      state.downChallenges = {
        ...state.downChallenges,
        [challengeId]: [{...lightProposal}]
      }
    }
    if (checkPicked(state.challenges, proposal)) {
      this.commit("proposals/removeProposal", proposal);
    }
    if (!challengePicked(state, proposal.category)) {
      state.rationales = {
        ...state.rationales,
        challengeId: ''
      }
    }
  },
  downRemoveProposal(state, proposal) {
    state.downChallenges[proposal.category] = state.downChallenges[proposal.category].filter(
      (p) => p.id !== proposal.id
    )
    if (state.downChallenges[proposal.category].length === 0) {
      delete state.downChallenges[proposal.category]
    }
    if (!challengePicked(state, proposal.category)) {
      delete state.rationales[proposal.category]
    }
  },
  moveProposal(state, {proposal, from, to}) {
    const challenge = proposal.category
    state.challenges = {
      ...state.challenges,
      [challenge]: move(state.challenges[challenge], from, to)
    }
    this.commit('proposals/calcAmounts')
  },
  updateTitle(state, title) {
    state.title = title
  },
  updateRationale(state, {challenge, rationale}) {
    state.rationales[challenge] = rationale
  },
  updateVersion(state) {
    if ((!state.version) || (state.version < 1)) {
      Object.keys(state.challenges).forEach((k) => {
        let acc = 0
        state.challenges[k] = state.challenges[k].map((p) => {
          let lightP = getLightProposal(p)
          lightP.pAmount = acc + lightP.amount
          acc = lightP.pAmount
          return lightP
        })
      })

      Object.keys(state.downChallenges).forEach((k) => {
        state.downChallenges[k] = state.downChallenges[k].map((p) => {
          let lightP = getLightProposal(p)
          return lightP
        })
      })
      state.version = 1
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
