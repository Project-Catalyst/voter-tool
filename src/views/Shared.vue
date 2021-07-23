<template>
  <div v-if="challenges.length > 0">
    <div class="hero mb-6">
      <p class="title is-2">
        {{ pickList.title }}
      </p>
    </div>

    <div class="proposals-list" v-if="pickList">

      <div class="box"
        v-for="proposals, k in pickList.rationales" :key="`challenge-${k}`">
        <p class="title is-3">
          {{ objChallenges[proposals.challenge_id].title }} <span class="subtitle is-6">({{$t('pickList.TOTAL_FUNDS')}} {{ objChallenges[proposals.challenge_id].amount | currency }})</span>
        </p>
        <div class="content">
          <blockquote class="shared-rationale" v-if="proposals.rationale">
            {{ proposals.rationale }}
          </blockquote>
        </div>
        <b-table
          v-if="(sharedProposals[proposals.challenge_id])"
          :data="sharedProposals[proposals.challenge_id]"
          :row-class="(row, index) => row.remaining < 0 && 'is-warning'">
          <b-table-column field="title" :label="$t('pickList.TITLE')" v-slot="props">
            <router-link :to="{ name: 'proposal', params: {
                fund: fund,
                challenge: props.row.category,
                id: props.row.id
              }}">
            {{ props.row.title }}
            </router-link>
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
        </b-table>
        <div class="downvote-wrapper" v-if="sharedDownProposals[proposals.challenge_id] && sharedDownProposals[proposals.challenge_id].length">
          <p class="title is-6 mb-0 mt-6">
            <span class="subtitle is-4">{{$t('pickList.DOWNVOTE')}}</span>
          </p>
          <b-table
            class="downvote-list"
            :data="sharedDownProposals[proposals.challenge_id]">
            <b-table-column field="title" :label="$t('pickList.TITLE')" v-slot="props">
              <router-link :to="{ name: 'proposal', params: {
                  fund: fund,
                  challenge: props.row.category,
                  id: props.row.id
                }}">
              {{ props.row.title }}
              </router-link>
              <a class="is-size-7" :href="props.row.url" target="blank">({{$t('pickList.OPEN_IN_IDEASCALE')}})</a>
            </b-table-column>
            <b-table-column field="amount" numeric :label="$t('pickList.FUNDS_REQUESTED')" v-slot="props">
              {{ props.row.amount | currency }}
            </b-table-column>
          </b-table>
        </div>
      </div>
    </div>
    <b-message type="isinfo" v-if="Object.keys(vChallenges).length === 0">
      <p class="subtitle is-4">
        {{ $t('pickList.NO_PROPOSALS_TEXT')}}
      </p>
    </b-message>
    <b-modal
      v-model="shareActive"
      has-modal-card
      trap-focus
      :destroy-on-hide="false"
      aria-role="dialog"
      :aria-label="$t('pickList.MODAL_TITLE')"
      aria-modal>
      <template #default="props">
        <share @close="props.close"></share>
      </template>
    </b-modal>
  </div>
</template>

<script>
import axios from 'axios';
import { mapState } from "vuex";
import CatalystAPI from '@/api/catalyst.js'
import ShareAPI from '@/api/share.js';

import Share from '@/components/Share';

export default {
  name: "Picked",
  data() {
    return {
      challenges: [],
      proposals: {},
      pickList: {},
      draggingRow: null,
      draggingRowIndex: null,
      shareActive: false
    }
  },
  components: {
    Share
  },
  computed: {
    ...mapState({
      pchallenges: (state) => state.proposals.challenges,
      downChallenges: (state) => state.proposals.downChallenges,
      rationales: (state) => state.proposals.rationales
    }),
    title: {
      get() {
        return this.$store.state.proposals.title
      },
      set (value) {
        this.$store.commit('proposals/updateTitle', value)
      }
    },
    fund() {
      if (this.$route) {
        return this.$route.params.fund
      }
      return false
    },
    uuid() {
      if (this.$route) {
        return this.$route.params.uuid
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
    sharedProposals() {
      let data = {}
      if (this.objChallenges && this.pickList && Object.keys(this.proposals).length) {
        if (this.pickList.rationales) {
          this.pickList.rationales.forEach((ch) => {
            const tot = this.objChallenges[ch.challenge_id].amount
            let ptot = tot
            if (ch.proposals) {
              let proposals = ch.proposals.split(',').map((p_id) => {
                let p = this.proposals[p_id]
                let cp = {...p}
                cp.remaining = ptot - p.amount
                ptot = cp.remaining
                cp.inBudget = (cp.remaining >= 0) ? '' : this.$t('pickList.OUT_OF_BUDGET')
                return cp
              })
              data[ch.challenge_id] = proposals
            }
          })
        }
      }
      return data
    },
    sharedDownProposals() {
      let data = {}
      if (this.objChallenges && this.pickList && Object.keys(this.proposals).length) {
        if (this.pickList.rationales) {
          this.pickList.rationales.forEach((ch) => {
            if (ch.downProposals) {
              let downProposals = ch.downProposals.split(',').map((p_id) => {
                return this.proposals[p_id]
              })
              data[ch.challenge_id] = downProposals
            }
          })
        }
      }
      return data
    },
    vChallenges() {
      if (this.objChallenges) {
        let challenges = {}
        let keys = [...Object.keys(this.pchallenges), ...Object.keys(this.downChallenges)]
        keys.forEach((k) => {
          if (this.objChallenges[k]) {
            const tot = this.objChallenges[k].amount
            if (this.pchallenges[k]) {
              challenges[k] = this.pchallenges[k].map((p) => {
                let cp = {...p}
                cp.remaining = tot - p.pAmount
                cp.inBudget = (cp.remaining >= 0) ? '' : this.$t('pickList.OUT_OF_BUDGET')
                return cp
              })
            } else {
              if (this.downChallenges[k]) {
                challenges[k] = []
              }
            }
          }
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
    },
    deleteDownRow(row) {
      this.$store.commit("proposals/downRemoveProposal", row);
    },
    updateRationale($event, k) {
      this.$store.commit(
        "proposals/updateRationale", {
          challenge: k,
          rationale: $event.target.value
        }
      );
    },
    openShare() {
      this.shareActive = true
    }
  },
  mounted(){
    CatalystAPI.challenges(this.fund).then((r) => {
      this.challenges = r.data
    })
    ShareAPI.shared(this.uuid).then((r) => {
      let localProposals = {}
      this.pickList = r.data.pick_list
      if (r.data.pick_list.rationales) {
        let requests = []
        r.data.pick_list.rationales.forEach((rationale) => {
          requests.push(CatalystAPI.proposals(this.fund, rationale.challenge_id))
        })
        axios.all(requests).then(axios.spread((...responses) => {
          responses.forEach((res) => {
            if (res.data.length) {
              res.data.forEach((p) => {
                localProposals[p.id] = p
              })
              this.proposals = localProposals
            }
          })
        }))
      }
    })
  },
}
</script>
<style lang="scss">
  tr.is-warning {
    background: hsl(44, 100%, 77%);
  }
  .downvote-list {
    tbody tr {
      background: #feecf0;
      color: #f14668;
      a, a:visited {
        color: #f14668;
      }
    }
  }
  .shared-rationale {
    white-space: pre-wrap;
  }
</style>
