<template>
  <div class="role-info">
    <div class="role-name">{{ name }}</div>
    <div class="role-code">{{ code }}</div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'RoleCell' })

defineProps<{
  code: string
  name: string
}>()
</script>

<style lang="scss" scoped>
.role-info {
  display: flex;
  gap: 2px;
  flex-direction: column;
  justify-content: center;

  .role-code {
    overflow: hidden;
    font-size: 12px;
    line-height: 1.2;
    color: $text-secondary;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .role-name {
    overflow: hidden;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.2;
    color: $text-primary;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
