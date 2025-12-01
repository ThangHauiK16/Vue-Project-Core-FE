<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useProductStore } from '@/stores/ProductStore'
import SearchBar from '@/components/SearchBar.vue'
import CategoryList from '@/components/CategoryList.vue'
import BookCard from '@/components/BookCard.vue'
import Pagination from '@/components/Pagination.vue'
import OrderModal from '@/components/OrderModal.vue'
import axios from 'axios'

const productStore = useProductStore()

const filteredBooks = ref([])
const selectedCategory = ref(null)
const orderBook = ref(null)
const showOrderModal = ref(false)


const categories = computed(() => {
  const cats = new Set(productStore.books.map(b => b.theLoai))
  return Array.from(cats)
})

const filterBooks = async (cat) => {
  selectedCategory.value = cat

  await productStore.getBooks(1, cat === 'Tất cả' ? '' : cat, 8)

  filteredBooks.value =
    cat === 'Tất cả'
      ? [...productStore.books]
      : productStore.books.filter(b => b.theLoai === cat)
}



const handleSearch = async (keyword) => {
  await productStore.searchBook(keyword, 8)
  filteredBooks.value = [...productStore.books]
}


const handleOrder = (book) => {
  orderBook.value = book
  showOrderModal.value = true
}


const payOrder = async ({ book, quantity }) => {
  try {
    const token = localStorage.getItem('token')
    await axios.post('/api/hoadon', {
      NgayTao: new Date().toISOString(),
      Username: JSON.parse(atob(token.split('.')[1])).unique_name,
      HoaDon_Saches: [{ MaSach: book.maSach, SoLuong: quantity }]
    }, { headers: { Authorization: `Bearer ${token}` } })
    showOrderModal.value = false
  } catch (err) {
    console.error(err)
  }
}


onMounted(async () => {
  await productStore.getBooks(1, '', 8)
  filteredBooks.value = selectedCategory.value
    ? productStore.books.filter(b => b.theLoai === selectedCategory.value)
    : [...productStore.books]
})

watch(() => productStore.books, (newBooks) => {
  if (!selectedCategory.value || selectedCategory.value === "Tất cả") {
    filteredBooks.value = [...newBooks]
  } else {
    filteredBooks.value = newBooks.filter(b => b.theLoai === selectedCategory.value)
  }
})

</script>

<template>
  <div class="row">
    <div class="col-md-2" style="margin-top: 1rem;">
      <div class="sticky-top" style="top: 127px;">
        <div class="container">
          <CategoryList @filter="filterBooks" />
        </div>
      </div>
    </div>
    <div class="col-md-10">
      <div class="row">
        <SearchBar @search="handleSearch" />
      </div>


      <div class="row me-5">
        <BookCard v-for="book in filteredBooks" :key="book.maSach" :book="book" @order="handleOrder" />
      </div>
      <Pagination :page="productStore.page" :totalPages="productStore.totalPages" @change="productStore.getBooks" />

    </div>

    <OrderModal :book="orderBook" :show="showOrderModal" @close="showOrderModal = false" @pay="payOrder" />
  </div>
</template>
