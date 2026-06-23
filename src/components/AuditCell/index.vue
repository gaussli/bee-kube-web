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
  gap: 4px;
  flex-direction: column;
  font-size: 13px;

  .row {
    display: flex;
    gap: 4px;
    align-items: center;

    .el-icon {
      color: $color-text-secondary;
    }

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
