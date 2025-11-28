<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import { getFullImageUrl } from '@/utils/flex'

const props = defineProps({
  show: Boolean,
  book: Object
})

const emit = defineEmits(["close"])


const previewImage = computed(() => {
  if (!props.book?.imageUrl) return ''
  return getFullImageUrl(props.book.imageUrl)
})


const formatCurrency = (value) => {
  if (typeof value !== "number") return value
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}
</script>

<template>
  <div v-if="show">
    <div class="modal fade show" style="display: block;">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">Thông tin sách</h5>
            <button class="btn-close" @click="emit('close')"></button>
          </div>

          <div class="modal-body">
            <div class="row">
              <div class="col-md-4 text-center">
                <img v-if="previewImage" :src="previewImage" alt="Hình sách"
                     style="max-width: 100%; border: 1px solid #ccc; border-radius: 5px;" />
                <div v-else>Chưa có hình</div>
              </div>
              <div class="col-md-8">
                <table class="table table-borderless">
                  <tbody>
                    <tr>
                      <th scope="row">Mã sách</th>
                      <td>{{ book.maSach }}</td>
                    </tr>
                    <tr>
                      <th scope="row">Tên sách</th>
                      <td>{{ book.tenSach }}</td>
                    </tr>
                    <tr>
                      <th scope="row">Thể loại</th>
                      <td>{{ book.theLoai }}</td>
                    </tr>
                    <tr>
                      <th scope="row">Tác giả</th>
                      <td>{{ book.tenTacGia }}</td>
                    </tr>
                    <tr>
                      <th scope="row">Giá nhập</th>
                      <td>{{ formatCurrency(book.giaNhap) }}</td>
                    </tr>
                    <tr>
                      <th scope="row">Giá bán</th>
                      <td>{{ formatCurrency(book.giaBan) }}</td>
                    </tr>
                    <tr>
                      <th scope="row">Nội dung</th>
                      <td>{{ book.noiDungSach }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" @click="emit('close')">Đóng</button>
          </div>

        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show"></div>
  </div>
</template>
