<!--
  Deployment 概览面板
  @module views/kubernetes/workload/deployment/detail/overview
-->

<template>
  <div class="deployment-overview">
    <!-- 1. 副本统计 -->
    <BeeCard class="deployment-overview__section">
      <div class="replica-stats">
        <div
          class="replica-stats__ring"
          :style="{
            background: `conic-gradient(${replicaRingColor} 0% ${replicaPercentage}%, $color-bg-elevated ${replicaPercentage}% 100%)`,
          }"
        >
          <div class="replica-stats__ring-inner">
            <span class="replica-stats__ring-value" :style="{ color: replicaRingColor }">{{ replicaPercentage }}%</span>
          </div>
        </div>
        <div class="replica-stats__grid">
          <div class="replica-stats__item">
            <div class="replica-stats__item-label">期望副本</div>
            <div class="replica-stats__item-value">{{ data.spec.replicas }}</div>
            <div class="replica-stats__item-sublabel">Desired Replicas</div>
          </div>
          <div class="replica-stats__item">
            <div class="replica-stats__item-label">就绪副本</div>
            <div class="replica-stats__item-value">{{ data.statusObj.readyReplicas }}</div>
            <div class="replica-stats__item-sublabel">Ready Replicas</div>
          </div>
          <div class="replica-stats__item">
            <div class="replica-stats__item-label">可用副本</div>
            <div class="replica-stats__item-value">{{ data.statusObj.availableReplicas }}</div>
            <div class="replica-stats__item-sublabel">Available Replicas</div>
          </div>
          <div class="replica-stats__item">
            <div class="replica-stats__item-label">已更新副本</div>
            <div class="replica-stats__item-value">{{ data.statusObj.updatedReplicas }}</div>
            <div class="replica-stats__item-sublabel">Updated Replicas</div>
          </div>
        </div>
      </div>
    </BeeCard>

    <!-- 2. 基本信息 -->
    <BeeCard class="deployment-overview__section">
      <div class="deployment-overview__section-title">基本信息</div>
      <div class="basic-info">
        <div class="basic-info__col">
          <BeeFieldItem field-name="名称" :field-value="data.metadata.name" />
          <BeeFieldItem field-name="UID" :field-value="data.uid" />
          <BeeFieldItem field-name="标签选择器" :field-value="selectorText" />
          <BeeFieldItem field-name="版本" :field-value="`v${data.metadata.generation}`" />
          <BeeFieldItem field-name="创建者" :field-value="data.createBy" />
          <BeeFieldItem field-name="Namespace" :field-value="data.namespace" />
        </div>
        <div class="basic-info__col">
          <BeeFieldItem field-name="副本计数" :field-value="String(data.spec.replicas)" />
          <BeeFieldItem field-name="集群名称" :field-value="data.cluster" />
          <BeeFieldItem field-name="创建时间" :field-value="data.createAt" />
          <BeeFieldItem field-name="更新时间" :field-value="data.updateAt" />
        </div>
      </div>
    </BeeCard>

    <!-- 3. 标签 -->
    <BeeCard class="deployment-overview__section">
      <div class="deployment-overview__section-title">标签</div>
      <div class="tag-list">
        <span v-for="[key, val] in labels" :key="key" class="tag-pill">{{ key }}: {{ val }}</span>
      </div>
    </BeeCard>

    <!-- 4. 注解 -->
    <BeeCard class="deployment-overview__section">
      <div class="deployment-overview__section-title">注解</div>
      <div class="tag-list">
        <span v-for="[key, val] in annotations" :key="key" class="tag-pill">{{ key }}: {{ val }}</span>
      </div>
    </BeeCard>

    <!-- 5. 资源配额 -->
    <BeeCard class="deployment-overview__section">
      <div class="resource-list">
        <div class="resource-item">
          <div class="resource-item__name">CPU</div>
          <div class="resource-item__detail">
            <div class="resource-item__group">
              <div class="resource-item__group-label">请求 / Request</div>
              <div class="resource-item__group-value">{{ resources?.request?.cpu || '-' }}</div>
            </div>
            <div class="resource-item__group">
              <div class="resource-item__group-label">限制 / Limit</div>
              <div class="resource-item__group-value">{{ resources?.limit?.cpu || '-' }}</div>
            </div>
          </div>
        </div>
        <div class="resource-item">
          <div class="resource-item__name">内存</div>
          <div class="resource-item__detail">
            <div class="resource-item__group">
              <div class="resource-item__group-label">请求 / Request</div>
              <div class="resource-item__group-value">{{ resources?.request?.memory || '-' }}</div>
            </div>
            <div class="resource-item__group">
              <div class="resource-item__group-label">限制 / Limit</div>
              <div class="resource-item__group-value">{{ resources?.limit?.memory || '-' }}</div>
            </div>
          </div>
        </div>
      </div>
    </BeeCard>

    <!-- 6. 条件 -->
    <BeeCard class="deployment-overview__section">
      <div class="condition-list">
        <div v-for="(cond, index) in data.statusObj.conditions" :key="index" class="condition-item">
          <div class="condition-item__type">{{ cond.type }}</div>
          <div
            class="condition-item__status"
            :class="`condition-item__status--${cond.status === 'True' ? 'true' : 'false'}`"
          >
            <span class="condition-item__status-dot" />
            {{ cond.status }}
          </div>
          <div class="condition-item__reason">{{ cond.reason }}</div>
          <div class="condition-item__message">{{ cond.message }}</div>
          <div class="condition-item__time">{{ cond.lastUpdateTime }}</div>
        </div>
      </div>
    </BeeCard>

    <!-- 7. 更新策略 -->
    <BeeCard class="deployment-overview__section">
      <div class="strategy-info">
        <div class="strategy-info__item">
          <div class="strategy-info__item-label">更新策略</div>
          <div class="strategy-info__item-value">{{ strategyLabel }}</div>
        </div>
        <div class="strategy-info__item">
          <div class="strategy-info__item-label">最大不可用量</div>
          <div class="strategy-info__item-value">
            maxUnavailable {{ data.spec.strategy.rollingUpdate.maxUnavailable }}
          </div>
        </div>
        <div class="strategy-info__item">
          <div class="strategy-info__item-label">最大超出副本数</div>
          <div class="strategy-info__item-value">maxSurge {{ data.spec.strategy.rollingUpdate.maxSurge }}</div>
        </div>
      </div>
    </BeeCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { DeploymentDetailVo } from '@/types/kubernetes/workload/types'

