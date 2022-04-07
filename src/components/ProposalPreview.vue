<template>
  <div class="card mb-4"  :key="proposal.id">
    <router-link :to="{ name: 'proposal', params: {
        fund: fund,
        challenge: proposal.category,
        id: proposal.id
      }}">
    <div class="card-content">
      <div class="content">
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
            <p><b>{{ $t('pickList.PROPOSAL_CATALYST_ID') }}:</b> {{ proposal.catalystId }}</p>
            <!-- TODO: plamen5kov: here to debug (preffer this info to be in the FundingWidget component) -->
            <p v-if="proposal.votes_result">
              <b>{{ $t('pickList.NUMBER_OF_CALCULATED_VOTES') }}:</b> {{ proposal.votes_result | currency_ada }}
            </p>
          </div>
          <funded-widget class="is-2" :proposal="proposal" :fund="fund" />
        </div>
        <div class="columns">
          <div class="column is-11" v-if="proposal.rating">
            <b-rate v-model="proposal.rating" disabled /> ~ {{ Math.ceil(proposal.no_assessments / 3) }} {{ $t('proposal.REVIEWS_BY_CA') }}
          </div>
          <div class="column is-11" v-if="proposal.f6_rating">
            <b-rate v-model="proposal.f6_rating" disabled /> {{ proposal.f6_no_assessments }} {{ $t('proposal.REVIEWS_BY_CA') }}
          </div>
          <div class="column is-11" v-if="!proposal.f6_rating && !proposal.rating">
            <b-rate v-model="fakeRate" disabled />
          </div>
          <div class="column is-1 card has-text-centered mt-2" v-if="isProposalPicked || isProposalDownPicked">
            <p class="subtitle is-7 mb-1">
              {{ $t('pickList.VOTE_PICK_LIST') }}
            </p>
            <b-icon
              icon="thumb-up"
              type="is-success"
              v-if="isProposalPicked" />
            <b-icon
              icon="thumb-down"
              type="is-danger"
              v-if="isProposalDownPicked" />
          </div>
        </div>
      </div>
    </div>
    </router-link>
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
  props: ['proposal', 'fund'],
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
  }
}

</script>
