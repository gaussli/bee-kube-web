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
  align-items: center;
  gap: $spacing-sm;
  height: 42px;

  .node-avatar {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: $bg-hover;
    border-radius: 8px;
    color: $color-primary;
    font-size: 18px;
  }

  .node-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 2px;
    min-width: 0;

    .node-name {
      font-size: 14px;
      font-weight: 600;
      color: $text-regular;
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .node-ip {
      font-size: 12px;
      line-height: 1.2;
      color: $text-secondary;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
