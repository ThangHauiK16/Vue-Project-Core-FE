<script setup>
import { ref } from 'vue'
import { useRegisterStore } from '@/stores/RegisterStore'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const confirmPassword = ref('')

const registerStore = useRegisterStore()
const router = useRouter()

const onSubmit = async (e) => {
  e.preventDefault()
  const success = await registerStore.register(username.value, password.value, confirmPassword.value)
  if (success) {
    setTimeout(() => {
      router.push('/') 
    }, 2000)
  }
}
</script>
<template>
     <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card shadow p-4" style="width: 380px; border-radius: 12px;">
      <h3 class="text-center mb-3">Đăng ký</h3>

      <form @submit="onSubmit">
        <div class="mb-3">
          <label class="form-label">Username</label>
          <input v-model="username" type="text" class="form-control" placeholder="Nhập username..." required />
        </div>

        <div class="mb-3">
          <label class="form-label">Password</label>
          <input v-model="password" type="password" class="form-control" placeholder="Nhập mật khẩu..." required />
        </div>

        <div class="mb-3">
          <label class="form-label">Confirm Password</label>
          <input v-model="confirmPassword" type="password" class="form-control" placeholder="Xác nhận mật khẩu..." required />
        </div>

        <button type="submit" class="btn btn-primary w-100" :disabled="loading">
          <span v-if="!loading">Đăng ký</span>
          <span v-else>Đang xử lý...</span>
        </button>

        <p v-if="error" class="text-danger mt-2">{{ error }}</p>
        <p v-if="success" class="text-success mt-2">{{ success }} Đang chuyển hướng tới login...</p>

        <div class="text-center mt-3">
          <span>Đã có tài khoản?</span>
          <RouterLink to="/" class="text-decoration-none">Đăng nhập</RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>
<style scoped>

</style>        