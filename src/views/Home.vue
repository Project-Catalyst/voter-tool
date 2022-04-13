<template>
  <div>
    <div class="columns is-multiline">
      <div class="column is-12">
        <p class="title is-3">{{ $t('home.TOOL_TITLE') }}</p>
        <p v-html="$t('home.TOOL_DESCRIPTION')"></p>
      </div>
      <div class="filters columns column is-12 mb-4">
        <b-field class="column">
            <b-input :placeholder="$t('general.SEARCH_FOR')"
                type="search"
                icon="magnify"
                icon-clickable
                v-model="keyword">
            </b-input>
        </b-field>
      </div>
    </div>
    <div v-if="!searchResultsVisible">
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
    <div class="proposals-list" v-if="searchResultsVisible">
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
  },

  computed: {
    ...mapGetters("user", ["dialogAccepted"]),
    fundsKeys() {
      return Object.keys(this.funds)
    },
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
