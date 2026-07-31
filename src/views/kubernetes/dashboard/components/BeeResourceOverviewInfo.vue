<!--
  资源概览信息卡片
  @module views/kubernetes/dashboard/components/BeeResourceOverviewInfo
-->

<template>
  <div class="bee-resource-overview-info">
    <BeeCard class="bee-resource-overview-info__core">
      <div class="bee-resource-overview-info__core-icon">
        <BeeIcon name="kubernetes-cluster" :size="40" />
      </div>
      <div class="bee-resource-overview-info__core-content">
        <div class="bee-resource-overview-info__core-content-row">
          <BeeFieldItem field-name="名称 / Name" :field-value="data.name" />
          <BeeFieldItem field-name="命名空间 / Namespace" :field-value="data.namespace" />
        </div>
        <BeeFieldItem field-name="描述 / Description" :field-value="data.description" />
      </div>
    </BeeCard>
    <div class="bee-resource-overview-info__field-cards">
      <BeeFieldCard field-name="运行时间 / Uptime" :field-value="resourceUptime" :field-sub-value="data.createdAt" />
      <BeeFieldCard field-name="状态 / Status" :field-value="statusConfig.label" :field-sub-value="statusConfig.labelEn" :style="{ '--bee-fieldcard-text-color': statusConfig.color }" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatTimeElapsed } from '@/utils/datetime'
import BeeCard from '@/components/BeeCard/index.vue'
import BeeFieldCard from '@/components/BeeFieldCard/index.vue'
import BeeFieldItem from '@/components/BeeFieldItem/index.vue'
import BeeIcon from '@/components/BeeIcon/index.vue'
import { DEPLOYMENT_STATUS_OPTIONS } from '@/config/kubernetes'

defineOptions({ name: 'BeeResourceOverviewInfo' })

/**
 * 资源概览信息
 */
export interface ResourceOverviewInfoData {
  /** 命名空间 */
  namespace: string
  /** 资源名称 */
  name: string
  /** 资源描述 */
  description?: string
  /** 资源状态 */
  status: string
  /** 创建时间 */
  createdAt: string
}

const props = defineProps<{
  data: ResourceOverviewInfoData
}>()

/** 资源运行时长 */
const resourceUptime = computed(() => formatTimeElapsed(props.data.createdAt))

/** 资源状态配置，通过 DEPLOYMENT_STATUS_OPTIONS 匹配 status 值获取 */
const statusConfig = computed(() => {
  const found = DEPLOYMENT_STATUS_OPTIONS.find(c => c.value === props.data.status)
  if (!found) {
    throw new Error(`[BeeResourceOverviewInfo] 未知资源状态: ${props.data.status}`)
  }
  return found
})
</script>

<style lang="scss" scoped>
.bee-resource-overview-info {
  display: flex;
  gap: $spacing-16;
  align-items: stretch;

  &__core {
    display: flex;
    gap: $spacing-16;
    flex: 1;
    align-items: flex-start;
    padding: $spacing-16;

    &-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      border-radius: 50% 0 50% 50%;
      color: $color-primary;
      background: $color-bg-elevated;
    }

    &-content {
      display: flex;
      gap: $spacing-16;
      flex-direction: column;
      flex: 1;
      align-items: center;
      width: 100%;

      &-row {
        display: flex;
        align-items: center;
        width: 100%;
      }
    }
  }

  &__field-cards {
    display: flex;
    gap: $spacing-16;
  }
}
</style>
