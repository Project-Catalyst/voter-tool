<template>
  <div class="container" v-if="proposal && challenge">
    <div class="hero mb-6">
      <p class="title is-6 mb-2">
        {{ challenge.title }}
      </p>
      <p class="title is-3">
        {{ proposal.title }}
      </p>
      <div class="box">
        <p class="mb-2">
          <b>Problem statement</b><br />
          {{ proposal.description }}
        </p>
        <p class="mb-4">
          <b>Problem solution</b><br />
          {{ proposal.solution }}
        </p>
        <p class="mb-4">
          <b>Experience</b><br />
          {{ proposal.solution }}
        </p>
        <div class="columns">
          <div class="column is-6">
            <p class="mb-3"><b>Funds requested:</b> ${{ proposal.amount }}</p>
            <b-progress :value="percentOfChallenge" size="is-medium" show-value>
              {{percentOfChallenge}}% if available funds in challenge
            </b-progress>
          </div>
          <div class="column is-narrow">
            <b-rate v-model="proposal.rating" disabled />
            ~ {{ (proposal.no_assessments / 3).toFixed(2) }} reviews by Community Advisors
          </div>
        </div>
        <b-button
          tag="a"
          :href="proposal.url"
          icon-left="eye"
          type="is-primary"
          target="blank">
          View full proposal in IdeaScale
        </b-button>
      </div>
      <div class="box" v-if="proposal.videos && (proposal.videos.length > 0)">
        <p class="title is-4">Videos</p>
        <div class="columns">
          <div class="column is-4"
            :key="`video-${i}`"
            v-for="(video, i) in proposal.videos">
            <video-embed css="video is-16by9" :src="video"></video-embed>
          </div>
        </div>
      </div>
      <div class="box" v-if="proposal.media && (proposal.media.length > 0)">
        <p class="title is-4">Links / Media</p>
        <div
            :key="`media-${i}`"
            v-for="(media, i) in proposal.media">
          <a :href="media.url" target="_blank">
            {{media.title}}
          </a>
        </div>
      </div>
    </div>
    <section class="reviews-list">
      <p class="title is-4">Assessments</p>
      <div class=""
        v-for="(assessments, question) in assessmentsByQuestion"
        :key="question">
        <p class="title is-5">{{questions[question]}}</p>
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
</style>
