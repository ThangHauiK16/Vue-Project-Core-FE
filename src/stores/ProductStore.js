import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'


export const useProductStore = defineStore('product', () => {
    const toast = useToast()
 


    const books = ref([])
    const loading = ref(false)
    const error = ref('')

    const page = ref(1)
    const pageSize = ref(10)
    const totalItems = ref(0)
    const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value))

    const getBooks = async (p = page.value, k = '', size = pageSize.value) => {
    loading.value = true
    error.value = ''
    try {
        const res = await axios.get('/api/book/page', {
            params: { page: p, pageSize: size, search: k }
        })
        books.value = res.data.items
        totalItems.value = res.data.totalItems
        page.value = res.data.page
        pageSize.value = size
    } catch (err) {
        error.value = err.response?.data?.message || 'Lỗi khi lấy danh sách sách'
        toast.error(error.value)
    } finally {
        loading.value = false
    }
}


    const prevPage = () => {
        if (page.value > 1) getBooks(page.value - 1)
    }

    const nextPage = () => {
        if (page.value < totalPages.value) getBooks(page.value + 1)
    }

    const searchBook = (search) => {
        getBooks(1, search.trim())
    }

    const getToken = () => {
        return localStorage.getItem('accessToken') || ''
    }

    const deleteBook = async (masach) => {
    loading.value = true
    error.value = ''
    try {
      const token = getToken()
      await axios.delete(`/api/book/${masach}`, {
                headers: { 'Authorization': `Bearer ${token}`  }
            })
      toast.success(`Xóa sách ${masach} thành công`)
      await getBooks(page.value) 
    } catch (err) {
      error.value = err.response?.data?.message || 'Lỗi khi xóa sách'
      toast.error(error.value)
    } finally {
      loading.value = false
    }
  }

    const addBook = async (bookData) => {
        loading.value = true
        try {
            const formData = new FormData()
            for (const key in bookData) {
                if (bookData[key] !== undefined && bookData[key] !== null) {
                    formData.append(key, bookData[key])
                }
            }
            const token = getToken()
            await axios.post('/api/book', formData, {
                headers: { 'Content-Type': 'multipart/form-data',  'Authorization': `Bearer ${token}`  }
            })
            toast.success(`Thêm sách thành công`)
            await getBooks(page.value)
        } catch (err) {
            error.value = err.response?.data?.message || 'Lỗi khi thêm sách'
            toast.error(error.value)
        } finally {
            loading.value = false
        }
    }

    const updateBook = async (bookData) => {
        if (!bookData.maSach) return
        loading.value = true
        try {
            const formData = new FormData()
            for (const key in bookData) {
                if (bookData[key] !== undefined && bookData[key] !== null) {
                    formData.append(key, bookData[key])
                }
            }
            const token = getToken()
            await axios.put(`/api/book/${bookData.maSach}`, formData, {
               headers: { 'Content-Type': 'multipart/form-data',  'Authorization': `Bearer ${token}`  }
            })
            toast.success(`Cập nhật sách thành công`)
            getBooks(page.value)
        } catch (err) {
            error.value = err.response?.data?.message || 'Lỗi khi cập nhật sách'
            toast.error(error.value)
        } finally {
            loading.value = false
        }
    }

    async function filterByPrice(page, category, sortPrice, pageSize = 8) {
        const res = await axios.get("/api/book/sort", {
            params: { page, pageSize, category, sortPrice }
        });

        books.value = res.data.items;
        totalPages.value = res.data.totalPages;
    }

    const downloadTemplate = async () => {
        try {
            const res = await axios.get('/api/book/download-template', {
            responseType: 'blob'
            })

            const blob = new Blob([res.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            })

            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'Book_Import_Template.xlsx'
            a.click()
            window.URL.revokeObjectURL(url)

            toast.success('Đã tải file Excel mẫu')
        } catch (err) {
            toast.error('Không thể tải file mẫu')
        }
    }

    const importExcel = async (file) => {
        if (!file) return

        loading.value = true
        try {
            const formData = new FormData()
            formData.append('file', file)

            const token = getToken()

            await axios.post('/api/book/import-excel', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
            })

            toast.success('Import Excel thành công')
            await getBooks(1)
        } catch (err) {
            toast.error(err.response?.data?.message || 'Import Excel thất bại')
        } finally {
            loading.value = false
        }
    }



    return {
        books,
        loading,
        error,
        page,
        pageSize,
        totalItems,
        totalPages,
        getBooks,
        searchBook,
        prevPage,
        nextPage,
        deleteBook,
        addBook,
        updateBook,
        filterByPrice,
        downloadTemplate,
        importExcel
    }
})
