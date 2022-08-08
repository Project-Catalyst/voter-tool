<template>
  <div>
    <div class="columns is-multiline">
      <div class="column is-12">
        <p class="title is-3">{{ $t('home.TOOL_TITLE') }}</p>
        <p v-html="$t('home.TOOL_DESCRIPTION')"></p>
      </div>
      <div class="filters columns column is-12 mb-4 is-multiline">
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
        <b-collapse class="column is-12"
          animation="slide"
          v-model="isFilterOpen">
          <template #trigger></template>

          
            <!-- Search input -->
            <b-field class="column is-12">
              <b-input :placeholder="$t('general.SEARCH_FOR')"
                type="search"
                icon="magnify"
                icon-clickable
                v-model="keyword">
              </b-input>
            </b-field>
            
            <!-- Fund Selection -->
            <b-field class="column is-3">
              <b-taginput
                  ref="fundTagSelection"
                  v-model="selectedFunds"
                  :data="filteredFunds"
                  autocomplete
                  field="title"
                  icon="label"
                  :open-on-focus="true"
                  placeholder="Filter by funds"
                  max-height="450px"
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

          
        </b-collapse>

        <!-- <b-field class="column">
            <b-input :placeholder="$t('general.SEARCH_FOR')"
                type="search"
                icon="magnify"
                icon-clickable
                v-model="keyword">
            </b-input>
        </b-field> -->
      </div>
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
    filteredProposals() {
      let filteredProposals = this.proposals;
      console.log(filteredProposals)
      // apply Funds filter
      if (this.selectedFunds.length > 0) {
        console.log('Fund Selection')
        let fundsIDs = this.selectedFunds.map( (fundObj) => 
          Object.keys(this.funds).find(key => this.funds[key].title === fundObj.title)
        )
        console.log(fundsIDs)
        let selecProps = [];
        fundsIDs.forEach((fID) => {
          selecProps.push(
            filteredProposals.filter( (el) => el.fund.toLowerCase().includes(fID.toLowerCase()))
          )
        })
        console.log(selecProps)
        filteredProposals = selecProps.flat();
      }
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
    // populate filters
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
