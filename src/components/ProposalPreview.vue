<template>
  <div class="card mb-4"  :key="proposal.id">
    <router-link :to="{ name: 'proposal', params: {
        fund: fund,
        challenge: proposal.category,
        id: proposal.id
      }}">
    <div class="card-content">
      <div class="content">
        <p class="subtitle is-4">
          {{ proposal.title }}
        </p>
        <p>{{ proposal.description }}</p>
        <p><b>Funds requested:</b> ${{ proposal.amount }}</p>
        <b-rate v-model="proposal.rating" disabled /> ~ {{ Math.ceil(proposal.no_assessments / 3) }} reviews by Community Advisors
      </div>
    </div>
    </router-link>
  </div>
</template>

<script>

export default {
  props: ['proposal', 'fund']
}

</script>
