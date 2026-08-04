<template>
  <div class="user-avatar" :style="{ width: `${size}px`, height: `${size}px` }">
    <img v-if="src" :src="src" :alt="text" @error="handleError" />
    <span v-else :style="{ backgroundColor: bgColor, fontSize: `${size * 0.4}px` }">{{ initials }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

defineOptions({ name: 'UserAvatar' })

const props = withDefaults(
  defineProps<{
    src?: string
    name?: string
    size?: number
  }>(),
  {
    src: '',
    name: '',
    size: 40,
  },
)

const hasError = ref(false)

const initials = computed(() => {
  return (props.name || 'U').charAt(0).toUpperCase()
})

// 根据名字生成稳定的低饱和度背景色
const bgColor = computed(() => {
  // 低饱和度 pastel 风格颜色
  const colors = [
    '#A8D8EA', // 浅蓝
    '#AA96DA', // 浅紫
    '#FCBAD3', // 浅粉
    '#FFFFD2', // 浅黄
    '#A8E6CF', // 浅绿
    '#FFD3B6', // 浅橙
    '#DCEDC1', // 浅草绿
    '#B5EAD7', // 薄荷绿
    '#C7CEEA', // 淡紫蓝
    '#FFB7B2', // 浅珊瑚
  ]
  const index = ((props.name || '').charCodeAt(0) || 0) % colors.length
  return colors[index]
})

function handleError() {
  hasError.value = true
}
</script>

<style lang="scss" scoped>
.user-avatar {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  span {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    font-weight: 600;
    color: #5a5a5a;
    user-select: none;
  }
}
</style>
