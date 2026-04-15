<template>
  <el-container class="home-layout">
    <LayoutAside :menus="menus" />
    <el-container class="content">
      <LayoutHeader />
      <LayoutMain />
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import LayoutAside from '@/components/Layout/LayoutAside.vue'
import LayoutHeader from '@/components/Layout/LayoutHeader.vue'
import LayoutMain from '@/components/Layout/LayoutMain.vue'
import { useUserStore } from '@/stores'
import type { CurrentMenu } from '@/types/auth'
import { computed } from 'vue'

defineOptions({ name: 'Home' })

const userStore = useUserStore()
const menus = computed<CurrentMenu[]>(() => userStore.getCurrentMenus() || [])
</script>

<style lang="scss" scoped>
.home-layout {
  height: 100vh;

  .content {
    flex-direction: column;
  }
}
</style>
