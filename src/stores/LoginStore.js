import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'

export const useLoginStore = defineStore('login', () => {
  const toast = useToast()

  let storedUser = null
  try {
    const tmp = localStorage.getItem('user')
    storedUser = tmp ? JSON.parse(tmp) : null
  } catch (e) {
    storedUser = null
  }

  const user = ref(storedUser)
  const loading = ref(false)
  const error = ref('')

  const login = async (username, password) => {
    loading.value = true
    error.value = ''
    try {
      const res = await axios.post('/api/auth/login', { username, password })
      
      user.value = { username: res.data.username }
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(user.value))
      
      toast.success(`Chào mừng ${user.value.username}! Đăng nhập thành công.`)
      return true
    } catch (err) {
      error.value = err.response?.data || 'Đăng nhập thất bại'
      toast.error(error.value)
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    toast.info('Bạn đã đăng xuất')
  }

  return { user, loading, error, login, logout }
})
