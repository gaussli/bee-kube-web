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
  height: 100%;
}
</style>
