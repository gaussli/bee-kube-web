<template>
  <BeeCard class="bee-back-header">
    <div class="bee-back-header__inner">
      <!-- 左侧：返回按钮 + 分割线 + 标题 -->
      <div class="bee-back-header__left">
        <BeeButton icon="basic-arrow-left" @click="handleBack"> 返回 </BeeButton>
        <BeeDivider color="hsl(0, 0%, 70%)" direction="vertical" :length="16" margin="12px" />
        <span class="bee-back-header__title">{{ title }}</span>
      </div>
      <!-- 右侧：操作按钮组 -->
      <div class="bee-back-header__right">
        <BeeButton v-for="action in actions" :key="action.key" :type="action.type" @click="handleAction(action.key)">
          {{ action.label }}
        </BeeButton>
      </div>
    </div>
  </BeeCard>
</template>

<script setup lang="ts">
import BeeButton from '@/components/base/BeeButton/index.vue'
import BeeCard from '@/components/BeeCard/index.vue'
import BeeDivider from '@/components/BeeDivider/index.vue'

/** 操作按钮项 */
export interface ActionItem {
  /** 操作标识 */
  key: string
  /** 按钮文本 */
  label: string
  /** 按钮类型 */
  type?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
}

defineOptions({ name: 'BeeBackHeader' })

/**
 * BeeBackHeader 组件属性
 */
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
  /** 操作按钮点击，payload 为 action.key */
  action: [key: string]
}>()

function handleBack() {
  emit('back')
}

function handleAction(key: string) {
  emit('action', key)
}
</script>

<style lang="scss" scoped>
.bee-back-header {
  display: flex;
  align-items: center;
  height: 64px;

  &__inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  &__left {
    display: flex;
    align-items: center;
  }

  &__title {
    font-size: $font-size-16;
    color: $color-text-primary;
  }

  &__right {
    display: flex;
    gap: $spacing-8;
    align-items: center;
  }
}
</style>
