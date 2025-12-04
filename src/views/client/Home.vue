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
const selectedPrice = ref("all")


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
    const token = localStorage.getItem('accessToken')
    await axios.post('/api/order', {
      NgayTao: new Date().toISOString(),
      Username: JSON.parse(atob(token.split('.')[1])).unique_name,
      Order_Books: [{ MaSach: book.maSach, SoLuong: quantity }]
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
   filterByPrice()
})

const filterByPrice = () => {
  let books = [...productStore.books]

  switch (selectedPrice.value) {
    case "under100":
      books = books.filter(b => b.giaBan < 100000)
      break
    case "100-200":
      books = books.filter(b => b.giaBan >= 100000 && b.giaBan <= 200000)
      break
    case "200-500":
      books = books.filter(b => b.giaBan >= 200000 && b.giaBan <= 500000)
      break
    case "above500":
      books = books.filter(b => b.giaBan > 500000)
      break
    default:
      books = [...productStore.books]
  }

  if (selectedCategory.value && selectedCategory.value !== "Tất cả") {
    books = books.filter(b => b.theLoai === selectedCategory.value)
  }

  filteredBooks.value = books
}

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
        <div class="d-flex justify-content-between">
           <div>
            <select class="form-select" v-model="selectedPrice" @change="filterByPrice">
              <option value="all">Tất cả giá</option>
              <option value="under100">Dưới 100.000 VNĐ</option>
              <option value="100-200">100.000 VNĐ - 200.000 VNĐ</option>
              <option value="200-500">200.000 VNĐ - 500.000 VNĐ</option>
              <option value="above500">Trên 500.000 VNĐ</option>
            </select>
          </div>
          
          <div class="">
            <SearchBar @search="handleSearch" />
          </div>
        </div>
      </div>


      <div class="row me-5">
        <BookCard v-for="book in filteredBooks" :key="book.maSach" :book="book" @order="handleOrder" />
      </div>
      <Pagination :page="productStore.page" :totalPages="productStore.totalPages" @change="productStore.getBooks" />

    </div>

    <OrderModal :book="orderBook" :show="showOrderModal" @close="showOrderModal = false" @pay="payOrder" />
  </div>
</template>
