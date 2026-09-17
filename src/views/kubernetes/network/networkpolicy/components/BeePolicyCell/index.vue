<template>
  <div class="bee-policy-cell">
    <!-- 主内容（上方）：策略类型胶囊 + 规则数徽标 -->
    <div class="bee-policy-cell__label">
      <template v-if="capsules.length">
        <div v-for="item in capsules" :key="item.value" class="bee-policy-cell__capsule">
          <BeeCapsule :copiable="false" :label="item.label" size="tiny" :type="item.capsuleType" />
          <span class="bee-policy-cell__badge" :class="`bee-policy-cell__badge--${item.capsuleType}`">
            {{ item.count }}
          </span>
        </div>
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
 * @description 纯展示单元，结构与 BeeTableCommonCell 一致：上方为策略类型胶囊（附规则数徽标）、下方为副文本，不发起任何请求
 */
import { computed } from 'vue'

import type { BeeType } from '@/config'
import type { PolicyType } from '@/config/kubernetes/network/networkpolicy'

import BeeCapsule from '@/components/base/BeeCapsule/index.vue'
import BeeEllipsisTooltipLabel from '@/components/business/BeeEllipsisTooltipLabel/index.vue'

import { NETWORKPOLICY_TYPE_OPTIONS } from '@/config/kubernetes/network/networkpolicy'

defineOptions({ name: 'BeePolicyCell' })

// ==================== 常量 ====================
/** 已知策略类型的展示顺序与胶囊配色 */
const KNOWN_TYPES: { value: PolicyType; capsuleType: BeeType }[] = [
  { value: 'Ingress', capsuleType: 'primary' },
  { value: 'Egress', capsuleType: 'warning' },
]

// ==================== Prop ====================
const props = withDefaults(
  defineProps<{
    /** 策略类型列表，如 ['Ingress', 'Egress']，空时显示 '-' */
    types?: PolicyType[]
    /** 入站规则数量，对应 Ingress 胶囊徽标 */
    ingressCount?: number
    /** 出站规则数量，对应 Egress 胶囊徽标 */
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
  const knownValues = KNOWN_TYPES.map(item => item.value)
  const knownCapsules = KNOWN_TYPES.filter(
    item => props.types.includes(item.value) || (countMap.value[item.value] ?? 0) > 0,
  ).map(item => ({
    value: item.value as string,
    label: getTypeLabel(item.value),
    count: countMap.value[item.value] ?? 0,
    capsuleType: item.capsuleType,
  }))
  const extraCapsules = props.types
    .filter(type => !knownValues.includes(type))
    .map(type => ({
      value: type as string,
      label: getTypeLabel(type),
      count: countMap.value[type] ?? 0,
      capsuleType: 'default' as BeeType,
    }))
  return [...knownCapsules, ...extraCapsules]
})
</script>

<style lang="scss" scoped>
@use 'sass:map';

/**
 * 结构与 BeeTableCommonCell 保持一致：`__label` 主内容行、`__sublabel` 副文本行
 * - `__capsule` 胶囊与徽标的组合容器，`__badge` 附着于胶囊右侧展示规则数
 * - 徽标配色跟随胶囊类型：入站 primary、出站 warning，取色与 BeeCapsule 同源
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
    gap: 12px;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: center;
    font-size: 14px;
    font-weight: normal;
    color: $color-text-primary;
  }

  &__capsule {
    display: inline-flex;
    gap: 2px;
    flex-direction: row;
    align-items: center;
  }

  &__badge {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    height: 14px;
    min-width: 14px;
    padding: 0 4px;
    border-radius: 7px;
    font-size: 10px;
    line-height: 1;

    &--primary {
      color: map.get($color, 'primary', 'text', 'base');
      background: map.get($color, 'primary', 'bg', 'base');
    }

    &--warning {
      color: map.get($color, 'warning', 'text', 'base');
      background: map.get($color, 'warning', 'bg', 'base');
    }

    &--default {
      border: 1px solid map.get($color, 'default', 'border', 'base');
      color: map.get($color, 'default', 'text', 'base');
      background: map.get($color, 'default', 'bg', 'base');
    }
  }

  &__sublabel {
    font-size: 12px;
    font-weight: normal;
    color: $color-text-third;
  }
}
</style>
