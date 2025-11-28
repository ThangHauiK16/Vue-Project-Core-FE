<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps({
  show: Boolean,
  user: Object
})

const emit = defineEmits(['close', 'update'])

const editUser = ref({ username: '', role: 'Customer' })

// Khi props.user thay đổi, clone dữ liệu vào editUser
watch(() => props.user, (newVal) => {
  if (newVal) editUser.value = { ...newVal }
})

// Submit form
const submit = () => {
  emit('update', { ...editUser.value })
}
</script>

<template>
  <div v-if="show">
    <div class="modal fade show" style="display: block;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Cập nhật User</h5>
            <button type="button" class="btn-close" @click="$emit('close')"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Username</label>
              <input class="form-control" v-model="editUser.username" disabled />
            </div>
            <div class="mb-3">
              <label class="form-label">Role</label>
              <select class="form-select" v-model="editUser.role">
                <option value="Admin">Admin</option>
                <option value="Customer">Customer</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="$emit('close')">Hủy</button>
            <button class="btn btn-primary" @click="submit">Lưu</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show"></div>
  </div>
</template>
