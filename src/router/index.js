import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Challenge from '../views/Challenge.vue'
import Proposal from '../views/Proposal.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/fund/:fund/challenge/:challenge',
    name: 'challenge',
    component: Challenge
  },
  {
    path: '/fund/:fund/challenge/:challenge/proposals/:id',
    name: 'proposal',
    component: Proposal
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
