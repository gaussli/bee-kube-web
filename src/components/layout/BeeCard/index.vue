<template>
  <div class="bee-card">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.bee-card {
  padding: 0;
  border-radius: 16px;
  background: var(--bee-card-color-bg, #{$color-bg-secondary});
}
</style>
