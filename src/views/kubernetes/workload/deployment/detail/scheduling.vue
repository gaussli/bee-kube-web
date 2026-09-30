<template>
  <div class="deployment-scheduling">
    <!-- 1. 节点亲和性 -->
    <BeeCard class="deployment-scheduling__card">
      <div class="deployment-scheduling__title">节点亲和性</div>

      <!-- 节点选择器 -->
      <div class="scheduling-block">
        <div class="scheduling-block__label">节点选择器 / nodeSelector</div>
        <div v-if="nodeSelectorChips.length > 0" class="chip-list">
          <BeeCapsule v-for="chip in nodeSelectorChips" :key="chip" :label="chip" size="small" />
        </div>
        <span v-else class="scheduling-empty">未配置节点选择器</span>
      </div>

      <!-- 硬性要求 -->
      <div class="scheduling-block">
        <div class="scheduling-block__label">必须满足 / Required</div>
        <div v-if="requiredNodeTerms.length > 0" class="term-list">
          <div v-for="(term, termIndex) in requiredNodeTerms" :key="termIndex" class="term-row">
            <BeeCapsule v-for="(chip, chipIndex) in formatNodeTerm(term)" :key="chipIndex" :label="chip" size="small" />
            <span v-if="!term.matchExpressions?.length" class="scheduling-empty">未配置匹配表达式</span>
          </div>
        </div>
        <span v-else class="scheduling-empty">未配置硬性节点亲和性</span>
      </div>

      <!-- 软性要求 -->
      <div class="scheduling-block">
        <div class="scheduling-block__label">优先满足 / Preferred</div>
        <div v-if="preferredNodeTerms.length > 0" class="term-list">
          <div v-for="(term, termIndex) in preferredNodeTerms" :key="termIndex" class="term-row">
            <BeeCapsule :label="`权重 ${term.weight}`" size="small" type="primary" />
            <BeeCapsule v-for="(chip, chipIndex) in formatNodeTerm(term)" :key="chipIndex" :label="chip" size="small" />
          </div>
        </div>
        <span v-else class="scheduling-empty">未配置软性节点亲和性</span>
      </div>
    </BeeCard>

    <!-- 2. Pod 亲和性 -->
    <BeeCard class="deployment-scheduling__card">
      <div class="deployment-scheduling__title">Pod 亲和性</div>
      <div v-if="podTermRows.length > 0" class="term-list">
        <div v-for="(row, index) in podTermRows" :key="index" class="term-row">
          <BeeCapsule :label="row.kindLabel" size="small" :type="row.kindType" />
          <BeeCapsule :label="`拓扑域 ${row.topologyKey}`" size="small" />
          <BeeCapsule v-for="(chip, chipIndex) in row.selectorChips" :key="chipIndex" :label="chip" size="small" />
          <BeeCapsule v-if="row.weight != null" :label="`权重 ${row.weight}`" size="small" />
          <span v-if="row.namespaces?.length" class="term-row__note">
            目标命名空间：{{ row.namespaces.join('、') }}
          </span>
        </div>
      </div>
      <span v-else class="scheduling-empty">未配置 Pod 亲和性 / 反亲和性</span>
    </BeeCard>

    <!-- 3. 容忍信息 -->
    <BeeCard class="deployment-scheduling__card">
      <div class="deployment-scheduling__title">容忍信息</div>
      <div v-if="tolerations.length > 0" class="term-list">
        <div v-for="(item, index) in tolerations" :key="index" class="term-row">
          <BeeCapsule :label="`键：${item.key || '全部'}`" size="small" />
          <BeeCapsule :label="`运算符：${formatTolerationOperator(item.operator)}`" size="small" />
          <BeeCapsule :label="`值：${item.value || '不限'}`" size="small" />
          <BeeCapsule :label="`效果：${formatEffect(item.effect)}`" size="small" :type="effectType(item.effect)" />
          <BeeCapsule
            v-if="item.tolerationSeconds != null"
            :label="`容忍时长：${item.tolerationSeconds} 秒`"
            size="small"
          />
        </div>
      </div>
      <span v-else class="scheduling-empty">未配置容忍</span>
    </BeeCard>
  </div>
</template>

<script setup lang="ts">
/**
 * Deployment 详情 - 调度策略
 * @module views/kubernetes/workload/deployment/detail/scheduling
 * @description 展示 Pod 模板的调度约束：节点选择器与节点亲和性、Pod 亲和性 / 反亲和性、容忍
 */
