<template>
  <main class="main">
    <router-view />
  </main>
</template>

<script setup lang="ts">
defineOptions({ name: 'LayoutMain' })
</script>

<style lang="scss" scoped>
.main {
  height: calc(100vh - 60px);
  padding: 0 $spacing-md $spacing-md 0;
  // overflow-y: auto;
}
</style>
