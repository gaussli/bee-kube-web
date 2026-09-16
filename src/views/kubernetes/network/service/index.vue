<template>
  <BeePage>
    <!-- 页面 Header -->
    <BeePageHeader v-bind="SERVICE_PAGE_META" />

    <!-- 页面 Body -->
    <BeeCard class="page-body">
      <!-- 工具栏 -->
      <div class="page-body__toolbar">
        <BeeInputSearch v-model="searchKey" class="page-body__toolbar-search" placeholder="按 UID / 名称搜索" />
        <BeeSelect v-model="queryForm.namespace" :options="namespaceOptions" placeholder="命名空间筛选" :width="200" />
        <BeeSelect v-model="queryForm.type" :options="SERVICE_TYPE_OPTIONS" placeholder="类型筛选" :width="200" />
        <BeeButton icon="basic-search" @click="handleSearch"> 搜索 </BeeButton>
        <BeeButton icon="basic-refresh" @click="handleReset"> 重置 </BeeButton>
        <div v-if="permissionMap.create" class="page-body__toolbar-separator"></div>
        <BeeButton v-if="permissionMap.create" icon="basic-create" type="primary" @click="handleCreate">
          新增
        </BeeButton>
        <BeeButton v-if="permissionMap.create" icon="basic-create" type="primary" @click="handleCreateYaml">
          YAML
        </BeeButton>
      </div>

      <!-- 表格 -->
      <div class="page-body__table">
        <BeeTable
          ref="tableRef"
          :data="services"
          :loading="loading"
          row-key="uid"
          selectable
          @selection-change="handleSelectionChange"
        >
          <!-- 服务信息列 -->
          <BeeTableColumn :width="500">
            <template #default="{ row }">
              <ServiceInfoCell :description="row.description" :name="row.name" :uid="row.uid" />
            </template>
          </BeeTableColumn>
          <!-- 命名空间列 -->
          <BeeTableColumn :width="200">
            <template #default="{ row }">
              <BeeTableCommonCell :label="row.namespace" sublabel="命名空间" />
            </template>
          </BeeTableColumn>
          <!-- 类型列 -->
          <BeeTableColumn :width="200">
            <template #default="{ row }">
              <BeeTableCommonCell :label="getServiceTypeLabel(row)" :sublabel="row.type" />
            </template>
          </BeeTableColumn>
          <!-- 集群 IP 列 -->
          <BeeTableColumn :width="200">
            <template #default="{ row }">
              <BeeTableCommonCell :label="row.headless ? 'Headless' : row.clusterIp || '-'" sublabel="集群 IP" />
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
          <BeeButton :disabled="selectedRows.length === 0" icon="basic-clear" @click="handleClearSelection">
            清空
          </BeeButton>
          <BeeButton
            v-if="permissionMap.delete"
            :disabled="selectedRows.length === 0"
            icon="basic-delete"
            type="danger"
            @click="handleBatchDelete"
          >
            删除 ({{ selectedRows.length }})
          </BeeButton>
          <BeeButton v-if="permissionMap.view" icon="basic-export" @click="handleExport"> 导出 </BeeButton>
          <BeeButton v-if="permissionMap.create" icon="basic-import" @click="handleImport"> 导入 </BeeButton>
        </div>
        <BeePagination
          v-model:page="pageData.page"
          v-model:page-size="pageData.pageSize"
          :total="pageData.total"
          @change="fetchServices"
        />
      </div>
    </BeeCard>

    <!-- 单个删除 Dialog -->
    <BeeDialog
      v-model="deleteDialogConfig.visible"
      icon="basic-delete"
      :loading="deleteDialogConfig.loading"
      title="删除服务"
      type="danger"
      @confirm="handleConfirmDelete"
    >
      <span>
        您确认删除 <strong>{{ selectedRow?.name || '' }}</strong> 服务吗？
      </span>
    </BeeDialog>

    <!-- 批量删除 Dialog -->
    <BeeDialog
      v-model="batchDeleteDialogConfig.visible"
      icon="basic-delete"
      :loading="batchDeleteDialogConfig.loading"
      title="批量删除服务"
      type="danger"
      @confirm="handleConfirmBatchDelete"
    >
      <BeeBatchDeleteDialogContent :delete-data="selectedRows" resource-type="服务" />
    </BeeDialog>
  </BeePage>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

