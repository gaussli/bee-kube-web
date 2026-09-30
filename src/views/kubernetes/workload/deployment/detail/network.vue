<template>
  <div class="deployment-network">
    <!-- 1. 关联服务 -->
    <BeeCard class="deployment-network__card">
      <div class="deployment-network__title">关联服务（{{ services.length }}）</div>
      <BeeTable :data="services" :loading="loading" row-key="uid">
        <!-- 服务信息 -->
        <BeeTableColumn :width="480">
          <template #default="{ row }">
            <ServiceInfoCell :description="row.description" :name="row.name" :uid="row.uid" />
          </template>
        </BeeTableColumn>
        <!-- 类型 -->
        <BeeTableColumn :width="160">
          <template #default="{ row }">
            <BeeTableCommonCell :label="serviceTypeLabel(row.type)" :sublabel="row.type" />
          </template>
        </BeeTableColumn>
        <!-- 集群 IP -->
        <BeeTableColumn :width="200">
          <template #default="{ row }">
            <BeeTableCommonCell :label="row.clusterIp || '-'" sublabel="集群 IP" />
          </template>
        </BeeTableColumn>
        <!-- 访问方式 -->
        <BeeTableColumn :width="200">
          <template #default="{ row }">
            <BeeTableCommonCell :label="row.headless ? 'Headless' : '普通 Service'" sublabel="访问方式" />
          </template>
        </BeeTableColumn>
        <!-- 创建信息 -->
        <BeeTableColumn :width="200">
          <template #default="{ row }">
            <BeeAuditCell :datetime="row.createAt" field-name="创建人 / 时间" :username="row.createBy" />
          </template>
        </BeeTableColumn>
        <!-- 更新信息 -->
        <BeeTableColumn :width="200">
          <template #default="{ row }">
            <BeeAuditCell :datetime="row.updateAt" field-name="更新人 / 时间" :username="row.updateBy" />
          </template>
        </BeeTableColumn>
      </BeeTable>
      <span v-if="!loading && services.length === 0" class="deployment-network__empty">未关联服务</span>
    </BeeCard>

    <!-- 2. 关联入口 -->
    <BeeCard class="deployment-network__card">
      <div class="deployment-network__title">关联入口（{{ ingresses.length }}）</div>
      <BeeTable :data="ingresses" :loading="loading" row-key="uid">
        <!-- 入口信息 -->
        <BeeTableColumn :width="480">
          <template #default="{ row }">
            <IngressInfoCell :description="row.description" :name="row.name" :uid="row.uid" />
          </template>
        </BeeTableColumn>
        <!-- Ingress Class -->
        <BeeTableColumn :width="180">
          <template #default="{ row }">
            <BeeTableCommonCell :label="row.ingressClassName || '-'" sublabel="入口类名" />
          </template>
        </BeeTableColumn>
        <!-- 默认后端服务 -->
        <BeeTableColumn :width="220">
          <template #default="{ row }">
            <BeeTableCommonCell :label="row.defaultBackendService || '-'" sublabel="默认后端服务" />
          </template>
        </BeeTableColumn>
        <!-- 路由规则数 -->
        <BeeTableColumn :width="140">
          <template #default="{ row }">
            <BeeTableCommonCell :label="String(row.ruleCount)" sublabel="路由规则数" />
          </template>
        </BeeTableColumn>
        <!-- TLS 配置数 -->
        <BeeTableColumn :width="140">
          <template #default="{ row }">
            <BeeTableCommonCell :label="String(row.tlsCount)" sublabel="TLS 配置数" />
          </template>
        </BeeTableColumn>
        <!-- 创建信息 -->
        <BeeTableColumn :width="200">
          <template #default="{ row }">
            <BeeAuditCell :datetime="row.createAt" field-name="创建人 / 时间" :username="row.createBy" />
          </template>
        </BeeTableColumn>
        <!-- 更新信息 -->
        <BeeTableColumn :width="200">
          <template #default="{ row }">
            <BeeAuditCell :datetime="row.updateAt" field-name="更新人 / 时间" :username="row.updateBy" />
          </template>
        </BeeTableColumn>
      </BeeTable>
      <span v-if="!loading && ingresses.length === 0" class="deployment-network__empty">未关联入口</span>
    </BeeCard>
  </div>
</template>

<script setup lang="ts">
/**
 * Deployment 详情 - 关联网络
 * @module views/kubernetes/workload/deployment/detail/network
 * @description 展示该无状态应用关联的服务（Service）与入口（Ingress），数据一次拉取、不分页
 */
import { computed, onMounted, ref } from 'vue'

import { useRoute } from 'vue-router'

import type { DeploymentIngressListVo, DeploymentServiceListVo } from '@/types/kubernetes/workload/deployment'

import type { ServiceType } from '@/config/kubernetes/network/service'

import { getDeploymentNetwork } from '@/api/kubernetes/workload/deployment'

import { BeeMessage } from '@/components/base/BeeMessage'
import BeeTableColumn from '@/components/BeeTable/BeeTableColumn.vue'
import BeeTableCommonCell from '@/components/BeeTable/BeeTableCommonCell.vue'
import BeeTable from '@/components/BeeTable/index.vue'
import BeeAuditCell from '@/components/business/BeeAuditCell/index.vue'
import BeeCard from '@/components/layout/BeeCard/index.vue'

import IngressInfoCell from '@/views/kubernetes/network/ingress/components/IngressInfoCell/index.vue'
import ServiceInfoCell from '@/views/kubernetes/network/service/components/ServiceInfoCell/index.vue'

import { SERVICE_TYPE_OPTIONS } from '@/config/kubernetes/network/service'

defineOptions({ name: 'DeploymentNetwork' })

const route = useRoute()

// ==================== Computed ====================
/** 所属集群 UID（路由参数） */
const clusterUid = computed(() => route.params.clusterUid as string)
/** 所属命名空间名称（路由参数） */
const namespace = computed(() => route.params.namespace as string)
/** 被查看无状态应用名称（路由参数） */
const deploymentName = computed(() => route.params.name as string)

// ==================== Reactive State ====================
/** 加载态 */
const loading = ref(false)
/** 关联服务列表 */
const services = ref<DeploymentServiceListVo[]>([])
/** 关联入口列表 */
const ingresses = ref<DeploymentIngressListVo[]>([])

// ==================== Method ====================
/**
 * 加载关联网络资源
 */
async function fetchNetwork() {
  if (!clusterUid.value || !namespace.value || !deploymentName.value) return
  loading.value = true
  try {
    const { services: serviceList, ingresses: ingressList } = await getDeploymentNetwork(
      clusterUid.value,
      namespace.value,
      deploymentName.value,
    )
    services.value = serviceList
    ingresses.value = ingressList
  } catch {
    BeeMessage.error('加载关联网络资源失败')
  } finally {
    loading.value = false
  }
}

/**
 * 服务类型中文标签
 * @param type - 服务类型
 * @returns 中文标签，未匹配时返回原值
 */
function serviceTypeLabel(type: ServiceType): string {
  return SERVICE_TYPE_OPTIONS.find(item => item.value === type)?.label || type
}

// ==================== Lifecycle ====================
onMounted(() => {
  void fetchNetwork()
})
</script>

<style lang="scss" scoped>
.deployment-network {
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

  &__empty {
    font-size: $font-size-12;
    color: $color-text-third;
  }
}
</style>
