<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useLoginStore } from '@/stores/LoginStore'
import { ref } from 'vue'
import CartModal from '@/views/client/CartModal.vue'

const loginStore = useLoginStore()
const router = useRouter()
const showCartModal = ref(false)

const handleLogout = () => {
  loginStore.logout()
  router.push('/')
}

const openCart = () => {
  if (!loginStore.user) {
    alert('Bạn cần đăng nhập để xem giỏ hàng!')
    return
  }
  showCartModal.value = true
}
</script>

<template>
<header class="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm">
  <div class="container-fluid">
    <RouterLink to="/home" class="navbar-brand fw-bold text-primary">Book Store</RouterLink>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ms-auto align-items-center">
        <li v-if="!loginStore.user" class="nav-item">
          <RouterLink to="/" class="nav-link logout-link">Login</RouterLink>
        </li>
        <li v-if="!loginStore.user" class="nav-item">
          <RouterLink to="/register" class="nav-link logout-link">Register</RouterLink>
        </li>

        <li v-if="loginStore.user" class="nav-item me-3">
          <span class="nav-link">Xin chào {{ loginStore.user.username }}</span>
        </li>

        <li v-if="loginStore.user" class="nav-item me-3">
          <button @click="openCart" class="btn  position-relative">
            🛒
            <span v-if="loginStore.cartCount > 0" class="badge bg-danger position-absolute top-0 start-100 translate-middle">
              {{ loginStore.cartCount }}
            </span>
          </button>
        </li>

        <li v-if="loginStore.user" class="nav-item">
          <a href="#" class="nav-link logout-link" @click.prevent="handleLogout">Logout</a>
        </li>
      </ul>
    </div>
  </div>
</header>

<main class="py-4">
  <RouterView />
</main>

<!-- Modal Giỏ hàng -->
<CartModal v-model:show="showCartModal" />
</template>

<style scoped>
.logout-link {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  color: #0d6efd;
  text-decoration: none;
  border: 1px solid transparent;
  border-radius: 0.375rem;
  transition: all 0.3s ease;
}
.logout-link:hover {
  background-color: #0d6efd;
  color: #fff;
  border-color: #0d6efd;
  cursor: pointer;
}
</style>
