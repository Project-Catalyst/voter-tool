<template>
  <div v-if="challenges.length > 0">
    <div class="hero mb-6">
      <p class="title is-4">
        My Vote Pick List
      </p>
      <p>
        In this page you can see a projection of your voting choices.<br />
        For each challenge you can see the progressive amount of fund remaining
        for each proposal you added to the pick list.<br />
        You can drag/drop the elements in the list.<br />
        Your pick list is stored on your browser (using localStorage and cookies), no info will be shared with
        thirdy parties (or us).<br />
        If you're using a setup where cookies are cleared at every browser launch, be careful because you may lose your choices!
      </p>
    </div>

    <div class="proposals-list" v-if="vChallenges">
      <div class="box"
        v-for="proposals, k in vChallenges" :key="`challenge-${k}`">
        <p class="title is-3">
          {{ objChallenges[k].title }} <span class="subtitle is-6">(Total funds: {{ objChallenges[k].amount | currency }})</span>
        </p>
        <b-table
          :data="proposals"
          :row-class="(row, index) => row.remaining < 0 && 'is-warning'"
          draggable
          @dragstart="dragstart"
          @drop="drop"
          @dragover="dragover"
          @dragleave="dragleave">
          <b-table-column field="title" label="Title" v-slot="props">
            {{ props.row.title }}
            <a class="is-size-7" :href="props.row.url" target="blank">(Open in IdeaScale)</a>
          </b-table-column>
          <b-table-column field="amount" numeric label="Funds requested" v-slot="props">
            {{ props.row.amount | currency }}
          </b-table-column>
          <b-table-column field="remaining" numeric label="Funds remaining" v-slot="props">
            {{ props.row.remaining | currency }}
          </b-table-column>
          <b-table-column field="inBudget" label="" v-slot="props">
            {{ props.row.inBudget}}
          </b-table-column>
          <b-table-column label="" width="40" v-slot="props" >
            <button class="button is-small is-light" @click="deleteRow(props.row)">
              <b-icon icon="delete"></b-icon>
            </button>
          </b-table-column>
        </b-table>
      </div>
    </div>
    <b-message type="isinfo" v-if="Object.keys(vChallenges).length === 0">
      <p class="subtitle is-4">
        You don't have any proposals in your Vote Pick List yet. Browse through the proposals and add them to see the projection of your choice of vote!
      </p>
    </b-message>
  </div>
</template>

<script>
import { mapState } from "vuex";
import CatalystAPI from '@/api/catalyst.js'

export default {
  name: "Picked",
  data() {
    return {
      challenges: [],
      draggingRow: null,
      draggingRowIndex: null,
      columns: [
        {
          field: 'title',
          label: 'Title'
        },
        {
          field: 'amount',
          label: 'Funds requested',
          numeric: true
        },
        {
          field: 'remaining',
          label: 'Funds remaining',
          numeric: true
        },
        {
          field: 'inBudget',
          label: '',
        }
      ]
    }
  },
  computed: {
    ...mapState({
      pchallenges: (state) => state.proposals.challenges,
    }),
    fund() {
      if (this.$route) {
        return this.$route.params.fund
      }
      return false
    },
    objChallenges() {
      const challenges = {}
      this.challenges.forEach((c) => {
        challenges[c.id] = c
      })
      return challenges
    },
    vChallenges() {
      if (this.objChallenges) {
        let challenges = {}
        Object.keys(this.pchallenges).forEach((k) => {
          const tot = this.objChallenges[k].amount
          challenges[k] = this.pchallenges[k].map((p) => {
            let cp = {...p}
            cp.remaining = tot - p.pAmount
            cp.inBudget = (cp.remaining > 0) ? '' : 'Out of budget'
            return cp
          })
        })
        return challenges
      }
      return {}
    }
  },
  methods: {
    dragstart(payload) {
      this.draggingRow = payload.row
      this.draggingRowIndex = payload.index
      payload.event.dataTransfer.effectAllowed = 'copy'
    },
    dragover(payload) {
      payload.event.dataTransfer.dropEffect = 'copy'
      payload.event.target.closest('tr').classList.add('is-selected')
      payload.event.preventDefault()
    },
    dragleave(payload) {
      payload.event.target.closest('tr').classList.remove('is-selected')
      payload.event.preventDefault()
    },
    drop(payload) {
      payload.event.target.closest('tr').classList.remove('is-selected')
      const droppedOnRowIndex = payload.index
      this.$store.commit(
        "proposals/moveProposal", {
          proposal: this.draggingRow,
          from: this.draggingRowIndex,
          to: droppedOnRowIndex
        }
      );
    },
    getChallenge(cId) {
      return this.challenges.find((c) => c.id === parseInt(cId))
    },
    deleteRow(row) {
      this.$store.commit("proposals/removeProposal", row);
    }
  },
  mounted(){
    CatalystAPI.challenges(this.fund).then((r) => {
      this.challenges = r.data
    })
  },
}
</script>
<style lang="scss">
  tr.is-warning {
    background: hsl(44, 100%, 77%);
  }
</style>
