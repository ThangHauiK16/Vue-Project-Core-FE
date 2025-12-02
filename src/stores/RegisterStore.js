import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'

export const useRegisterStore = defineStore('register', () => {
  const loading = ref(false)
  const error = ref('')
  const success = ref('')
  const toast = useToast()

  const register = async (username, email, password, confirmPassword) => {
    error.value = ''
    success.value = ''

    // Check confirm password
    if (password !== confirmPassword) {
      error.value = 'Mật khẩu xác nhận không khớp!'
      toast.error(error.value)
      return false
    }

    loading.value = true
    try {
      const res = await axios.post('/api/auth/register', { username, email, password })

      success.value = res.data
      toast.success(success.value)
      return true
    }
    catch (err) {
      const data = err.response?.data

      if (data) {
        // Case: ModelState (object)
        if (typeof data === 'object' && !Array.isArray(data)) {
          let message = ''

          Object.keys(data).forEach(key => {
            message += data[key].join(', ') + '\n'
          })

          error.value = message.trim()
          toast.error(error.value)
        }
        // Case: text error (username exists)
        else {
          error.value = data
          toast.error(error.value)
        }
      } else {
        error.value = 'Đăng ký thất bại. Vui lòng thử lại.'
        toast.error(error.value)
      }

      return false
    }
    finally {
      loading.value = false
    }
  }

  return { loading, error, success, register }
})
