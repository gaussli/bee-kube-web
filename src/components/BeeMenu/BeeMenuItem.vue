<template>
  <div class="bee-menu-item" :class="{ 'is-active': isActive }" @click="handleClick">
    <BeeIcon v-if="icon" :name="icon" :size="14" class="bee-menu-item__icon" />
    <span class="bee-menu-item__label">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
/**
 * BeeMenuItem 叶子菜单项组件
 * @module components/BeeMenu/BeeMenuItem
 */
import { computed, inject } from 'vue'
import BeeIcon from '@/components/BeeIcon/index.vue'
import { MenuContextKey } from './types'

defineOptions({ name: 'BeeMenuItem' })

const props = defineProps<{
  /** 唯一标识 */
  index: string | number
  /** 菜单文本 */
  label: string
  /** 图标名称 */
  icon?: string
}>()

const emit = defineEmits<{
  /** 点击事件 */
  click: [index: string | number]
}>()

const menuContext = inject(MenuContextKey, null)

/** 是否为当前激活项 */
const isActive = computed(() => menuContext?.activeIndex?.value === props.index)

/**
 * 处理点击，更新激活状态并向上抛出事件
 */
function handleClick() {
  menuContext?.selectItem(props.index)
  emit('click', props.index)
}
</script>

<style lang="scss" scoped>
@use 'sass:map';

.bee-menu-item {
  position: relative;
  display: flex;
  flex-shrink: 0;
  gap: $spacing-8;
  align-items: center;
  box-sizing: border-box;
  height: 40px;
  padding: 0 20px;
  border: 1px solid transparent;
  border-radius: $radius-full;
  font-size: 14px;
  color: $text-secondary;
  cursor: pointer;
  user-select: none;
  transition:
    color 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    background: rgba(map.get($colors, 'primary', 50), 0.1);
  }

  &.is-active {
    color: map.get($colors, 'primary', 50);
    background: rgba(map.get($colors, 'primary', 50), 0.1);
    border-color: map.get($colors, 'primary', 50);
  }

  &__icon {
    flex-shrink: 0;
  }

  &__label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
