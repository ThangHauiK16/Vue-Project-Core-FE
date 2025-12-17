import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'

export const useUserStore = defineStore('user', () => {
  const toast = useToast()

  const users = ref([])
  const loading = ref(false)
  const error = ref('')
  const token = localStorage.getItem("accessToken");

  const page = ref(1)
  const pageSize = ref(10)
  const totalItems = ref(0)
  const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value))

  const getUsers = async (p = page.value, k = '',size = pageSize.value) => {
  loading.value = true
  error.value = ''
  try {
    const res = await axios.get('/api/user', {
      params: { page: p, pageSize: size, keyword: k }
    })
    users.value = res.data.items
    totalItems.value = res.data.totalItems
    page.value = res.data.page
    pageSize.value = size
  } catch (err) {
    error.value = err.response?.data?.message || 'Lỗi khi lấy danh sách người dùng'
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}

  const deleteUser = async (username) => {
    loading.value = true
    error.value = ''
    try {
      await axios.delete(`/api/user/${username}` ,  {
              headers: {
                Authorization: `Bearer ${token}`
              }
          })
      toast.success(`Xóa user ${username} thành công`)
      getUsers(page.value) 
    } catch (err) {
      error.value = err.response?.data?.message || 'Lỗi khi xóa người dùng'
      toast.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const prevPage = () => {
    if (page.value > 1) getUsers(page.value - 1)
  }

  const nextPage = () => {
    if (page.value < totalPages.value) getUsers(page.value + 1)
  }

  const updateUser = async (username , data) => {
    loading.value = true 
    error.value = ''
    try {
        await axios.put(`/api/user/${username}` , data ,  {
              headers: {
                Authorization: `Bearer ${token}`
              }
          })
        toast.success(`Cập nhật user ${username} thành công`)
        await getUsers(page.value) 
    } catch (error) {
        error.value = error.response?.data?.message || 'Lỗi khi cập nhật người dùng'
        toast.error(error.value)
    }finally{
        loading.value = false
    }
  }

const searchUser = (keyword) => {
  getUsers(1, keyword.trim())
}

const exportExcel = async (keyword = '') => {
  try {
    const res = await axios.get('/api/user/export-excel', {
      params: { keyword },
      responseType: 'blob', 
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const blob = new Blob([res.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Users_${new Date().toISOString().slice(0,19)}.xlsx`
    link.click()

    window.URL.revokeObjectURL(url)

    toast.success('Xuất Excel thành công')
  } catch (err) {
    error.value = err.response?.data?.message || 'Lỗi khi xuất Excel'
    toast.error(error.value)
  }
}

  return {
    users,
    loading,
    error,
    page,
    pageSize,
    totalItems,
    totalPages,
    getUsers,
    deleteUser,
    prevPage,
    nextPage,
    updateUser,
    searchUser,
    exportExcel
  }
})
