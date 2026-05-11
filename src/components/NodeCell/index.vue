<template>
  <div class="node-profile">
    <div class="node-avatar">
      <Box />
    </div>
    <div class="node-info">
      <div class="node-name">{{ name }}</div>
      <div class="node-ip">{{ ip }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Box } from '@element-plus/icons-vue'

defineOptions({ name: 'NodeCell' })

defineProps<{
  name: string
  ip: string
}>()
</script>

<style lang="scss" scoped>
.node-profile {
  display: flex;
  gap: $spacing-sm;
  align-items: center;
  height: 42px;

  .node-avatar {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    font-size: 18px;
    color: $color-primary;
    background-color: $bg-hover;
  }

  .node-info {
    display: flex;
    gap: 2px;
    flex-direction: column;
    justify-content: center;
    min-width: 0;

    .node-name {
      overflow: hidden;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.2;
      color: $text-regular;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .node-ip {
      overflow: hidden;
      font-size: 12px;
      line-height: 1.2;
      color: $text-secondary;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
