<template>
  <div class="bee-ellipsis-tooltip-label">
    <BeeTooltip :disabled="!isOverflow" :tooltip="label">
      <span ref="spanRef">{{ label }}</span>
    </BeeTooltip>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import BeeTooltip from '@/components/base/BeeTooltip/index.vue'

// ==================== Props ====================
const props = defineProps<{
  /** 文本 */
  label: string
}>()

// ==================== Reactive State ====================
const spanRef = ref<HTMLElement>()
const isOverflow = ref(false)

// ==================== Variables ====================
let resizeObjserver: ResizeObserver | null = null

// ==================== Watch ====================
watch(
  () => props.label,
  () => initCheck(),
)

// ==================== Methods ====================
/**
 * 检查溢出
 */
const checkOverflow = () => {
  const el = spanRef.value
  if (!el) return
  isOverflow.value = el.scrollWidth > el.clientWidth
}

/**
 * 初始化检测，确保 DOM 渲染完成
 */
const initCheck = () => {
  void nextTick(() => checkOverflow())
}

/**
 * 设置 ResizeObserver
 */
const setupObserver = () => {
  if (!spanRef.value) return
  resizeObjserver = new ResizeObserver(checkOverflow)
  resizeObjserver.observe(spanRef.value)
}

const cleanupObserver = () => {
  if (resizeObjserver) {
    resizeObjserver.disconnect()
    resizeObjserver = null
  }
}

// ==================== Lifecycle ====================
onMounted(() => {
  initCheck()
  setupObserver()
})

onBeforeUnmount(() => {
  cleanupObserver()
})
</script>

<style lang="scss" scoped>
.bee-ellipsis-tooltip-label {
  max-width: 100%;
  overflow: hidden;

  span {
    display: block;
    overflow: hidden;
    font-size: inherit;
    font-weight: inherit;
    color: inherit;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
