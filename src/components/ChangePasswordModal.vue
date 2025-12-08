<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'

const props = defineProps({
  show: Boolean
})
const emit = defineEmits(['close', 'updated'])

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const message = ref('')
const error = ref('')
const loading = ref(false)


const reset = () => {
  oldPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  message.value = ''
  error.value = ''
  loading.value = false
}


watch(() => props.show, (val) => {
  if (val) {
    message.value = ''
    error.value = ''
    loading.value = false
  } else {
    reset()
  }
})

const submitChange = async () => {
  message.value = ''
  error.value = ''

  if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
    error.value = 'Vui lòng điền đủ các trường.'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Mật khẩu xác nhận không khớp!'
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
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      }
    )
    error.value = ''
    message.value = 'Đổi mật khẩu thành công!'

   
    emit('updated')

    /
    setTimeout(() => {
      emit('close')
     
      reset()
    }, 1000)

  } catch (err) {
    message.value = ''
    error.value = err?.response?.data?.message || 'Đổi mật khẩu thất bại!'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="show" class="modal-backdrop-custom">
    <div class="modal-custom">
      <h4 class="text-center mb-3">Đổi mật khẩu</h4>

      <div class="mb-2">
        <label>Mật khẩu cũ</label>
        <input v-model="oldPassword" type="password" class="form-control" />
      </div>

      <div class="mb-2">
        <label>Mật khẩu mới</label>
        <input v-model="newPassword" type="password" class="form-control" />
      </div>

      <div class="mb-2">
        <label>Xác nhận mật khẩu</label>
        <input v-model="confirmPassword" type="password" class="form-control" />
      </div>

      <p v-if="message" class="text-success text-center mt-2">{{ message }}</p>
      <p v-if="error" class="text-danger text-center mt-2">{{ error }}</p>

      <div class="d-flex gap-2 mt-3">
        <button class="btn btn-secondary w-50" @click="() => { emit('close'); reset(); }" :disabled="loading">
          Đóng
        </button>

        <button class="btn btn-primary w-50" @click="submitChange" :disabled="loading">
          <span v-if="!loading">Lưu</span>
          <span v-else>Đang xử lý...</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}
.modal-custom {
  background: white;
  padding: 20px;
  width: 400px;
  border-radius: 12px;
}
</style>
