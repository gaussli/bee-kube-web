<template>
  <div class="bee-label-copyable" :style="{ color }">
    <span class="bee-label-copyable__label">{{ label }}</span>
    <BeeIcon name="basic-copy" :size="12" class="bee-label-copyable__copy" @click="handleCopy" />
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import BeeIcon from '@/components/BeeIcon/index.vue'

defineOptions({ name: 'BeeLabelCopyable' })

defineProps<{
  label: string
  color?: string
}>()

async function handleCopy() {
  const text = (event?.target as HTMLElement)?.closest('.bee-label-copyable')?.querySelector('.bee-label-copyable__label')?.textContent
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
.bee-label-copyable {
  display: inline-flex;
  gap: $spacing-8;
  align-items: center;

  .bee-label-copyable__label {
    font-size: $font-size-12;
  }

  .bee-label-copyable__copy {
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: $color-primary;
    }
  }
}
</style>