import { useRoute } from 'vue-router'

import type { ServiceListVo } from '@/types/kubernetes/network/service'

import BeeButton from '@/components/base/BeeButton/index.vue'
import BeeDialog from '@/components/base/BeeDialog/index.vue'
import BeeInputSearch from '@/components/base/BeeInputSearch/index.vue'
import BeeSelect from '@/components/base/BeeSelect/index.vue'
import BeePagination from '@/components/BeePagination/index.vue'
import BeeTableColumn from '@/components/BeeTable/BeeTableColumn.vue'
import BeeTableCommonCell from '@/components/BeeTable/BeeTableCommonCell.vue'
import BeeTable from '@/components/BeeTable/index.vue'
import BeeActionCell from '@/components/business/BeeActionCell/index.vue'
import BeeAuditCell from '@/components/business/BeeAuditCell/index.vue'
import BeeBatchDeleteDialogContent from '@/components/business/BeeDialogContent/BeeBatchDeleteDialogContent.vue'
import BeePageHeader from '@/components/business/BeePageHeader/index.vue'
import BeeCard from '@/components/layout/BeeCard/index.vue'
import BeePage from '@/components/layout/BeePage/index.vue'

import { SERVICE_PAGE_META, SERVICE_TYPE_OPTIONS } from '@/config/kubernetes/network/service'
import { useKubernetesStore } from '@/stores'

import { useNamespaceFetch } from '../../namespace/composables/useFetch'

import ServiceInfoCell from './components/ServiceInfoCell/index.vue'
import { useServiceAction } from './composables/useAction'
import { useServiceFetch } from './composables/useFetch'
import { useServicePermission } from './composables/usePermission'
import { useServiceTable } from './composables/useTable'

defineOptions({ name: 'ServicePage' })

// ==================== Computed ====================
/** 当前集群 UID */
const clusterUid = computed(
  () => (useRoute().params.clusterUid as string) || useKubernetesStore().activeClusterUid || '',
)

// ==================== Namespace Composables ====================
const { namespaceOptions, fetchNamespaceOptions } = useNamespaceFetch(clusterUid)

// ==================== Service Composables ====================
const { permissionMap } = useServicePermission()
const { tableRef, loading, selectedRow, selectedRows, handleSelectionChange } = useServiceTable()
const { queryForm, pageData, services, fetchServices } = useServiceFetch(clusterUid, loading)
const {
  searchKey,
  deleteDialogConfig,
  batchDeleteDialogConfig,
  getActions,
  handleSearch,
  handleReset,
  handleCreate,
  handleCreateYaml,
  handleBatchDelete,
  handleImport,
  handleExport,
  handleClearSelection,
  handleConfirmDelete,
  handleConfirmBatchDelete,
} = useServiceAction(clusterUid, permissionMap, queryForm, pageData, fetchServices, tableRef, selectedRow, selectedRows)

// ==================== Method ====================
/**
 * 获取服务类型的展示文案
 * @description ExternalName 类型展示外部域名，其余类型展示选项文案，均回落原始类型值
 * @param row - 服务列表行数据
 * @returns 类型展示文案
 */
function getServiceTypeLabel(row: ServiceListVo): string {
  if (row.type === 'ExternalName') {
    return row.externalName || row.type
  }
  return SERVICE_TYPE_OPTIONS.find(item => item.value === row.type)?.label || row.type
}

// ==================== Lifecycle ====================
onMounted(() => {
  void fetchNamespaceOptions()
  void fetchServices()
})
</script>

<style lang="scss" scoped>
.page-body {
  display: flex;
  gap: 16px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  flex: 1;
  width: 100%;
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

    &-separator {
      flex-shrink: 0;
      width: 1px;
      height: 16px;
      margin: 0 8px;
      background: $color-separator;
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
      justify-content: flex-start;
      align-items: center;
    }
  }
}
</style>
