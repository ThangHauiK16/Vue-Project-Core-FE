<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  show: Boolean,
  user: Object
})

const emit = defineEmits(["close"])
</script>

<template>
  <div v-if="show">
    <div class="modal fade show" style="display: block;">
      <div class="modal-dialog">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">Thông tin người dùng</h5>
            <button class="btn-close" @click="emit('close')"></button>
          </div>

          <div class="modal-body">
            <p><strong>Username:</strong> {{ user?.username }}</p>
            <p><strong>Email:</strong> {{ user?.email }}</p>
            <p><strong>Role:</strong> {{ user?.role }}</p>
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