import { computed } from 'vue'

import type {
  NodeAffinityTerm,
  NodeExpression,
  PodAffinityTerm,
  WeightedPodAffinityTerm,
} from '@/types/kubernetes/pod/affinity/types'
import type { LabelSelector, LabelSelectorRequirement } from '@/types/kubernetes/types'
import type { DeploymentDetailVo } from '@/types/kubernetes/workload/deployment'

import type { BeeType } from '@/config'
import type { TaintEffect } from '@/config/kubernetes/core'
import type { TolerationOperator } from '@/config/kubernetes/pod'

import BeeCapsule from '@/components/base/BeeCapsule/index.vue'
import BeeCard from '@/components/layout/BeeCard/index.vue'

import { TAINT_EFFECT_OPTIONS } from '@/config/kubernetes/core'
import { NODE_EXPRESSION_OPERATOR_OPTIONS, TOLERATION_OPERATOR_OPTIONS } from '@/config/kubernetes/pod'

/**
 * Pod 亲和性条目
 * @remarks 把「亲和 / 反亲和」与「硬性 / 软性」拍平成同一种结构，便于统一渲染
 */
interface PodTermRow {
  /** 亲和性类型标签，如「Pod 亲和性 · 必须满足」 */
  kindLabel: string
  /** 亲和性类型配色 */
  kindType: BeeType
  /** 拓扑域键 */
  topologyKey: string
  /** 标签选择器匹配条件文本 */
  selectorChips: string[]
  /** 权重，仅软性条件有 */
  weight?: number
  /** 目标命名空间列表 */
  namespaces?: string[]
}

defineOptions({ name: 'DeploymentScheduling' })

const props = defineProps<{
  /** Deployment 详情数据 */
  data: DeploymentDetailVo
}>()

// ==================== Constants ====================
/** 运算符中文标签映射，标签选择器的运算符是节点表达式的子集，共用一份 */
const OPERATOR_LABEL_MAP: Record<string, string> = Object.fromEntries(
  NODE_EXPRESSION_OPERATOR_OPTIONS.map(item => [String(item.value), item.label]),
)

/** 容忍运算符中文标签映射 */
const TOLERATION_OPERATOR_LABEL_MAP: Record<string, string> = Object.fromEntries(
  TOLERATION_OPERATOR_OPTIONS.map(item => [String(item.value), item.label]),
)

/** 污点效果中文标签映射 */
const EFFECT_LABEL_MAP: Record<string, string> = Object.fromEntries(
  TAINT_EFFECT_OPTIONS.map(item => [String(item.value), item.label]),
)

/** 污点效果配色映射 */
const EFFECT_TYPE_MAP: Record<string, BeeType> = {
  NoSchedule: 'warning',
  PreferNoSchedule: 'default',
  NoExecute: 'danger',
}

// ==================== Computed ====================
/** Pod 模板 Spec */
const podSpec = computed(() => props.data.spec.template.spec)
/** 节点选择器标签 */
const nodeSelectorChips = computed(() =>
  Object.entries(podSpec.value.nodeSelector ?? {}).map(([key, value]) => `${key} = ${value}`),
)
/** 硬性节点亲和性条件 */
const requiredNodeTerms = computed(() => podSpec.value.affinity?.nodeAffinity?.required ?? [])
/** 软性节点亲和性条件 */
const preferredNodeTerms = computed(() => podSpec.value.affinity?.nodeAffinity?.preferred ?? [])
/** 容忍列表 */
const tolerations = computed(() => podSpec.value.tolerations ?? [])
/** Pod 亲和性与反亲和性条目 */
const podTermRows = computed<PodTermRow[]>(() => {
  const { podAffinity, podAntiAffinity } = podSpec.value.affinity ?? {}
  const rows: PodTermRow[] = []

  /**
   * 收集一类亲和性的硬性与软性条件
   * @param kindLabel - 亲和性类型标签
   * @param kindType - 亲和性类型配色
   * @param terms - 硬性条件
   * @param weightedTerms - 软性条件（带权重）
   */
  const collect = (
    kindLabel: string,
    kindType: BeeType,
    terms?: PodAffinityTerm[],
    weightedTerms?: WeightedPodAffinityTerm[],
  ) => {
    for (const term of terms ?? []) rows.push(createPodTermRow(`${kindLabel} · 必须满足`, kindType, term))
    for (const term of weightedTerms ?? []) {
      rows.push(createPodTermRow(`${kindLabel} · 优先满足`, kindType, term, term.weight))
    }
  }

  collect('Pod 亲和性', 'primary', podAffinity?.required, podAffinity?.preferred)
  collect('Pod 反亲和性', 'warning', podAntiAffinity?.required, podAntiAffinity?.preferred)
  return rows
})

