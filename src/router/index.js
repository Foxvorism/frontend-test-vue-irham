import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Work',
      component: () => import('@/views/WorkView.vue'),
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('@/views/AboutView.vue'),
    },
    {
      path: '/services',
      name: 'Services',
      component: () => import('@/views/ServicesView.vue'),
    },
    {
      path: '/ideas',
      name: 'Ideas',
      component: () => import('@/views/IdeasView.vue'),
    },
    {
      path: '/careers',
      name: 'Careers',
      component: () => import('@/views/CareersView.vue'),
    },
    {
      path: '/contact',
      name: 'Contact',
      component: () => import('@/views/ContactView.vue'),
    },
  ],
})

export default router
