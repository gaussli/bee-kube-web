<template>
  <BeeCard class="bee-back-header">
    <!-- 左侧：返回按钮 + 分割线 + 标题 -->
    <div class="bee-back-header__left">
      <BeeIconButton icon="basic-arrow-left" @click="handleBack" />
      <span class="bee-back-header__title">{{ title }}</span>
    </div>
    <!-- 右侧：操作按钮组 -->
    <div class="bee-back-header__right">
      <BeeButton
        v-for="action in actions"
        :key="action.value"
        :icon="action.icon"
        :type="action.type"
        @click="handleAction(action.value)"
      >
        {{ action.label }}
      </BeeButton>
    </div>
  </BeeCard>
</template>

<script setup lang="ts">
import BeeButton, { type BeeButtonType } from '@/components/base/BeeButton/index.vue'
import BeeIconButton from '@/components/base/BeeIconButton/index.vue'
import BeeCard from '@/components/layout/BeeCard/index.vue'

/** 操作按钮项 */
export interface ActionItem {
  /** 操作标识 */
  value: string
  /** 操作标签 */
  label: string
  /** 按钮icon */
  icon?: string
  /** 按钮类型 */
  type?: BeeButtonType
  /** 分隔线标记 */
  divided?: boolean
}

defineOptions({ name: 'BeeBackHeader' })

// ==================== Prop & Emit ====================
withDefaults(
  defineProps<{
    /** 标题文本 */
    title?: string
    /** 右侧操作按钮组 */
    actions?: ActionItem[]
  }>(),
  {
    title: '',
    actions: () => [],
  },
)

const emit = defineEmits<{
  /** 返回按钮点击 */
  back: []
  /** 操作按钮点击 */
  action: [value: string]
}>()

// ==================== Handler ====================
function handleBack() {
  emit('back')
}

function handleAction(value: string) {
  emit('action', value)
}
</script>

<style lang="scss" scoped>
.bee-back-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;

  &__left {
    display: flex;
    gap: 16px;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  &__title {
    font-size: 16px;
    font-weight: bold;
    color: $color-text-primary;
  }

  &__right {
    display: flex;
    gap: 8px;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
}
</style>
