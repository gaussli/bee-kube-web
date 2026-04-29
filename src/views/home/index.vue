<template>
  <el-container class="home-layout">
    <LayoutAside />
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

defineOptions({ name: 'Home' })
</script>

<style lang="scss" scoped>
.home-layout {
  height: 100vh;

  .content {
    flex-direction: column;
  }
}
</style>
