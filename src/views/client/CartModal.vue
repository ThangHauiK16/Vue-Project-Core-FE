<script setup>
import { computed, watch } from 'vue'
import { useLoginStore } from '@/stores/LoginStore'
import axios from 'axios'
import { getFullImageUrl } from '@/utils/flex'
import { useToast } from 'vue-toastification'

const props = defineProps({ show: Boolean })
const emit = defineEmits(['update:show'])

const loginStore = useLoginStore()
const toast = useToast()


const cartItems = computed(() => loginStore.cartItems || [])


const totalPrice = computed(() =>
  (cartItems.value || []).reduce((acc, item) => {
    const price = Number(item?.giaBan) || 0
    const qty = Number(item?.soLuong) || 0
    return acc + price * qty
  }, 0)
)


const fetchCart = async () => {
  if (!loginStore.user) return
  try {
    const res = await axios.get(`/api/Cart/${loginStore.user.username}`)
    const items = Array.isArray(res.data.items) ? res.data.items : []

    const promises = items.map(i => axios.get(`/api/sach/${i.maSach}`))
    const results = await Promise.all(promises)

    loginStore.cartItems = results.map((r, idx) => ({
      maSach: items[idx].maSach,
      soLuong: items[idx].soLuong,
      tenSach: r.data.tenSach ?? 'Sản phẩm',
      moTa: r.data.moTa ?? '',
      giaBan: Number(r.data.giaBan) || 0,
      imageUrl: r.data.imageUrl ?? ''
    }))

    loginStore.setCartCount(loginStore.cartItems.length)
  } catch (error) {
    console.error(error)
    loginStore.cartItems = []
    loginStore.setCartCount(0)
  }
}


const removeItem = async (maSach) => {
  try {
    await axios.delete(`/api/Cart/remove`, { params: { username: loginStore.user.username, maSach } })
    loginStore.cartItems = loginStore.cartItems.filter(item => item.maSach !== maSach)
    loginStore.setCartCount(loginStore.cartItems.length)
  } catch (error) {
    console.error(error)
    toast.warning('Xóa sản phẩm thất bại!')
  }
}


const increaseQty = async (maSach) => {
  try {
    await axios.post(`/api/Cart/increase`, null, {
      params: { username: loginStore.user.username, maSach }
    })
    const item = loginStore.cartItems.find(i => i.maSach === maSach)
    if (item) item.soLuong++
  } catch (error) {
    console.error(error)
    toast.warning("Tăng số lượng thất bại!")
  }
}


const decreaseQty = async (maSach) => {
  try {
    const item = loginStore.cartItems.find(i => i.maSach === maSach)
    if (!item) return

    if (item.soLuong > 1) {
      await axios.post(`/api/Cart/decrease`, null, {
        params: { username: loginStore.user.username, maSach }
      })
      item.soLuong--
    } else {
      await axios.delete(`/api/Cart/remove`, {
        params: { username: loginStore.user.username, maSach }
      })
      loginStore.cartItems = loginStore.cartItems.filter(i => i.maSach !== maSach)
      loginStore.setCartCount(loginStore.cartItems.length)
    }
  } catch (error) {
    console.error(error)
    toast.warning("Giảm số lượng thất bại!")
  }
}


const checkout = async () => {
  try {
    await axios.post(`/api/Cart/checkout`, null, { params: { username: loginStore.user.username } })
    loginStore.cartItems = []
    loginStore.setCartCount(0)
    closeModal()
    toast.success('Thanh toán thành công!')
  } catch (error) {
    console.error(error)
    toast.warning('Thanh toán thất bại!')
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
              <div class="list-group-item d-flex align-items-center mb-2" 
                   v-for="item in cartItems" :key="item.maSach">

                <img :src="getFullImageUrl(item.imageUrl) || ''" 
                     class="me-3" style="width: 80px; height: 80px; object-fit: cover;">

                <div class="flex-grow-1">
                  <h6>{{ item.tenSach }}</h6>
                  <p>{{ item.moTa }}</p>

                  <div class="d-flex gap-5 align-items-center">
                    <p class="text-danger mt-2">
                      {{ ((item.giaBan || 0) * (item.soLuong || 0)).toLocaleString('vi-VN') }} VNĐ
                    </p>
                    <div class="d-flex align-items-center">
                      <button class="btn btn-sm btn-outline-primary me-2" @click="decreaseQty(item.maSach)">-</button>
                      <span class="fw-bold">{{ item.soLuong || 0 }}</span>
                      <button class="btn btn-sm btn-outline-primary ms-2" @click="increaseQty(item.maSach)">+</button>
                    </div>
                  </div>
                </div>

                <div>
                  <button class="btn btn-sm btn-outline-danger" @click="removeItem(item.maSach)">Xóa</button>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <div class="me-auto fw-bold">
              Tổng: {{ (totalPrice.value || 0).toLocaleString('vi-VN') }} VNĐ
            </div>
            <button class="btn btn-secondary" @click="closeModal">Hủy</button>
            <button class="btn btn-success" @click="checkout">Thanh toán</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show"></div>
  </div>
</template>