import { calcPercentage } from '@/utils/kubernetes'

import BeeCard from '@/components/BeeCard/index.vue'
import BeeFieldItem from '@/components/BeeFieldItem/index.vue'

defineOptions({ name: 'DeploymentOverview' })

const props = defineProps<{
  /** Deployment 详情数据 */
  data: DeploymentDetailVo
}>()

/** 副本就绪百分比 */
const replicaPercentage = computed(() => {
  const { readyReplicas } = props.data.status
  const desired = props.data.spec.replicas
  return calcPercentage(readyReplicas, desired)
})

/** 副本就绪环形颜色 */
const replicaRingColor = computed(() => {
  const pct = replicaPercentage.value
  if (pct >= 100) return '$color-success'
  if (pct >= 50) return '$color-warning'
  return '$color-danger'
})

/** 标签选择器展示文本 */
const selectorText = computed(() => {
  const sel = props.data.spec.selector.matchLabels
  return Object.entries(sel)
    .map(([k, v]) => `${k}: ${v}`)
    .join(', ')
})

/** 标签列表 */
const labels = computed(() => Object.entries(props.data.metadata.labels))

/** 注解列表 */
const annotations = computed(() => Object.entries(props.data.metadata.annotations))

/** 主容器计算资源配置（取模板中第一个主容器） */
const resources = computed(() => {
  const containers = props.data.spec.template.spec.containers
  return containers.length > 0 ? containers[0].resources : undefined
})

/** 更新策略中文名称映射 */
const strategyLabelMap: Record<string, string> = {
  RollingUpdate: '滚动更新 / RollingUpdate',
  Recreate: '重建 / Recreate',
}

