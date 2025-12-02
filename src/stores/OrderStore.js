import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'

export const useOrderStore = defineStore('order', () => {
    const toast = useToast()

    const orders = ref([])
    const orderDetail = ref(null)  

    const loading = ref(false)
    const error = ref('')

    const page = ref(1)
    const pageSize = ref(5)
    const totalItems = ref(0)
    const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value))

    // ===================== LOAD LIST ======================
    const getOrders = async (p = page.value, k = '') => {
        loading.value = true
        error.value = ''
        try {
            const res = await axios.get('/api/hoadon/paged', {
                params: { page: p, pageSize: pageSize.value, search: k }
            })
            orders.value = res.data.items
            totalItems.value = res.data.totalItems
            page.value = res.data.page
        } catch (err) {
            error.value = err.response?.data?.message || 'Lỗi khi lấy danh sách hoá đơn'
            toast.error(error.value)
        } finally {
            loading.value = false
        }
    }

    const prevPage = () => {
        if (page.value > 1) getOrders(page.value - 1)
    }

    const nextPage = () => {
        if (page.value < totalPages.value) getOrders(page.value + 1)
    }

    const searchOrder = (keyword) => {
        getOrders(1, keyword.trim())
    }

  
    const getOrderById = async (id) => {
        loading.value = true
        try {
            const res = await axios.get(`/api/hoadon/${id}`)
            orderDetail.value = res.data
            return res.data
        } catch (err) {
            toast.error("Không tìm thấy hoá đơn")
            return null
        } finally {
            loading.value = false
        }
    }

    
    const createOrder = async (data) => {
        loading.value = true
        try {
            await axios.post('/api/hoadon', data)
            toast.success("Thêm hoá đơn thành công")
            await getOrders(page.value)
        } catch (err) {
            toast.error(err.response?.data?.message || "Lỗi khi thêm hoá đơn")
        } finally {
            loading.value = false
        }
    }

    
    const updateOrder = async (id, data) => {
        loading.value = true
        try {
            await axios.put(`/api/hoadon/${id}`, data)
            toast.success("Cập nhật hoá đơn thành công")
            await getOrders(page.value)
        } catch (err) {
            toast.error(err.response?.data?.message || "Lỗi khi cập nhật hoá đơn")
        } finally {
            loading.value = false
        }
    }

    
    const deleteOrder = async (id) => {
        loading.value = true
        try {
            await axios.delete(`/api/hoadon/${id}`)
            toast.success("Xoá hoá đơn thành công")
            await getOrders(page.value)
        } catch (err) {
            toast.error(err.response?.data?.message || "Lỗi khi xóa hoá đơn")
        } finally {
            loading.value = false
        }
    }
   
    const approveOrder = async (id) => {
        try {
            await axios.put(`/api/hoadon/${id}/approve`)
            toast.success("Duyệt hoá đơn thành công")
            await getOrders(page.value)
        } catch (err) {
            toast.error(err.response?.data?.message || "Lỗi khi duyệt hoá đơn")
        }
    }


    const cancelOrder = async (id) => {
        try {
            await axios.put(`/api/hoadon/${id}/cancel`)
            toast.success("Huỷ hoá đơn thành công")
            await getOrders(page.value)
        } catch (err) {
            toast.error(err.response?.data?.message || "Lỗi khi huỷ hoá đơn")
        }
    }


    return {
        orders,
        orderDetail,

        loading,
        error,

        page,
        pageSize,
        totalItems,
        totalPages,

        getOrders,
        prevPage,
        nextPage,
        searchOrder,

        getOrderById,
        createOrder,
        updateOrder,
        deleteOrder,

        approveOrder,
        cancelOrder

    }
})
