<template>
  <div class="container" v-if="challenge && challengeId && fund">
    <div class="hero mb-6">
      <p class="title is-4">
        {{ challenge.title }}
      </p>
      <p>{{ challenge.description }}</p>
      <p><b>Funds:</b> ${{ challenge.amount }}</p>
    </div>
    <div class="proposals-list">
      <div class="filters columns mb-4">
        <b-field class="column is-narrow">
          <b-select placeholder="Order by" v-model="sortBy">
            <option
                v-for="option in sortingOptions"
                :value="option.k"
                :key="option.k">
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
        </b-field>      </div>
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
import CatalystAPI from '@/api/catalyst.js';
import shuffle from "@/utils/shuffle";
import ProposalPreview from '@/components/ProposalPreview';

export default {
  components: {
    ProposalPreview
  },
  data(){
    return {
      keyword: '',
      sortBy: 'rating',
      challenges: [],
      proposals: [],
      sortingOptions: [
        { k: 'amount', l: 'Amount' },
        { k: 'rating', l: 'Review Score' },
        { k: 'no_assessments', l: 'No. reviews' },
        { k: 'random', l: 'Random' },
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
    console.log(this.$route.params)
  },
  computed: {
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
        if (this.sortBy === 'random') {
          return shuffle(proposals);
        } else {
          return proposals.sort((a, b) => b[this.sortBy] - a[this.sortBy])
        }
      }
      return []
    }
  }
}
</script>
