<template>
  <div class="container" v-if="challenge && challengeId && fund">
    <div class="hero mb-6">
      <p class="title is-4">
        {{ challenge.title }}
      </p>
      <p>{{ challenge.description }}</p>
      <p><b>Funds:</b> {{ challenge.amount | currency }}</p>
    </div>
    <div class="proposals-list">
      <div class="filters columns mb-4">
        <b-field class="column is-narrow">
          <b-select placeholder="Order by" v-model="sortBy">
            <option
                v-for="(option, i) in sortingOptions"
                :value="option.k"
                :key="`${option.k}-${i}`">
                {{ option.l }}
            </option>
          </b-select>
        </b-field>
        <b-field class="column">
            <b-input placeholder="Search..."
                type="search"
                icon="magnify"
                icon-clickable
                v-model="keyword">
            </b-input>
        </b-field>
      </div>
      <proposal-preview
        :proposal="proposal"
        :key="proposal.id"
        :fund="fund"
        :challenge="challenge"
        v-for="proposal in sortedFilteredProposals"
        />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import CatalystAPI from '@/api/catalyst.js';
import shuffle from "@/utils/shuffle";
import ProposalPreview from '@/components/ProposalPreview';

export default {
  components: {
    ProposalPreview
  },
  data(){
    return {
      challenges: [],
      proposals: [],
      sortingOptions: [
        { k: { v: 'amount', r: false}, l: 'Requested Budget (DESC)'},
        { k: { v: 'amount', r: true}, l: 'Requested Budget (ASC)'},
        { k: { v: 'rating', r: false}, l: 'Review Score (DESC)' },
        { k: { v: 'rating', r: true}, l: 'Review Score (ASC)' },
        { k: { v: 'title', r: false}, l: 'A-Z' },
        { k: { v: 'title', r: true}, l: 'Z-A' },
        { k: { v: 'no_assessments', r: false}, l: 'No. reviews (DESC)' },
        { k: { v: 'no_assessments', r: true}, l: 'No. reviews (ASC)' },
        { k: { v: 'random', r: false}, l: 'Random' },
      ]
    }
  },

  mounted(){
    CatalystAPI.challenges(this.fund).then((r) => {
      this.challenges = r.data
    })
    CatalystAPI.proposals(this.fund, this.challengeId).then((r) => {
      this.proposals = r.data
    })
  },
  computed: {
    ...mapGetters("user", ["challengeSeed"]),
    seed() {
      return this.challengeSeed(this.challengeId)
    },
    sortBy: {
      get () {
        if (this.challenge) {
          if (this.$store.state.user.challengeOrder[this.challenge.id]) {
            return this.$store.state.user.challengeOrder[this.challenge.id]
          }
        }
        return 'random'
      },
      set (value) {
        this.$store.commit('user/setOrder', {
          challenge: this.challenge.id,
          order: value
        })
        if (value === 'random') {
          this.$store.commit('user/setSeed', {
            challenge: this.challenge.id,
            seed: Math.random() * 10000
          })
        }
      }
    },
    keyword: {
      get () {
        if (this.challenge) {
          if (this.$store.state.user.challengeSearch[this.challenge.id]) {
            return this.$store.state.user.challengeSearch[this.challenge.id]
          }
        }
        return ''
      },
      set (value) {
        this.$store.commit('user/setSearch', {
          challenge: this.challenge.id,
          search: value
        })
      }
    },
    fund() {
      if (this.$route) {
        return this.$route.params.fund
      }
      return false
    },
    challengeId() {
      if (this.$route) {
        return this.$route.params.challenge
      }
      return false
    },
    challenge() {
      if (this.challenges) {
        return this.challenges.find((el) => (
          el.id === parseInt(this.$route.params.challenge))
        )
      }
      return false
    },
    sortedFilteredProposals() {
      if (this.proposals) {
        let proposals = this.proposals
        if (this.keyword.trim() !== '') {
          proposals = proposals.filter(
            (el) => el.title.toLowerCase().includes(this.keyword.toLowerCase())
          )
        }
        if (this.sortBy.v === 'random') {
          if (!this.seed) {
            this.$store.commit('user/setSeed', {
              challenge: this.challenge.id,
              seed: Math.random() * 10000
            })
          }
          return shuffle(proposals, this.seed)
        } else {
          if (this.sortBy.v === 'title') {
            let sorted = proposals.sort((a, b) => {
              var textA = a.title.toUpperCase()
              var textB = b.title.toUpperCase()
              return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
            })
            if (this.sortBy.r) {
              sorted.reverse()
            }
            return sorted
          } else {
            let sorted = proposals.sort((a, b) => b[this.sortBy.v] - a[this.sortBy.v])
            if (this.sortBy.r) {
              sorted.reverse()
            }
            return sorted
          }
        }
      }
      return []
    }
  }
}
</script>
