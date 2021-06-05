<template>
  <div id="app">
    <b-navbar class="is-primary" :mobile-burger="false">
      <template #brand>
        <b-navbar-item tag="router-link" :to="{ name: 'Home' }">
          <img src="@/assets/images/catalyst.png" alt="Project Catalyst" />
        </b-navbar-item>
      </template>
      <template #end>
        <b-navbar-dropdown label="Voter Tool">
          <b-navbar-item tag="router-link" :to="{ name: 'picked', params: {fund: 'f4'}}">
            F4 Picked Proposals
          </b-navbar-item>
        </b-navbar-dropdown>
      </template>
    </b-navbar>
    <div class="section container">
      <div class="content-wrapper">
        <router-view/>
      </div>
    </div>
    <footer class="footer">
      <div class="content has-text-centered">
        <p>Made by Catalyst Community for the Catalyst Community</p>
        <p>
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
          href="#">
        </b-button>
      </div>
    </footer>
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
</style>
