<template>
  <div class="card">
    <div class="card-content">
      <div class="media">
        <div class="media-content">
          <p class="title is-4">{{author}}</p>
          <p class="subtitle is-6">@johnsmith</p>
        </div>
      </div>
      <div class="content">
        <a @click="openChallenges">Console log Challenges</a>
        <br><a @click="openAllFunds">Console log allFunds</a>
        <br>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec
        iaculis mauris. <a>@bulmaio</a>. <a>#css</a> <a>#responsive</a>
        <br />
        <small>11:09 PM - 1 Jan 2016</small>
      </div>
    </div>
  </div>
</template>

<script>
// import { defineComponent } from '@vue/composition-api'

export default {
  data() {
    return {

    }
  },
  props: ['author', 'challenges', 'allFunds'],
  computed: {

  },
  methods: {
    openChallenges() {
      console.log(this.challenges)
    },
    openAllFunds() {
      console.log(this.allFunds)
    }
  }
}
</script>
