<template>
  <Teleport to="body">
    <Transition name="dialog-fade">
      <div v-if="modelValue" class="bee-dialog-mask">
        <div class="bee-dialog" :style="dialogStyle">
          <!-- 头部：标题 + 关闭按钮 -->
          <div class="dialog-header">
            <span class="dialog-title">{{ title }}</span>
            <BeeCircleButton icon="basic-close" tooltip="关闭" :border="false" size="small" @click="handleClose" />
          </div>

          <!-- 内容区：优先渲染 slot -->
          <div class="dialog-body">
            <slot>{{ content }}</slot>
          </div>

          <!-- 底部：取消 + 确定 -->
          <div class="dialog-footer">
            <BeeButton @click="handleCancel">取消</BeeButton>
            <BeeButton type="success" @click="handleConfirm">确定</BeeButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * BeeDialog - 通用对话框组件
 * @module components/BeeDialog
 * @description 基于 Teleport 的模态对话框，支持标题、自定义内容、确认/取消操作
 */
import { computed } from 'vue'

import BeeButton from '@/components/BeeButton/index.vue'
import BeeCircleButton from '@/components/BeeCircleButton/index.vue'

defineOptions({ name: 'BeeDialog' })

// ==================== Props ====================

const props = withDefaults(
  defineProps<{
    /** 控制对话框显示/隐藏（v-model） */
    modelValue: boolean
    /** 对话框标题 */
    title?: string
    /** 对话框默认文本内容（slot 优先） */
    content?: string
    /** 对话框宽度，支持 number（px）或 string */
    width?: number | string
  }>(),
  {
    title: '提示',
    content: '',
    width: 400,
  },
)

// ==================== Emits ====================

const emit = defineEmits<{
  /** 更新 v-model 值 */
  'update:modelValue': [value: boolean]
  /** 取消/关闭事件 */
  'cancel': []
  /** 确认事件 */
  'confirm': []
}>()

// ==================== Computed ====================

/** 对话框动态样式，将 width 转换为 CSS 变量 */
const dialogStyle = computed(() => {
  const widthValue = typeof props.width === 'number' ? `${props.width}px` : props.width
  return {
    '--dialog-width': widthValue,
  }
})

// ==================== Methods ====================

/** 关闭对话框（点击关闭按钮） */
function handleClose() {
  emit('update:modelValue', false)
  emit('cancel')
}

/** 取消操作 */
function handleCancel() {
  emit('update:modelValue', false)
  emit('cancel')
}

/** 确认操作 */
function handleConfirm() {
  emit('confirm')
}
</script>

<style lang="scss" scoped>
// ==================== 遮罩层 ====================
.bee-dialog-mask {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $color-bg-mask;
}

// ==================== 对话框容器 ====================
.bee-dialog {
  width: var(--dialog-width);
  border-radius: 12px;
  overflow: hidden;
  background-color: $color-bg-elevated;
  box-shadow: 0 8 32px rgb(0 0 0 / 40%);
}

// ==================== 头部 ====================
.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-16;

  .dialog-title {
    font-size: $font-size-16;
    font-weight: 600;
    color: $color-text-primary;
  }
}

// ==================== 内容区 ====================
.dialog-body {
  padding: $spacing-8 $spacing-16;
  font-size: $font-size-14;
  line-height: 1.6;
  color: $color-text-primary;
}

// ==================== 底部操作区 ====================
.dialog-footer {
  display: flex;
  gap: $spacing-8;
  justify-content: flex-end;
  padding: $spacing-16;
}

// ==================== 过渡动画 ====================
.dialog-fade-enter-active {
  animation: dialog-fade-in 0.25s ease-out;
}

.dialog-fade-leave-active {
  animation: dialog-fade-out 0.2s ease-in;
}

.dialog-fade-enter-active .bee-dialog {
  animation: dialog-fade-in 0.25s ease-out;
}

.dialog-fade-leave-active .bee-dialog {
  animation: dialog-fade-out 0.2s ease-in;
}

@keyframes dialog-fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes dialog-fade-out {
  from {
    opacity: 1;
    transform: scale(1);
  }

  to {
    opacity: 0;
    transform: scale(0.95);
  }
}
</style>
