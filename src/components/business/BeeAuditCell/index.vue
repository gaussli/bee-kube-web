<template>
  <div class="bee-audit-cell">
    <div class="bee-audit-cell__top">
      <BeeTooltip :tooltip="username">
        <img v-if="userAvatar" class="bee-audit-cell__avatar" :src="userAvatar" />
        <BeeIcon v-else class="bee-audit-cell__icon" name="basic-avatar" />
      </BeeTooltip>
      <span class="bee-audit-cell__datetime">{{ datetime || '-' }}</span>
    </div>
    <span class="bee-audit-cell__bottom">{{ fieldName }}</span>
  </div>
</template>

<script setup lang="ts">
import BeeIcon from '@/components/base/BeeIcon/index.vue'
import BeeTooltip from '@/components/base/BeeTooltip/index.vue'

defineOptions({ name: 'BeeAuditCell' })

// ==================== Props ====================
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
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: auto;

  &__top {
    display: flex;
    gap: 4px;
    justify-content: flex-start;
    align-items: center;
    font-size: 14px;
    font-weight: normal;
    color: $color-text-primary;
  }

  &__avatar {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    border-radius: 9999px;
    object-fit: cover;
  }

  &__bottom {
    font-size: 12px;
    font-weight: normal;
    color: $color-text-third;
  }
}
</style>
