import { createRouter, createWebHistory } from 'vue-router'

import ClientLayout from '../layouts/ClientLayout.vue'
import AdminLayout from '../layouts/AdminLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    // CLIENT LAYOUT
    {
      path: '/',
      component: ClientLayout,
      children: [
        {
          path: '',
          redirect: '/login'
        },
        {
          path: 'login',
          name: 'Login',
          component: () => import('../views/auth/Login.vue'),
        },
        {
          path: 'register',
          name: 'Register',
          component: () => import('../views/auth/Register.vue'),
        },
        {
          path: 'home',
          name: 'Home',
          component: () => import('../views/client/Home.vue'),
        },
      ]
    },


    // ADMIN LAYOUT
    {
      path: '/admin',
      component: AdminLayout,
      children: [
        {
          path: 'dashboard',
          name: 'AdminDashboard',
          component: () => import('../views/admin/Dashboard.vue'),
        },
        {
          path: 'users',
          name: 'AdminUsers',
          component: () => import('../views/admin/users/UserList.vue'),
        },
        {
          path: 'products',
          name: 'AdminProducts',
          component: () => import('../views/admin/products/ProductList.vue'),
        },
        {
          path: 'orders',
          name: 'AdminOrders',
          component: () => import('../views/admin/orders/OrderList.vue'),
        },
      ]
    }
  ],
})

export default router
