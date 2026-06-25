<template>
  <div class="bee-page">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.bee-page {
  display: flex;
  gap: $spacing-16;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
</style>
