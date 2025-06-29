import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Projects from '../views/Projects.vue'
import Dependencies from '../views/Dependencies.vue'
import Security from '../views/Security.vue'
import Analytics from '../views/Analytics.vue'
import Settings from '../views/Settings.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/projects',
      name: 'Projects',
      component: Projects
    },
    {
      path: '/dependencies',
      name: 'Dependencies',
      component: Dependencies
    },
    {
      path: '/security',
      name: 'Security',
      component: Security
    },
    {
      path: '/analytics',
      name: 'Analytics',
      component: Analytics
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings
    }
  ]
})

export default router