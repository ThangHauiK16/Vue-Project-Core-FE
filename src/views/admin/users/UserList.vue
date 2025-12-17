<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useUserStore } from '@/stores/UserStore'
import Swal from 'sweetalert2'
import UserEditModal from './UserEditModal.vue' 
import UserDetailModal from './UserDetailModal.vue'



const userStore = useUserStore()

const showModal = ref(false)
const selectedUser = ref(null)

const showDetail = ref(false)
const detailUser = ref(null)

const keyword = ref("")


onMounted(() => {
  userStore.getUsers(1,'',5)
})


const confirmDelete = (username) => {
  Swal.fire({
    title: `Bạn có chắc muốn xóa ${username}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy'
  }).then((result) => {
    if (result.isConfirmed) {
      userStore.deleteUser(username)
    }
  })
}


const openEditModal = (user) => {
  selectedUser.value = user
  showModal.value = true
}

const handleUpdate = async (updatedUser) => {
  const payload = { username: updatedUser.username,
                    email: updatedUser.email,
                    password: updatedUser.password ,
                    role: updatedUser.role };
  await userStore.updateUser(updatedUser.username, payload);
  showModal.value = false;
}

const openDetailModal = async (user) => {
  const res = await axios.get(`/api/user/${user.username}`)
  detailUser.value = res.data
  showDetail.value = true
}
const searchUser = () => {
  userStore.searchUser(keyword.value)  
}


const exportExcel = () => {
  userStore.exportExcel(keyword.value)
}


</script>

<template>
  <div>
    <div class="d-flex justify-content-between">
      <h2>Quản lý người dùng</h2>
     <div class="input-group input-group-sm mb-2" style="max-width: 350px;">
        <input  type="text" class="form-control" placeholder="Nhập username" v-model="keyword" @keyup.enter="searchUser" >
        <div class="d-flex gap-2">
          <button class="btn btn-outline-secondary" type="button" @click="searchUser">
              Search
          </button>
          <button class="btn btn-success btn-sm" @click="exportExcel">
              Export 
          </button>
        </div>
      </div>
    </div>

    <table class="table table-bordered">
      <thead>
        <tr>
          <th>STT</th>
          <th>Username</th>
          <th>Role</th>
          <th class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(u, index) in userStore.users" :key="u.username">
          <td>{{ (userStore.page - 1) * userStore.pageSize + index + 1 }}</td>
          <td  @dblclick="openDetailModal(u)"  style="cursor: pointer;" >
              {{ u.username }}
          </td> 
          <td>{{ u.role }}</td>
          <td class="text-center">
            <button class="btn btn-sm btn-primary me-3 ms-3" @click="openEditModal(u)">Edit</button>
            <button class="btn btn-sm btn-danger" @click="confirmDelete(u.username)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="d-flex justify-content-between align-items-center mt-2">
      <div class="d-flex gap-1">
        <button class="btn btn-primary" @click="userStore.prevPage" :disabled="userStore.page === 1"><<</button>
        <button class="btn btn-primary" @click="userStore.nextPage" :disabled="userStore.page === userStore.totalPages">>></button>
      </div>
      <span>Trang {{ userStore.page }} / {{ userStore.totalPages }}</span>
    </div>

    <!-- Modal component -->
    <UserEditModal
      :show="showModal"
      :user="selectedUser"
      @close="showModal = false"
      @update="handleUpdate"
    />
    <UserDetailModal 
      :show="showDetail" 
      :user="detailUser" 
      @close="showDetail = false" 
    />

  </div>
</template>
