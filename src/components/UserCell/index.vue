<template>
  <div class="user-profile">
    <UserAvatar :src="avatar" :name="username" :size="36" />
    <div class="user-info">
      <div class="username">{{ username }}</div>
      <div class="nickname">{{ nickname || '-' }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UserAvatar from '@/components/UserAvatar/index.vue'

defineOptions({ name: 'UserProfile' })

defineProps<{
  avatar?: string
  username: string
  nickname?: string
}>()
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
      font-size: 14px;
      font-weight: 600;
      color: #303133;
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .nickname {
      font-size: 12px;
      color: #909399;
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
