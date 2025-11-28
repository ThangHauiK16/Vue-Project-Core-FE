<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({ initialKeyword: String })
const emit = defineEmits(['search'])
const keyword = ref(props.initialKeyword || '')

const onSearch = () => emit('search', keyword.value.trim())
</script>

<template>
<div class="d-flex justify-content-end mb-3">
  <div class="input-group input-group-sm" style="max-width: 250px;">
    <input type="text" v-model="keyword" class="form-control" placeholder="Nhập tên sách" @keyup.enter="onSearch">
    <button class="btn btn-outline-secondary" @click="onSearch">Search</button>
  </div>
</div>
</template>
