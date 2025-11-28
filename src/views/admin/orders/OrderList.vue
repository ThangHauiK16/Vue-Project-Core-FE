<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios' 
import Swal from 'sweetalert2'
import { useOrderStore } from '@/stores/OrderStore'
import OrderModal from './OrderModal.vue'
import DetailOrderModal from './DetailOrderModal.vue'
const orderStore = useOrderStore()
const search = ref("")

const showModal = ref(false)
const modalTitle = ref("Thêm hóa đơn")
const selectedOrder = ref(null)

const books = ref([])

onMounted(() => {
  orderStore.getOrders()
  loadBook()
})
const searchOrder = () =>{
  orderStore.searchOrder(search.value)
}
const confirmDelete = (order) => {
  Swal.fire({
    title: `Bạn có chắc muốn xóa ${order.maHoaDon}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy'
  }).then((result) => {
    if (result.isConfirmed) {
      orderStore.deleteOrder(order.maHoaDon)
    }
  })
}
// const openAddModal = () => {
//   modalTitle.value = "Thêm hoá đơn"
//   selectedOrder.value = null
//   showModal.value = true
// }
const openEditModal = async (order) => {
  modalTitle.value = "Cập nhật hoá đơn"

  const fullOrder = await orderStore.getOrderById(order.maHoaDon)
  selectedOrder.value = fullOrder

  showModal.value = true
}
const getUserName = () => {
  const user = localStorage.getItem('user')
  if (!user) return ''
  return JSON.parse(user).username
}

const saveOrder = async (form) => {
  const ngayTaoIso = new Date(form.ngayTao).toISOString()

  const payload = {
    ngayTao: ngayTaoIso,
    hoaDon_Saches: form.details,
    username:  getUserName()
  }

  if (selectedOrder.value === null) {
    await orderStore.createOrder(payload)
  } else {
    await orderStore.updateOrder(selectedOrder.value.maHoaDon, payload)
  }

  showModal.value = false
}
const showDetailModal = ref(false)

const openDetailModal = async (order) => {
  const fullOrder = await orderStore.getOrderById(order.maHoaDon)
  selectedOrder.value = fullOrder
  showDetailModal.value = true
}

const loadBook = async () => {
  const res = await axios.get('/api/sach')
  books.value = res.data
}
</script>

<template>
  <div>
   
    <div class="d-flex justify-content-between">
      <!-- <button class="btn btn-success mb-2"  @click="openAddModal">Add Order</button> -->
      <h2>Quản lý hoá đơn</h2>
      <div class="input-group input-group-sm mb-2" style="max-width: 350px;">
        <input type="text" class="form-control" placeholder="Nhập mã hoá đơn hoặc tên người đặt"
               v-model="search" @keyup.enter="searchOrder">
        <button class="btn btn-outline-secondary" type="button" @click="searchOrder">
          Tìm Kiếm
        </button>
      </div>
    </div>

    <table class="table table-bordered">
      <thead>
        <tr>
          <th>STT</th>
          <th>Mã hoá đơn</th>
          <th>Ngày tạo</th>
          <th class="text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(o, index) in orderStore.orders" :key="o.maHoaDon">
          <td>{{ (orderStore.page - 1) * orderStore.pageSize + index + 1 }}</td>
          <td @dblclick="openDetailModal(o)" style="cursor: pointer;">
            {{ o.maHoaDon }}
          </td>
          <td>{{ o.ngayTao }}</td>
          <td class="text-center align-middle">
            <button class="btn btn-sm btn-primary me-3 ms-3" @click="openEditModal(o)">Edit</button>
            <button class="btn btn-sm btn-danger" @click="confirmDelete(o)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="d-flex justify-content-between align-items-center mt-2">
      <div class="d-flex gap-1">
        <button class="btn btn-primary" @click="orderStore.prevPage" 
                :disabled="orderStore.page === 1"><<</button>
        <button class="btn btn-primary" @click="orderStore.nextPage" 
                :disabled="orderStore.page === orderStore.totalPages">>></button>
      </div>
      <span>Trang {{ orderStore.page }} / {{ orderStore.totalPages }}</span>
    </div>
  
    <OrderModal
      :show="showModal"
      :title="modalTitle"
      :order="selectedOrder"
      :books="books"
      @close="showModal = false"
      @save="saveOrder"
    />
    <DetailOrderModal
      :show="showDetailModal"
      :title="'Chi tiết hoá đơn ' + (selectedOrder?.maHoaDon || '')"
      :order="selectedOrder"
      :books="books"
      @close="showDetailModal = false"
   />

  </div>
</template>
