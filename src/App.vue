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

<style lang="scss">
#app {
}

#nav {
}
</style>
