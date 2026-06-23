<template>
  <Teleport to="body">
    <Transition name="dialog-fade">
      <div v-if="modelValue" class="bee-dialog-mask">
        <div class="bee-dialog" :style="dialogStyle">
          <!-- Header -->
          <div class="dialog-header">
            <span class="dialog-title">{{ title }}</span>
            <BeeButton @click="handleClose">
              <template #icon><Close /></template>
            </BeeButton>
          </div>

          <!-- Body -->
          <div class="dialog-body">
            <slot>{{ content }}</slot>
          </div>

          <!-- Footer -->
          <div class="dialog-footer">
            <BeeButton @click="handleCancel">取消</BeeButton>
            <BeeButton type="success" @click="handleConfirm">确定</BeeButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Close } from '@element-plus/icons-vue'
import BeeButton from '@/components/BeeButton/index.vue'

defineOptions({ name: 'BeeDialog' })

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    content?: string
    width?: number | string
  }>(),
  {
    title: '提示',
    content: '',
    width: 400
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'cancel': []
  'confirm': []
}>()

const dialogStyle = computed(() => {
  const widthValue = typeof props.width === 'number' ? `${props.width}px` : props.width
  return {
    '--dialog-width': widthValue
  }
})

function handleClose() {
  emit('update:modelValue', false)
  emit('cancel')
}

function handleCancel() {
  emit('update:modelValue', false)
  emit('cancel')
}

function handleConfirm() {
  emit('confirm')
}
</script>

<style lang="scss" scoped>
.bee-dialog-mask {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(0 0 0 / 60%);
}

.bee-dialog {
  width: var(--dialog-width);
  border-radius: 12px;
  overflow: hidden;
  background-color: $bg-overlay;
  box-shadow: 0 8px 32px rgb(0 0 0 / 40%);
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;

  // border-bottom: 1px solid rgba($text-secondary, 0.1);

  .dialog-title {
    font-size: 14px;
    font-weight: 600;
    color: $text-regular;
  }
}

.dialog-body {
  padding: 8px 16px;
  font-size: 14px;
  line-height: 1.6;
  color: $color-text-primary;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px;

  // border-top: 1px solid rgba($text-secondary, 0.1);
}

// 动画
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
