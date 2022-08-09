<template>
  <div>
    <div class="column is-12">
      <p class="title is-3">{{ $t('home.TOOL_TITLE') }}</p>
      <p v-html="$t('home.TOOL_DESCRIPTION')"></p>
    </div>

    <div class="filters">
      <div class="columns column is-12 mb-4 is-multiline">
        <div class="column is-12">
          <p><em>Scroll down to choose an specific Fund-Challenge proposal environment, or use the filters to search for proposals.</em></p>
        </div>
        <div class="column is-12">
          <b-button
            type="is-primary"
            @click="isFilterOpen = !isFilterOpen">
            {{pickFilterButtonMsg}}
          </b-button>
        </div>
      </div>

      <!-- Collapsable filters -->
      <b-collapse
        animation="slide"
        v-model="isFilterOpen">
        <template #trigger></template>

        <div class="columns mb-4 is-multiline">
          <!-- Fund Selection -->
          <b-field label="Select from Funds" class="column is-8">
            <b-taginput
                ref="fundTagSelection"
                v-model="selectedFunds"
                :data="filteredFunds"
                autocomplete
                field="title"
                icon="label"
                :open-on-focus="true"
                placeholder="Filter by specific funds"
                @remove="getFilteredFunds(false)"
                @typing="getFilteredFunds"
                type="is-primary is-light"
                close-type="is-primary is-light"
                attached>
                <template v-slot="props">
                    {{props.option.title}}
                </template>
                <template #empty>
                    There are no items
                </template>
            </b-taginput>
          </b-field>

          <!-- FundsAmount Selection -->
          <b-field label="Funds Requested" class="column is-4">
            <b-select 
            placeholder="Select an interval"
            v-model="fundsAmount">
              <option
                v-for="option in fundsRange"
                :value="option.range"
                :key="option.id">
                {{ option.title }}
              </option>
            </b-select>
          </b-field>

          <!-- FundedStatus Selection -->
          <b-field label="Funded Status" class="column is-4">
            <b-radio v-model="fundedStatus"
                name="name"
                native-value="all">
                All
            </b-radio>
            <b-radio v-model="fundedStatus"
                name="name"
                native-value="funded">
                Funded 
            </b-radio>
            <b-radio v-model="fundedStatus"
                name="name"
                native-value="notfunded">
                Not funded
            </b-radio>
          </b-field>

          <!-- Reviews Selection -->
          <b-field label="Number of Reviews" class="column is-4">
            <b-slider v-model="selectedReviews" :min="reviewsMin" :max="reviewsMax"></b-slider>
          </b-field>
          <!-- Rating Selection -->
          <b-field label="Rating" class="column is-4">
            <b-rate></b-rate>
          </b-field>
          

          <!-- Search input -->
          <b-field label="Select from Titles" class="column is-10">
            <b-input :placeholder="$t('general.SEARCH_FOR')"
              type="search"
              icon="magnify"
              icon-clickable
              v-model="keyword">
            </b-input>
          </b-field>
        </div>  

      </b-collapse>
    </div>

    <div v-if="!activeFilters">
      <div class="columns is-multiline mb-6"
        v-for="localFund in fundsKeys"
        :key="`f-${localFund}`"
        >
        <div class="column is-12">
          <p class="title is-3">{{funds[localFund].title}}</p>
        </div>
        <div class="column is-4"
          v-for="challenge in funds[localFund].challenges"
          :key="challenge.id">
          <div class="card is-primary">
            <router-link :to="{ name: 'challenge', params: {
              fund: localFund,
              challenge: challenge.id
              }}">
            <div class="card-content">
              <div class="content">
                <p class="title is-4">
                  {{ challenge.title }}
                </p>
                <p>{{ challenge.description }}</p>
                <p v-if="challenge.nr_proposals"><b>{{ challenge.nr_proposals }}</b> {{$t('home.PROPOSALS_SUBMITTED')}}</p>
                <p>{{$t('home.FUNDS')}} <b>{{ challenge.amount | currency}}</b></p>
              </div>
            </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="proposals-list" v-if="activeFilters">
      <proposal-preview
        :proposal="proposal"
        :key="proposal.id"
        :fund="proposal.fund"
        v-for="proposal in filteredProposals"
        />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import CatalystAPI from '@/api/catalyst.js';
import ProposalPreview from '@/components/ProposalPreview';
import { quantileSeq } from 'mathjs'

