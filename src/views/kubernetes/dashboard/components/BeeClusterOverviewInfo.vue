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
      <BeeFieldCard prop-name="状态 / Status" :text="statusConfig.label" :subtext="statusConfig.labelEn" :style="{ '--bee-fieldcard-text-color': statusConfig.color }" />
      <BeeFieldCard prop-name="版本 / Version" :text="data.k8sVersion" subtext="" />
      <BeeFieldCard prop-name="运行时间 / Uptime" :text="clusterUptime" :subtext="data.createdAt" />
      <BeeFieldCard
        prop-name="证书期限 / Expired At"
        :text="`剩余 ${certRemainDays} 天`"
        :subtext="data.certExpireAt"
        :style="certRemainDays <= CERT_EXPIRE_WARNING_DAYS ? { '--bee-fieldcard-text-color': '#e6a23c' } : {}"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { StatusConfig } from '@/config/kubernetes'
import { calcRemainDays, formatTimeElapsed } from '@/utils/datetime'
import BeeCard from '@/components/BeeCard/index.vue'
import BeeFieldCard from '@/components/BeeFieldCard/index.vue'
import BeeFieldItem from '@/components/BeeFieldItem/index.vue'
import BeeIcon from '@/components/BeeIcon/index.vue'
import { COLOR_GRAY_70 } from '@/config/color'
import { CERT_EXPIRE_WARNING_DAYS, CLUSTER_STATUS_CONFIG } from '@/config/kubernetes'

defineOptions({ name: 'BeeClusterOverviewInfo' })

/**
 * 集群概览信息
 */
export interface ClusterOverviewInfoData {
  /** 集群名称 */
  name: string
  /** 集群描述 */
  description: string
  /** 集群状态 */
  status: number
  /** 创建时间 */
  createdAt: string
  /** Kubernetes 版本 */
  k8sVersion: string
  /** API Server 地址 */
  apiServer: string
  /** 证书到期时间 */
  certExpireAt: string
}

const props = defineProps<{
  /** 集群概览数据 */
  data: ClusterOverviewInfoData
}>()

/** 集群运行时长 */
const clusterUptime = computed(() => formatTimeElapsed(props.data.createdAt))

/** 证书剩余天数 */
const certRemainDays = computed(() => calcRemainDays(props.data.certExpireAt))

/** 集群状态配置，通过 CLUSTER_STATUS_CONFIG 匹配 status 值获取 */
const statusConfig = computed(() => {
  const found = CLUSTER_STATUS_CONFIG.find(c => c.value === props.data.status)
  return found ?? ({ label: '未知', labelEn: 'Unknown', color: COLOR_GRAY_70 } as StatusConfig)
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
    flex: 1;
    align-items: flex-start;
    height: 100%;
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
    display: grid;
    gap: $spacing-16;
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
