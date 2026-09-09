<template>
  <div class="bee-header-user-info">
    <!-- 左部分：头像 -->
    <img alt="用户头像" class="bee-header-user-info__avatar" :src="avatarSrc" />
    <!-- 右部分：用户信息 -->
    <div class="bee-header-user-info__content">
      <span class="bee-header-user-info__nickname">{{ nickname }}</span>
      <span class="bee-header-user-info__username">{{ username }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import defaultAvatarImg from '@/assets/user_avatar.png'

defineOptions({ name: 'BeeHeaderUserInfo' })

// ==================== Prop  ====================
const props = withDefaults(
  defineProps<{
    /** 头像图片地址，为空时使用默认头像 */
    img?: string
    /** 用户昵称 */
    nickname?: string
    /** 用户名 */
    username?: string
  }>(),
  {
    img: '',
    nickname: '',
    username: '',
  },
)

/** 头像地址，为空时使用默认头像 */
const avatarSrc = computed(() => props.img || defaultAvatarImg)
</script>

<style lang="scss" scoped>
.bee-header-user-info {
  display: flex;
  gap: 12px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 8px 12px;
  border-radius: 8px;
  background: $color-bg-secondary;
  user-select: none;

  &__avatar {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    border-radius: 9999px;
    object-fit: cover;
  }

  &__content {
    display: flex;
    gap: 8px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }

  &__nickname {
    font-size: 13px;
    font-weight: bold;
    color: $color-text-primary;
  }

  &__username {
    font-size: 12px;
    font-weight: normal;
    color: $color-text-secondary;
  }
}
</style>
