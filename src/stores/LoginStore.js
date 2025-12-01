import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'
import {getRoleFromToken} from '@/utils/flex'
export const useLoginStore = defineStore('login', () => {
  const toast = useToast()

  const loading = ref(false)
  const error = ref('')
  const cartCount = ref(0)
  const cartItems = ref([])
  
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

      await fetchCart()

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
   const fetchCart = async () => {
    if (!user.value) return
    try {
      const res = await axios.get(`/api/Cart/${user.value.username}`)
      const items = Array.isArray(res.data.items) ? res.data.items : []

      const promises = items.map(i => axios.get(`/api/sach/${i.maSach}`))
      const results = await Promise.all(promises)

      cartItems.value = results.map((r, idx) => ({
        maSach: items[idx].maSach,
        soLuong: items[idx].soLuong,
        tenSach: r.data.tenSach ?? 'Sản phẩm',
        moTa: r.data.moTa ?? '',
        giaBan: Number(r.data.giaBan) || 0,
        imageUrl: r.data.imageUrl ?? ''
      }))

      setCartCount(cartItems.value.length)
    } catch (err) {
      console.error(err)
      cartItems.value = []
      setCartCount(0)
    }
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    toast.info('Bạn đã đăng xuất')
  }
  const setCartCount = (count) => {
    cartCount.value = count
  }

  return { user, loading, cartItems, error,cartCount, login, logout,setCartCount,fetchCart}
})
