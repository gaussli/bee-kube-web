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
  flex-direction: column;
  justify-content: center;
  gap: 2px;

  .permission-code {
    font-size: 12px;
    color: $text-secondary;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .permission-name {
    font-size: 14px;
    font-weight: 600;
    color: $text-primary;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
