<template>
  <div class="container" v-if="proposal && challenge">
    <div class="hero mb-6">
      <p class="title is-6 mb-2">
        <router-link :to="{ name: 'challenge', params: {
          fund: this.fund,
          challenge: challenge.id
          }}">
          {{ challenge.title }}
        </router-link>
      </p>
      <p class="title is-3">
        {{ proposal.title }}
      </p>
      <p class="subtitle is-6">
        {{ proposal.author }}
      </p>
      <div class="box proposal-content">
        <div class="columns">
          <div class="column">
            <p class="mb-2" v-if="proposal.solution">
              <b>{{ $t('proposal.PROBLEM_STATEMENT')}}</b><br />
              {{ proposal.description }}
            </p>
            <p class="mb-2" v-if="proposal.importance">
              <b>{{ $t('proposal.CHALLENGE_QUESTION')}}</b><br />
              {{ proposal.description }}
            </p>
            <p class="mb-4" v-if="proposal.solution">
              <b>{{ $t('proposal.PROBLEM_SOLUTION')}}</b><br />
              {{ proposal.solution }}
            </p>
            <p class="mb-4" v-if="proposal.importance">
              <b>{{ $t('proposal.IMPORTANCE')}}</b><br />
              {{ proposal.importance }}
            </p>
            <p class="mb-4" v-if="proposal.experience">
              <b>{{ $t('proposal.EXPERIENCE')}}</b><br />
              {{ proposal.experience }}
            </p>
            <p class="mb-4" v-if="proposal.success">
              <b>{{ $t('proposal.SUCCESS')}}</b><br />
              {{ proposal.success }}
            </p>
            <p class="mb-3"><b>{{ $t('proposal.FUNDS_REQUEST')}}</b> {{ proposal.amount | currency }}</p>
            <div class="my-progress">
              <b-progress :value="percentOfChallenge" size="is-medium" show-value>
                {{percentOfChallenge}}% {{ $t('proposal.AVAILABLE_FUNDS')}}
              </b-progress>
            </div>
          </div>
          <div class="column is-narrow">
            <div class="mb-6" v-if="proposal.rating">
              <b-rate size="is-large" v-model="proposal.rating" disabled />
              ~ <b>{{ Math.ceil(proposal.no_assessments / 3) }}</b> {{ $t('proposal.REVIEWS_BY_CA')}}
            </div>
            <div class="mb-6" v-if="proposal.f6_rating">
              <b-rate size="is-large" v-model="proposal.f6_rating" disabled />
              <b>{{ proposal.f6_no_assessments }}</b> {{ $t('proposal.REVIEWS_BY_CA')}}
            </div>
            <div class="mb-6" v-if="!proposal.f6_rating && !proposal.rating">
              <b-rate size="is-large" v-model="fakeRating" disabled />
            </div>
            <div v-for="(avg, question) in avgByQuestion" :key="`avg-${question}`">
              <b-field class="inline" :label="$t(`proposal.${questions[question].title}`)">
                <b-rate size="is-small" v-model="avgByQuestion[question]" disabled />
              </b-field>
            </div>
            <funded-widget class="internal-funded-widget mt-3" :proposal="proposal" :fund="fund" />
          </div>
        </div>
        <div class="buttons">
          <b-button
            tag="a"
            :href="proposal.url"
            icon-left="eye"
            type="is-primary"
            target="blank">
            {{ $t('proposal.VIEW_FULL_PROPOSAL')}}
          </b-button>
          <b-button
            v-if="fund === currentFund"
            @click="handlePickList"
            :icon-left="(isProposalPicked) ? 'thumb-up' : 'thumb-up-outline'"
            type="is-primary-light">
            {{ pickMsg }}
          </b-button>
          <b-button
            v-if="fund === currentFund"
            @click="handleDownPickList"
            :icon-left="(isProposalDownPicked) ? 'thumb-down' : 'thumb-down-outline'"
            type="is-primary-light">
            {{ pickDownMsg }}
          </b-button>
        </div>
        <div class="content" v-if="(proposal.videos && (proposal.videos.length === 0)) || (proposal.media && (proposal.media.length === 0))">
          <p class="buttons">
            <a :href="formLink" target="_blank">
              {{ $t('proposal.SUGGEST_VIDEO_MEDIA')}}
            </a>
          </p>
        </div>
      </div>
      <div class="box" v-if="proposal.videos && (proposal.videos.length > 0)">
        <p class="title is-4">{{ $t('proposal.VIDEOS')}}</p>
        <div class="columns is-multiline">
          <div class="column is-4"
            :key="`video-${i}`"
            v-for="(video, i) in proposal.videos">
            <video-embed :params="getVideoParams(video)" css="video is-16by9" :src="video"></video-embed>
          </div>
        </div>
      </div>
      <div class="box" v-if="proposal.media && (proposal.media.length > 0)">
        <p class="title is-4">{{ $t('proposal.LINKS_MEDIA')}}</p>
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
    <section class="reviews-list" v-if="proposal.assessments">
      <p class="title is-4">{{ $t('proposal.REVIEWS')}}</p>
      <div class="block mb-6"
        v-for="(assessments, question) in assessmentsByQuestion"
        :key="question">
        <p class="title is-5">{{questions[question].full}}</p>
        <assessment-partial v-for="assessment in assessments"
          :assessment="assessment"
          :key="assessment.id" />
      </div>
    </section>
    <section class="reviews-list" v-if="proposal.f6_no_assessments">
      <p class="title is-4">{{ $t('proposal.REVIEWS')}}</p>
      <assessment-full v-for="assessment in proposal.f6_assessments"
        :isChallengeSetting="(proposal.importance)"
        :assessment="assessment"
        :key="assessment.id" />
    </section>
    <div class="victor" v-if="goodEasterEgg">
      <video width="500" autoplay muted playsinline @ended="goodEasterEgg = false">
        <source :src="`${publicPath}/victor-approves.mp4`" type="video/mp4">
      </video>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import questions from "@/assets/data/questions.json";
