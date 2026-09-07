<template>
  <div class="bee-card">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.bee-card {
  width: 100%;
  padding: 0;
  border-radius: var(--bee-card-border-radius, 16px);
  background: var(--bee-card-color-bg, #{$color-bg-secondary});
}
</style>
