<!--
  集群概览信息卡片
  @module views/kubernetes/dashboard/components/BeeClusterOverviewInfo
-->

<template>
  <div class="bee-cluster-overview-info">
    <BeeCard class="bee-cluster-overview-info__core">
      <div class="bee-cluster-overview-info__core-icon">
        <BeeIcon name="kubernetes-cluster" :size="40" />
      </div>
      <div class="bee-cluster-overview-info__core-content">
        <div class="bee-cluster-overview-info__core-content-row">
          <BeeFieldItem field-name="名称 / Name" :field-value="data.name" />
          <BeeFieldItem field-name="API Server" :field-value="data.apiServer" />
        </div>
        <BeeFieldItem field-name="描述 / Description" :field-value="data.description" />
      </div>
    </BeeCard>
    <div class="bee-cluster-overview-info__field-cards">
      <BeeFieldCard
        field-name="状态 / Status"
        :field-sub-value="statusConfig.labelEn"
        :field-value="statusConfig.label"
        :style="{ '--bee-fieldcard-text-color': statusConfig.color }"
      />
      <BeeFieldCard field-name="版本 / Version" :field-value="data.k8sVersion" />
      <BeeFieldCard field-name="运行时间 / Uptime" :field-sub-value="data.createdAt" :field-value="clusterUptime" />
      <BeeFieldCard
        field-name="证书期限 / Expired At"
        :field-sub-value="data.certExpireAt"
        :field-value="`剩余 ${certRemainDays} 天`"
        :style="certRemainDays <= CERT_EXPIRE_WARNING_DAYS ? { '--bee-fieldcard-text-color': '#e6a23c' } : {}"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { calcRemainDays, formatTimeElapsed } from '@/utils/datetime'

import BeeIcon from '@/components/base/BeeIcon/index.vue'
import BeeCard from '@/components/BeeCard/index.vue'
import BeeFieldCard from '@/components/BeeFieldCard/index.vue'
import BeeFieldItem from '@/components/BeeFieldItem/index.vue'

import { CERT_EXPIRE_WARNING_DAYS } from '@/config/kubernetes'
import { CLUSTER_STATUS_OPTIONS, type ClusterStatus } from '@/config/kubernetes/cluster'

defineOptions({ name: 'BeeClusterOverviewInfo' })

/**
 * 集群概览信息
 */
export interface ClusterOverviewInfoData {
  /** 集群名称 */
  name: string
  /** 集群描述 */
  description?: string
  /** 集群状态 */
  status: ClusterStatus
  /** 创建时间 */
  createdAt: string
  /** Kubernetes 版本 */
  k8sVersion?: string
  /** API Server 地址 */
  apiServer: string
  /** 证书到期时间 */
  certExpireAt?: string
}

const props = defineProps<{
  data: ClusterOverviewInfoData
}>()

/** 集群运行时长 */
const clusterUptime = computed(() => formatTimeElapsed(props.data.createdAt))

/** 证书剩余天数 */
const certRemainDays = computed(() => calcRemainDays(props.data.certExpireAt))

/** 集群状态配置，通过 CLUSTER_STATUS_OPTIONS 匹配 status 值获取 */
const statusConfig = computed(() => {
  const found = CLUSTER_STATUS_OPTIONS.find(c => c.value === props.data.status)
  if (!found) {
    throw new Error(`[BeeClusterOverviewInfo] 未知集群状态: ${props.data.status}`)
  }
  return found
})
</script>

<style lang="scss" scoped>
.bee-cluster-overview-info {
  display: flex;
  gap: $spacing-16;
  align-items: center;

  &__core {
    display: flex;
    gap: $spacing-16;
    align-items: flex-start;
    flex: 1;
    height: 100%;
    padding: $spacing-16;

    &-icon {
      display: flex;
      justify-content: center;
      align-items: center;
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
      align-items: center;
      flex: 1;
      width: 100%;

      &-row {
        display: flex;
        align-items: center;
        width: 100%;
      }
    }
  }

  &__field-cards {
    display: grid;
    gap: $spacing-16;
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
