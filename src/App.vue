<script setup>
import { onMounted } from 'vue'
import { useLoginStore } from '@/stores/LoginStore'

const loginStore = useLoginStore()

onMounted(() => {
  if (loginStore.user) {
    loginStore.fetchCart()
  }
})
</script>


<template>
  <RouterView />
</template>
