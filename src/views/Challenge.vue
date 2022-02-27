<template>
  <div class="container" v-if="challenge && challengeId && fund">
    <div class="hero mb-6">
      <p class="title is-4">
        {{ challenge.title }}
      </p>
      <p>{{ challenge.description }}</p>
      <p><b>{{$t('home.FUNDS')}}</b> {{ challenge.amount | currency }}</p>
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
            <b-input :placeholder="$t('challenge.SEARCH')"
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
      proposals: []
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
    sortingOptions() {
      let rating
      let no_ass
      if (this.fund == 'f6' || this.fund == 'f7') {
        rating = 'f6_rating'
        no_ass = 'f6_no_assessments'
      } else {
        rating = 'rating'
        no_ass = 'no_assessments'
      }
      return [
        { k: { v: 'amount', r: false}, l: this.$t('challenge.REQUESTED_BUDGET_DESC')},
        { k: { v: 'amount', r: true}, l: this.$t('challenge.REQUESTED_BUDGET_ASC')},
        { k: { v: rating, r: false}, l: this.$t('challenge.REVIEW_SCORE_DESC')},
        { k: { v: rating, r: true}, l: this.$t('challenge.REVIEW_SCORE_ASC') },
        { k: { v: 'title', r: false}, l: this.$t('challenge.AZ') },
        { k: { v: 'title', r: true}, l: this.$t('challenge.ZA') },
        { k: { v: no_ass, r: false}, l: this.$t('challenge.NO_REVIEWS_DESC') },
        { k: { v: no_ass, r: true}, l: this.$t('challenge.NO_REVIEWS_ASC') },
        ...(this.isFund7 ? [{ k: { v: 'votes_cast', r: false}, l: this.$t('challenge.NUMBER_OF_WALLETS_DESC')}] : []),
        ...(this.isFund7 ? [{ k: { v: 'votes_cast', r: true}, l: this.$t('challenge.NUMBER_OF_WALLETS_ASC') }] : []),
        ...(this.isFund7 ? [{ k: { v: 'votes_result', r: false}, l: this.$t('challenge.VOTING_RESULTS_DESC')}] : []),
        ...(this.isFund7 ? [{ k: { v: 'votes_result', r: true}, l: this.$t('challenge.VOTING_RESULTS_ASC') }] : []),
        { k: { v: 'random', r: false}, l: this.$t('challenge.RANDOM') },
      ]
    },
    sortBy: {
      get () {
        if (this.challenge) {
          if (this.$store.state.user.challengeOrder[this.challenge.id]) {
            return this.$store.state.user.challengeOrder[this.challenge.id]
          }
        }
        return {v: 'random', r: false}
      },
      set (value) {
        this.$store.commit('user/setOrder', {
          challenge: this.challenge.id,
          order: value
        })
        if (value.v === 'random') {
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
    isFund7() {
      return this.fund == 'f7'
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
