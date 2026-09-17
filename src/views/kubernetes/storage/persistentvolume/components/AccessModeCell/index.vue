<template>
  <div class="access-mode-cell">
    <!-- 主内容（上方）：访问模式胶囊 -->
    <div class="access-mode-cell__label">
      <template v-if="modeLabels.length">
        <BeeCapsule v-for="item in modeLabels" :key="item.value" :label="item.label" size="tiny" />
      </template>
      <span v-else>-</span>
    </div>
    <!-- 副文本（下方） -->
    <BeeEllipsisTooltipLabel v-if="sublabel" class="access-mode-cell__sublabel" :label="sublabel" />
  </div>
</template>

<script setup lang="ts">
/**
 * AccessModeCell 访问模式单元格
 * @module views/kubernetes/storage/persistentvolume/components/AccessModeCell
 * @description 纯展示单元，结构与 BeeTableCommonCell 一致：上方为访问模式胶囊、下方为副文本，不发起任何请求
 */
import { computed } from 'vue'

import type { PersistentVolumeAccessMode } from '@/config/kubernetes/core'

import BeeCapsule from '@/components/base/BeeCapsule/index.vue'
import BeeEllipsisTooltipLabel from '@/components/business/BeeEllipsisTooltipLabel/index.vue'

import { PERSISTENTVOLUME_ACCESS_MODE_OPTIONS } from '@/config/kubernetes/core'

defineOptions({ name: 'AccessModeCell' })

// ==================== Prop ====================
const props = withDefaults(
  defineProps<{
    /** 访问模式列表，如 ['ReadWriteOnce', 'ReadOnlyMany']，空时显示 '-' */
    accessModes?: PersistentVolumeAccessMode[]
    /** 副文本（下方），不传则不渲染 */
    sublabel?: string
  }>(),
  {
    accessModes: () => [],
    sublabel: '',
  },
)

// ==================== Computed ====================
/** 访问模式选项列表（原始值 + 中文文案，未知类型回落原始值） */
const modeLabels = computed(() =>
  props.accessModes.map(mode => ({
    value: mode,
    label: PERSISTENTVOLUME_ACCESS_MODE_OPTIONS.find(item => item.value === mode)?.label || mode,
  })),
)
</script>

<style lang="scss" scoped>
/**
 * 结构与 BeeTableCommonCell 保持一致：`__label` 主内容行、`__sublabel` 副文本行
 */
.access-mode-cell {
  display: flex;
  gap: 8px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: auto;

  &__label {
    display: flex;
    gap: 4px;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: center;
    font-size: 14px;
    font-weight: normal;
    color: $color-text-primary;
  }

  &__sublabel {
    font-size: 12px;
    font-weight: normal;
    color: $color-text-third;
  }
}
</style>
