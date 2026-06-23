<template>
  <div class="permission-info">
    <div class="permission-name">{{ name }}</div>
    <div class="permission-code">{{ code }}</div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'PermissionCell' })

defineProps<{
  code: string
  name: string
}>()
</script>

<style lang="scss" scoped>
.permission-info {
  display: flex;
  gap: 2px;
  flex-direction: column;
  justify-content: center;

  .permission-code {
    overflow: hidden;
    font-size: 12px;
    line-height: 1.2;
    color: $text-secondary;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .permission-name {
    overflow: hidden;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.2;
    color: $color-text-primary;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
