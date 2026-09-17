<template>
  <BeePage>
    <!-- 页面 Header -->
    <BeePageHeader v-bind="NODE_PAGE_META" />

    <!-- 页面 Body -->
    <BeeCard class="page-body">
      <!-- 工具栏 -->
      <div class="page-body__toolbar">
        <BeeInputSearch v-model="searchKey" class="page-body__toolbar-search" placeholder="按 UID / 名称 / IP 搜索" />
        <BeeSelect v-model="queryForm.status" :options="NODE_STATUS_OPTIONS" placeholder="节点状态" />
        <BeeButton icon="basic-search" @click="handleSearch"> 搜索 </BeeButton>
        <BeeButton icon="basic-refresh" @click="handleReset"> 重置 </BeeButton>
      </div>

      <!-- 表格 -->
      <div class="page-body__table">
        <BeeTable :data="nodes" :loading="loading" row-key="uid">
          <!-- 节点信息列 -->
          <BeeTableColumn :width="500">
            <template #default="{ row }">
              <NodeInfoCell :description="row.description" :ip="row.ip" :name="row.name" :uid="row.uid" />
            </template>
          </BeeTableColumn>
          <!-- 状态列 -->
          <BeeTableColumn :width="160">
            <template #default="{ row }">
              <BeeStatusCell :options="NODE_STATUS_OPTIONS" :status="row.status" :status-msg="row.statusMsg" />
            </template>
          </BeeTableColumn>
          <!-- CPU 用量列 -->
          <BeeTableColumn :width="160">
            <template #default="{ row }">
              <BeeResourceUsageCell
                field-name="CPU"
                :percentage="
                  calcPercentage(
                    toMillicoresOfQuantity(row.resource.usage.cpu),
                    toMillicoresOfQuantity(row.resource.allocation.cpu),
                  )
                "
              />
            </template>
          </BeeTableColumn>
          <!-- 内存用量列 -->
          <BeeTableColumn :width="160">
            <template #default="{ row }">
              <BeeResourceUsageCell
                field-name="内存"
                :percentage="
                  calcPercentage(
                    toBytesOfQuantity(row.resource.usage.memory),
                    toBytesOfQuantity(row.resource.allocation.memory),
                  )
                "
              />
            </template>
          </BeeTableColumn>
          <!-- Pod 数列 -->
          <BeeTableColumn :width="120">
            <template #default="{ row }">
              <BeeTableCommonCell :label="String(row.resource.usage.pods.value)" sublabel="Pod 数" />
            </template>
          </BeeTableColumn>
          <!-- Kubelet 版本列 -->
          <BeeTableColumn :width="200">
            <template #default="{ row }">
              <BeeTableCommonCell :label="row.kubeletVersion" sublabel="Kubelet 版本" />
            </template>
          </BeeTableColumn>
          <!-- 创建信息列 -->
          <BeeTableColumn :width="200">
            <template #default="{ row }">
              <BeeAuditCell :datetime="row.createAt" field-name="创建人 / 时间" :username="row.createBy" />
            </template>
          </BeeTableColumn>
          <!-- 更新信息列 -->
          <BeeTableColumn :width="200">
            <template #default="{ row }">
              <BeeAuditCell :datetime="row.updateAt" field-name="更新人 / 时间" :username="row.updateBy" />
            </template>
          </BeeTableColumn>
          <!-- 操作列 -->
          <BeeTableColumn fixed="right" :width="136">
            <template #default="{ row }">
              <BeeActionCell :actions="getActions(row)" />
            </template>
          </BeeTableColumn>
        </BeeTable>
      </div>

      <!-- 底栏 -->
      <div class="page-body__footer">
        <div class="page-body__footer-actions">
          <BeeButton v-if="permissionMap.view" icon="basic-export" @click="handleExport"> 导出 </BeeButton>
        </div>
        <BeePagination
          v-model:page="pageData.page"
          v-model:page-size="pageData.pageSize"
          :total="pageData.total"
          @change="fetchNodes"
        />
      </div>
    </BeeCard>

    <!-- 封锁确认 Dialog -->
    <BeeDialog
      v-model="cordonDialogConfig.visible"
      icon="kubernetes-cordon"
      :loading="cordonDialogConfig.loading"
      title="封锁节点"
      type="primary"
      @confirm="handleConfirmCordon"
    >
      <span>
        您确认要将节点 <strong>{{ selectedRow?.name || '' }}</strong> 标记为不可调度（封锁）吗？
      </span>
    </BeeDialog>

    <!-- 解封确认 Dialog -->
    <BeeDialog
      v-model="uncordonDialogConfig.visible"
      icon="kubernetes-uncordon"
      :loading="uncordonDialogConfig.loading"
      title="解封节点"
      type="primary"
      @confirm="handleConfirmUncordon"
    >
      <span>
        您确认要将节点 <strong>{{ selectedRow?.name || '' }}</strong> 标记为可调度（解封）吗？
      </span>
    </BeeDialog>

    <!-- 排空确认 Dialog -->
    <BeeDialog
      v-model="drainDialogConfig.visible"
      icon="kubernetes-drain"
      :loading="drainDialogConfig.loading"
      title="排空节点"
      type="primary"
      @confirm="handleConfirmDrain"
    >
      <span>
        您确认要排空节点 <strong>{{ selectedRow?.name || '' }}</strong> 上的所有 Pod 吗？
      </span>
    </BeeDialog>
  </BeePage>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

