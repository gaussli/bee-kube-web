<template>
  <div class="bee-page">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.bee-page {
  display: flex;
  gap: 16px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  background: var(--bee-page-color-bg, transparent);
}
</style>
