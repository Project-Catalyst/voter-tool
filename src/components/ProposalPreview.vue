<template>
  <div class="card mb-4"  :key="proposal.id">
    <div class="card-content">
      <div class="content">
        <router-link :to="{ name: 'proposal', params: {
          fund: fund,
          challenge: proposal.category,
          id: proposal.id,
          allFunds: allFunds
          }}">
        <div class="columns">
          <div class="column is-10">
            <p class="subtitle is-6 mb-0" v-if="proposal.fund">
              {{ fundName }}
            </p>
            <p class="subtitle is-4 mb-1">
              {{ proposal.title }}
            </p>
            <p class="subtitle is-6 mb-4" v-if="proposal.author">
              {{ proposal.author }}
            </p>
            <p>{{ proposal.description }}</p>
            <p><b>{{ $t('pickList.FUNDS_REQUESTED') }}:</b> {{ proposal.amount | currency}}</p>
            <p v-if="proposal.catalystId"><b>{{ $t('pickList.PROPOSAL_CATALYST_ID') }}:</b> {{ proposal.catalystId }}</p>
            <!-- TODO: plamen5kov: here to debug (preffer this info to be in the FundingWidget component) -->
            <p v-if="proposal.votes_result">
              <b>{{ $t('pickList.NUMBER_OF_CALCULATED_VOTES') }}:</b> {{ proposal.votes_result | currency_ada }}
            </p>
          </div>
          <funded-widget class="is-2" :proposal="proposal" :fund="fund" />
        </div>
        </router-link>
        <div class="columns">
          <div class="column is-10" v-if="proposal.rating">
            <b-rate v-model="proposal.rating" disabled /> ~ {{ Math.ceil(proposal.no_assessments / 3) }} {{ $t('proposal.REVIEWS_BY_CA') }}
          </div>
          <div class="column is-10" v-if="proposal.f6_rating">
            <b-rate v-model="proposal.f6_rating" disabled /> {{ proposal.f6_no_assessments }} {{ $t('proposal.REVIEWS_BY_CA') }}
          </div>
          <div class="column is-10" v-if="!proposal.f6_rating && !proposal.rating">
            <b-rate v-model="fakeRate" disabled />
          </div>
          <div class="pick-list column is-2">
            <p class="mb-1 has-text-centered">{{ $t('pickList.VOTE_PICK_LIST') }}</p>
            <div class="pick-list-buttons columns">
              <div class="column is-narrow is-offset-2">
                <b-tooltip label="Remove from Downvote list"
                  position="is-bottom"
                  type="is-danger is-light">
                  <b-button v-if="isProposalDownPicked"
                    @click="removeDownPick"
                    size="is-medium"
                    type="is-danger">
                    <b-icon
                      icon="thumb-down">
                    </b-icon>
                  </b-button>
                </b-tooltip>
                <b-tooltip label="Add to Downvote list"
                  position="is-bottom"
                  type="is-danger">
                  <b-button v-if="!isProposalDownPicked"
                    @click="addDownPick"
                    size="is-medium"
                    type="is-danger is-light"
                    outlined>
                    <b-icon
                      icon="thumb-down-outline">
                    </b-icon>
                  </b-button>
                </b-tooltip>
              </div>
              <div class="column is-narrow">
                <b-tooltip label="Remove from Upvote list"
                  position="is-bottom"
                  type="is-success is-light">
                  <b-button v-if="isProposalPicked"
                    @click="removePick"
                    size="is-medium"
                    type="is-success">
                    <b-icon
                      icon="thumb-up">
                    </b-icon>
                  </b-button>
                </b-tooltip>
                <b-tooltip label="Add to Upvote list"
                  position="is-bottom"
                  type="is-success">
                  <b-button v-if="!isProposalPicked"
                    @click="addPick"
                    size="is-medium"
                    type="is-success is-light"
                    outlined>
                    <b-icon
                      icon="thumb-up-outline">
                    </b-icon>
                  </b-button>
                </b-tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { mapGetters } from "vuex";
import FundedWidget from '@/components/FundedWidget';

export default {
  data() {
    return {
      fakeRate: 0
    }
  },
  props: ['proposal', 'fund', 'allFunds'],
  components: {
    FundedWidget
  },
  computed: {
    ...mapGetters("proposals", ["isPicked", "isDownPicked"]),
    isProposalPicked() {
      return this.isPicked(this.proposal)
    },
    isProposalDownPicked() {
      return this.isDownPicked(this.proposal)
    },
    fundName() {
      return this.fund.replace('f', 'Fund ')
    }
  },

  methods: {
    removeDownPick() {
      const pickListLink = this.$router.resolve({
        name: 'picked',
        params: { fund: this.fund }
      })
      this.$store.commit("proposals/downRemoveProposal", this.proposal);
      this.$buefy.notification.open({
        message: `<b>${this.proposal.title}</b> removed from the DownVote Pick List<br />
        <a href="${pickListLink.href}">Open the Vote Pick List</>`,
        type: 'is-primary',
        position: 'is-bottom-right'
      })

    },
    addDownPick() {
      if (this.isProposalPicked) {
        this.removePick()
      }
      const pickListLink = this.$router.resolve({
        name: 'picked',
        params: { fund: this.fund }
      })
      this.$store.commit("proposals/downAddProposal", this.proposal);
      this.$buefy.notification.open({
        message: `<b>${this.proposal.title}</b> added to the DownVote Pick List<br />
        <a href="${pickListLink.href}">Open the Vote Pick List</>`,
        type: 'is-primary',
        position: 'is-bottom-right'
      })

    },
    removePick() {
      const pickListLink = this.$router.resolve({
        name: 'picked',
        params: { fund: this.fund }
      })
      this.$store.commit("proposals/removeProposal", this.proposal);
      this.$buefy.notification.open({
        message: `<b>${this.proposal.title}</b> removed from the Vote Pick List<br />
        <a href="${pickListLink.href}">Open the Vote Pick List</>`,
        type: 'is-primary',
        position: 'is-bottom-right'
      })

    },
    addPick() {
      if (this.isProposalDownPicked) {
        this.removeDownPick()
      }
      const pickListLink = this.$router.resolve({
        name: 'picked',
        params: { fund: this.fund }
      })
      this.$store.commit("proposals/addProposal", this.proposal);
      this.$buefy.notification.open({
        message: `<b>${this.proposal.title}</b> added to the Vote Pick List<br />
        <a href="${pickListLink.href}">Open the Vote Pick List</>`,
        type: 'is-primary',
        position: 'is-bottom-right'
      })
    }
  }
}

</script>
