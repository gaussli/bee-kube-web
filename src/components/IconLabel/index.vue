<template>
  <span class="icon-label">
    <el-icon><component :is="icon" /></el-icon>
    <span>{{ label }}</span>
  </span>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

defineOptions({ name: 'IconLabel' })

defineProps<{
  icon: Component
  label: string
}>()
</script>

<style lang="scss" scoped>
.icon-label {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  font-weight: 500;

  .el-icon {
    font-size: 14px;
    color: $text-secondary;
  }
}
</style>