import { useRoute } from 'vue-router'

import BeeButton from '@/components/base/BeeButton/index.vue'
import BeeDialog from '@/components/base/BeeDialog/index.vue'
import BeeInputSearch from '@/components/base/BeeInputSearch/index.vue'
import BeePagination from '@/components/base/BeePagination/index.vue'
import BeeSelect from '@/components/base/BeeSelect/index.vue'
import BeeResourceUsageCell from '@/components/BeeResourceUsageCell/index.vue'
import BeeTableColumn from '@/components/BeeTable/BeeTableColumn.vue'
import BeeTableCommonCell from '@/components/BeeTable/BeeTableCommonCell.vue'
import BeeTable from '@/components/BeeTable/index.vue'
import BeeActionCell from '@/components/business/BeeActionCell/index.vue'
import BeeAuditCell from '@/components/business/BeeAuditCell/index.vue'
import BeePageHeader from '@/components/business/BeePageHeader/index.vue'
import BeeStatusCell from '@/components/business/BeeStatusCell/index.vue'
import BeeCard from '@/components/layout/BeeCard/index.vue'
import BeePage from '@/components/layout/BeePage/index.vue'

import { NODE_PAGE_META, NODE_STATUS_OPTIONS } from '@/config/kubernetes/node'
import { useKubernetesStore } from '@/stores'
import { calcPercentage, toBytesOfQuantity, toMillicoresOfQuantity } from '@/utils'

import NodeInfoCell from './components/NodeInfoCell.vue'
import { useNodeAction } from './composables/useAction'
import { useNodeFetch } from './composables/useFetch'
import { useNodePermission } from './composables/usePermission'
import { useNodeTable } from './composables/useTable'

defineOptions({ name: 'NodePage' })

// ==================== Computed ====================
/** 当前集群 UID */
const clusterUid = computed(
  () => (useRoute().params.clusterUid as string) || useKubernetesStore().activeClusterUid || '',
)

// ==================== Node Composables ====================
const { permissionMap } = useNodePermission()
const { loading, selectedRow } = useNodeTable()
const { queryForm, pageData, nodes, fetchNodes } = useNodeFetch(clusterUid, loading)
const {
  searchKey,
  cordonDialogConfig,
  uncordonDialogConfig,
  drainDialogConfig,
  getActions,
  handleSearch,
  handleReset,
  handleExport,
  handleConfirmCordon,
  handleConfirmUncordon,
  handleConfirmDrain,
} = useNodeAction(clusterUid, permissionMap, queryForm, pageData, fetchNodes, selectedRow)

// ==================== Lifecycle ====================
onMounted(() => {
  void fetchNodes()
})
</script>

<style lang="scss" scoped>
.page-body {
  display: flex;
  gap: 16px;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  padding: 16px;
  overflow: hidden;

  &__toolbar {
    display: flex;
    gap: 8px;
    flex-flow: row wrap;
    align-items: center;

    &-search {
      flex: 1;
      min-width: 100px;
    }
  }

  &__table {
    flex: 1;
    min-height: 0;
  }

  &__footer {
    display: flex;
    gap: 8px;
    flex-flow: row wrap;
    justify-content: space-between;
    align-items: center;

    &-actions {
      display: flex;
      gap: 8px;
      flex-flow: row wrap;
      align-items: center;
    }
  }
}
</style>
