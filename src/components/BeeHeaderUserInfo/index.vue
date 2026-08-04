<template>
  <div class="bee-header-user-info">
    <!-- 左部分：头像 -->
    <img :src="avatarSrc" class="bee-header-user-info__avatar" alt="用户头像" />
    <!-- 右部分：用户信息 -->
    <div class="bee-header-user-info__info">
      <span class="bee-header-user-info__nickname">{{ nickname }}</span>
      <span class="bee-header-user-info__username">{{ username }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import defaultAvatarImg from '@/assets/user_avatar.png'

defineOptions({ name: 'BeeHeaderUserInfo' })

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
  gap: $spacing-8;
  align-items: center;
  box-sizing: border-box;
  width: fit-content;
  height: 100%;
  padding: $spacing-8 $spacing-16;
  border-radius: $radius-8;
  background: $color-bg-surface;
  user-select: none;

  &__avatar {
    flex-shrink: 0;
    width: auto;
    height: 100%;
    aspect-ratio: 1 / 1;
    border-radius: $radius-full;
    object-fit: cover;
    vertical-align: middle;
  }

  &__info {
    display: flex;
    gap: $spacing-4;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
  }

  &__nickname {
    overflow: hidden;
    font-size: $font-size-12;
    font-weight: bold;
    line-height: 1.2;
    color: $color-text-primary;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__username {
    overflow: hidden;
    font-size: $font-size-10;
    font-weight: normal;
    line-height: 1.2;
    color: $color-text-primary;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
