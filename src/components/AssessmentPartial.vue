<template>
  <div class="card mb-4">
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
</template>

<script>

export default {
  props: ['assessment'],
}

</script>

<style lang="scss">
</style>
