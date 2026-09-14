<template>
  <div class="bee-status-cell">
    <div class="content-top" :class="[typeClass]">
      <div class="content-top__dot"></div>
      <span class="content-top__label">{{ statusLabel }}</span>
    </div>
    <div class="content-bottom">
      <span class="content-bottom__label-en">{{ status }}</span>
      <BeeTooltip v-if="statusMsg" placement="right" :tooltip="statusMsg">
        <BeeIcon class="content-bottom__icon" name="basic-help" />
      </BeeTooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import type { Option } from '@/config/kubernetes'

import BeeIcon from '@/components/base/BeeIcon/index.vue'
import BeeTooltip from '@/components/base/BeeTooltip/index.vue'

defineOptions({ name: 'BeeStatusCell' })

// ==================== Props ====================
const props = defineProps<{
  status: string
  statusMsg?: string
  options: Option[]
}>()

// ==================== Reactive Status ====================
const statusLabel = ref<string>(props.options.find(option => option.value === props.status)?.label || '-')
const typeClass = computed(() => {
  const option = props.options.find(option => option.value === props.status)
  return option?.type && option.type != 'default' ? `bee-status-cell--${option.type}` : ''
})
</script>

<style lang="scss" scoped>
@use 'sass:map';

$types: primary, success, warning, danger;

.bee-status-cell {
  --bee-status-cell-color: #{$color-text-primary};

  display: flex;
  gap: 8px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: auto;

  @each $type in $types {
    &--#{$type} {
      --bee-status-cell-color: #{map.get($color, $type, 'text', 'base')};
    }
  }

  .content-top {
    display: flex;
    gap: 8px;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    &__dot {
      width: 10px;
      height: 10px;
      border-radius: 9999px;
      background: var(--bee-status-cell-color, #f00);
    }

    &__label {
      font-size: 14px;
      font-weight: bold;
      color: var(--bee-status-cell-color);
    }
  }

  .content-bottom {
    display: flex;
    gap: 4px;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    font-size: 12px;
    color: $color-text-third;
  }
}
</style>
