<template>
  <router-view />
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores'
import { onMounted } from 'vue'

const userStore = useUserStore()

onMounted(() => {
  // 检查登录状态
  if (userStore.isLogin()) {
    // 可以在这里获取用户信息
    console.log('已登录')
  }
})
</script>

<style>
.app {
  width: 100%;
  height: 100%;
}
</style>
