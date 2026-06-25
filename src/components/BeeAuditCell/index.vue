<template>
  <div class="bee-audit-cell">
    <div class="bee-audit-cell__value">
      <img v-if="userAvatar" :src="userAvatar" class="bee-audit-cell__avatar" />
      <BeeIcon v-else name="basic-id" :size="16" class="bee-audit-cell__icon" />
      <span class="bee-audit-cell__datetime">{{ datetime || '-' }}</span>
    </div>
    <span class="bee-audit-cell__key">{{ fieldName }}</span>
  </div>
</template>

<script setup lang="ts">
/**
 * 审计信息单元格组件
 * 上下结构：上方展示操作用户（头像+用户名），下方展示属性名称
 * @module components/BeeAuditCell
 */
import BeeIcon from '@/components/BeeIcon/index.vue'

defineOptions({ name: 'BeeAuditCell' })

defineProps<{
  /** 操作用户名 */
  username: string
  /** 操作用户头像地址，存在时显示头像图片，否则显示默认图标 */
  userAvatar?: string
  /** 操作时间 */
  datetime: string
  /** 属性名称 */
  fieldName: string
}>()
</script>

<style lang="scss" scoped>
.bee-audit-cell {
  display: flex;
  gap: 8px;
  flex-direction: column;
  width: 100%;
  height: auto;

  &__value {
    display: flex;
    gap: 4px;
    align-items: center;
  }

  &__avatar {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    border-radius: $radius-full;
    object-fit: cover;
  }

  &__icon {
    flex-shrink: 0;
    color: $color-text-secondary;
  }

  &__datetime {
    overflow: hidden;
    font-size: 14px;
    color: $color-text-primary;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__key {
    font-size: 12px;
    color: $color-text-tertiary;
    white-space: nowrap;
  }
}
</style>
