<template>
  <div v-if="!hidden" class="bee-dropdown__item" @click="handleClick">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, inject } from 'vue'

defineOptions({ name: 'BeeDropdownItem' })

const props = defineProps<{
  /** 值，用于 v-model */
  value: string | number
  /** 标签文本 */
  label?: string
  /** 图标 */
  icon?: string
}>()

const emit = defineEmits<{
  click: []
}>()

/** 注入的 Dropdown 上下文 */
interface DropdownContext {
  addItem: (item: { value: string | number; label?: string; icon?: string; onClick?: () => void }) => void
  removeItem: (value: string | number) => void
  hideMenu: () => void
  updateValue: (value: string | number) => void
}

const dropdown = inject<DropdownContext | null>('beeDropdown', null)

/** 是否隐藏（用于 v-permission 等指令） */
const hidden = ref(false)

/** 通知隐藏 */
function setHidden(val: boolean) {
  hidden.value = val
}

onMounted(() => {
  // 注册到父组件
  if (dropdown) {
    dropdown.addItem({
      value: props.value,
      label: props.label,
      icon: props.icon,
    })
  }
})

onBeforeUnmount(() => {
  // 从父组件移除
  if (dropdown) {
    dropdown.removeItem(props.value)
  }
})

/** 点击处理 */
function handleClick() {
  // 更新父组件的 v-model
  if (dropdown) {
    dropdown.updateValue(props.value)
    dropdown.hideMenu()
  }
  emit('click')
}

// 暴露方法供指令使用
defineExpose({
  setHidden,
})
</script>
