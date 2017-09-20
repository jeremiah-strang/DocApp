import Vue from 'vue'
import Router from 'vue-router'
import Documents from '@/components/Documents'
import Account from '@/components/Account'
import Dashboard from '@/components/Dashboard'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Documents',
      component: Documents,
    },
    {
      path: '/account',
      name: 'Account',
      component: Account,
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
    },
  ]
})
