<template>
  <div v-if="show">
    <div class="modal fade show" style="display: block;">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
       
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
            <button class="btn-close" @click="$emit('close')"></button>
          </div>

         
          <div class="modal-body">
            <p><strong>Mã Hóa Đơn:</strong> {{ order?.maHoaDon }}</p>
            <p><strong>Ngày Tạo:</strong> {{ formatDate(order?.ngayTao) }}</p>
            <p><strong>Người Tạo:</strong> {{ order?.username }}</p>
            <p><strong>Trạng Thái: </strong> {{ statusToText(order.trangThai) }}</p>

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
                <tr v-for="(item, index) in order?.order_Books || []" :key="index">
                  <td>{{ item.maSach }}</td>
                  <!-- <td>{{ getBookName(item.maSach) }}</td>
                  <td>{{ item.soLuong }}</td>
                  <td>{{ getPrice(item) }}</td> -->
                  <td>{{ item.tenSach }}</td>
                  <td>{{ item.soLuong }}</td>
                  <td>{{ (item.gia * item.soLuong).toLocaleString('vi-VN') }}</td>

                 
                </tr>
                <tr v-if="!order?.order_Books || order.order_Books.length === 0">
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

// const formatDate = (iso) => {
//   if (!iso) return ''
//   return new Date(iso).toLocaleString('vi-VN')
// }

const formatDate = (iso) => {
  if (!iso) return '';

  const d = new Date(iso);
  d.setHours(d.getHours() + 7);

  return d.toLocaleString('vi-VN');
};


// const getBookName = (maSach) => {
//   const book = props.books.find(b => b.maSach === maSach)
//   return book ? book.tenSach : 'Không rõ'
// }

// const getPrice = (item) => {
//   const book = props.books.find(b => b.maSach === item.maSach)
//   return book ? book.giaBan * item.soLuong : 0
// }

// const totalPrice = computed(() => {
//   if (!props.order?.order_Books) return 0
//   return props.order.order_Books.reduce((sum, item) => {
//     const book = props.books.find(b => b.maSach === item.maSach)
//     return sum + (book ? book.giaBan * item.soLuong : 0)
//   }, 0)
// })
const totalPrice = computed(() => {
  if (!props.order?.order_Books) return 0
  return props.order.order_Books.reduce((sum, item) => {
    return sum + (item.gia * item.soLuong)
  }, 0)
})

const statusToText = (status) => {
  switch (status) {
    case "pending": return "Chờ xử lý"
    case "success": return "Đã duyệt"
    case "cancel":  return "Đã huỷ"
    default:        return status
  }
}
</script>
