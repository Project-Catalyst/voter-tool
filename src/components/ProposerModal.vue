<template>
  <div class="card">
    <!-- <div class="card-icon">
        <b-icon icon="account-details" size="is-medium"></b-icon>
    </div> -->
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

        <b-field label="Proposals across Funds">
<!-- 
          <b-table
            :data="isEmpty ? [] : data"
            :striped="true"
            :narrowed="true"
            :hoverable="true"
            :loading="isLoading"
            :focusable="isFocusable"
            :mobile-cards="hasMobileCards">

            <b-table-column field="id" label="ID" width="40" :td-attrs="columnTdAttrs" numeric v-slot="props">
                {{ props.row.id }}
            </b-table-column>

            <b-table-column field="first_name" label="First Name" :td-attrs="columnTdAttrs" v-slot="props">
                {{ props.row.first_name }}
            </b-table-column>

            <b-table-column field="last_name" label="Last Name" :td-attrs="columnTdAttrs" v-slot="props">
                {{ props.row.last_name }}
            </b-table-column>

            <b-table-column field="date" label="Date" :th-attrs="dateThAttrs" :td-attrs="columnTdAttrs" centered v-slot="props">
                <span class="tag is-success">
                    {{ new Date(props.row.date).toLocaleDateString() }}
                </span>
            </b-table-column>

            <b-table-column label="Gender" :td-attrs="columnTdAttrs" v-slot="props">
                <span>
                    <b-icon
                        v-if="props.row.id !== 'Total'"
                        pack="fas"
                        :icon="props.row.gender === 'Male' ? 'mars' : 'venus'">
                    </b-icon>
                    {{ props.row.gender }}
                </span>
            </b-table-column>

            <template #empty>
                <div class="has-text-centered">No records</div>
            </template> -->
        
        </b-field>

        <a @click="openChallenges">Console log Challenges</a>
        <br><a @click="openFunds">Console log Funds</a>
        <br><a @click="openAllProposals">Console log allProposals</a>
        <br><a @click="displayTableData">Console log tableData</a>
        
        <br>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec
        iaculis mauris. <a>@bulmaio</a>. <a>#css</a> <a>#responsive</a>
        <br />
        <small>11:09 PM - 1 Jan 2016</small>
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
      ? data.funded = (proposal.funded === 1) ? '&check;' : ''
      : data.funded = 'n/a'
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
