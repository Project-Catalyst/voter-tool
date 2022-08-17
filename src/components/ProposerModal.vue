<template>
  <div class="card">
    <div class="card-content">
      <div class="media">
        <div class="media-content">
          <p class="subtitle is-6" v-html="$t('proposerModal.NOTE')"></p>
        </div>
      </div>
      <div class="content">

        <div class="box">
          <div class="media">
            <div class="media-left">
                <b-icon icon="account-details" size="is-medium"></b-icon>
            </div>
            <div class="media-content">
              <h1 class="title">{{author}}</h1>
            </div>
          </div>
          <h4>{{proposerProposals.length}} proposals submitted from {{fundsText}}</h4>
          <h4>Total funds requested: {{proposerAmountSum | currency}}</h4>
          <h4>Funds approved*: {{proposerAmountFunded | currency}}</h4>
          <p><small>* Is the total funds approved by community vote. Funds are provided on conditions and therefore may not yet be fully distributed to the proposer. Funding information is not available to all Funds: check out the table below for detailed information.</small></p>
        </div>

        <b-field label="Explore the author's proposals across funds:"></b-field>

        <b-table
          :data="tableData"
          ref="table"
          :loading="isLoading"
          detailed
          hoverable
          custom-detail-row
          :opened-detailed="[proposerFunds[0]]"
          detail-key="proposal"
          @details-open="(row, index) => $buefy.toast.open(`Expanded ${row.proposal}`)"
          :show-detail-icon="true">

          <b-table-column field="proposal" label="Title" v-slot="props">
            <b>{{ props.row.proposal }}</b>
          </b-table-column>

          <b-table-column field="count" label="#" numeric centered v-slot="props">
            <b>{{ props.row.count }}</b>
          </b-table-column>

          <b-table-column field="challenge" label="Challenge Setting" centered v-slot="props">
            <b>{{ props.row.challenge }}</b>
          </b-table-column>

          <b-table-column field="reviews" label="N. of reviews" numeric centered v-slot="props">
            <b>{{ props.row.reviews }}</b>
          </b-table-column>

          <b-table-column field="amount" label="Funds requested" numeric centered v-slot="props">
            <b>{{ props.row.amount | currency }}</b>
          </b-table-column>

          <b-table-column field="funded" label="Funded status" centered v-slot="props">
            <span v-if="props.row.funded === 0" style="color:#993404;">
              <b>{{ props.row.funded }}</b><b-icon icon="check-bold"></b-icon>
            </span>
            <span v-else style="color:green;">
                <b>{{ props.row.funded }}</b><b-icon icon="check-bold"></b-icon>
            </span>
          </b-table-column>

          <template slot="detail" slot-scope="props">
            <tr v-for="item in props.row.items" :key="item.id">
              <td></td>
              <td><a @click="goToProposal(item)">{{ item.proposal }}</a></td>
              <td class="has-text-centered">{{ item.count }}</td>
              <td class="has-text-centered">{{ item.challenge }}</td>
              <td class="has-text-centered">{{ item.reviews }}</td>
              <td class="has-text-centered">
                <span v-if="item.funded === 'funded'" style="color:green;">
                    {{ item.amount | currency }}
                </span>
                <span v-else>
                    {{ item.amount | currency }}
                </span>
              </td>
              <td class="has-text-centered">
                <span v-if="item.funded === fundedValue" class="tag is-success">
                  &emsp;  {{ item.funded }} &emsp;
                </span>
                <span v-else-if="item.funded === overBudValue" class="tag is-warning">
                   {{ item.funded }}
                </span>
                <span v-else class="tag is-danger">
                    {{ item.funded }}
                </span>
              </td>
            </tr>
          </template>
        </b-table>

        <!-- <a @click="openChallenges">Console log Challenges</a>
        <br><a @click="openFunds">Console log Funds</a>
        <br><a @click="openAllProposals">Console log allProposals</a>
        <br><a @click="displayTableData">Console log tableData</a> -->
      </div>
    </div>
  </div>
</template>

<script>
import CatalystAPI from '@/api/catalyst.js';

