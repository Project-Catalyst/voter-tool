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
            <div class="mb-6">
              <b-rate size="is-large" v-model="proposal.rating" disabled />
              ~ <b>{{ Math.ceil(proposal.no_assessments / 3) }}</b> {{ $t('proposal.REVIEWS_BY_CA')}}
            </div>
            <div v-for="(avg, question) in avgByQuestion" :key="`avg-${question}`">
              <b-field class="inline" :label="questions[question].title">
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
            @click="handlePickList"
            :icon-left="(isProposalPicked) ? 'thumb-up' : 'thumb-up-outline'"
            type="is-primary-light">
            {{ pickMsg }}
          </b-button>
          <b-button
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
            <video-embed css="video is-16by9" :src="video"></video-embed>
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
    <section class="reviews-list">
      <p class="title is-4">{{ $t('proposal.REVIEWS')}}</p>
      <div class="block mb-6"
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
            <div class="content columns is-multiline"
              v-if="assessment.reply || assessment.pc_fb || (assessment.no_vca >= 4 && (assessment.c_fb / assessment.no_vca) > 0.5)">
              <blockquote class="column is-12">
                <p class="title is-6">{{ $t('proposal.QA') }}</p>
                <div class="block" v-if="assessment.reply">
                  <p>
                    <b>{{ $t('proposal.PROPOSER_REPLY') }}</b><br />
                    {{ assessment.reply }}
                  </p>
                </div>
                <div class="" v-if="assessment.pc_fb">
                  <b-icon
                    type="is-primary"
                    icon="checkbox-marked">
                  </b-icon>
                  {{ $t('proposal.PROPOSER_MARKED_CF') }}
                </div>
                <div class="" v-if="assessment.no_vca >= 4 && (assessment.c_fb / assessment.no_vca) > 0.5">
                  <b-icon
                    type="is-primary"
                    icon="checkbox-marked">
                  </b-icon>
                  {{ assessment.c_fb }} / {{ assessment.no_vca }} {{ $t('proposal.VCA_MARKED_CF') }}
                </div>
              </blockquote>
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

import FundedWidget from '@/components/FundedWidget';

export default {
  data(){
    return {
      questions: questions,
      challenges: [],
      proposal: []
    }
  },

  components: {
    FundedWidget
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
      Object.keys(this.assessmentsByQuestion).forEach((key) => {
        const el = this.assessmentsByQuestion[key]
        let avg = (el.reduce((n, {rating}) => n + rating, 0)) / el.length
        avgs[key] = avg
      })
      return avgs
    },
    pickMsg() {
      return (this.isProposalPicked) ? `Remove from My Upvote Pick List` : `Add to My Upvote Pick List`
    },
    pickDownMsg() {
      return (this.isProposalDownPicked) ? `Remove from My Downvote Pick List` : `Add to My Downvote Pick List`
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
    },
    handleDownPickList() {
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
