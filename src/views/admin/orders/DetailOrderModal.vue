<template>
  <div v-if="show">
    <div class="modal fade show" style="display: block;">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
            <button class="btn-close" @click="$emit('close')"></button>
          </div>

          <!-- Modal Body -->
          <div class="modal-body">
            <p><strong>Mã Hóa Đơn:</strong> {{ order?.maHoaDon }}</p>
            <p><strong>Ngày Tạo:</strong> {{ formatDate(order?.ngayTao) }}</p>
            <p><strong>Người Tạo:</strong> {{ order?.username }}</p>

            <h5 class="mt-4">Sản Phẩm:</h5>
            <table class="table table-bordered table-sm">
              <thead>
                <tr>
                  <th>Mã Sách</th>
                  <th>Tên Sách</th>
                  <th>Số Lượng</th>
                  <th>Giá Thành (VNĐ)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in order?.hoaDon_Saches || []" :key="index">
                  <td>{{ item.maSach }}</td>
                  <td>{{ getBookName(item.maSach) }}</td>
                  <td>{{ item.soLuong }}</td>
                  <td>{{ getPrice(item) }}</td>
                </tr>
                <tr v-if="!order?.hoaDon_Saches || order.hoaDon_Saches.length === 0">
                  <td colspan="4" class="text-center">Không có sản phẩm nào.</td>
                </tr>
              </tbody>
            </table>

            <div class="d-flex justify-content-end mt-2">
              <h5>
                <strong>Tổng tiền: </strong>
                <span class="text-success">{{ totalPrice.toLocaleString('vi-VN') }} VNĐ</span>
              </h5>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="$emit('close')">Đóng</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  show: Boolean,
  order: Object,
  books: Array,
  title: String
})
const emit = defineEmits(['close'])

const formatDate = (iso) => {
  if (!iso) return ''
  return new Date(iso).toLocaleString('vi-VN')
}

const getBookName = (maSach) => {
  const book = props.books.find(b => b.maSach === maSach)
  return book ? book.tenSach : 'Không rõ'
}

const getPrice = (item) => {
  const book = props.books.find(b => b.maSach === item.maSach)
  return book ? book.giaBan * item.soLuong : 0
}

const totalPrice = computed(() => {
  if (!props.order?.hoaDon_Saches) return 0
  return props.order.hoaDon_Saches.reduce((sum, item) => {
    const book = props.books.find(b => b.maSach === item.maSach)
    return sum + (book ? book.giaBan * item.soLuong : 0)
  }, 0)
})
</script>