export default {
  props: ['author', 'challenges'],
  data() {
    return {
      proposals: [],
      funds: {
        'f9': {
          title: "Fund 9",
          challenges: []
        },
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

  computed: {
    overBudValue()   { return 'over budget' },
    fundedValue()    { return 'funded' },
    notFundedValue() { return 'not funded' },
    challengeSettingText() { return 'challenge setting' },
    fundsKeys() {
      return Object.keys(this.funds)
    },
    fundsText() {
      return this.funds[this.fundsKeys[this.fundsKeys.length-1]].title.concat(" to ", this.funds[this.fundsKeys[0]].title)
    },
    proposerProposals() {
      return this.proposals.filter( (el) => el.author ===  this.author)
    },
    proposerAmountSum() {
      return this.proposerProposals.map( (el) => el.amount ).reduce((partialSum, a) => partialSum + a, 0)
    },
    proposerAmountFunded() {
      return this.proposerProposals.filter( (el) => this.isFunded(el) === true).map( (el) => el.amount ).reduce((partialSum, a) => partialSum + a, 0)
    },
    proposerFunds() {
      return [... new Set(this.proposerProposals.map( (el) => el.fund ))]
    },
    tableData() {
      const data =[];
      let template = {
        proposal: '',
        count: '',
        challenge: '',
        reviews: 0,
        amount: 0,
        funded: 'n/a'
        // items: []
      };
      
      // push Fund-N templateData to const < data >
      data.push(this.getChallengeSettingData(template))
      this.proposerFunds.forEach( (fId) => data.push(this.getFundData(fId, template)) )
      return data
    },
    isLoading() {
      return (this.proposals.length === 0) ? true : false
    }
  },

  methods: {
    displayTableData() {
      console.log(this.tableData)
    },
    openChallenges() {
      console.log(this.challenges)
    },
    openFunds() {
      console.log(this.funds)
    },
    openAllProposals() {
      console.log(this.proposals)
    },
    getReviews(p) {
      return ( Object.prototype.hasOwnProperty.call(p, 'f6_no_assessments') ) ? p.f6_no_assessments : Math.ceil(p.no_assessments / 3)
    },
    hasFunded(p) {
      return Object.prototype.hasOwnProperty.call(p, 'funded');
    },
    isFunded(p) {
      if (!this.hasFunded(p)) { return false}
      return (p.funded === 2) ? true : false
    },
    isFundedStatus(p) {
      if (!this.hasFunded(p))  { return '    n/a    '}
      else if (p.funded === 2) { return this.fundedValue}
      else if (p.funded === 1) { return this.overBudValue}
      else                     { return this.notFundedValue}
    },
    getProposalData (proposal, templateData) {
      /*
      templateData = {
            proposal: '',
            count: '',
            challenge: '',
            reviews: 0,
            amount: 0,
            funded: 'n/a'
            // items: []
          }
      */
      const data = {...templateData};
      data.proposal = proposal.title;
      data.count = '';
      data.challenge = this.funds[proposal.fund].challenges.find( (el) => el.id === proposal.category ).title.split(": ").pop();
      ( data.challenge.includes(this.challengeSettingText) )
      ? data.challenge = data.challenge.replace(this.challengeSettingText, '')
      : data.challenge = data.challenge
      data.reviews = this.getReviews(proposal);
      data.amount = proposal.amount;
      data.funded = this.isFundedStatus(proposal);
      data.id = proposal.id;
      return data
    },
    getFundData(fundId, templateData) {
      /*
      templateData = {
            proposal: '',
            count: '',
            challenge: '',
            reviews: 0,
            amount: 0,
            funded: 'n/a'
            items: [] // [... proposalData]
          }
      */
      const data = {...templateData};
      let fundProposals = this.proposerProposals
        .filter( (p) => p.fund === fundId )
        .filter( (p) => !this.funds[p.fund].challenges.find( (el) => el.id === p.category ).title.includes(this.challengeSettingText) );

      // proposal
      data.proposal = this.funds[fundId].title.concat(" ", "proposals");
      // count
      data.count = fundProposals.length;
      // challenge
      data.challenge = fundId.toUpperCase().concat(' challenges');
      // reviews
      data.reviews = fundProposals.map( (p) => this.getReviews(p) ).reduce((partialSum, a) => partialSum + a, 0);
      // amount
      data.amount = fundProposals.map( (p) => p.amount ).reduce((partialSum, a) => partialSum + a, 0);
      // funded
      data.funded = fundProposals.map( (p) => (this.isFunded(p)) ? 1 : 0 ).reduce((partialSum, a) => partialSum + a, 0);
      // items
      data.items = fundProposals.map( (p) => this.getProposalData(p, templateData) );
      data.items.sort(this.sortProposalsByChallenge);

      return data
    },
    getChallengeSettingData (templateData) {
      /*
      templateData = {
            proposal: '',
            count: '',
            challenge: '',
            reviews: 0,
            amount: 0,
            funded: 'n/a'
            items: [] // [... proposalData]
          }
      */
      const data = {...templateData};
      let csProposals = this.proposerProposals.filter( (p) => this.funds[p.fund].challenges.find( (el) => el.id === p.category ).title.includes(this.challengeSettingText) );

      // proposal
      data.proposal = "Challenge Setting proposals";
      // count
      data.count = csProposals.length;
      // challenge
      data.challenge = "Fund challenge reference";
      // reviews
      data.reviews = csProposals.map( (p) => this.getReviews(p) ).reduce((partialSum, a) => partialSum + a, 0);
      // amount
      data.amount = csProposals.map( (p) => p.amount ).reduce((partialSum, a) => partialSum + a, 0);
      // funded
      data.funded = csProposals.map( (p) => (this.isFunded(p)) ? 1 : 0 ).reduce((partialSum, a) => partialSum + a, 0);
      // items
      data.items = csProposals.map( (p) => this.getProposalData(p, templateData) );
      data.items.sort(this.sortProposalsByChallenge);

      return data
    },
    goToProposal(item) {
      let proposal = this.proposerProposals.filter( (p) => p.id === item.id )[0]
      let page = this.$router.resolve({name: 'proposal', params: {
        fund: proposal.fund,
        challenge: proposal.category,
        id: proposal.id
      }})
      window.open(page.href, '_blank');
    },
    sortProposalsByChallenge(a, b) {
      return a.challenge.localeCompare(b.challenge)
    }
  },

  created() {
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
  }
}
</script>

<style lang="scss">
.inline {
  display: flex;
  justify-content: space-between;
}
</style>
