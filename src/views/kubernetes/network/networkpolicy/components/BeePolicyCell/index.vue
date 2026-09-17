<template>
  <div class="bee-policy-cell">
    <!-- 主内容（上方）：策略类型分段胶囊（左段类型、右段规则数） -->
    <div class="bee-policy-cell__label">
      <template v-if="capsules.length">
        <BeeSegmentCapsule
          v-for="item in capsules"
          :key="item.value"
          :label="item.label"
          size="tiny"
          :sublabel="String(item.count)"
        />
      </template>
      <span v-else>-</span>
    </div>
    <!-- 副文本（下方） -->
    <BeeEllipsisTooltipLabel v-if="sublabel" class="bee-policy-cell__sublabel" :label="sublabel" />
  </div>
</template>

<script setup lang="ts">
/**
 * BeePolicyCell 网络策略单元格
 * @module views/kubernetes/network/networkpolicy/components/BeePolicyCell
 * @description 纯展示单元，结构与 BeeTableCommonCell 一致：上方为策略类型分段胶囊（左段类型、右段规则数）、
 *              下方为副文本，不发起任何请求
 */
import { computed } from 'vue'

import type { PolicyType } from '@/config/kubernetes/network/networkpolicy'

import BeeSegmentCapsule from '@/components/base/BeeSegmentCapsule/index.vue'
import BeeEllipsisTooltipLabel from '@/components/business/BeeEllipsisTooltipLabel/index.vue'

import { NETWORKPOLICY_TYPE_OPTIONS } from '@/config/kubernetes/network/networkpolicy'

defineOptions({ name: 'BeePolicyCell' })

// ==================== 常量 ====================
/** 已知策略类型的展示顺序 */
const KNOWN_TYPES: PolicyType[] = ['Ingress', 'Egress']

// ==================== Prop ====================
const props = withDefaults(
  defineProps<{
    /** 策略类型列表，如 ['Ingress', 'Egress']，空时显示 '-' */
    types?: PolicyType[]
    /** 入站规则数量，对应 Ingress 胶囊右段 */
    ingressCount?: number
    /** 出站规则数量，对应 Egress 胶囊右段 */
    egressCount?: number
    /** 副文本（下方），不传则不渲染 */
    sublabel?: string
  }>(),
  {
    types: () => [],
    ingressCount: 0,
    egressCount: 0,
    sublabel: '',
  },
)

// ==================== Computed ====================
/** 各策略类型对应的规则数量 */
const countMap = computed<Record<string, number>>(() => ({
  Ingress: props.ingressCount,
  Egress: props.egressCount,
}))

/**
 * 类型展示文案（未知类型回落原始值）
 * @param type
 */
function getTypeLabel(type: string): string {
  return NETWORKPOLICY_TYPE_OPTIONS.find(item => item.value === type)?.label || type
}

/**
 * 胶囊列表
 * @description 已知类型按固定顺序展示；类型命中 policyTypes 或规则数大于 0 均输出，避免计数丢失；未知类型追加在末尾
 */
const capsules = computed(() => {
  const knownCapsules = KNOWN_TYPES.filter(type => props.types.includes(type) || (countMap.value[type] ?? 0) > 0).map(
    type => ({
      value: type as string,
      label: getTypeLabel(type),
      count: countMap.value[type] ?? 0,
    }),
  )
  const extraCapsules = props.types
    .filter(type => !KNOWN_TYPES.includes(type))
    .map(type => ({
      value: type as string,
      label: getTypeLabel(type),
      count: countMap.value[type] ?? 0,
    }))
  return [...knownCapsules, ...extraCapsules]
})
</script>

<style lang="scss" scoped>
/**
 * 结构与 BeeTableCommonCell 保持一致：`__label` 主内容行、`__sublabel` 副文本行
 */
.bee-policy-cell {
  display: flex;
  gap: 8px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: auto;

  &__label {
    display: flex;
    gap: 8px;
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
