<template>
  <div class="audit-cell">
    <div class="row">
      <el-icon><User /></el-icon>
      <span>{{ user || '-' }}</span>
    </div>
    <div class="row">
      <el-icon><Clock /></el-icon>
      <span>{{ time || '-' }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Clock, User } from '@element-plus/icons-vue'

defineOptions({ name: 'AuditCell' })

defineProps<{
  user?: string
  time?: string
}>()
</script>

<style lang="scss" scoped>
.audit-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
  color: $text-regular;

  .row {
    display: flex;
    align-items: center;
    gap: 4px;

    .el-icon {
      color: $text-secondary;
    }

    span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
