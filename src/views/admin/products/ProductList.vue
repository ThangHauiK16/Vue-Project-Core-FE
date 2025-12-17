<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios' 
import { useProductStore } from '@/stores/ProductStore'
import { getFullImageUrl } from '@/utils/flex'
import Swal from 'sweetalert2'
import BookModal from './BookModal.vue'
import ProductDetailModal from './ProductDetailModal.vue'

const productStore = useProductStore()
const search = ref("")
const isEdit = ref(false)

const currentBook = ref({})
const modalTitle = ref('Thêm sách')
const bookModal = ref(null)

const showDetail = ref(false)
const detailBook = ref(null)

const excelInput = ref(null)

onMounted(() => {
  productStore.getBooks(1,'',5)
})

const searchBook = () => {
  productStore.searchBook(search.value,5)
}

const confirmDelete = (sach) => {
  Swal.fire({
    title: `Bạn có chắc muốn xóa ${sach.tenSach}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy'
  }).then((result) => {
    if (result.isConfirmed) {
      productStore.deleteBook(sach.maSach)
    }
  })
}

const addBook = () => {
  modalTitle.value = 'Thêm sách'
  currentBook.value = {}
  isEdit.value = false
  bookModal.value.showModal()
}

const editBook = (book) => {
  modalTitle.value = 'Cập nhật sách'
  currentBook.value = { ...book }
  isEdit.value = true
  bookModal.value.showModal()
}


const handleSaved = async (bookData) => {
  if (isEdit.value) {
    await productStore.updateBook(bookData)
  } else {
    const exists = productStore.books.some(b => b.maSach === bookData.maSach)
    if (exists) {
      Swal.fire({
        icon: 'error',
        title: 'Trùng mã sách',
        text: 'Mã sách đã tồn tại, vui lòng nhập mã khác'
      })
      return
    }
    await productStore.addBook(bookData)
  }
}


const openDetailModal = async (book) => {
  const res = await axios.get(`/api/book/${book.maSach}`)
  detailBook.value = res.data
  showDetail.value = true
}

const handleImportClick = async () => {
  const result = await Swal.fire({
    title: 'Import Excel',
    text: 'Bạn đã có file Excel mẫu chưa?',
    icon: 'question',
    showCancelButton: true,
    showDenyButton: true,
    confirmButtonText: 'Có rồi',
    denyButtonText: 'Chưa có',
    cancelButtonText: 'Hủy'
  })

  if (result.isConfirmed) {
    excelInput.value.click()
  } else if (result.isDenied) {
    productStore.downloadTemplate()
  }
}

const handleFileSelected = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  await productStore.importExcel(file)
  e.target.value = '' 
}
</script>

<template>
  <div>
    <h2>Quản lý sách</h2>
    <div class="d-flex justify-content-between">
      <button class="btn btn-success mb-2"  @click="addBook">Add Book</button>
      <div class="input-group input-group-sm mb-2" style="max-width: 450px;">
        <input type="text" class="form-control" placeholder="Nhập tên sách" v-model="search" @keyup.enter="searchBook">
        <div class="d-flex gap-2">
          <button class="btn btn-outline-secondary" type="button" @click="searchBook">
            Tìm Kiếm
          </button>
          <button class="btn btn-warning " @click="handleImportClick">
            Import 
          </button>
       </div>
      </div>
    </div>
    <input
      type="file"
      ref="excelInput"
      accept=".xlsx,.xls"
      style="display: none"
      @change="handleFileSelected"
    />
    <BookModal 
      ref="bookModal" 
      :model-value="currentBook" 
      :title="modalTitle"
      @saved="handleSaved" 
    />

    <table class="table table-bordered">
      <thead>
        <tr>
          <th>STT</th>
          <th>Tên sách</th>
          <th class="text-center">Hình ảnh</th>
          <th class="text-center">Số Lượng</th>
          <th class="text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(s, index) in productStore.books" :key="s.maSach">
          <td>{{ (productStore.page - 1) * productStore.pageSize + index + 1 }}</td>
          <td  @dblclick="openDetailModal(s)"  style="cursor: pointer;" >
              {{ s.tenSach }}
          </td>
          <td class="text-center">
            <img 
              v-if="s.imageUrl" 
              :src="getFullImageUrl(s.imageUrl)" 
              alt="Hình sách" 
              style="width: 100px; height: 100px; border-radius: 4px;" 
            >
            <span v-else>Chưa có ảnh</span>
          </td>

          <td class="text-center">{{ s.soLuong }}</td>

          <td class="text-center align-middle">
            <button class="btn btn-sm btn-primary me-3 ms-3" @click="editBook(s)">Edit</button>
            <button class="btn btn-sm btn-danger" @click="confirmDelete(s)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="d-flex justify-content-between align-items-center mt-2">
      <div class="d-flex gap-1">
        <button class="btn btn-primary" @click="productStore.prevPage" 
                :disabled="productStore.page === 1"><<</button>
        <button class="btn btn-primary" @click="productStore.nextPage" 
                :disabled="productStore.page === productStore.totalPages">>></button>
      </div>
      <span>Trang {{ productStore.page }} / {{ productStore.totalPages }}</span>
    </div>
    <ProductDetailModal 
      :show="showDetail" 
      :book="detailBook" 
      @close="showDetail = false" 
    />
    
  </div>
</template>
