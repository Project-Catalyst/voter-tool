<template>
  <div>
    <div class="box is-size-5 content">
      <p class="title is-2 has-text-centered">{{ $t('support.SUPPORT_US') }}</p>
      <div class="is-4 mb-6" v-html="$t('support.MYSTERIOUS_TEXT')" />
      <div class="is-flex is-justify-content-center mb-6 mt-6">
        <b-button
          @click="buy"
          type="is-primary"
          size="is-large">
          {{ $t('support.BUY_MYSTERIOUS_BOX') }}
        </b-button>
      </div>
      <div class="mysterious-box-image is-flex is-justify-content-center mb-2">
        <img src="@/assets/images/MysteriousBox-low.jpg" />
      </div>
      <p class="is-size-7 has-text-centered">Policy:<br /><a class="is-b-ellipsis" href="https://pool.pm/policy/4a2eb4fe8421164aaba78987258d7bcf96128b86dd2ad2fc13b75be6" target="_blank">4a2eb4fe8421164aaba78987258d7bcf96128b86dd2ad2fc13b75be6</a></p>
      <div class="is-flex is-justify-content-center mb-6 mt-6">
        <b-button
          @click="buy"
          type="is-primary"
          size="is-large">
          {{ $t('support.BUY_MYSTERIOUS_BOX') }}
        </b-button>
      </div>
      <p class="title is-3">AIM</p>
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
    <b-modal
      v-model="buyPopup"
      has-modal-card
      trap-focus
      :destroy-on-hide="false"
      aria-role="dialog"
      :aria-label="$t('support.BUY_MYSTERIOUS_BOX')"
      aria-modal>
      <template #default="props">
        <div class="modal-card" style="width: auto">
          <header class="modal-card-head">
            <p class="modal-card-title">{{ $t('support.BUY_MYSTERIOUS_BOX') }}</p>
            <button
                type="button"
                class="delete"
                @click="props.close"/>
          </header>
          <section class="modal-card-body">
            <div class="is-size-5 mb-6" v-html="$t('support.BUY_MYSTERIOUS_TEXT')" />
            <p class="has-text-weight-bold is-flex is-justify-content-center mb-6">
              <span class="is-size-4 is-b-ellipsis">
                addr1v92ths3660262p4fxdtfulksxthyk8zjyl8pf3yh5uj3p8cfa80rt
              </span>
            <b-button
              @click="copyBuyAddress"
              type="is-primary"
              icon-left="content-copy">
            </b-button>
            </p>
            <div class="is-4 mb-6" v-html="$t('support.BUY_MYSTERIOUS_TEXT_2')" />
          </section>
          <footer class="modal-card-foot">
            <b-button
              @click="copyBuyAddress"
              :label="$t('support.COPY_ADDRESS')"

              type="is-primary" />
          </footer>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>

export default {
  data() {
    return {
      buyPopup: false
    }
  },
  methods: {
    copyBuyAddress() {
      this.$clipboard('addr1v92ths3660262p4fxdtfulksxthyk8zjyl8pf3yh5uj3p8cfa80rt')
      this.$buefy.notification.open({
        message: this.$t('general.ADDRESS_COPIED'),
        type: 'is-primary',
        position: 'is-bottom-right'
      })
    },
    buy() {
      this.buyPopup = true
    },
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

.is-b-ellipsis {
  display: inline-block;
  max-width: 730px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}
</style>
