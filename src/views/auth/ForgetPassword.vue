<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const email = ref('')
const loading = ref(false)
const message = ref('')
const error = ref('')

const router = useRouter()

const onSubmit = async (e) => {
  e.preventDefault()
  message.value = ''
  error.value = ''
  loading.value = true

  try {
    const res = await axios.post('/api/Auth/forgot-password', {
      email: email.value
    })

    message.value = 'Vui lòng kiểm tra email để đặt lại mật khẩu!'
  } catch (err) {
    error.value = err.response?.data?.message || 'Có lỗi xảy ra!'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="d-flex justify-content-center align-items-center vh-100">
    <div class="card shadow p-4" style="width: 400px; border-radius: 12px;">
      <h3 class="text-center mb-3">Quên mật khẩu</h3>

      <form @submit="onSubmit">
        <div class="mb-3">
          <label class="form-label">Nhập email</label>
          <input
            v-model="email"
            type="email"
            class="form-control"
            placeholder="example@gmail.com"
            required
          />
        </div>

        <button type="submit" class="btn btn-primary w-100" :disabled="loading">
          <span v-if="!loading">Gửi yêu cầu</span>
          <span v-else>Đang xử lý...</span>
        </button>

       
        <p v-if="message" class="text-success mt-3 text-center">{{ message }}</p>

       
        <p v-if="error" class="text-danger mt-3 text-center">{{ error }}</p>

        <div class="text-center mt-3">
          <RouterLink to="/login" class="text-decoration-none">Quay lại đăng nhập</RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
</style>
