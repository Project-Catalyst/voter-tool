<template>
  <div>
    <div class="box is-size-5 content">
      <p class="title is-3">{{ $t('support.SUPPORT_US') }}</p>
      <div class="is-4" v-html="$t('support.SUPPORT_TEXT')" />
      <p class="has-text-weight-bold is-flex is-justify-content-center">
        <span class="is-size-4 is-s-ellipsis">
          addr1q9hh7nqmantwkd5upsamc6p54ckseksmngh858ng788hwfa99jp2g3s20g7k2hvj6rtl00l647hxvw3a5a84m3mzzlmqvartlu
        </span>
        <b-button
          @click="copy"
          type="is-primary"
          icon-left="content-copy">
        </b-button>
      </p>
      <div v-html="$t('support.SUPPORT_TEXT_3')" />
      <p>&nbsp;</p>
    </div>
  </div>
</template>

<script>

export default {
  methods: {
    copy() {
      this.$clipboard('addr1q9hh7nqmantwkd5upsamc6p54ckseksmngh858ng788hwfa99jp2g3s20g7k2hvj6rtl00l647hxvw3a5a84m3mzzlmqvartlu')
      this.$buefy.notification.open({
        message: this.$t('general.ADDRESS_COPIED'),
        type: 'is-primary',
        position: 'is-bottom-right'
      })
    },
  },
}
</script>

<style lang="scss">
.support-us {
  position: relative;
  a, a:visited {
    position: relative;
    z-index: 1;
  }
  .hover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    opacity: 0;
    transition: opacity .3s ease-in-out;
  }
  &:hover {
    .hover {
      opacity: 1;
    }
  }
}
.is-s-ellipsis {
  display: inline-block;
  max-width: 500px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}
</style>
