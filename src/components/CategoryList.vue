<script setup>
import { ref, onMounted, defineEmits, nextTick } from 'vue'
import axios from 'axios'

const emit = defineEmits(['filter'])

const categories = ref([])
const visibleCategories = ref([])
const activeCategory = ref('Tất cả')
const visibleCount = ref(5)   

onMounted(async () => {
  try {
    const res = await axios.get('/api/book/categories')
    categories.value = ['Tất cả', ...res.data]

    loadMore() 

    await nextTick()
    addScrollListener()
  } catch (err) {
    console.error('Lỗi khi lấy category:', err)
  }
})


const loadMore = () => {
  visibleCategories.value = categories.value.slice(0, visibleCount.value)
}


const addScrollListener = () => {
  const container = document.getElementById('category-box')

  container.addEventListener('scroll', () => {
    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 10) {
      if (visibleCount.value < categories.value.length) {
        visibleCount.value += 5
        loadMore()
      }
    }
  })
}

const selectCategory = (cat) => {
  activeCategory.value = cat
  emit('filter', cat)
}
</script>

<template>
  <div class="p-3 bg-light rounded shadow-sm" style="margin-top:2rem;">
    <h5 class="text-center fw-bold mb-3 text-primary">Thể Loại</h5>

    <div id="category-box" style="max-height:230px; overflow-y:auto;">
      <ul class="list-unstyled">
        <li 
          v-for="cat in visibleCategories"
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
  </div>
</template>

<style scoped>
.cursor-pointer { cursor: pointer; }
.hover\:bg-primary:hover { background-color: #0d6efd !important; }
.hover\:text-white:hover { color: #fff !important; }
.transition { transition: all 0.3s ease; }
</style>
