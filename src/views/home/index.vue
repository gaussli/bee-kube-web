<template>
  <section class="bee-home">
    <BeeHeader />
    <section class="body">
      <BeeAside />
      <BeeMain />
    </section>
  </section>
</template>

<script setup lang="ts">
import BeeAside from '@/components/BeeLayout/BeeAside.vue'
import BeeHeader from '@/components/BeeLayout/BeeHeader.vue'
import BeeMain from '@/components/BeeLayout/BeeMain.vue'

defineOptions({ name: 'Home' })
</script>

<style lang="scss" scoped>
.bee-home {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;

  .body {
    flex: 1;
    display: flex;
    min-height: 0;
    overflow: hidden;
  }
}
</style>
