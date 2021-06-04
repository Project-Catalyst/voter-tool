<template>
  <div class="columns is-multiline">
    <div class="column is-4"
      v-for="challenge in challenges"
      :key="challenge.id">
      <div class="card is-primary">
        <router-link :to="{ name: 'challenge', params: {
          fund: 'f4',
          challenge: challenge.id
          }}">
        <div class="card-content">
          <div class="content">
            <p class="title is-4">
              {{ challenge.title }}
            </p>
            <p>{{ challenge.description }}</p>
            <p><b>Funds:</b> ${{ challenge.amount }}</p>
          </div>
        </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import CatalystAPI from '@/api/catalyst.js';

export default {
  data(){
    return {
      challenges: []
    }
  },

  mounted(){
    CatalystAPI.challenges('f4').then((r) => {
      this.challenges = r.data
    })
  }
}
</script>