export default {
  components: {
    ProposalPreview
  },
  data(){
    return {
      challenges: [],
      proposals: [],
      fund: 'f8',
      isFilterOpen: false,
      filteredFunds: [],
      selectedFunds: [],
      fundsAmount: [],
      fundedStatus: '',
      selectedReviews: [0,0],
      selectedAmount: [0,0],
      keyword: '',
      funds: {
        'f8': {
          title: "Fund 8",
          challenges: []
        },
        'f7': {
          title: "Fund 7",
          challenges: []
        },
        'f6': {
          title: "Fund 6",
          challenges: []
        },
        'f5': {
          title: "Fund 5",
          challenges: []
        },
        'f4': {
          title: "Fund 4",
          challenges: []
        }
      }
    }
  },

  methods: {
    getFilteredFunds(text) {
      let filteredFunds;
      if (text) {
        filteredFunds = this.funds.filter((option) => {
          return option.title
            .toString()
            .toLowerCase()
            .indexOf(text.toLowerCase()) >= 0
        })
      } else {
        filteredFunds = Object.values(this.funds)
      }
      this.filteredFunds = filteredFunds.filter((option) => {
        return this.selectedFunds.indexOf(option) === -1
      })
    }
  },

  computed: {
    ...mapGetters("user", ["dialogAccepted"]),
    fundsKeys() {
      return Object.keys(this.funds)
    },
    activeFilters() {
      return (this.keyword.trim().length > 3) || (this.selectedFunds.length > 0)
    },
    reviewsMin() {
      let reviews = this.proposals.map( (fundObj) => Object.prototype.hasOwnProperty.call(fundObj, 'f6_no_assessments') ? fundObj.f6_no_assessments : fundObj.no_assessments);
      return Math.min(...reviews)
    },
    reviewsMax() {
      let reviews = this.proposals.map( (fundObj) => Object.prototype.hasOwnProperty.call(fundObj, 'f6_no_assessments') ? fundObj.f6_no_assessments : fundObj.no_assessments);
      return Math.max(...reviews)
    },
    fundsRange() {
      if(this.proposals.length > 0) {
        let amount = this.proposals.map( (fundObj) => fundObj.amount );
        let quantiles = quantileSeq(amount, [1/3, 0.5, 2/3]);
        return [
          {id: 1, title:`$min - $${quantiles[0]}`, range:[Math.min(...amount),quantiles[0]]},
          {id: 2, title:`$${quantiles[0]} - $${quantiles[1]}`, range:[quantiles[0],quantiles[1]]},
          {id: 3, title:`$${quantiles[1]} - $${quantiles[2]}`, range:[quantiles[1],quantiles[2]]},
          {id: 4, title:`$${quantiles[2]} - $max`, range:[quantiles[2],Math.max(...amount)]}
        ]
      }
      return false
    },
    filteredProposals() {
      let filteredProposals = this.proposals;
      // console.log(filteredProposals)

      // apply Funds filter
      if (this.selectedFunds.length > 0) {
        let fundsIDs = this.selectedFunds.map( (fundObj) => 
          Object.keys(this.funds).find(key => this.funds[key].title === fundObj.title)
        )
        let selecProps = [];
        fundsIDs.forEach((fID) => {
          selecProps.push(
            filteredProposals.filter( (el) => el.fund.toLowerCase().includes(fID.toLowerCase()))
          )
        })
        filteredProposals = selecProps.flat();
      }

      // apply fundedStatus filter
      if (this.fundedStatus === 'funded') {
        filteredProposals = filteredProposals.filter( (el) => el.funded === 2)
      }
      else if (this.fundedStatus === 'notfunded') {
        let selecProps = [];
        selecProps.push(filteredProposals.filter( (el) => el.funded === 1));
        // selecProps.push(filteredProposals.filter((el) => !Object.prototype.hasOwnProperty.call(el, 'funded') ))
        filteredProposals = selecProps.flat();
      }

      // apply fundsAmount filter
      if (this.fundsAmount.length > 0) {
        console.log(this.fundsAmount)
        filteredProposals = filteredProposals.filter( (el) => (el.amount >= this.fundsAmount[0] && el.amount <= this.fundsAmount[1]) )
      }
      console.log(filteredProposals)

      // apply text search filter
      if (this.keyword.trim().length > 3) {
        let selecProps = filteredProposals.filter(
          (el) => el.title.toLowerCase().includes(this.keyword.toLowerCase())
        )
        filteredProposals = selecProps;
      }
      return filteredProposals
    },
    pickFilterButtonMsg() {
      return (this.isFilterOpen) ? 'Close filters' : 'Open filters'
    }
  },

  mounted(){
    if (window.localStorage) {
      let oldKeys = ['voter-tool-f5-default']
      oldKeys.forEach((k) => {
        let oldKey = window.localStorage.getItem(k)
        if (oldKey) {
          window.localStorage.removeItem(k)
        }
      })
    }
    this.fundsKeys.forEach((el) => {
      CatalystAPI.challenges(el).then((r) => {
        this.funds[el].challenges = r.data
        this.funds[el].challenges.forEach((c) => {
          CatalystAPI.proposals(el, c.id).then((res) => {
            if (res.data.length) {
              this.proposals = this.proposals.concat(...res.data.map((p) => {
                p.fund = el
                return p
              }))
            }
          })
        })
      })
    })
    this.getFilteredFunds()
    if (!this.dialogAccepted) {
      this.$buefy.dialog.alert({
        title: 'Voter Tool',
        message: this.$t('general.WARNING_POPUP'),
        confirmText: this.$t('general.CONFIRM_POPUP'),
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
