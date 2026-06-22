<template>
  <div class="bee-menu">
    <slot />
  </div>
</template>

<script setup lang="ts">
/**
 * BeeMenu 菜单容器组件
 * 提供菜单上下文，管理激活项与子菜单展开状态
 * @module components/BeeMenu/BeeMenu
 */
import { ref, provide, readonly } from 'vue'
import { MenuContextKey } from './types'

defineOptions({ name: 'BeeMenu' })

const props = withDefaults(
  defineProps<{
    /** 默认激活的菜单项 index */
    defaultActive?: string | number
  }>(),
  { defaultActive: undefined }
)

const emit = defineEmits<{
  /** 菜单项选中事件 */
  select: [index: string | number]
}>()

/** 当前激活的菜单项 index */
const activeIndex = ref<string | number | undefined>(props.defaultActive)
/** 当前展开的子菜单 index（最多 1 个） */
const expandedKey = ref<string | number | undefined>()

/**
 * 激活指定菜单项
 * @param index - 菜单项 index
 */
function selectItem(index: string | number) {
  activeIndex.value = index
  emit('select', index)
}

/**
 * 切换子菜单展开/收起
 * 同一时间最多展开 1 个子菜单
 * @param key - 子菜单 index
 */
function toggleSubMenu(key: string | number) {
  expandedKey.value = expandedKey.value === key ? undefined : key
}

/**
 * 注册子菜单展开状态（仅 BeeSubMenu 使用）
 * @param key - 子菜单 index
 */
function isSubMenuExpanded(key: string | number): boolean {
  return expandedKey.value === key
}

provide(MenuContextKey, {
  activeIndex: readonly(activeIndex),
  selectItem,
  toggleSubMenu,
  isSubMenuExpanded
})
</script>

<style lang="scss" scoped>
.bee-menu {
  display: flex;
  gap: $spacing-8;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: $spacing-16;
  overflow-y: auto;
  background: transparent;
}
</style>
