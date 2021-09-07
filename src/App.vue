<template>
  <div id="app">
    <b-navbar class="is-primary" :mobile-burger="true">
      <template #brand>
        <b-navbar-item tag="router-link" :to="{ name: 'Home' }">
          <img src="@/assets/images/catalyst.png" alt="Project Catalyst" />
        </b-navbar-item>
      </template>
      <template #end>
        <b-navbar-dropdown :label="langs[$i18n.locale]" v-if="langs.length > 1">
          <b-navbar-item
            @click="changeLocale(lang)"
            v-for="(name, lang) in langs"
            :key="`lang-${lang}`">
            {{ name }}
          </b-navbar-item>
        </b-navbar-dropdown>
        <b-navbar-item tag="router-link" :to="{ name: 'Support' }">
          {{ $t('general.SUPPORT') }}
        </b-navbar-item>
        <b-navbar-item tag="a" target="_blank" href="https://www.reddit.com/r/cardano/comments/ofo1bz/fund_5_register_to_vote_all_you_need_to_know/">
          {{ $t('general.VOTING_GUIDE') }}
        </b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ name: 'Home' }">
          {{ $t('general.CHALLENGE_PICKER') }}
        </b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ name: 'picked', params: {fund: 'f5'}}">
          {{ $t('general.MY_VOTE_PICK_LIST') }}
        </b-navbar-item>
      </template>
    </b-navbar>
    <div class="section container">
      <b-message :title="$t('general.WARNING')" type="is-warning" aria-close-label="Close message">
        <span v-html="$t('general.WARNING_MESSAGE')" />
      </b-message>
      <div class="content-wrapper">
        <router-view/>
      </div>
    </div>
    <footer class="footer">
      <div class="content has-text-centered">
        <p>{{$t('general.MADE_BY')}}</p>
        <p class="has-text-weight-bold">
          {{$t('general.DONATE')}}
          <br />
          <span class="is-ellipsis">
            addr1q9hh7nqmantwkd5upsamc6p54ckseksmngh858ng788hwfa99jp2g3s20g7k2hvj6rtl00l647hxvw3a5a84m3mzzlmqvartlu
          </span>
          <b-button
            @click="copy"
            type="is-primary"
            size="is-small"
            icon-left="content-copy">
          </b-button>
        </p>
        <b-button
          :label="$t('general.FEEDBACK')"
          type="is-primary"
          icon-left="message-reply-text"
          tag="a"
          target="_blank"
          href="https://forms.gle/7R79GhM2vpoGyFfa9">
        </b-button>
      </div>
    </footer>
    <div class="floating-button is-hidden-mobile">
      <b-button
        tag="router-link"
        :to="{ name: 'Support' }"
        type="is-primary" size="is-medium">{{$t('support.SUPPORT_US')}}</b-button>
    </div>
  </div>
</template>

<script>

import langs from "@/locales/locales";
export default {
  data(){
    return {
      challenges: [],
      langs: langs
    }
  },

  methods: {
    copy() {
      this.$clipboard('addr1q9hh7nqmantwkd5upsamc6p54ckseksmngh858ng788hwfa99jp2g3s20g7k2hvj6rtl00l647hxvw3a5a84m3mzzlmqvartlu')
      this.$buefy.notification.open({
        message: this.$t('general.ADDRESS_COPIED'),
        type: 'is-primary',
        position: 'is-bottom-right'
      })
    },
    scrollToSupport() {
      var element = this.$refs.supportus;
      var top = element.offsetTop;
      if (window.innerWidth < 768) {
        top = top - 176;
      }
      window.scrollTo({
        left:0,
        top: top,
        behavior: 'smooth'
      });
    },
    changeLocale(locale) {
      this.$store.commit('user/setLocale', locale)
      this.$i18n.locale = locale
      this.$router.go()
    }
  },
  created() {
    this.$i18n.locale = this.$store.state.user.locale
    this.$store.commit('proposals/updateVersion')
  }
}
</script>

<style lang="scss">
.is-ellipsis {
  display: inline-block;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}

#nav {
}


.floating-button {
  position: fixed;
  bottom: 20px;
  left: 20px;
  width: 180px;
  cursor: pointer;
  z-index: 10;
}

</style>
