<template>
  <div v-if="challenges.length > 0">
    <div class="hero mb-6">
      <p class="title is-4">
        {{ $t('pickList.MY_VOTE_PICK_LIST')}}
      </p>
      <p v-html="$t('pickList.PICK_LIST_DESC')"></p>
    </div>

    <div class="proposals-list" v-if="vChallenges">
      <div class="box"
        v-for="proposals, k in vChallenges" :key="`challenge-${k}`">
        <p class="title is-3">
          {{ objChallenges[k].title }} <span class="subtitle is-6">({{$t('pickList.TOTAL_FUNDS')}} {{ objChallenges[k].amount | currency }})</span>
        </p>
        <b-table
          :data="proposals"
          :row-class="(row, index) => row.remaining < 0 && 'is-warning'"
          draggable
          @dragstart="dragstart"
          @drop="drop"
          @dragover="dragover"
          @dragleave="dragleave">
          <b-table-column field="title" :label="$t('pickList.TITLE')" v-slot="props">
            {{ props.row.title }}
            <a class="is-size-7" :href="props.row.url" target="blank">({{$t('pickList.OPEN_IN_IDEASCALE')}})</a>
          </b-table-column>
          <b-table-column field="amount" numeric :label="$t('pickList.FUNDS_REQUESTED')" v-slot="props">
            {{ props.row.amount | currency }}
          </b-table-column>
          <b-table-column field="remaining" numeric :label="$t('pickList.FUNDS_REMAINING')" v-slot="props">
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
        {{ $t('pickList.NO_PROPOSALS_TEXT')}}
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
      draggingRowIndex: null
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
            cp.inBudget = (cp.remaining >= 0) ? '' : this.$t('pickList.OUT_OF_BUDGET')
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
