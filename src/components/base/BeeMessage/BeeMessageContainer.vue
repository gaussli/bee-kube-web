<template>
  <TransitionGroup class="bee-message-container" name="bee-message" tag="div">
    <BeeMessageItem
      v-for="message in messageItemList"
      :key="message.id"
      :message="message.message"
      :show-close="message.showClose"
      :type="message.type"
      @close="handleClose(message.id)"
    />
  </TransitionGroup>
</template>

<script setup lang="ts">
import BeeMessageItem from './BeeMessageItem.vue'
import { messageItemList, removeMessage } from './store.ts'

defineOptions({ name: 'BeeMessageContainer' })

// ==================== Handler ====================
/**
 * 关闭消息
 * @param id - 消息 ID
 */
function handleClose(id: number) {
  removeMessage(id)
}
</script>

<style lang="scss" scoped>
.bee-message-container {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 9999;
  display: flex;
  gap: 8px;
  flex-direction: column;
  pointer-events: none;
}

// ---- TransitionGroup 动画 ----
.bee-message-enter-active {
  transition: all 0.3s ease-out;
}

.bee-message-leave-active {
  transition: all 0.25s ease-in;
}

.bee-message-enter-from {
  opacity: 0;
  transform: translateX(40px);
}

.bee-message-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}
</style>
