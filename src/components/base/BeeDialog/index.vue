<template>
  <Teleport to="body">
    <Transition name="dialog-fade">
      <div v-if="modelValue" class="bee-dialog-mask">
        <div class="bee-dialog" :class="[typeClass]">
          <div class="bee-dialog__header">
            <div class="bee-dialog__header-icon">
              <BeeIcon :name="icon" :size="24" />
            </div>
            <div class="bee-dialog__header-title">{{ title }}</div>
          </div>
          <div class="bee-dialog__content">
            <slot />
          </div>
          <div class="bee-dialog__actions">
            <BeeButton @click="handleCancel">取 消</BeeButton>
            <BeeButton :loading="props.loading" :type="type" @click="handleConfirm">确 认</BeeButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { BeeType } from '@/config'

import BeeButton from '@/components/base/BeeButton/index.vue'
import BeeIcon from '@/components/base/BeeIcon/index.vue'

defineOptions({ name: 'BeeDialog' })

// ==================== Prop & Emit ====================
const modelValue = defineModel<boolean>()

const props = withDefaults(
  defineProps<{
    /** Dialog 图标 */
    icon: string
    /** Dialog 标题  */
    title: string
    /** Dialog 类型 */
    type?: BeeType
    /** 加载标记 */
    loading?: boolean
  }>(),
  {
    type: 'default',
    loading: false,
  },
)

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

// ==================== Computed ====================
const typeClass = computed(() => (props.type != 'default' ? `bee-dialog--${props.type}` : ''))

// ==================== Handler ====================
/**
 * 取消删除
 */
function handleCancel() {
  emit('cancel')
  modelValue.value = false
}

/**
 * 确认删除
 */
function handleConfirm() {
  emit('confirm')
}
</script>

<style lang="scss" scoped>
@use 'sass:map';

$types: primary, success, warning, danger;

// ==================== 遮罩层 ====================
.bee-dialog-mask {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $color-bg-mask;
}

// ==================== 对话框容器 ====================
.bee-dialog {
  /* stylelint-disable order/custom-properties-alphabetical-order */
  --bee-dialog-color-bg: #{$color-bg-third};
  --bee-dialog-color: #{map.get($color, 'default', 'text', 'base')};
  --bee-dialog-icon-color-bg: #{map.get($color, 'default', 'bg', 'base')};

  @each $type in $types {
    &.bee-dialog--#{$type} {
      --bee-dialog-color: #{map.get($color, $type, 'text', 'base')};
      --bee-dialog-icon-color-bg: #{map.get($color, $type, 'bg', 'base')};
    }
  }

  /* stylelint-enable order/custom-properties-alphabetical-order */
  filter: drop-shadow(0 0 4px color-mix(in srgb, var(--bee-dialog-color-bg) 50%, transparent));
  display: flex;
  gap: 48px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 400px;
  min-height: 288px;
  max-height: 80%;
  padding: 24px;
  border-radius: 16px;
  overflow: hidden;
  background-color: var(--bee-dialog-color-bg);

  &__header {
    display: flex;
    gap: 12px;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    color: var(--bee-dialog-color);

    &-icon {
      padding: 16px;
      border-radius: 9999px;
      background: var(--bee-dialog-icon-color-bg);
    }

    &-title {
      font-size: 16px;
      font-weight: bold;
      user-select: none;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    overflow: hidden;
    font-size: 14px;
    font-weight: normal;
    color: $color-text-secondary;
  }

  &__actions {
    .bee-button {
      --bee-button-width: 100%;
    }

    display: flex;
    gap: 16px;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
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
