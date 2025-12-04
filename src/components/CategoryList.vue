<!-- <script setup>
import { ref, onMounted, defineEmits } from 'vue'
import axios from 'axios'

const emit = defineEmits(['filter'])

const categories = ref([])
const activeCategory = ref('Tất cả')

onMounted(async () => {
  try {
    const res = await axios.get('/api/sach/categories')
    categories.value = ['Tất cả', ...res.data]
  } catch (err) {
    console.error('Lỗi khi lấy category:', err)
  }
})

const selectCategory = (cat) => {
  activeCategory.value = cat
  emit('filter', cat)   
}
</script>

<template>
<div>
  <h5 class="text-center fw-semibold">Thể Loại</h5>
  <ul class="list-group">
    <li v-for="cat in categories" :key="cat"
        class="list-group-item list-group-item-action text-center"
        :class="{ active: activeCategory === cat }"
        @click="selectCategory(cat)">
      {{ cat }}
    </li>
  </ul>
</div>
</template> -->




<script setup>
import { ref, onMounted, defineEmits } from 'vue'
import axios from 'axios'

const emit = defineEmits(['filter'])

const categories = ref([])
const activeCategory = ref('Tất cả')

onMounted(async () => {
  try {
    const res = await axios.get('/api/book/categories')
    categories.value = ['Tất cả', ...res.data]
  } catch (err) {
    console.error('Lỗi khi lấy category:', err)
  }
})

const selectCategory = (cat) => {
  activeCategory.value = cat
  emit('filter', cat)
}
</script>

<template>
  <div class="p-3 bg-light rounded shadow-sm" style="margin-top: 2rem;">
    <h5 class="text-center fw-bold mb-3 text-primary">Thể Loại</h5>
    <ul class="list-unstyled">
      <li 
        v-for="cat in categories" 
        :key="cat"
        @click="selectCategory(cat)"
        :class="[
          'mb-2 px-3 py-2 rounded text-center cursor-pointer transition',
          activeCategory === cat
            ? 'bg-primary text-white fw-semibold shadow-sm'
            : 'bg-white text-dark hover:bg-primary hover:text-white'
        ]"
      >
        {{ cat }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.cursor-pointer { cursor: pointer; }
.hover\:bg-primary:hover { background-color: #0d6efd !important; }
.hover\:text-white:hover { color: #fff !important; }
.transition { transition: all 0.3s ease; }
</style>
