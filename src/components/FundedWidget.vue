<template>
  <div class="card funded-card" v-if="proposal.funded > 0">
    <div class='card-content has-text-centered'>
      <p class="subtitle is-4 mb-1">
        {{ fundedText }}
      </p>
      <b-icon
        v-if="proposal.funded === 2"
        icon="trophy"
        size="is-large">
      </b-icon>
      <div class="">
        <div class="is-flex is-align-items-center is-justify-content-space-between">
          <b-icon
            class="mr-3"
            icon="thumb-up"
            size="is-small"
            type="is-success">
          </b-icon>
          <div class="is-flex-grow-1  has-text-right">
            {{ proposal.upvotes | currency_ada}}
          </div>
        </div>
        <div class="is-flex is-align-items-center">
          <b-icon
            class="mr-3"
            icon="thumb-down"
            size="is-small"
            type="is-danger">
          </b-icon>
          <div class="is-flex-grow-1 has-text-right">
            {{ proposal.downvotes | currency_ada}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: ['proposal', 'fund'],
  computed: {
    fundedText() {
      if (this.proposal.funded === 2) {
        return this.$t('proposal.FUNDED')
      } else if (this.proposal.funded === 1) {
        return this.$t('proposal.OVER_BUDGET')
      } else {
        return this.$t('proposal.NOT_FUNDED')
      }
    }
  }
}

</script>

<style lang="scss">
  @import 'bulma/sass/utilities/mixins';
  .funded-card {
    @include desktop {
      position: absolute !important;
      top: -30px;
      right: -30px;
    }
  }
</style>
