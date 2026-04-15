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
  padding: $spacing-md;
  background: $bg-color;
  overflow-y: auto;
}
</style>
