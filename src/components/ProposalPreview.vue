<template>
  <div class="card mb-4"  :key="proposal.id">
    <router-link :to="{ name: 'proposal', params: {
        fund: fund,
        challenge: proposal.category,
        id: proposal.id
      }}">
    <div class="card-content">
      <div class="content">
        <p class="subtitle is-4 mb-1">
          {{ proposal.title }}
        </p>
        <p class="subtitle is-6 mb-4">
          {{ proposal.author }}
        </p>
        <p>{{ proposal.description }}</p>
        <p><b>Funds requested:</b> {{ proposal.amount | currency}}</p>
        <b-rate v-model="proposal.rating" disabled /> ~ {{ Math.ceil(proposal.no_assessments / 3) }} reviews by Community Advisors
      </div>
    </div>
    </router-link>
    <funded-widget :proposal="proposal" :fund="fund" />
  </div>
</template>

<script>

import FundedWidget from '@/components/FundedWidget';

export default {
  props: ['proposal', 'fund'],
  components: {
    FundedWidget
  }
}

</script>
