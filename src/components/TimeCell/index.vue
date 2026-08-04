<template>
  <div class="time-cell">
    <div class="time-text">{{ formatTime(time) }}</div>
    <div v-if="showRelative" class="relative-text">{{ formatRelative(time) }}</div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'TimeCell' })

interface Props {
  time?: string
  showRelative?: boolean
}

withDefaults(defineProps<Props>(), {
  time: '',
  showRelative: false
})

function formatTime(time?: string): string {
  if (!time) return '-'
  const date = new Date(time)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatRelative(time?: string): string {
  if (!time) return ''
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 30) return `${days}天前`
  return `${Math.floor(days / 30)}个月前`
}
</script>

<style lang="scss" scoped>
.time-cell {
  display: flex;
  gap: 2px;
  flex-direction: column;
}

.time-text {
  font-size: 13px;
  color: $color-text-primary;
}

.relative-text {
  font-size: 12px;
  color: $color-text-secondary;
}
</style>
