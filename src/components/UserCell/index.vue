<template>
  <div class="user-profile">
    <UserAvatar :src="avatar" :name="username" :size="36" />
    <div class="user-info">
      <div class="username">
        {{ username }}
        <span v-if="gender !== undefined && gender !== null" class="gender">{{ genderText }}</span>
      </div>
      <div class="nickname">{{ nickname || '-' }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import UserAvatar from '@/components/UserAvatar/index.vue'

defineOptions({ name: 'UserProfile' })

const props = defineProps<{
  avatar?: string
  username: string
  nickname?: string
  gender?: number
}>()

const genderText = computed(() => {
  const map = { 0: '♀', 1: '♂' }
  return props.gender !== undefined && props.gender !== null ? map[props.gender] : ''
})
</script>

<style lang="scss" scoped>
.user-profile {
  display: flex;
  gap: $spacing-8;
  align-items: center;
  height: 42px;

  .user-info {
    display: flex;
    gap: 2px;
    flex-direction: column;
    justify-content: center;
    min-width: 0;

    .username {
      display: flex;
      gap: 6px;
      align-items: center;
      overflow: hidden;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.2;
      color: $color-text-regular;
      text-overflow: ellipsis;
      white-space: nowrap;

      .gender {
        font-size: 12px;
      }
    }

    .nickname {
      overflow: hidden;
      font-size: 12px;
      line-height: 1.2;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
