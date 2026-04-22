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
  align-items: center;
  gap: $spacing-sm;
  height: 42px;

  .user-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 2px;
    min-width: 0;

    .username {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      font-weight: 600;
      color: $text-regular;
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      .gender {
        font-size: 12px;
      }
    }

    .nickname {
      font-size: 12px;
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
