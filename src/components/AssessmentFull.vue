<template>
  <div class="card mb-4">
     <div class="card-header">
      <b-button
        tag="a"
        icon-left="link"
        type="mb-2"
        target="blank"
        @click="copyLink(assessment.id)"
      >
        {{ $t("proposal.LINK") }}
      </b-button>
      <div v-bind:id="assessment.id" class="transparent-text">{{assessment.id}}</div>
    </div>
    <div class="card-content">
      <div class="content columns">
        <div class="column">
          <b v-if="isChallengeSetting">{{ $t(questions[4].full) }}</b>
          <b v-if="!isChallengeSetting">{{ $t(questions[1].full) }}</b>
          <p>{{ assessment.q0 }}</p>
        </div>
        <div class="column is-narrow">
          <b-rate v-model="assessment.q0r" disabled />
        </div>
      </div>
      <div class="content columns">
        <div class="column">
          <b v-if="isChallengeSetting">{{ $t(questions[5].full) }}</b>
          <b v-if="!isChallengeSetting">{{ $t(questions[2].full) }}</b>
          <p>{{ assessment.q1 }}</p>
        </div>
        <div class="column is-narrow">
          <b-rate v-model="assessment.q1r" disabled />
        </div>
      </div>
      <div class="content columns">
        <div class="column">
          <b v-if="isChallengeSetting">{{ $t(questions[6].full) }}</b>
          <b v-if="!isChallengeSetting">{{ $t(questions[3].full) }}</b>
          <p>{{ assessment.q2 }}</p>
        </div>
        <div class="column is-narrow">
          <b-rate v-model="assessment.q2r" disabled />
        </div>
      </div>
      <div class="content columns is-multiline"
        v-if="assessment.reply || assessment.vca_o">
        <blockquote class="column is-12">
          <p class="title is-6">{{ $t('proposal.QA') }}</p>
          <div class="block" v-if="assessment.reply">
            <p>
              <b>{{ $t('proposal.PROPOSER_REPLY') }}</b><br />
              {{ assessment.reply }}
            </p>
          </div>
          <div class="" v-if="assessment.vca_o">
            <span v-if="assessment.vca_o == 1">
              <b-icon
                type="is-primary"
                icon="checkbox-marked">
              </b-icon>
              {{ $t('proposal.VCA_GOOD') }} ({{ $tc('proposal.VCA_GROUP', assessment.no_vca) }}) <a class="is-size-7" @click="details = !details">[{{ $t('proposal.DETAILS') }}]</a>
            </span>
            <span v-if="assessment.vca_o == 2">
              <b-icon
                type="is-success"
                icon="checkbox-marked">
              </b-icon>
              {{ $t('proposal.VCA_EXCELLENT') }} ({{ $tc('proposal.VCA_GROUP', assessment.no_vca) }}) <a class="is-size-7" @click="details = !details">[{{ $t('proposal.DETAILS') }}]</a>
            </span>
            <div class="content" v-if="details">
              <p class="mt-4 mb-1"><b>QA Details</b></p>
              <p class="mb-1">
                <b-icon
                  type="is-success"
                  icon="checkbox-marked">
                </b-icon>&nbsp;
                <b>{{assessment.ne}} / {{assessment.no_vca}}</b> {{ $t('proposal.RATED_EXCELLENT') }}
              </p>
              <p class="mb-1">
                <b-icon
                  type="is-primary"
                  icon="checkbox-marked">
                </b-icon>&nbsp;
                <b>{{assessment.ng}} / {{assessment.no_vca}}</b> {{ $t('proposal.RATED_GOOD') }}
              </p>
              <p class="mb-1">
                <b-icon
                  type="is-warning"
                  icon="checkbox-marked">
                </b-icon>&nbsp;
                <b>{{assessment.nfo}} / {{assessment.no_vca}}</b> {{ $t('proposal.RATED_FILTERED_OUT') }}
              </p>
            </div>
          </div>
        </blockquote>
      </div>
    </div>
  </div>
</template>

<script>

import questions from "@/assets/data/questions.json";

export default {
  data(){
    return {
      questions: questions,
      details: false
    }
  },
  methods: {
    copyLink(assessmentId) {
      const linkUrl = `${window.location.origin}/#${this.$route.path}#${assessmentId}`
      navigator.clipboard.writeText(linkUrl)
      this.$buefy.toast.open('copied assessment url')
    }
  },
  props: ['assessment', 'isChallengeSetting'],
}

</script>

<style lang="scss" scoped>
p {
  white-space: pre-line;
}
</style>
