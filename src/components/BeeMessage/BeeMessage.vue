<template>
  <div class="bee-message" :class="`bee-message--${type}`">
    <BeeIcon :name="iconName" :size="14" class="bee-message__icon" />
    <span class="bee-message__content">{{ message }}</span>
    <button v-if="showClose" class="bee-message__close" @click="$emit('close')">
      <BeeIcon name="basic-close" :size="12" />
    </button>
  </div>
</template>

<script setup lang="ts">
/**
 * BeeMessage 消息提示组件
 * 支持 success / error / warning / info 四种类型，支持关闭按钮
 * @module components/BeeMessage/BeeMessage
 */
import { computed } from 'vue'

import type { MessageType } from './types'

import BeeIcon from '@/components/BeeIcon/index.vue'

defineOptions({ name: 'BeeMessage' })

const props = withDefaults(
  defineProps<{
    /** 消息类型 */
    type?: MessageType
    /** 消息文本 */
    message?: string
    /** 是否显示关闭按钮 */
    showClose?: boolean
  }>(),
  {
    type: 'info',
    message: '',
    showClose: true,
  },
)

defineEmits<{
  close: []
}>()

/** 类型 → 图标名称映射 */
const iconMap: Record<MessageType, string> = {
  success: 'basic-success-filled',
  error: 'basic-danger-filled',
  warning: 'basic-warning-filled',
  info: 'basic-info-filled',
}

const iconName = computed(() => iconMap[props.type])
</script>

<style lang="scss" scoped>
@use 'sass:map';

.bee-message {
  // ---- CSS 自定义属性 ----
  --bee-message-bg: #{map.get($colors, 'gray', 15)};
  --bee-message-border-color: #{map.get($colors, 'gray', 40)};
  --bee-message-color: #{$color-text-primary};
  --bee-message-icon-color: #{map.get($colors, 'gray', 70)};
  --bee-message-shadow: 0 4px 12px rgb(0 0 0 / 15%);

  display: flex;
  gap: $spacing-8;
  align-items: flex-start;
  box-sizing: border-box;
  min-width: 280px;
  max-width: 420px;
  padding: 10px $spacing-16;
  border: 1px solid var(--bee-message-border-color);
  border-radius: $radius-8;
  font-size: $font-size-14;
  line-height: 20px;
  color: var(--bee-message-color);
  background: var(--bee-message-bg);
  box-shadow: var(--bee-message-shadow);
  pointer-events: auto;

  &__icon {
    flex-shrink: 0;
    margin-top: 3px;
    color: var(--bee-message-icon-color);
  }

  &__content {
    overflow-wrap: break-word;
    flex: 1;
  }

  &__close {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    padding: 0;
    margin-top: 0;
    margin-left: auto;
    border: none;
    border-radius: $radius-4;
    color: var(--bee-message-color);
    opacity: 0.6;
    background: transparent;
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover {
      opacity: 1;
    }
  }

  // ---- 类型修饰 ----
  &--success {
    --bee-message-bg: #{rgba(map.get($colors, 'success', 50), 0.5)};
    --bee-message-border-color: #{rgba(map.get($colors, 'success', 50), 0.3)};
    --bee-message-icon-color: #{map.get($colors, 'success', 50)};
  }

  &--error {
    --bee-message-bg: #{rgba(map.get($colors, 'danger', 50), 0.5)};
    --bee-message-border-color: #{rgba(map.get($colors, 'danger', 50), 0.3)};
    --bee-message-icon-color: #{map.get($colors, 'danger', 50)};
  }

  &--warning {
    --bee-message-bg: #{rgba(map.get($colors, 'warning', 50), 0.5)};
    --bee-message-border-color: #{rgba(map.get($colors, 'warning', 50), 0.3)};
    --bee-message-icon-color: #{map.get($colors, 'warning', 50)};
  }

  &--info {
    --bee-message-bg: #{map.get($colors, 'gray', 15)};
    --bee-message-border-color: #{map.get($colors, 'gray', 40)};
    --bee-message-icon-color: #{map.get($colors, 'gray', 70)};
  }
}
</style>
