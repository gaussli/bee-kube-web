<template>
  <TransitionGroup name="bee-msg" tag="div" class="bee-message-container">
    <BeeMessageItem
      v-for="msg in messages"
      :key="msg.id"
      :type="msg.type"
      :message="msg.message"
      :show-close="msg.showClose"
      @close="onClose(msg.id)"
    />
  </TransitionGroup>
</template>

<script setup lang="ts">
/**
 * BeeMessage 消息容器组件
 * 通过 TransitionGroup 管理消息的入场/离场动画，固定在页面右上角
 * @module components/BeeMessage/BeeMessageContainer
 */
import BeeMessageItem from './BeeMessage.vue'
import { messageState, removeMessage } from './state'

defineOptions({ name: 'BeeMessageContainer' })

/** 响应式消息列表（与 state.ts 共享代理） */
const messages = messageState

/**
 * 关闭消息
 * @param id - 消息 ID
 */
function onClose(id: number) {
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
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}

// ---- TransitionGroup 动画 ----
.bee-msg-enter-active {
  transition: all 0.3s ease-out;
}

.bee-msg-leave-active {
  transition: all 0.25s ease-in;
}

.bee-msg-enter-from {
  opacity: 0;
  transform: translateX(40px);
}

.bee-msg-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}
</style>
