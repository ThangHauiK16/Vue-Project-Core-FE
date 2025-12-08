<script setup>
import { Modal } from 'bootstrap'
import { ref, computed, watch, defineProps, defineEmits, onMounted } from 'vue'
import { useToast } from 'vue-toastification'

const props = defineProps({
  book: Object,
  show: Boolean
})

const emit = defineEmits(['close', 'pay'])

const toast = useToast()
const quantity = ref(1)
const totalPrice = computed(() =>
  props.book ? props.book.giaBan * quantity.value : 0
)

let modalInstance = null

onMounted(() => {
  const modalEl = document.getElementById('orderModal')
  modalInstance = new Modal(modalEl, { backdrop: 'static', keyboard: true })
})

watch(() => props.show, (value) => {
  if (modalInstance) {
    value ? modalInstance.show() : modalInstance.hide()
  }
})

watch(() => props.book, () => {
  quantity.value = 1
})

// const onPay = () => {
//     emit('pay', { book: props.book, quantity: quantity.value })
//     toast.success('Thanh toán thành công!')
// }
const onPay = async () => {
  try {
    const res = await axios.get(`/api/book/${props.book.maSach}`)
    const dbBook = res.data

    if (dbBook.soLuong < quantity.value) {
      toast.error(`Chỉ còn ${dbBook.soLuong} sản phẩm trong kho!`)
      return
    }

    emit('pay', { book: props.book, quantity: quantity.value })
    toast.success('Thanh toán thành công!')
  } catch (err) {
    toast.error('Không kiểm tra được số lượng sản phẩm!')
  }
}

</script>


<template>
  <!-- Bootstrap Modal -->
  <div class="modal fade" id="orderModal" tabindex="-1">
    <div class="modal-dialog modal-md">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title">Chi Tiết Đơn Hàng</h5>
          <button type="button" class="btn-close" @click="emit('close')"></button>
        </div>

        <div class="modal-body" v-if="book">
          <div class="mb-3">
            <label class="form-label">Tên Sách:</label>
            <p>{{ book.tenSach }}</p>
          </div>

          <div class="mb-3">
            <label class="form-label">Giá:</label>
            <p class="text-danger">{{ book.giaBan.toLocaleString('vi-VN') }} VNĐ</p>
          </div>

          <div class="mb-3">
            <label class="form-label">Số lượng:</label>
            <input min="1" type="number" class="form-control" v-model.number="quantity" />
          </div>

          <div class="mb-3">
            <label class="form-label">Tổng tiền:</label>
            <p class="text-success">{{ totalPrice.toLocaleString('vi-VN') }} VNĐ</p>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="emit('close')">Hủy</button>
          <button class="btn btn-primary" @click="onPay">Thanh toán</button>
        </div>

      </div>
    </div>
  </div>
</template>
