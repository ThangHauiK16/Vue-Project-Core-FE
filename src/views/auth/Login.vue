<script setup>
import { ref } from 'vue'
import { useLoginStore } from '@/stores/LoginStore'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')

const loginStore = useLoginStore()
const router = useRouter()

const onSubmit = async (e) => {
  e.preventDefault()
  const success = await loginStore.login(username.value, password.value)
  if (success) {
   
    if (loginStore.user.role === 'Admin') {
      router.push('/admin/dashboard')
    } else {
      router.push('/home')
    }
  }
}
</script>

<template>
  <div class="d-flex justify-content-center align-items-center vh-100 ">
    <div class="card shadow p-4" style="width: 380px; border-radius: 12px;">
      <h3 class="text-center mb-3">Đăng nhập</h3>

      <form @submit="onSubmit">
        <div class="mb-3">
          <label class="form-label">Username</label>
          <input v-model="username" type="text" class="form-control" placeholder="Nhập username..." />
        </div>

        <div class="mb-3">
          <label class="form-label">Password</label>
          <input v-model="password" type="password" class="form-control" placeholder="Nhập mật khẩu..." />
        </div>

        <button type="submit" class="btn btn-primary w-100" :disabled="loginStore.loading">
          <span v-if="!loginStore.loading">Đăng nhập</span>
          <span v-else>Đang xử lý...</span>
        </button>

        <p v-if="loginStore.error" class="text-danger mt-2">{{ loginStore.error }}</p>

        <div class="text-center mt-3">
          <span>Chưa có tài khoản?</span>
          <RouterLink to="/register" class="text-decoration-none ms-1">Đăng ký</RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
</style>
