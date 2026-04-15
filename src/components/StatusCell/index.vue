<template>
  <el-tag :type="tagType" class="status-tag">
    <el-icon><component :is="icon" /></el-icon>
    <span>{{ label }}</span>
  </el-tag>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Check, CircleClose } from '@element-plus/icons-vue'

defineOptions({ name: 'StatusCell' })

const props = defineProps<{
  status: 0 | 1
}>()

const config = {
  1: { label: '启用', icon: Check, type: 'success' as const },
  0: { label: '禁用', icon: CircleClose, type: 'danger' as const }
}

const label = computed(() => config[props.status].label)
const icon = computed(() => config[props.status].icon)
const tagType = computed(() => config[props.status].type)
</script>

<style lang="scss" scoped>
.status-tag {
  border-radius: 8px;
  height: auto;
  line-height: 1.5;

  :deep(.el-tag__content) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    height: auto;
    padding: 4px;
  }

  :deep(.el-icon) {
    cursor: default;
    font-size: 14px;
  }
}
</style>
