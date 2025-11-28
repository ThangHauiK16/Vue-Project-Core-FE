<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({ page: Number, totalPages: Number })
const emit = defineEmits(['change'])

const changePage = (p) => {
  if (p >= 1 && p <= props.totalPages) emit('change', p)
}
</script>

<template>
<nav>
  <ul class="pagination justify-content-center mt-3">
    <li class="page-item" :class="{ disabled: page === 1 }">
      <a class="page-link" href="#" @click.prevent="changePage(page-1)">Previous</a>
    </li>

    <li v-for="i in totalPages" :key="i" class="page-item" :class="{ active: i === page }">
      <a class="page-link" href="#" @click.prevent="changePage(i)">{{ i }}</a>
    </li>

    <li class="page-item" :class="{ disabled: page === totalPages }">
      <a class="page-link" href="#" @click.prevent="changePage(page+1)">Next</a>
    </li>
  </ul>
</nav>
</template>
