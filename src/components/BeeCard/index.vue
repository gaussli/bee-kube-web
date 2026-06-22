<template>
  <div class="bee-card">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.bee-card {
  --bee-card-bg: #{$color-bg-surface};

  padding: 0 $spacing-16;
  border-radius: $radius-8;
  background: var(--bee-card-bg);
}
</style>
