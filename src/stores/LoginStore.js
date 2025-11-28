import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'
import {getRoleFromToken} from '@/utils/flex'
export const useLoginStore = defineStore('login', () => {
  const toast = useToast()

  const loading = ref(false)
  const error = ref('')

  
  const storedUser = localStorage.getItem('user')
  const user = ref(storedUser ? JSON.parse(storedUser) : null)

  

  const login = async (username, password) => {
    loading.value = true
    error.value = ''
    try {
      const res = await axios.post('/api/auth/login', { username, password })
      const token = res.data.token

      const role = getRoleFromToken(token)

     
      user.value = {
        username: res.data.username,
        role: role
      }

      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user.value))

      toast.success(`Chào mừng ${user.value.username}! Đăng nhập thành công.`)
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Đăng nhập thất bại'
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
