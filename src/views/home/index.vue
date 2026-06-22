<template>
  <section class="bee-home">
    <BeeHeader />
    <section class="bee-body">
      <BeeAside />
      <BeeMain />
    </section>
  </section>
</template>

<script setup lang="ts">
/**
 * 首页布局组件
 * 头部 + 左侧菜单 + 右侧内容区的经典三段式布局
 * @module views/home
 */
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
  height: 100dvh; // 动态视口高度，避免移动端地址栏抖动
  overflow: hidden;

  .bee-body {
    display: flex;
    flex-direction: row;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }
}
</style>
