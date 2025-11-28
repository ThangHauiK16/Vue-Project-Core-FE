<script setup>
import { ref, watch, computed } from 'vue'
import { useLoginStore } from '@/stores/LoginStore'
import axios from 'axios'
import { getFullImageUrl } from '@/utils/flex'

const props = defineProps({ show: Boolean })
const emit = defineEmits(['update:show'])

const loginStore = useLoginStore()
const cartItems = ref([])

// Tính tổng giá trị giỏ hàng
const totalPrice = computed(() =>
  cartItems.value.reduce((acc, item) => {
    const price = Number(item?.giaBan) || 0
    const qty = Number(item?.soLuong) || 0
    return acc + price * qty
  }, 0)
)

// Lấy giỏ hàng từ backend
const fetchCart = async () => {
  if (!loginStore.user) return
  try {
    const res = await axios.get(`/api/Cart/${loginStore.user.username}`)
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
    
    loginStore.setCartCount(cartItems.value.length)
  } catch (error) {
    console.error(error)
    cartItems.value = []
    loginStore.setCartCount(0)
  }
}

// Xóa sản phẩm
const removeItem = async (maSach) => {
  try {
    await axios.delete(`/api/Cart/remove`, { params: { username: loginStore.user.username, maSach } })
    cartItems.value = cartItems.value.filter(item => item.maSach !== maSach)
    loginStore.setCartCount(cartItems.value.length)
  } catch (error) {
    console.error(error)
    alert('Xóa sản phẩm thất bại!')
  }
}

// Thanh toán
const checkout = async () => {
  try {
    await axios.post(`/api/Cart/checkout`, null, { params: { username: loginStore.user.username } })
    cartItems.value = []
    loginStore.setCartCount(0)
    closeModal()
    alert('Thanh toán thành công!')
  } catch (error) {
    console.error(error)
    alert('Thanh toán thất bại!')
  }
}

const closeModal = () => emit('update:show', false)

watch(() => props.show, (val) => {
  if (val) fetchCart()
})
</script>

<template>
<div v-if="props.show">
  <div class="modal fade show" style="display: block;">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Giỏ hàng của bạn</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <div v-if="!cartItems || cartItems.length === 0" class="text-center text-muted">
            Giỏ hàng trống
          </div>
          <div v-else class="list-group">
            <div class="list-group-item d-flex align-items-center mb-2" v-for="item in cartItems" :key="item.maSach">
              <img :src="getFullImageUrl(item.imageUrl) || ''" alt="" class="me-3" style="width: 80px; height: 80px; object-fit: cover;">
              <div class="flex-grow-1">
                <h6>{{ item.tenSach || '' }}</h6>
                <p class="mb-1">{{ item.moTa || '' }}</p>
                <p class="text-danger">{{ (item.giaBan || 0).toLocaleString('vi-VN') }} VNĐ x {{ item.soLuong || 0 }}</p>
              </div>
              <div>
                <button class="btn btn-sm btn-outline-danger" @click="removeItem(item.maSach)">Xóa</button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div class="me-auto fw-bold">Tổng: {{ (totalPrice.value || 0).toLocaleString('vi-VN') }} VNĐ</div>
          <button class="btn btn-secondary" @click="closeModal">Hủy</button>
          <button class="btn btn-success" @click="checkout">Thanh toán</button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show"></div>
</div>
</template>
