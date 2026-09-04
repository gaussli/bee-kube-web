<template>
  <Teleport to="body">
    <Transition name="dialog-fade">
      <div v-if="modelValue" class="bee-dialog-mask">
        <div class="bee-dialog">
          <div class="bee-dialog__header">
            <div class="bee-dialog__header-icon">
              <BeeIcon name="basic-delete" :size="24" />
            </div>
            <div class="bee-dialog__header-title">删除集群</div>
          </div>
          <div class="bee-dialog__content">您确认要删除 “{{ cluster }}” 集群吗？</div>
          <div class="bee-dialog__actions">
            <BeeButton @click="handleCancel">取 消</BeeButton>
            <BeeButton type="danger" @click="handleConfirm">确 认</BeeButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import BeeButton from '@/components/BeeButton/index.vue'
import BeeIcon from '@/components/BeeIcon/index.vue'

defineOptions({ name: 'ClusterDeleteDialog' })

// ==================== Prop & Emit ====================
const modelValue = defineModel<boolean>()
defineProps<{
  cluster: string
}>()
const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

// ==================== Handler ====================
/**
 * 取消删除
 */
function handleCancel() {
  emit('cancel')
  modelValue.value = false // defineModel 双向绑定，置 false 即关闭并触发离开过渡
}

/**
 * 确认删除
 */
function handleConfirm() {
  emit('confirm')
  modelValue.value = false
}
</script>

<style lang="scss" scoped>
@use 'sass:map';

// ==================== 遮罩层 ====================
.bee-dialog-mask {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $color-bg-mask;
}

// ==================== 对话框容器 ====================
.bee-dialog {
  filter: drop-shadow(0 0 4px rgba($color-bg-dialog, 50%));
  display: flex;
  gap: 48px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 400px;
  padding: 24px;
  border-radius: 16px;
  overflow: hidden;
  background-color: $color-bg-dialog;

  &__header {
    display: flex;
    gap: 12px;
    flex-direction: column;
    align-items: center;

    &-icon {
      padding: 16px;
      border-radius: 1000px;
      color: map.get($colors-danger, 'text', 'base');
      background: map.get($colors-danger, 'bg', 'base');
    }

    &-title {
      font-size: 16px;
      font-weight: bold;
      color: map.get($colors-danger, 'text', 'base');
      user-select: none;
    }
  }

  &__content {
    display: flex;
    gap: 16px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    font-size: 14px;
    color: $color-text-secondary;
  }

  &__actions {
    --bee-button-width: 100%;

    display: flex;
    gap: 16px;
    flex-direction: row;
    justify-content: center;
    width: 100%;
  }
}

// ==================== 过渡动画 ====================
.dialog-fade-enter-active {
  animation: dialog-fade-in 0.25s ease-out;
}

.dialog-fade-leave-active {
  animation: dialog-fade-out 0.2s ease-in;
}

.dialog-fade-enter-active .bee-dialog {
  animation: dialog-fade-in 0.25s ease-out;
}

.dialog-fade-leave-active .bee-dialog {
  animation: dialog-fade-out 0.2s ease-in;
}

@keyframes dialog-fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes dialog-fade-out {
  from {
    opacity: 1;
    transform: scale(1);
  }

  to {
    opacity: 0;
    transform: scale(0.95);
  }
}
</style>
