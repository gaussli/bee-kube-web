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
  flex-direction: column;
  justify-content: center;
  gap: 2px;

  .role-code {
    font-size: 12px;
    color: $text-secondary;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .role-name {
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
