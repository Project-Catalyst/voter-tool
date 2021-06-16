<template>
  <div id="app">
    <b-navbar class="is-primary" :mobile-burger="true">
      <template #brand>
        <b-navbar-item tag="router-link" :to="{ name: 'Home' }">
          <img src="@/assets/images/catalyst.png" alt="Project Catalyst" />
        </b-navbar-item>
      </template>
      <template #end>
        <b-navbar-item @click="scrollToSupport">
          Support us
        </b-navbar-item>
        <b-navbar-item tag="a" target="_blank" href="https://www.reddit.com/r/cardano/comments/nqt6u0/all_you_need_to_know_fund4_voting/">
          Voting Guide
        </b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ name: 'Home' }">
          Challenge Picker
        </b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ name: 'picked', params: {fund: 'f4'}}">
          My Vote Pick List
        </b-navbar-item>
      </template>
    </b-navbar>
    <div class="section container">
      <b-message title="Warning" type="is-warning" aria-close-label="Close message">
        IMPORTANT!: The tool does not cast votes, use the official voting app. This is a non-official community made tool: all the info presented is not supported by IOHK, if you find an error please report it to us using <a href="https://forms.gle/ongBz2k8NfiosFz69" target="_blank">this form</a>!
      </b-message>
      <div class="content-wrapper">
        <router-view/>
      </div>
    </div>
    <div class="hero has-background-light" ref="supportus">
      <div class="section container is-flex is-justify-content-center support-us">
        <a href="https://www.drunkendragon.games/community-tools/" target="_blank">
          <img src="@/assets/images/support.png" alt="Support us with CNFTs" />
          <img class="hover" src="@/assets/images/support-hover.png" alt="Support us with CNFTs" />
        </a>
      </div>
    </div>
    <footer class="footer">
      <div class="content has-text-centered">
        <p>Made by Catalyst Community for the Catalyst Community</p>
        <p class="has-text-weight-bold">
          If you want to support the development of the voter tool you can donate some ADA to:
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
          label="Feedback"
          type="is-primary"
          icon-left="message-reply-text"
          tag="a"
          target="_blank"
          href="https://forms.gle/7R79GhM2vpoGyFfa9">
        </b-button>
      </div>
    </footer>
    <div class="floating-button is-hidden-mobile" @click="scrollToSupport">
      <img src="@/assets/images/support-button.png" alt="Support us with CNFTs" />
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      challenges: []
    }
  },

  methods: {
    copy() {
      this.$clipboard('addr1q9hh7nqmantwkd5upsamc6p54ckseksmngh858ng788hwfa99jp2g3s20g7k2hvj6rtl00l647hxvw3a5a84m3mzzlmqvartlu')
      this.$buefy.notification.open({
        message: "Address copied to clipboard!",
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
    }
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

.floating-button {
  position: fixed;
  bottom: 20px;
  left: 20px;
  width: 180px;
  cursor: pointer;
  z-index: 10;
}

</style>
