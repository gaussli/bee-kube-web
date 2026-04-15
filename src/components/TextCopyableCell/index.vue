<template>
  <div class="text-copyable-cell">
    <span class="text">{{ text }}</span>
    <el-button link type="primary" :icon="DocumentCopy" size="small" @click="handleCopy" />
  </div>
</template>

<script setup lang="ts">
import { DocumentCopy } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

defineOptions({ name: 'TextCopyableCell' })

defineProps<{
  text: string
}>()

async function handleCopy() {
  const text = (event?.target as HTMLElement)?.closest('.text-copyable-cell')?.querySelector('.text')?.textContent
  if (text) {
    try {
      await navigator.clipboard.writeText(text)
      ElMessage.success('已复制到剪贴板')
    } catch {
      ElMessage.error('复制失败')
    }
  }
}
</script>

<style lang="scss" scoped>
.text-copyable-cell {
  display: inline-flex;
  align-items: center;
  gap: 4px;

  .text {
    font-family: monospace;
    font-size: 12px;
  }
}
</style>
