<template>
  <div class="bee-scale-dialog-content">
    <span>
      将{{ resourceType }} <strong>{{ name }}</strong> 的副本数由 <strong>{{ currentReplicas }}</strong> 调整为：
    </span>
    <BeeFieldNumber
      id="scale-replicas"
      v-model="modelValue"
      icon="kubernetes-scale"
      label="副本数"
      :max-length="10"
      required
      tip="副本数需为 0 或正整数；设为 0 会停止该应用的全部 Pod。"
      :validator="validateReplicas"
    />
  </div>
</template>

<script setup lang="ts">
import { watchEffect } from 'vue'

import type { RuleResult } from '@/validators/types'

import BeeFieldNumber from '@/components/base/BeeFieldNumber/index.vue'

/**
 * 扩缩容弹窗内容
 * @description 展示「由当前副本数调整为」并编辑目标副本数，供各工作负载的扩缩容弹窗复用。
 * 副本数校验由本组件负责，结果通过 `v-model:valid` 反馈给父级，用于禁用弹窗的确认按钮
 * @example
 * ```vue
 * <BeeScaleDialogContent
 *   v-model="scaleForm.replicas"
 *   v-model:valid="scaleForm.valid"
 *   :current-replicas="selectedRow?.replicas ?? 0"
 *   resource-type="无状态应用"
 *   :name="selectedRow?.name || ''"
 * />
 * ```
 */
defineOptions({ name: 'BeeScaleDialogContent' })

// ==================== Prop & Emit ====================
const modelValue = defineModel<number>()
const valid = defineModel<boolean>('valid', { default: true })

defineProps<{
  /** 被扩缩容的资源名称 */
  name: string
  /** 被扩缩容的资源类型，如「无状态应用」 */
  resourceType: string
  /** 当前副本数，用于展示「由 N 调整为」 */
  currentReplicas: number
}>()

// ==================== Method ====================
/**
 * 校验副本数
 * @remarks 数字字段不能用 `chain().required()`（其内部对值调用 `trim()`），故此处单独判断
 * @param value - 目标副本数
 * @returns 校验错误文案，通过时为 undefined
 */
function validateReplicas(value: number | undefined): RuleResult {
  if (value == null) return '请输入副本数'
  return Number.isInteger(value) && value >= 0 ? undefined : '副本数需为 0 或正整数'
}

// ==================== Watch ====================
/** 实时同步校验结果给父级 */
watchEffect(() => {
  valid.value = validateReplicas(modelValue.value) == null
})
</script>

<style lang="scss" scoped>
.bee-scale-dialog-content {
  display: flex;
  gap: 16px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  width: 100%;

  strong {
    color: $color-text-primary;
  }
}
</style>
