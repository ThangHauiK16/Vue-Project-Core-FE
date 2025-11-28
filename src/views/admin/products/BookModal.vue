<template>
  <div class="modal fade" tabindex="-1" ref="modalRef" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="save">
            <div class="row">
              <div class="col-6">
                <div class="mb-3">
                  <label class="form-label">Mã sách</label>
                  <input type="text" class="form-control" v-model="form.maSach" required maxlength="50" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Tên sách</label>
                  <input type="text" class="form-control" v-model="form.tenSach" required maxlength="200" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Thể loại</label>
                  <input type="text" class="form-control" v-model="form.theLoai" maxlength="100" />
                </div>
              </div>
              <div class="col-6">
                <div class="mb-3">
                  <label class="form-label">Giá nhập</label>
                  <input type="number" class="form-control" v-model="form.giaNhap" min="0" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Giá bán</label>
                  <input type="number" class="form-control" v-model="form.giaBan" min="0" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Tên tác giả</label>
                  <input type="text" class="form-control" v-model="form.tenTacGia" maxlength="100" />
                </div>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Nội dung sách</label>
              <textarea class="form-control" v-model="form.noiDungSach" maxlength="2000"></textarea>
            </div>

            <div class="mb-3">
              <label class="form-label">Chọn hình ảnh</label>
              <input type="file" class="form-control" @change="onFileChange" accept="image/*" />
              <div class="mt-3">
                <img v-if="previewImage" :src="previewImage" alt="Preview"
                     style="max-width:200px; border:1px solid #ccc; padding:5px;" />
              </div>
            </div>
          </form>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
          <button type="button" class="btn btn-primary" @click="save">Lưu</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Modal } from 'bootstrap'
import { getFullImageUrl } from '@/utils/flex'

const props = defineProps({
  modelValue: Object,
  title: String
})
const emit = defineEmits(['update:modelValue', 'saved'])

const modalRef = ref(null)
const modalInstance = ref(null)
const form = ref({})           // dữ liệu nội bộ
const previewImage = ref('')

// Đồng bộ props.modelValue vào form
watch(() => props.modelValue, (newVal) => {
  form.value = { ...newVal }
  previewImage.value = newVal?.imageUrl ? getFullImageUrl(newVal.imageUrl) : ''
}, { immediate: true })

// Show modal
const showModal = () => {
  if (!modalInstance.value && modalRef.value) {
    modalInstance.value = new Modal(modalRef.value)
  }
  modalInstance.value.show()
}

// Save
const save = () => {
  emit('saved', { ...form.value, imageFile: selectedFile.value })
  modalInstance.value.hide()
}

// Xử lý file ảnh
const selectedFile = ref(null)
const onFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    previewImage.value = URL.createObjectURL(file)
  }
}

// Expose hàm cho component cha
defineExpose({ showModal })
</script>