/** 更新策略展示文本 */
const strategyLabel = computed(() => {
  return strategyLabelMap[props.data.spec.strategy.type] || props.data.spec.strategy.type
})
</script>

<style lang="scss" scoped>
.deployment-overview {
  display: flex;
  gap: $spacing-16;
  flex-direction: column;

  &__section {
    padding: $spacing-16;

    &-title {
      margin-bottom: $spacing-16;
      font-size: $font-size-14;
      font-weight: 600;
      color: $color-text-primary;
    }
  }
}

/* 副本统计 */
.replica-stats {
  display: flex;
  gap: $spacing-24;
  align-items: center;

  &__ring {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: conic-gradient($color-success 0% 100%, $color-bg-elevated 100% 100%);

    &-inner {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: $color-bg-surface;
    }

    &-value {
      font-size: $font-size-18;
      font-weight: bold;
      color: $color-success;
    }
  }

  &__grid {
    display: grid;
    gap: $spacing-16;
    flex: 1;
    grid-template-columns: repeat(2, 1fr);
  }

  &__item {
    display: flex;
    gap: $spacing-4;
    flex-direction: column;
    padding: $spacing-16;
    border-radius: $radius-8;
    background: $color-bg-elevated;

    &-label {
      font-size: $font-size-12;
      color: $color-text-secondary;
    }

    &-value {
      font-size: $font-size-18;
      font-weight: bold;
      color: $color-text-primary;
    }

    &-sublabel {
      font-size: $font-size-10;
      color: $color-text-tertiary;
    }
  }
}

/* 基本信息 */
.basic-info {
  display: grid;
  gap: $spacing-8 $spacing-24;
  grid-template-columns: repeat(2, 1fr);
}

/* 标签 & 注解 */
.tag-list {
  display: flex;
  gap: $spacing-8;
  flex-wrap: wrap;
}

.tag-pill {
  padding: $spacing-4 $spacing-8;
  border-radius: $radius-4;
  font-size: $font-size-12;
  color: $color-text-secondary;
  background: $color-bg-elevated;
}

/* 资源配额 */
.resource-list {
  display: flex;
  gap: $spacing-16;
  flex-direction: column;
}

.resource-item {
  display: flex;
  gap: $spacing-24;
  align-items: center;

  &__name {
    width: 60px;
    font-size: $font-size-14;
    font-weight: 600;
    color: $color-text-primary;
  }

  &__detail {
    display: flex;
    gap: $spacing-24;
    flex: 1;
  }

  &__group {
    flex: 1;

    &-label {
      margin-bottom: $spacing-4;
      font-size: $font-size-10;
      color: $color-text-tertiary;
    }

    &-value {
      font-size: $font-size-14;
      color: $color-text-primary;
    }
  }
}

/* 条件 */
.condition-list {
  display: flex;
  gap: $spacing-8;
  flex-direction: column;
}

.condition-item {
  display: grid;
  gap: $spacing-16;
  align-items: center;
  grid-template-columns: 100px 80px 160px 1fr 140px;
  padding: $spacing-8 $spacing-16;
  border-radius: $radius-8;
  background: $color-bg-elevated;

  &__type {
    font-size: $font-size-12;
    font-weight: 500;
    color: $color-text-primary;
  }

  &__status {
    display: flex;
    gap: $spacing-4;
    align-items: center;
    font-size: $font-size-12;
    font-weight: 500;

    &--true {
      color: $color-success;
    }

    &--false {
      color: $color-danger;
    }

    &-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentcolor;
    }
  }

  &__reason {
    font-size: $font-size-12;
    color: $color-text-secondary;
  }

  &__message {
    font-size: $font-size-12;
    color: $color-text-tertiary;
  }

  &__time {
    font-size: $font-size-10;
    color: $color-text-tertiary;
    text-align: right;
  }
}

/* 更新策略 */
.strategy-info {
  display: flex;
  gap: $spacing-24;

  &__item {
    flex: 1;

    &-label {
      margin-bottom: $spacing-4;
      font-size: $font-size-10;
      color: $color-text-tertiary;
    }

    &-value {
      font-size: $font-size-14;
      color: $color-text-primary;
    }
  }
}
</style>