import CatalystAPI from '@/api/catalyst.js'
import groupBy from '@/utils/group.js'

import { EventBus } from "./../EventBus";
import FundedWidget from '@/components/FundedWidget';
import AssessmentPartial from '@/components/AssessmentPartial';
import AssessmentFull from '@/components/AssessmentFull';

export default {
  data(){
    return {
      questions: questions,
      challenges: [],
      proposal: [],
      currentFund: 'f7',
      goodEasterEgg: false,
      fakeRating: 0,
      publicPath: process.env.BASE_URL
    }
  },

  components: {
    FundedWidget,
    AssessmentPartial,
    AssessmentFull
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
    ...mapGetters("proposals", ["isPicked", "isDownPicked"]),
    isProposalPicked() {
      return this.isPicked(this.proposal)
    },
    isProposalDownPicked() {
      return this.isDownPicked(this.proposal)
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
        return +((this.proposal.amount * 100) / this.challenge.amount).toFixed(3)
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
      if (this.assessmentsByQuestion.length) {
        Object.keys(this.assessmentsByQuestion).forEach((key) => {
          const el = this.assessmentsByQuestion[key]
          let avg = (el.reduce((n, {rating}) => n + rating, 0)) / el.length
          avgs[key] = avg
        })
      } else {
        if (this.proposal) {
          if (this.proposal.f6_assessments) {
            if (this.proposal.importance) {
              // Challenge settings
              avgs[4] = this.findAvgByKey(this.proposal.f6_assessments, 'q0r')
              avgs[5] = this.findAvgByKey(this.proposal.f6_assessments, 'q1r')
              avgs[6] = this.findAvgByKey(this.proposal.f6_assessments, 'q2r')
            } else {
              // Normal Challenge
              avgs[1] = this.findAvgByKey(this.proposal.f6_assessments, 'q0r')
              avgs[2] = this.findAvgByKey(this.proposal.f6_assessments, 'q1r')
              avgs[3] = this.findAvgByKey(this.proposal.f6_assessments, 'q2r')
            }
          }
        }
      }
      return avgs
    },
    pickMsg() {
      return (this.isProposalPicked) ? this.$t('proposal.REMOVE_UPVOTE_PICKLIST') : this.$t('proposal.ADD_UPVOTE_PICKLIST')
    },
    pickDownMsg() {
      return (this.isProposalDownPicked) ? this.$t('proposal.REMOVE_DOWNVOTE_PICKLIST') : this.$t('proposal.ADD_DOWNVOTE_PICKLIST')
    },
    formLink() {
      const proposalId = this.proposal.id
      const proposalTitle = encodeURI(this.proposal.title)
      return `https://docs.google.com/forms/d/e/1FAIpQLSdnL1Dgnp_IrWc-ZiRYVXt4WxVLrxad-1T_fF9Jczeh0q9pGA/viewform?usp=pp_url&entry.1253257562=${proposalId}&entry.1906290995=${proposalTitle}`
    }
  },
  methods: {
    findAvgByKey(arr, key) {
      const { length } = arr;
      return arr.reduce((acc, val) => {
        return acc + (val[key]/length);
      }, 0);
    },
    parseUrlQuery(value) {
      var urlParams = new URL(value).searchParams
      return Array.from(urlParams.keys()).reduce((acc, key) => {
        acc[key] = urlParams.getAll(key)
        return acc
      }, {})
    },
    getVideoParams(video) {
      let params = {
        'picture-in-picture': 1,
        accelerometer: 1,
        gyroscope: 1
      }
      var urlParams = this.parseUrlQuery(video)
      if (urlParams["start"]) {
        params.start = urlParams["start"]
      }
      if (urlParams["end"]) {
        params.end = urlParams["end"]
      }
      return params
    },
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
        if (this.proposal.id === 368984) {
          this.goodEasterEgg = true
        }
        this.$store.commit("proposals/addProposal", this.proposal);
        this.$buefy.notification.open({
          message: `<b>${this.proposal.title}</b> added to the Vote Pick List<br />
          <a href="${pickListLink.href}">Open the Vote Pick List</>`,
          type: 'is-primary',
          position: 'is-bottom-right'
        })
      }
    },
    handleDownPickList(e) {
      const pickListLink = this.$router.resolve({
        name: 'picked',
        params: { fund: this.fund }
      })
      if (this.isProposalDownPicked) {
        this.$store.commit("proposals/downRemoveProposal", this.proposal);
        this.$buefy.notification.open({
          message: `<b>${this.proposal.title}</b> removed from the DownVote Pick List<br />
          <a href="${pickListLink.href}">Open the Vote Pick List</>`,
          type: 'is-primary',
          position: 'is-bottom-right'
        })
      } else {
        if (this.proposal.id === 368984) {
          EventBus.$emit("badEaster", e);
        }
        this.$store.commit("proposals/downAddProposal", this.proposal);
        this.$buefy.notification.open({
          message: `<b>${this.proposal.title}</b> added to the DownVote Pick List<br />
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
  @import 'bulma/sass/utilities/mixins';
  .victor {
    position: fixed;
    z-index: 1000;
    transform: translateX(-50%) translateY(-50%);
    top: 50%;
    left: 50%;
    width: 500px;
    height: 500px;
    pointer-events: none;
  }
  .internal-funded-widget {
    @include desktop {
      top: initial;
      bottom: -30px;
    }
  }
  .proposal-content {
    @include desktop {
      position: relative;
    }
    p {
      white-space: pre-line;
    }
  }
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
