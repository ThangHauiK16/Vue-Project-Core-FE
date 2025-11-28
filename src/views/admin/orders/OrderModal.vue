<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  books: Array,
  order: Object,       
  title: String        
})

const emit = defineEmits(["close", "save"])

const form = ref({
  ngayTao: "",
  details: []
})


watch(() => props.show, (val) => {
  if (val) {
    if (props.order) {
    
     form.value = {
        ngayTao: props.order.ngayTao,
        details: props.order.hoaDon_Saches
            ? JSON.parse(JSON.stringify(props.order.hoaDon_Saches))
            : []
        }

    } else {
     
      form.value = {
        ngayTao: "",
        details: []
      }
    }
  }
})

const addBook = () => {
  form.value.details.push({ maSach: "", soLuong: 1 })
}

const removeBook = (index) => {
  form.value.details.splice(index, 1)
}


const saveOrder = () => {
  emit("save", form.value)
}
</script>

<template>
  <div v-if="show">
    <div class="modal fade show" style="display: block;">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
            <button class="btn-close" @click="emit('close')"></button>
          </div>

          <div class="modal-body">

            <div class="mb-3">
              <label class="form-label fw-bold">Ngày Tạo</label>
              <input type="datetime-local" class="form-control"
                     v-model="form.ngayTao" required />
            </div>

            <div class="mb-3">
              <label class="fw-bold">Danh sách Sản phẩm</label>

              <div class="row g-3 mb-2" 
                   v-for="(item, index) in form.details" :key="index">
                
                <div class="col-6">
                  <select class="form-select" v-model="item.maSach" required>
                    <option value="" disabled>-- Chọn Sách --</option>
                    <option v-for="b in books" :key="b.maSach" :value="b.maSach">
                      {{ b.tenSach }} ({{ b.maSach }})
                    </option>
                  </select>
                </div>

                <div class="col-4">
                  <input type="number" min="1" class="form-control"
                         v-model="item.soLuong" />
                </div>

                <div class="col-2">
                  <button class="btn btn-danger btn-sm w-100"
                          @click="removeBook(index)">
                    Xóa
                  </button>
                </div>
              </div>

              <button class="btn btn-info btn-sm mt-2" @click="addBook">
                Thêm Sách
              </button>
            </div>

          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" @click="emit('close')">Đóng</button>
            <button class="btn btn-primary" @click="saveOrder">Lưu</button>
          </div>

        </div>
      </div>
    </div>

    <div class="modal-backdrop fade show"></div>
  </div>
</template>
