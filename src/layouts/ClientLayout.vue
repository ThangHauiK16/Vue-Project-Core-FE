<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useLoginStore } from '@/stores/LoginStore'
import { ref } from 'vue'
import CartModal from '@/views/client/CartModal.vue'
import OrderHistoryModal from '@/views/client/OrderHistoryModal.vue' 
import { useToast } from 'vue-toastification'
import ChangePasswordModal from "@/components/ChangePasswordModal.vue"

const showPasswordModal = ref(false)


const loginStore = useLoginStore()
const router = useRouter()
const showCartModal = ref(false)
const showOrderHistory = ref(false)
const toast = useToast()


const handleLogout = () => {
  loginStore.logout()
  router.push('/')
}

const openCart = () => {
  if (!loginStore.user) {
    toast.warning('Bạn cần đăng nhập để xem giỏ hàng!')
    return
  }
  showCartModal.value = true
}
const openOrderHistory = () => {
  if (!loginStore.user) {
    toast.warning('Bạn cần đăng nhập để xem lịch sử đơn hàng!')
    return
  }
  showOrderHistory.value = true
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
         <!-- <li v-if="loginStore.user" class="nav-item">
          <RouterLink to="/resetpassword" class="text-decoration-none ms-1">Đổi mật khẩu</RouterLink>
        </li> -->
         <li v-if="loginStore.user" class="nav-item">
         <button class="btn text-primary" @click="showPasswordModal = true">
            Đổi mật khẩu
        </button>

        </li>
        <li v-if="loginStore.user" class="nav-item me-3">
          <button @click="openOrderHistory" class="btn text-primary">
            Lịch sử đơn hàng
          </button>
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

<footer class="bg-light text-dark mt-5 py-4 border-top">
  <div class="container">
    <div class="row">

      <!-- Cột 1 -->
      <div class="col-md-4 mb-3">
        <h5 class="fw-bold text-primary">Book Store</h5>
        <p class="small">
          Nền tảng mua sách trực tuyến nhanh chóng - tiện lợi - giá tốt.
          Cung cấp hàng ngàn đầu sách đa dạng cho mọi đối tượng.
        </p>
      </div>

      <!-- Cột 2 -->
      <div class="col-md-4 mb-3">
        <h5 class="fw-bold">Liên hệ</h5>
        <ul class="list-unstyled small">
          <li>📍 Hà Nội - Việt Nam</li>
          <li>📞 0123 456 789</li>
          <li>📧 support@bookstore.com</li>
        </ul>
      </div>

      <!-- Cột 3 -->
      <div class="col-md-4 mb-3">
        <h5 class="fw-bold">Theo dõi chúng tôi</h5>
        <div class="d-flex gap-2 fs-4">
          <a href="#" class="text-primary"><i class="bi bi-facebook"></i></a>
          <a href="#" class="text-danger"><i class="bi bi-instagram"></i></a>
          <a href="#" class="text-info"><i class="bi bi-twitter"></i></a>
          <a href="#" class="text-dark"><i class="bi bi-tiktok"></i></a>
        </div>
      </div>

    </div>

    <div class="text-center mt-3 small text-muted">
      © 2025 Book Store. All rights reserved.
    </div>
  </div>
</footer>

<CartModal v-model:show="showCartModal" />
<OrderHistoryModal v-model:show="showOrderHistory" />
<ChangePasswordModal
  :show="showPasswordModal"
  @close="showPasswordModal = false"
  @updated="() => toast.success('Mật khẩu đã được cập nhật!')"
/>


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
footer a {
  text-decoration: none;
}

footer a:hover {
  opacity: 0.7;
}

footer .bi {
  transition: 0.3s;
}

footer .bi:hover {
  transform: scale(1.15);
}

</style>
