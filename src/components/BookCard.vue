
<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue'
import { getFullImageUrl, getRoleFromToken } from '@/utils/flex'
import { useToast } from 'vue-toastification'
import axios from 'axios'
import { useLoginStore } from '@/stores/LoginStore'  

const loginStore = useLoginStore()  

const props = defineProps({ book: Object })
const emit = defineEmits(['order', 'add-to-cart'])
const toast = useToast()

const quantity = ref(1)
const totalPrice = computed(() => props.book ? props.book.giaBan * quantity.value : 0)

const onOrder = () => {
  const token = localStorage.getItem('accessToken')
  const role = getRoleFromToken(token)
  if (role !== 'Customer') {
    toast.warning('Chỉ khách hàng mới có thể đặt hàng!')
    return
  }
  emit('order', props.book)
}

const onAddToCart = async () => {
  const token = localStorage.getItem('accessToken')
  const username = token ? JSON.parse(atob(token.split('.')[1])).unique_name : null
  if (!username) {
    toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng!')
    return
  }

  try {
    await axios.post(`/api/Cart/add`, null, {
      params: { username, maSach: props.book.maSach, soLuong: quantity.value }
    })
    
    const existingItem = loginStore.cartItems.find(i => i.maSach === props.book.maSach)
    if (existingItem) {
      existingItem.soLuong += quantity.value
    } else {
      loginStore.cartItems.push({
        maSach: props.book.maSach,
        soLuong: quantity.value,
        tenSach: props.book.tenSach,
        moTa: props.book.moTa,
        giaBan: props.book.giaBan,
        imageUrl: props.book.imageUrl
      })
    }
    loginStore.cartCount = loginStore.cartItems.length
    toast.success('Đã thêm vào giỏ hàng!')
    emit('add-to-cart', props.book)
  } catch (error) {
    console.error(error)
    toast.error('Thêm vào giỏ hàng thất bại!')
  }
}
</script>

<template>
<div class="col-md-3 mb-4" v-if="book">
  <div class="card h-100">
    <img :src="getFullImageUrl(book.imageUrl)" :alt="book.tenSach" class="card-img-top" style="object-fit: contain; height: 300px;">
    <div class="card-body text-center">
      <div class="card-title fw-semibold" style="height:2rem;">{{ book.tenSach }}</div>
      <div class="card-text text-danger">{{ book.giaBan.toLocaleString('vi-VN') }} VNĐ</div>
      <div class="d-flex justify-content-center gap-2 mt-2">
        <button class="btn btn-success btn-sm" @click="onOrder">Thanh toán</button>
        <button class="btn btn-primary btn-sm" @click="onAddToCart">Thêm vào giỏ hàng</button>
      </div>
    </div>
  </div>
</div>
</template>