// ==================== Method ====================
/**
 * 格式化标签匹配表达式
 * @param expression - 节点表达式或标签选择器表达式
 * @returns 形如「kubernetes.io/os 包含 [linux]」的文本
 */
function formatExpression(expression: NodeExpression | LabelSelectorRequirement): string {
  const operator = OPERATOR_LABEL_MAP[expression.operator] ?? expression.operator
  const values = expression.values?.length ? ` [${expression.values.join('、')}]` : ''
  return `${expression.key} ${operator}${values}`
}

/**
 * 格式化节点亲和性条件
 * @param term - 节点亲和性条件
 * @returns 匹配条件文本列表
 */
function formatNodeTerm(term: NodeAffinityTerm): string[] {
  return (term.matchExpressions ?? []).map(formatExpression)
}

/**
 * 格式化标签选择器
 * @param selector - 标签选择器
 * @returns 匹配条件文本列表
 */
function formatLabelSelector(selector?: LabelSelector): string[] {
  if (!selector) return []
  const labels = Object.entries(selector.matchLabels ?? {}).map(([key, value]) => `${key} = ${value}`)
  return [...labels, ...(selector.matchExpressions ?? []).map(formatExpression)]
}

/**
 * 构建 Pod 亲和性条目
 * @param kindLabel - 亲和性类型标签
 * @param kindType - 亲和性类型配色
 * @param term - 亲和性条件
 * @param weight - 权重，仅软性条件传入
 * @returns 渲染用条目
 */
function createPodTermRow(kindLabel: string, kindType: BeeType, term: PodAffinityTerm, weight?: number): PodTermRow {
  return {
    kindLabel,
    kindType,
    topologyKey: term.topologyKey,
    selectorChips: formatLabelSelector(term.labelSelector),
    weight,
    namespaces: term.namespaces,
  }
}

/**
 * 格式化容忍运算符
 * @param operator - 容忍运算符，为空时 K8s 默认 Equal
 * @returns 中文标签
 */
function formatTolerationOperator(operator?: TolerationOperator): string {
  const value = operator ?? 'Equal'
  return TOLERATION_OPERATOR_LABEL_MAP[value] ?? value
}

/**
 * 格式化污点效果
 * @param effect - 污点效果，为空表示匹配所有效果
 * @returns 中文标签
 */
function formatEffect(effect?: TaintEffect): string {
  if (!effect) return '全部'
  return EFFECT_LABEL_MAP[effect] ?? effect
}

/**
 * 污点效果对应的配色
 * @param effect - 污点效果
 * @returns 胶囊配色
 */
function effectType(effect?: TaintEffect): BeeType {
  return effect ? (EFFECT_TYPE_MAP[effect] ?? 'default') : 'default'
}
</script>

<style lang="scss" scoped>
.deployment-scheduling {
  display: flex;
  gap: $spacing-16;
  flex-direction: column;

  &__card {
    padding: $spacing-16;
  }

  &__title {
    margin-bottom: $spacing-16;
    font-size: $font-size-14;
    font-weight: 600;
    color: $color-text-primary;
  }
}

.scheduling-block {
  display: flex;
  gap: $spacing-8;
  flex-direction: column;

  & + & {
    margin-top: $spacing-16;
  }

  &__label {
    font-size: $font-size-12;
    color: $color-text-secondary;
  }
}

.chip-list {
  display: flex;
  gap: $spacing-8;
  flex-wrap: wrap;
}

.term-list {
  display: flex;
  gap: $spacing-8;
  flex-direction: column;
}

.term-row {
  display: flex;
  gap: $spacing-8;
  flex-wrap: wrap;
  align-items: center;
  padding: $spacing-8 $spacing-16;
  border-radius: $radius-8;
  background: $color-bg-third;

  &__note {
    font-size: $font-size-12;
    color: $color-text-third;
  }
}

.scheduling-empty {
  font-size: $font-size-12;
  color: $color-text-third;
}
</style>
