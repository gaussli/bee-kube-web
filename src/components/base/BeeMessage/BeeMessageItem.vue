<template>
  <div class="bee-message" :class="[typeClass]">
    <BeeIcon class="bee-message__icon" :name="iconName" />
    <span class="bee-message__text">{{ message }}</span>
    <button v-if="showClose" class="bee-message__close" @click="handleClose">
      <BeeIcon name="basic-close" :size="12" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { MessageType } from './types'

import BeeIcon from '@/components/base/BeeIcon/index.vue'

defineOptions({ name: 'BeeMessage' })

// ==================== Prop & Emit ====================
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
    type: 'primary',
    message: '',
    showClose: false,
  },
)

const emit = defineEmits<{
  close: []
}>()

// ==================== Reactive State ====================
const typeClass = computed(() => `bee-message--${props.type}`)
const iconName = computed(() => {
  switch (props.type) {
    case 'success':
      return 'basic-success'
    case 'warning':
      return 'basic-warning'
    case 'danger':
      return 'basic-danger'
    default:
      return 'basic-info'
  }
})

// ==================== Handler ====================
/**
 * 关闭按钮点击事件处理
 */
function handleClose() {
  emit('close')
}
</script>

<style lang="scss" scoped>
@use 'sass:map';

.bee-message {
  $types: primary, success, warning, danger;

  display: flex;
  gap: 8px;
  flex-direction: row;
  align-items: center;
  width: 400px;
  padding: 12px 20px;
  border: 1px solid;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5em;
  pointer-events: auto;

  &__content {
    overflow-wrap: break-word;
    flex: 1;
  }

  &__close {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 20px;
    border: none;
    color: $color-text-secondary;
    opacity: 0.5;
    background: transparent;
    cursor: pointer;
    transition: opacity 0.3s;

    &:hover {
      opacity: 1;
    }
  }

  @each $type in $types {
    $colors-type: map.get($color, $type);

    &--#{$type} {
      filter: drop-shadow(0 0 4px rgba(map.get($colors-type, 'bg', 'base'), 50%));
      border-color: var(--bee-message-color-border-#{$type}, map.get($colors-type, 'border', 'base'));
      color: var(--bee-message-color-text-#{$type}, map.get($colors-type, 'text', 'base'));
      background: var(--bee-message-color-bg-#{$type}, map.get($colors-type, 'bg', 'base'));
    }
  }
}
</style>
