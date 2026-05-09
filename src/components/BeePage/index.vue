<template>
  <div class="bee-page">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.bee-page {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  height: 100%;
}
</style>
