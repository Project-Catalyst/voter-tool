<template>
  <div class="container" v-if="proposal && challenge">
    <div class="hero mb-6">
      <p class="title is-6 mb-2">
        {{ challenge.title }}
      </p>
      <p class="title is-3">
        {{ proposal.title }}
      </p>
      <p class="subtitle is-6">
        {{ proposal.author }}
      </p>
      <div class="box">
        <div class="columns">
          <div class="column">
            <p class="mb-2" v-if="proposal.solution">
              <b>Problem statement</b><br />
              {{ proposal.description }}
            </p>
            <p class="mb-2" v-if="proposal.importance">
              <b>Challenge question</b><br />
              {{ proposal.description }}
            </p>
            <p class="mb-4" v-if="proposal.solution">
              <b>Problem solution</b><br />
              {{ proposal.solution }}
            </p>
            <p class="mb-4" v-if="proposal.importance">
              <b>Why is it important?</b><br />
              {{ proposal.importance }}
            </p>
            <p class="mb-4" v-if="proposal.experience">
              <b>Relevant experience</b><br />
              {{ proposal.experience }}
            </p>
            <p class="mb-4" v-if="proposal.success">
              <b>How does success look like?</b><br />
              {{ proposal.success }}
            </p>
            <p class="mb-3"><b>Funds requested:</b> {{ proposal.amount | currency }}</p>
            <div class="my-progress">
              <b-progress :value="percentOfChallenge" size="is-medium" show-value>
                {{percentOfChallenge}}% of available funds in challenge
              </b-progress>
            </div>
          </div>
          <div class="column is-narrow">
            <div class="mb-6">
              <b-rate size="is-large" v-model="proposal.rating" disabled />
              ~ <b>{{ Math.ceil(proposal.no_assessments / 3) }}</b> reviews by Community Advisors
            </div>
            <div v-for="(avg, question) in avgByQuestion" :key="`avg-${question}`">
              <b-field class="inline" :label="questions[question].title">
                <b-rate size="is-small" v-model="avgByQuestion[question]" disabled />
              </b-field>
            </div>
          </div>
        </div>
        <div class="buttons">
          <b-button
            tag="a"
            :href="proposal.url"
            icon-left="eye"
            type="is-primary"
            target="blank">
            View full proposal in IdeaScale
          </b-button>
          <b-button
            @click="handlePickList"
            :icon-left="(isProposalPicked) ? 'bookmark-remove' : 'bookmark-plus'"
            type="is-primary-light">
            {{ pickMsg }}
          </b-button>
        </div>
        <div class="content" v-if="(proposal.videos && (proposal.videos.length === 0)) || (proposal.media && (proposal.media.length === 0))">
          <p class="buttons">
            <a :href="formLink" target="_blank">
              Do you want to suggest video or media for this proposal? Click here!
            </a>
          </p>
        </div>
      </div>
      <div class="box" v-if="proposal.videos && (proposal.videos.length > 0)">
        <p class="title is-4">Videos</p>
        <div class="columns is-multiline">
          <div class="column is-4"
            :key="`video-${i}`"
            v-for="(video, i) in proposal.videos">
            <video-embed css="video is-16by9" :src="video"></video-embed>
          </div>
        </div>
      </div>
      <div class="box" v-if="proposal.media && (proposal.media.length > 0)">
        <p class="title is-4">Links / Media</p>
        <div class="content">
          <div
              :key="`media-${i}`"
              v-for="(media, i) in proposal.media">
            <a :href="media.url" target="_blank">
              {{media.title}}
            </a>
          </div>
        </div>
      </div>
    </div>
    <section class="reviews-list">
      <p class="title is-4">Reviews</p>
      <div class=""
        v-for="(assessments, question) in assessmentsByQuestion"
        :key="question">
        <p class="title is-5">{{questions[question].full}}</p>
        <div class="card mb-4"
          v-for="assessment in assessments"
          :key="assessment.id">
          <div class="card-content">
            <div class="content columns">
              <div class="column">
                <p>{{ assessment.note }}</p>
              </div>
              <div class="column is-narrow">
                <b-rate v-model="assessment.rating" disabled />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import questions from "@/assets/data/questions.json";
