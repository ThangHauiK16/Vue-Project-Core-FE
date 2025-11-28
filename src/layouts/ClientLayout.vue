<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useLoginStore } from '@/stores/LoginStore'

const loginStore = useLoginStore()
const router = useRouter()

const handleLogout = () => {
  loginStore.logout()
  router.push('/')
}
</script>

<template>
  <header class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
    <div class="container">
      <RouterLink to="/" class="navbar-brand fw-bold text-primary">Book Store</RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">

          <li v-if="!loginStore.user" class="nav-item">
            <RouterLink to="/" class="nav-link">Login</RouterLink>
          </li>
          <li v-if="!loginStore.user" class="nav-item">
            <RouterLink to="/register" class="nav-link">Register</RouterLink>
          </li>

          <li v-if="loginStore.user" class="nav-item me-3">
            <span class="nav-link">Xin chào {{ loginStore.user.username }}</span>
          </li>

          <li v-if="loginStore.user" class="nav-item">
            <RouterLink to="/dashboard" class="nav-link">Dashboard</RouterLink>
          </li>

          <li v-if="loginStore.user" class="nav-item">
            <a href="#" class="nav-link" @click.prevent="handleLogout">Logout</a>
          </li>

        </ul>
      </div>
    </div>
  </header>

  <main class="container py-4">
    <RouterView />
  </main>
</template>
