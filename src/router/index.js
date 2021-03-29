import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/home'
import Sign from '@/pages/start/Sign'
import Login from '@/pages/start/Login'
import App from '@/pages/App'
import Push from '@/pages/Push'
import Out from '@/pages/Out'
import Bigclass from '@/pages/Bigclass'
import Smallclass from '@/pages/Smallclass'
import Supplier from '@/pages/Supplier'
import User from '@/pages/User'
import StockManage from '@/pages/StockManage'
import Report from '@/pages/Report'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/sign'
    },
    {
      path: '/sign',
      name: 'Sign',
      component: Sign
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/app',
      name: 'App',
      component: App,
      children: [
        {
          path: '/',
          redirect: '/home'
        },
        {
          path: '/home',
          name: 'Home',
          component: Home
        },
        {
          path: '/out',
          name: 'Out',
          component: Out
        },
        {
          path: '/push',
          name: 'Push',
          component: Push
        },
        {
          path: '/bigclass',
          name: 'Bigclass',
          component: Bigclass
        },
        {
          path: '/smallclass',
          name: 'smallclass',
          component: Smallclass
        },
        {
          path: '/supplier',
          name: 'Supplier',
          component: Supplier
        },
        {
          path: '/user',
          name: 'User',
          component: User
        },
        {
          path: '/stockManage',
          name: 'StockManage',
          component: StockManage
        },
        {
          path: '/report',
          name: 'Report',
          component: Report
        },
      ]
    },
  ]
})
