<template>
  <div class="card">
    <div class="card-content">
      <div class="media">
        <div class="media-left">
            <b-icon icon="account-details" size="is-medium"></b-icon>
        </div>
        <div class="media-content">
          <p class="title is-4">{{author}}</p>
          <p class="subtitle is-6">{{proposerProposals.length}} proposals submitted from {{fundsTextSubtitle}} &bull; ${{proposerAmountSum}} total funds requested</p>
        </div>
      </div>
      <div class="content">

        <b-field label="Proposals across Funds"></b-field>
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

          <b-table-column field="reviews" label="Number of reviews" numeric centered v-slot="props">
            <b>{{ props.row.reviews }}</b>
          </b-table-column>

          <b-table-column field="amount" label="Funds requested" numeric centered v-slot="props">
            <b>{{ props.row.amount }}</b>
          </b-table-column>

          <b-table-column field="funded" label="Funded status" centered v-slot="props">
            <b>{{ props.row.funded }}</b>
          </b-table-column>

          <template slot="detail" slot-scope="props">
            <tr v-for="item in props.row.items" :key="item.id">
              <td></td>
              <td><a @click="goToProposal(item)">{{ item.proposal }}</a></td>
              <td class="has-text-centered">{{ item.reviews }}</td>
              <td class="has-text-centered">{{ item.amount }}</td>
              <td class="has-text-centered"><b-icon :icon="item.funded === 'yes' ? 'check-bold' : ''"></b-icon></td>
            </tr>
          </template>
        </b-table>

        <!-- <a @click="openChallenges">Console log Challenges</a>
        <br><a @click="openFunds">Console log Funds</a>
        <br><a @click="openAllProposals">Console log allProposals</a>
        <br><a @click="displayTableData">Console log tableData</a>
        
        <br>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec
        iaculis mauris. <a>@bulmaio</a>. <a>#css</a> <a>#responsive</a>
        <br />
        <small>11:09 PM - 1 Jan 2016</small> -->
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
    fundsKeys() {
      return Object.keys(this.funds)
    },
    fundsTextSubtitle() {
      return this.funds[this.fundsKeys[this.fundsKeys.length-1]].title.concat(" to ", this.funds[this.fundsKeys[0]].title)
    },
    proposerProposals() {
      return this.proposals.filter( (el) => el.author ===  this.author)
    },
    proposerAmountSum() {
      return this.proposerProposals.map( (el) => el.amount ).reduce((partialSum, a) => partialSum + a, 0)
    },
    proposerFunds() {
      return [... new Set(this.proposerProposals.map( (el) => el.fund ))]
    },
    tableData() {
      const data =[];
      let template = {
        proposal: '',
        reviews: 0,
        amount: 0,
        funded: 'n/a'
        // items: []
      };
      
      // push Fund-N templateData to const data
      this.proposerFunds.forEach( (fId) => {
        data.push(this.getFundData(fId, template)) 
      })
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
    getProposalData (proposal, templateData) {
      /* 
      templateData = {
            proposal: '',
            reviews: 0,
            amount: 0,
            funded: 'n/a'
            // items: [] 
          } 
      */
      const data = {...templateData};
      data.proposal = proposal.title;
      data.reviews = (Object.prototype.hasOwnProperty.call(proposal, 'f6_no_assessments')) 
        ? proposal.f6_no_assessments 
        : proposal.no_assessments
      data.amount = proposal.amount;
      let hasFunded = Object.prototype.hasOwnProperty.call(proposal, 'funded');
      ( hasFunded ) 
      ? data.funded = (proposal.funded === 1) ? 'yes' : 'no'
      : data.funded = 'n/a'
      data.id = proposal.id
      return data
    },
    getFundData(fundId, templateData) {
      /* 
      templateData = {
            proposal: '',
            reviews: 0,
            amount: 0,
            funded: 'n/a'
            items: [] // [... proposalData] 
          } 
      */
      const data = {...templateData};
      let fundProposals = this.proposerProposals.filter( (p) => p.fund === fundId );
      
      // proposal
      data.proposal = this.funds[fundId].title.concat(" ", "proposals");
      // reviews
      data.reviews = fundProposals.map( (p) => ( Object.prototype.hasOwnProperty.call(p, 'f6_no_assessments') ) 
        ? p.f6_no_assessments
        : Math.ceil(p.no_assessments / 3)
      ).reduce((partialSum, a) => partialSum + a, 0);
      // amount
      data.amount = fundProposals.map( (p) => p.amount ).reduce((partialSum, a) => partialSum + a, 0);
      // funded
      data.funded = fundProposals.map( (p) => {
        let hasFunded = Object.prototype.hasOwnProperty.call(p, 'funded');
        if (hasFunded) {
          return p.funded   // considers p.funded : Funded=1, NotFunded=0
        } else {
          return 0          // compute 0 for n/a funded info
        }
      }).reduce((partialSum, a) => partialSum + a, 0);
      // items 
      data.items = fundProposals.map( (p) => this.getProposalData(p, templateData) )
      
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