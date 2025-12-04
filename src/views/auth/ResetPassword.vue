<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const message = ref('')
const error = ref('')
const loading = ref(false)

const router = useRouter()

const onSubmit = async (e) => {
  e.preventDefault()
  message.value = ''
  error.value = ''

  if (newPassword.value !== confirmPassword.value) {
    error.value = "Mật khẩu xác nhận không khớp!"
    return
  }

  loading.value = true

  try {
    await axios.post(
      '/api/Auth/change-password',
      {
        oldPassword: oldPassword.value,
        newPassword: newPassword.value
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      }
    )

    message.value = "Đổi mật khẩu thành công! Đang chuyển hướng..."
    setTimeout(() => router.push('/home'), 1500)

  } catch (err) {
    error.value = err.response?.data?.message || "Đổi mật khẩu thất bại!"
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="d-flex justify-content-center align-items-center vh-100">
    <div class="card shadow p-4" style="width: 400px; border-radius: 12px;">
      <h3 class="text-center mb-3">Đổi mật khẩu</h3>

      <form @submit="onSubmit">

        <div class="mb-3">
          <label class="form-label">Mật khẩu cũ</label>
          <input
            v-model="oldPassword"
            type="password"
            class="form-control"
            placeholder="Nhập mật khẩu cũ"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Mật khẩu mới</label>
          <input
            v-model="newPassword"
            type="password"
            class="form-control"
            placeholder="Nhập mật khẩu mới"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Xác nhận mật khẩu</label>
          <input
            v-model="confirmPassword"
            type="password"
            class="form-control"
            placeholder="Nhập lại mật khẩu"
            required
          />
        </div>

        <button class="btn btn-primary w-100" :disabled="loading">
          <span v-if="!loading">Đổi mật khẩu</span>
          <span v-else>Đang xử lý...</span>
        </button>

        <p v-if="message" class="text-success mt-3 text-center">{{ message }}</p>
        <p v-if="error" class="text-danger mt-3 text-center">{{ error }}</p>

      </form>
    </div>
  </div>
</template>
