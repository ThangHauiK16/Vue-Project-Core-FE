<script setup>
import { ref, watch, defineProps, defineEmits, onMounted } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'
import { useProductStore } from '@/stores/ProductStore'
import OrderDetailModal from '@/components/OrderDetailModal.vue'
import { useOrderStore } from '@/stores/OrderStore'


const props = defineProps({
  show: Boolean
})
const emit = defineEmits(['update:show'])

const productStore = useProductStore()
const orderStore = useOrderStore()

const books = ref([])

const orders = ref([])
const loading = ref(false)
const selectedOrder = ref(null)
const showDetail = ref(false)
const toast = useToast()

onMounted(() => {
  loadBook()
})

watch(() => props.show, async (newVal) => {
  if (newVal) {
    
    await productStore.getBooks() 
    await fetchOrders()
  }
})

const fetchOrders = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('accessToken')
    const res = await axios.get('/api/order/history', {
      headers: { Authorization: `Bearer ${token}` }
    })

    
    await productStore.getBooks()
    const booksData = productStore.books

    orders.value = res.data.map(order => {
      let tongTien = 0
      if (order.order_Books) {
        order.order_Books.forEach(item => {
          const book = booksData.find(b => b.maSach === item.maSach)
          if (book) tongTien += book.giaBan * item.soLuong
        })
      }
      return { ...order, tongTien }
    })

  } catch (err) {
    console.error(err)
    toast.error('Lỗi khi lấy lịch sử đơn hàng')
  } finally {
    loading.value = false
  }
}



const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '0 VNĐ';
  return amount.toLocaleString('vi-VN') + ' VNĐ';
}



const openDetail = async (order) => {
  const fullOrder = await orderStore.getOrderById(order.maHoaDon)
  selectedOrder.value = fullOrder
  showDetail.value = true
}

const loadBook = async () => {
  const res = await axios.get('/api/book')
  books.value = res.data
}
const closeModal = () => emit('update:show', false)

const statusToText = (status) => {
  switch (status) {
    case "pending": return "Chờ xử lý"
    case "success": return "Đã duyệt"
    case "cancel":  return "Đã huỷ"
    default:        return status
  }
}

</script>


<template>
  <div v-if="props.show" class="modal fade show" style="display:block; z-index:1050">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Lịch sử đơn hàng</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>

        <div class="modal-body">
          <div v-if="loading">Đang tải...</div>
          <div v-else>
            <div v-if="orders.length === 0">Chưa có đơn hàng nào.</div>
            <div v-else class="list-group">
              <button
                v-for="order in orders"
                :key="order.maHoaDon"
                class="list-group-item list-group-item-action d-flex justify-content-between align-items-center mb-3"
                @click="openDetail(order)">
                <div>
                 Đơn hàng #{{ order.maHoaDon }} - {{ statusToText(order.trangThai) }}
                </div>
                <span class="badge bg-success">
                  Tổng: {{ formatCurrency(order.tongTien) }}
                </span>
              </button>
            </div>
          </div>
        </div>
<!-- {{ new Date(order.ngayTao).toLocaleString() }} -->
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModal">Đóng</button>
        </div>
      </div>
    </div>

    <div class="modal-backdrop fade show" @click="closeModal"></div>

    <OrderDetailModal
      v-model:show="showDetail"
      :order="selectedOrder"
      :books="books"
      title="Chi tiết đơn hàng"
    />
  </div>
</template>

<style scoped>
.modal-backdrop {
  z-index: 1040;
}
.modal-dialog {
  z-index: 1050;
}
</style>