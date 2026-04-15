<template>
  <div class="status-cell">
    <span class="dot" :class="colorClass"></span>
    <span class="label">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'StatusCell' })

const props = defineProps<{
  status: 0 | 1
}>()

const config = {
  1: { label: '启用', colorClass: 'success' },
  0: { label: '禁用', colorClass: 'danger' }
}

const label = computed(() => config[props.status].label)
const colorClass = computed(() => config[props.status].colorClass)
</script>

<style lang="scss" scoped>
.status-cell {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;

    &.success {
      background-color: #67c23a;
    }

    &.danger {
      background-color: #f56c6c;
    }
  }
}
</style>
