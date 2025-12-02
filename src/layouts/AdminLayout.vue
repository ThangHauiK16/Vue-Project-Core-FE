<template>
  <div class="layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <h2 class="logo">Book Store</h2>
      <nav>
        <RouterLink to="/admin/dashboard">Dashboard</RouterLink>
        <RouterLink to="/admin/users">Người dùng</RouterLink>
        <RouterLink to="/admin/products">Sản phẩm</RouterLink>
        <RouterLink to="/admin/orders">Đơn hàng</RouterLink>
      </nav>
    </aside>

    <!-- Main content -->
    <div class="main">
      <!-- Navbar -->
      <header class="navbar">
        <div class="user-info">
          <span>Xin chào, {{ loginStore.user?.username || 'Admin' }}</span>
        </div>
        <a href="#" class="logout-link " @click.prevent="logout">Logout</a>
      </header>

      <!-- Page content -->
      <main class="content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useLoginStore } from '@/stores/LoginStore'

const router = useRouter()
const loginStore = useLoginStore()


if (!loginStore.user ) {
  router.push('/')
}


const logout = () => {
  loginStore.logout()
  router.push('/')
}
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 220px;
  color: white;
  background-color: #0d6efd;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.sidebar .logo {
  font-size: 1.8rem;
  margin-bottom: 2rem;
  text-align: center;
}

.sidebar nav {
  display: flex;
  flex-direction: column;
}

.sidebar nav a {
  text-align: center;
  color: white;
  text-decoration: none;
  padding: 10px 0;
  transition: background 0.3s;
}

.sidebar nav a.router-link-active {
  background-color: #0b5ed7;
  border-radius: 4px;
}


.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  background-color: #ecf0f1;
  border-bottom: 1px solid #bdc3c7;
}

.logout-link {
  display: inline-block;
  padding: 0.375rem 0.75rem; 
  color: #0d6efd;
  text-decoration: none;
  border: 1px solid transparent;
  border-radius: 0.375rem;
  transition: all 0.3s ease;
}

.logout-link:hover {
  background-color: #0d6efd;
  color: #fff;
  border-color: #0d6efd;
  cursor: pointer;
}


.content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}
</style>