import CatalystAPI from '@/api/catalyst.js'
import groupBy from '@/utils/group.js'

export default {
  data(){
    return {
      questions: questions,
      challenges: [],
      proposal: []
    }
  },

  mounted(){
    CatalystAPI.challenges(this.fund).then((r) => {
      this.challenges = r.data
    })
    CatalystAPI.proposal(this.fund, this.challengeId, this.$route.params.id).then((r) => {
      this.proposal = r.data
    })
  },
  computed: {
    ...mapGetters("proposals", ["isPicked"]),
    isProposalPicked() {
      return this.isPicked(this.proposal)
    },
    fund() {
      if (this.$route) {
        return this.$route.params.fund
      }
      return false
    },
    challengeId() {
      if (this.$route) {
        return this.$route.params.challenge
      }
      return false
    },
    challenge() {
      if (this.challenges) {
        return this.challenges.find((el) => (
          el.id === parseInt(this.$route.params.challenge))
        )
      }
      return false
    },
    percentOfChallenge() {
      if (this.proposal && this.challenge) {
        return (this.proposal.amount * 100) / this.challenge.amount
      }
      return false
    },
    assessmentsByQuestion() {
      if (this.proposal) {
        if (this.proposal.assessments) {
          const groupByQ = groupBy('question')
          return groupByQ(this.proposal.assessments)
        }
      }
      return []
    },
    avgByQuestion() {
      let avgs = {}
      Object.keys(this.assessmentsByQuestion).forEach((key) => {
        const el = this.assessmentsByQuestion[key]
        let avg = (el.reduce((n, {rating}) => n + rating, 0)) / el.length
        avgs[key] = avg
      })
      return avgs
    },
    pickMsg() {
      return (this.isProposalPicked) ? `Remove from My Pick List` : `Add to My Pick List`
    },
    formLink() {
      const proposalId = this.proposal.id
      const proposalTitle = encodeURI(this.proposal.title)
      return `https://docs.google.com/forms/d/e/1FAIpQLSdnL1Dgnp_IrWc-ZiRYVXt4WxVLrxad-1T_fF9Jczeh0q9pGA/viewform?usp=pp_url&entry.1253257562=${proposalId}&entry.1906290995=${proposalTitle}`
    }
  },
  methods: {
    handlePickList() {
      const pickListLink = this.$router.resolve({
        name: 'picked',
        params: { fund: this.fund }
      })
      if (this.isProposalPicked) {
        this.$store.commit("proposals/removeProposal", this.proposal);
        this.$buefy.notification.open({
          message: `<b>${this.proposal.title}</b> removed from the Vote Pick List<br />
          <a href="${pickListLink.href}">Open the Vote Pick List</>`,
          type: 'is-primary',
          position: 'is-bottom-right'
        })
      } else {
        this.$store.commit("proposals/addProposal", this.proposal);
        this.$buefy.notification.open({
          message: `<b>${this.proposal.title}</b> added to the Vote Pick List<br />
          <a href="${pickListLink.href}">Open the Vote Pick List</>`,
          type: 'is-primary',
          position: 'is-bottom-right'
        })
      }
    }
  }
}
</script>
<style lang="scss">
  .video {
    position: relative;
    display: block;
    width: 100%;
    padding: 0;
    overflow: hidden;
    &.is-21by9 {
      padding-top: 42.85714%
    }
    &.is-16by9 {
      padding-top: 56.25%
    }
    &.is-4by3 {
      padding-top: 75%
    }
    &.is-1by1 {
      padding-top: 100%
    }
    iframe, embed, object, video {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 0
    }
  }
  .my-progress {
    max-width: 450px;
  }
  .notices .notification {
    pointer-events: initial;
  }
  .inline {
    display: flex;
    justify-content: space-between;
  }
</style>
