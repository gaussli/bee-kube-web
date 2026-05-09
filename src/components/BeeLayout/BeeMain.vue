<template>
  <main class="bee-main">
    <router-view />
  </main>
</template>

<script setup lang="ts">
defineOptions({ name: 'BeeMain' })
</script>

<style lang="scss" scoped>
.bee-main {
  flex: 1;
  min-width: 0;
}
</style>
