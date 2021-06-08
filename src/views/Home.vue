<template>
  <div>
    <div class="columns is-multiline">
      <div class="column is-12">
        <p class="title is-3">Project Catalyst Voter tool</p>
        <p><b>Voter-tool</b> is a part of the <b>AIM Community Tool</b> series developed by the community for the community. It is designed to assist you in your analysis of Cardano Project Catalyst proposals and create a voting guide. In the future we hope to induce features that will assist with discoverability and sharing of your voting advice.
        </p>
      </div>
      <div class="filters columns column is-12 mb-4">
        <b-field class="column">
            <b-input placeholder="Search for proposals..."
                type="search"
                icon="magnify"
                icon-clickable
                v-model="keyword">
            </b-input>
        </b-field>
      </div>
    </div>
    <div class="columns is-multiline" v-if="!searchResultsVisible">
      <div class="column is-4"
        v-for="challenge in challenges"
        :key="challenge.id">
        <div class="card is-primary">
          <router-link :to="{ name: 'challenge', params: {
            fund: 'f4',
            challenge: challenge.id
            }}">
          <div class="card-content">
            <div class="content">
              <p class="title is-4">
                {{ challenge.title }}
              </p>
              <p>{{ challenge.description }}</p>
              <p><b>Funds:</b> {{ challenge.amount | currency}}</p>
            </div>
          </div>
          </router-link>
        </div>
      </div>
    </div>
    <div class="proposals-list" v-if="searchResultsVisible">
      <proposal-preview
        :proposal="proposal"
        :key="proposal.id"
        :fund="fund"
        v-for="proposal in filteredProposals"
        />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import CatalystAPI from '@/api/catalyst.js';
import ProposalPreview from '@/components/ProposalPreview';

export default {
  components: {
    ProposalPreview
  },
  data(){
    return {
      challenges: [],
      proposals: [],
      fund: 'f4',
      keyword: ''
    }
  },

  methods: {
    copy() {
      this.$clipboard('addr1q9hh7nqmantwkd5upsamc6p54ckseksmngh858ng788hwfa99jp2g3s20g7k2hvj6rtl00l647hxvw3a5a84m3mzzlmqvartlu')
      this.$buefy.notification.open({
        message: "Address copied to clipboard!",
        type: 'is-primary',
        position: 'is-bottom-right'
      })
    }
  },

  computed: {
    ...mapGetters("user", ["dialogAccepted"]),
    searchResultsVisible() {
      return (this.keyword.trim().length > 3)
    },
    filteredProposals() {
      if (this.keyword.trim().length > 3) {
        return this.proposals.filter(
          (el) => el.title.toLowerCase().includes(this.keyword.toLowerCase())
        )
      }
      return this.proposals
    }
  },

  mounted(){
    CatalystAPI.challenges('f4').then((r) => {
      this.challenges = r.data
      this.challenges.forEach((c) => {
        CatalystAPI.proposals('f4', c.id).then((res) => {
          if (res.data.length) {
            this.proposals = this.proposals.concat(...res.data)
          }
        })
      })
    })
    if (!this.dialogAccepted) {
      this.$buefy.dialog.alert({
        title: 'Voter Tool',
        message: 'IMPORTANT!: The tool does not cast votes, instead it creates a guide to reference when you do vote.<br />To do so you will need to submit your ballots through the official voting app.<br /><br />Fund 4 voting information is available on <a target="_blank" href="https://www.reddit.com/r/cardano/comments/nqt6u0/all_you_need_to_know_fund4_voting/">Reddit from u/danny_cryptofay</a>',
        confirmText: 'Cool!',
        onConfirm: () => {
          this.$store.commit('user/setDialog', true)
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .is-vertical-centered {
    span {
      vertical-align: middle;
      display: inline-block;
    }
  }
</style>
