<!-- <template>
  <div v-if="show" class="modal-backdrop">
    <div class="modal-content">
      <h4 class="text-center">{{ book.tenSach }}</h4>

      <div class="text-center">
        <img :src="getFullImageUrl(book.imageUrl)" style="width:180px"></img>
      </div>

      <p class="mt-3">{{ book.noiDungSach }}</p>

      <h5 class="text-danger mt-2 text-center">{{ book.giaBan.toLocaleString('vi-VN') }} VNĐ</h5>

      <button class="btn btn-secondary mt-3" @click="$emit('close')">
        Đóng
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { getFullImageUrl } from '@/utils/flex'

defineProps({
  book: Object,
  show: Boolean
})
</script>

<style>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display:flex;
  justify-content:center;
  align-items:center;
  z-index: 9999;
}
.modal-content {
  background:white;
  padding:20px;
  border-radius:12px;
  width:450px;
  max-width:90%;
}
</style> -->
<script setup>
import { defineProps, defineEmits, computed } from "vue"
import { getFullImageUrl } from "@/utils/flex"

const props = defineProps({
  show: Boolean,
  book: Object
})

const emit = defineEmits(["close"])

const previewImage = computed(() => {
  if (!props.book?.imageUrl) return ""
  return getFullImageUrl(props.book.imageUrl)
})

const formatCurrency = (value) => {
  if (typeof value !== "number") return value
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value)
}
</script>

<template>
  <div v-if="show">
    <div class="modal fade show" style="display: block;">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">

          <!-- Header -->
          <div class="modal-header">
            <h5 class="modal-title">{{ book.tenSach }}</h5>
            <button type="button" class="btn-close" @click="emit('close')"></button>
          </div>

          <!-- Body -->
          <div class="modal-body">
            <div class="row">
              <!-- Hình sách -->
              <div class="col-md-4 text-center">
                <img 
                  v-if="previewImage"
                  :src="previewImage" 
                  alt="Hình sách" 
                  class="img-fluid border rounded" 
                  style="max-height: 300px;"
                />
                <div v-else>Chưa có hình</div>
              </div>

              <!-- Thông tin chi tiết -->
              <div class="col-md-8">
                <table class="table table-borderless">
                  <tbody>
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
                      <th scope="row">Giá </th>
                      <td class="text-danger">{{ formatCurrency(book.giaBan) }}</td>
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

          <!-- Footer -->
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="emit('close')">Đóng</button>
          </div>

        </div>
      </div>
    </div>

    <!-- Backdrop -->
    <div class="modal-backdrop fade show"></div>
  </div>
</template>

<style scoped>
.modal-body {
  max-height: 70vh;
  overflow-y: auto;
}
</style>
