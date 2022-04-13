<template>
  <div id="app">
    <b-navbar class="is-primary" :mobile-burger="true">
      <template #brand>
        <b-navbar-item tag="router-link" :to="{ name: 'Home' }">
          <img src="@/assets/images/catalyst.png" alt="Project Catalyst" />
        </b-navbar-item>
      </template>
      <template #end>
        <b-navbar-dropdown :label="langs[$i18n.locale]" v-if="Object.keys(langs).length > 1">
          <b-navbar-item
            @click="changeLocale(lang)"
            v-for="(name, lang) in langs"
            :key="`lang-${lang}`">
            {{ name }}
          </b-navbar-item>
        </b-navbar-dropdown>
        <b-navbar-item tag="a" target="_blank" href="https://github.com/Project-Catalyst/voter-tool/tree/master/public/data">
          {{ $t('general.RAW_DATA') }}
        </b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ name: 'Support' }">
          {{ $t('general.SUPPORT') }}
        </b-navbar-item>
        <!--
        <b-navbar-item tag="a" target="_blank" href="https://bit.ly/Fund7-Voting-Open">
          {{ $t('general.VOTING_GUIDE') }}
        </b-navbar-item>
        -->
        <b-navbar-item tag="router-link" :to="{ name: 'Home' }">
          {{ $t('general.CHALLENGE_PICKER') }}
        </b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ name: 'picked', params: {fund: 'f7'}}">
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
        <p>{{$t('general.MADE_BY')}}</p>
        <p><img class="aim-logo" src="@/assets/images/aim-logo.png" alt="Cardano AIM" /></p>
        <p class="is-size-4 has-text-weight-bold">
          <a href="https://cardanoscan.io/pool/b61f05ec1e907ab9b069eaec6c664056c16f56cab59076109c66d2ae" target="_blank">
            Stake with [AIM] pool
          </a>
        </p>
        <p class="icons">
          <a href="https://github.com/Project-Catalyst/ca-tool" target="_blank">
            <b-icon icon="github" size="small" />
          </a>
          <a href="https://twitter.com/AimCardano" target="_blank">
            <b-icon icon="twitter" size="small" />
          </a>
          <a href="https://t.me/joinchat/Ivl50eWG7r0zODI1" target="_blank">
            <b-icon icon="telegram" size="small" />
          </a>
        </p>
        <b-button
          :label="$t('general.FEEDBACK')"
          type="is-primary"
          icon-left="message-reply-text"
          tag="a"
          target="_blank"
          href="https://docs.google.com/forms/d/e/1FAIpQLSeOszOgMfmUmD3EpLxsznkhMGsR1BmpNZnEOcB7Na6zz4NDug/viewform">
        </b-button>
      </div>
    </footer>
  </div>
</template>

<script>

import langs from "@/locales/locales";
export default {
  data(){
    return {
      challenges: [],
      badEasterEgg: [],
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
    },
    activateBadEaster(e) {
      this.badEasterEgg.push({
        x: e.pageX,
        y: e.pageY
      })
      setTimeout(()=>{
        this.badEasterEgg = []
      }, 10000);
    }
  },
  created() {
    this.$i18n.locale = this.$store.state.user.locale
    this.$store.commit('proposals/updateVersion')
  }
}
</script>

<style lang="scss">
body {
  overflow-x: hidden;
}
.is-ellipsis {
  display: inline-block;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}

.transparent-text {
  color: rgba(0, 0, 0, 0.0);
}

#app {
  position: relative;
}

.aim-logo {
  width: 150px;
}


.floating-button {
  position: fixed;
  bottom: 20px;
  left: 20px;
  width: 180px;
  cursor: pointer;
  z-index: 10;
}

.floating-mobile-button {
  position: fixed;
  bottom: 10px;
  left: 20px;
  cursor: pointer;
  z-index: 10;
  .card-image {
    .image {
      img {
        max-width: 320px !important;
      }
    }
  }
}

  .glass {
    position: absolute;
    z-index: 1000;
    background: url('./assets/images/glass.png');
    width: 768px;
    height: 1098px;
    transform: translateX(-57%) translateY(-43%);
    pointer-events: none;
  }
  .special-button {
    height: 3.5em !important;
  }
</style>
