<template>
  <div v-if="challenges.length > 0">
    <div class="hero mb-6">
      <p class="title is-4">
        {{ $t('pickList.MY_VOTE_PICK_LIST')}}
      </p>
      <p v-html="$t('pickList.PICK_LIST_DESC')"></p>
    </div>

    <div class="proposals-list" v-if="Object.keys(vChallenges).length > 0">

      <div class="columns">
        <div class="column is-8">
          <b-field :label="$t('pickList.SHARE_TITLE')">
            <b-input v-model="title"></b-input>
          </b-field>
        </div>
        <div class="column is-2">
          <b-button type="is-primary is-large" @click="openShare">{{ $t('pickList.SHARE') }}</b-button>
        </div>
        <!--
        <div class="column is-2">
          <b-button type="is-primary is-large" @click="savePdf">{{ $t('pickList.EXPORT_PDF') }}</b-button>
        </div>
        -->
      </div>
      <section id="export_pdf">
        <div class="box "
          v-for="proposals, k in vChallenges" :key="`challenge-${k}`">
          <p class="title is-3">
            {{ objChallenges[k].title }} <span class="subtitle is-6">({{$t('pickList.TOTAL_FUNDS')}} {{ objChallenges[k].amount | currency }})</span>
          </p>
          <b-field :label="$t('pickList.CHALLENGE_RATIONALE')">
            <b-input :value="rationales[k]" type="textarea"
              @keyup.native.stop="updateRationale($event, k)"
              @click="updateRationale($event, k)"
              @change="updateRationale($event, k)"
              ></b-input>
          </b-field>
          <b-table
            v-if="(proposals.length)"
            :data="proposals"
            :row-class="(row, index) => row.remaining < 0 && 'is-warning'"
            draggable
            @dragstart="dragstart"
            @drop="drop"
            @dragover="dragover"
            @dragleave="dragleave">
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
            <b-table-column label="" width="40" v-slot="props" >
              <button class="button is-small is-light" @click="deleteRow(props.row)">
                <b-icon icon="delete"></b-icon>
              </button>
            </b-table-column>
          </b-table>
          <div class="downvote-wrapper" v-if="downChallenges[k] && downChallenges[k].length">
            <p class="title is-6 mb-0 mt-6">
              <span class="subtitle is-4">{{$t('pickList.DOWNVOTE')}}</span>
            </p>
            <b-table
              class="downvote-list"
              :data="downChallenges[k]">
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
              <b-table-column label="" width="40" v-slot="props" >
                <button class="button is-small is-light" @click="deleteDownRow(props.row)">
                  <b-icon icon="delete"></b-icon>
                </button>
              </b-table-column>
            </b-table>
          </div>
        </div>
      </section>
      <div class="columns mt-1">
        <div class="column is-6">
          <b-button type="is-primary is-large" @click="openShare">{{ $t('pickList.SHARE') }}</b-button>
        </div>
        <!--
        <div class="column is-6">
          <b-button type="is-primary is-large is-pulled-right" @click="savePdf">{{ "Export PDF" }}</b-button>
        </div>
        -->
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
import { mapState } from "vuex";
import CatalystAPI from '@/api/catalyst.js'
import html2pdf from 'html2pdf.js'

import Share from '@/components/Share';

export default {
  name: "Picked",
  data() {
    return {
      challenges: [],
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
    },
    savePdf() {
      var element = document.getElementById('export_pdf');
      var opt = {
        margin: 5,
        filename: 'voter-tool_my-voter-pick-list.pdf',
        image: {type: 'jpeg', quality: 0.98},
        pagebreak: {
            mode: ['css', 'whiteline'],
            avoid: ['img', '.row']
        },
        html2canvas: {
            scale: 2,
            dpi: 192,
            letterRendering: true,
            logging: true
        },
        jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
        },
        pdfCallback: this.pdfCallback
      }
      html2pdf(element, opt);
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
  .downvote-list {
    tbody tr {
      background: #feecf0;
      color: #f14668;
      a, a:visited {
        color: #f14668;
      }
    }
  }
</style>
