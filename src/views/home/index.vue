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
import { computed } from 'vue'
import { useUserStore } from '@/stores'
import LayoutAside from '@/components/Layout/LayoutAside.vue'
import LayoutHeader from '@/components/Layout/LayoutHeader.vue'
import LayoutMain from '@/components/Layout/LayoutMain.vue'
import type { CurrentMenu } from '@/types'

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
