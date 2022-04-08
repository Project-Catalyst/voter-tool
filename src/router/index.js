import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Challenge from '../views/Challenge.vue'
import Proposal from '../views/Proposal.vue'
import Picked from '../views/Picked.vue'
import Shared from '../views/Shared.vue'
import Support from '../views/Support.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/support-us',
    name: 'Support',
    component: Support
  },
  {
    path: '/:fund/picked',
    name: 'picked',
    component: Picked
  },
  {
    path: '/:fund/shared/:uuid',
    name: 'shared',
    component: Shared
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
  routes,
  scrollBehavior (to, from, savedPosition) {
    return new Promise((resolve) => {
      if (savedPosition) {
        setTimeout(() => {
          resolve(savedPosition)
        }, 500)
      } else if(to.hash) {
        setTimeout(() => {
          const element = document.getElementById(to.hash.substring("#".length))
          element.scrollIntoView({behavior: "smooth"})
          resolve(true)
        }, 500)
      } else {
        resolve({ x: 0, y: 0 })
      }
    })
  },
})

router.afterEach(() => {
  router.app.$mixpanel.track('view')
})

export default router
