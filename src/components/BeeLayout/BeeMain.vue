<template>
  <main class="bee-main">
    <router-view />
  </main>
</template>

<script setup lang="ts">
/**
 * 主内容区布局组件
 * 承载 router-view
 * @module components/BeeLayout/BeeMain
 */
defineOptions({ name: 'BeeMain' })
</script>

<style lang="scss" scoped>
.bee-main {
  flex: 1;
  min-width: 0;
  padding: $spacing-16 $spacing-16 $spacing-16 0;
}
</style>
