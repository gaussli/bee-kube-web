<template>
  <BeePage>
    <!-- 页面 Header -->
    <BeePageHeader v-bind="PERSISTENTVOLUMECLAIM_PAGE_META" />

    <!-- 页面 Body -->
    <BeeCard class="page-body">
      <!-- 工具栏 -->
      <div class="page-body__toolbar">
        <BeeSearchInput
          v-model="searchKey"
          class="page-body__toolbar-search"
          placeholder="按 UID / 名称 / 存储类搜索"
        />
        <BeeSelect v-model="queryForm.namespace" :options="namespaceOptions" placeholder="命名空间筛选" :width="200" />
        <BeeSelect v-model="queryForm.status" :options="PERSISTENTVOLUMECLAIM_PHASE_OPTIONS" placeholder="状态筛选" />
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
          :data="persistentVolumeClaims"
          :loading="loading"
          row-key="uid"
          selectable
          @selection-change="handleSelectionChange"
        >
          <!-- 声明信息列 -->
          <BeeTableColumn :width="500">
            <template #default="{ row }">
              <PersistentVolumeClaimInfoCell :description="row.description" :name="row.name" :uid="row.uid" />
            </template>
          </BeeTableColumn>
          <!-- 命名空间列 -->
          <BeeTableColumn :width="200">
            <template #default="{ row }">
              <BeeTableCommonCell :label="row.namespace" sublabel="命名空间" />
            </template>
          </BeeTableColumn>
          <!-- 状态列 -->
          <BeeTableColumn :min-width="160">
            <template #default="{ row }">
              <BeeStatusCell
                :options="PERSISTENTVOLUMECLAIM_PHASE_OPTIONS"
                :status="row.status"
                :status-msg="row.statusMsg"
              />
            </template>
          </BeeTableColumn>
          <!-- 存储类列 -->
          <BeeTableColumn :width="200">
            <template #default="{ row }">
              <BeeTableCommonCell :label="row.storageClassName || '-'" sublabel="存储类" />
            </template>
          </BeeTableColumn>
          <!-- 访问模式列 -->
          <BeeTableColumn :width="200">
            <template #default="{ row }">
              <BeeAccessModeCell :access-modes="row.accessModes" sublabel="访问模式" />
            </template>
          </BeeTableColumn>
          <!-- 卷模式列 -->
          <BeeTableColumn :width="160">
            <template #default="{ row }">
              <BeeTableCommonCell :label="getVolumeModeLabel(row.volumeMode)" :sublabel="row.volumeMode || '-'" />
            </template>
          </BeeTableColumn>
          <!-- 绑定 PV 列 -->
          <BeeTableColumn :width="200">
            <template #default="{ row }">
              <BeeTableCommonCell :label="getVolumeNameLabel(row)" sublabel="绑定 PV" />
            </template>
          </BeeTableColumn>
          <!-- 容量列 -->
          <BeeTableColumn :width="200">
            <template #default="{ row }">
              <BeeTableCommonCell :label="getCapacityLabel(row)" sublabel="容量" />
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
          @change="fetchPersistentVolumeClaims"
        />
      </div>
    </BeeCard>

    <!-- 单个删除 Dialog -->
    <BeeDialog
      v-model="deleteDialogConfig.visible"
      icon="basic-delete"
      :loading="deleteDialogConfig.loading"
      title="删除持久卷声明"
      type="danger"
      @confirm="handleConfirmDelete"
    >
      <span>
        您确认删除 <strong>{{ selectedRow?.name || '' }}</strong> 持久卷声明吗？
      </span>
    </BeeDialog>

    <!-- 批量删除 Dialog -->
    <BeeDialog
      v-model="batchDeleteDialogConfig.visible"
      icon="basic-delete"
      :loading="batchDeleteDialogConfig.loading"
      title="批量删除持久卷声明"
      type="danger"
      @confirm="handleConfirmBatchDelete"
    >
      <BeeBatchDeleteDialogContent :delete-data="selectedRows" resource-type="持久卷声明" />
    </BeeDialog>
  </BeePage>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

import { useRoute } from 'vue-router'

import type { PersistentVolumeClaimListVo } from '@/types/kubernetes/storage/persistentvolumeclaim'
import type { Quantity } from '@/types/kubernetes/types'

import type { PersistentVolumeMode } from '@/config/kubernetes/storage/persistentvolume'

import BeeButton from '@/components/base/BeeButton/index.vue'
import BeeDialog from '@/components/base/BeeDialog/index.vue'
import BeePagination from '@/components/base/BeePagination/index.vue'
import BeeSearchInput from '@/components/base/BeeSearchInput/index.vue'
import BeeSelect from '@/components/base/BeeSelect/index.vue'
import BeeTableColumn from '@/components/BeeTable/BeeTableColumn.vue'
import BeeTableCommonCell from '@/components/BeeTable/BeeTableCommonCell.vue'
import BeeTable from '@/components/BeeTable/index.vue'
import BeeAccessModeCell from '@/components/business/BeeAccessModeCell/index.vue'
import BeeActionCell from '@/components/business/BeeActionCell/index.vue'
import BeeAuditCell from '@/components/business/BeeAuditCell/index.vue'
import BeeBatchDeleteDialogContent from '@/components/business/BeeDialogContent/BeeBatchDeleteDialogContent.vue'
import BeePageHeader from '@/components/business/BeePageHeader/index.vue'
import BeeStatusCell from '@/components/business/BeeStatusCell/index.vue'
import BeeCard from '@/components/layout/BeeCard/index.vue'
import BeePage from '@/components/layout/BeePage/index.vue'

import { PERSISTENTVOLUME_MODE_OPTIONS } from '@/config/kubernetes/storage/persistentvolume'
import {
  PERSISTENTVOLUMECLAIM_PAGE_META,
  PERSISTENTVOLUMECLAIM_PHASE_OPTIONS,
} from '@/config/kubernetes/storage/persistentvolumeclaim'
import { useKubernetesStore } from '@/stores'

import { useNamespaceFetch } from '../../namespace/composables/useFetch'

import PersistentVolumeClaimInfoCell from './components/PersistentVolumeClaimInfoCell/index.vue'
import { usePersistentVolumeClaimAction } from './composables/useAction'
import { usePersistentVolumeClaimFetch } from './composables/useFetch'
import { usePersistentVolumeClaimPermission } from './composables/usePermission'
import { usePersistentVolumeClaimTable } from './composables/useTable'

defineOptions({ name: 'PersistentVolumeClaimPage' })

// ==================== Computed ====================
/** 当前集群 UID */
const clusterUid = computed(
  () => (useRoute().params.clusterUid as string) || useKubernetesStore().activeClusterUid || '',
)

// ==================== Namespace Composables ====================
const { namespaceOptions, fetchNamespaceOptions } = useNamespaceFetch(clusterUid)

// ==================== PersistentVolumeClaim Composables ====================
const { permissionMap } = usePersistentVolumeClaimPermission()
const { tableRef, loading, selectedRow, selectedRows, handleSelectionChange } = usePersistentVolumeClaimTable()
const { queryForm, pageData, persistentVolumeClaims, fetchPersistentVolumeClaims } = usePersistentVolumeClaimFetch(
  clusterUid,
  loading,
)
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
} = usePersistentVolumeClaimAction(
  clusterUid,
  permissionMap,
  queryForm,
  pageData,
  fetchPersistentVolumeClaims,
  tableRef,
  selectedRow,
  selectedRows,
)

// ==================== Method ====================
/**
 * 格式化存储容量
 * @description 数量为空或为 0 时视为未分配，返回空字符串
 * @param quantity - 容量对象
 * @returns 形如 '5Gi' 的容量文案
 */
function formatQuantity(quantity?: Quantity): string {
  if (!quantity || !quantity.value) return ''
  return `${quantity.value}${quantity.unit}`
}

/**
 * 获取卷模式的展示文案
 * @description 取选项中文文案，未知值回落原始值，均缺失显示 '-'
 * @param mode - 卷模式
 * @returns 卷模式展示文案
 */
function getVolumeModeLabel(mode?: PersistentVolumeMode): string {
  if (!mode) return '-'
  return PERSISTENTVOLUME_MODE_OPTIONS.find(item => item.value === mode)?.label || mode
}

/**
 * 获取绑定 PV 的展示文案
 * @description 已绑定展示 PV 名称，未绑定展示「未绑定」
 * @param row - 持久卷声明列表行数据
 * @returns 绑定 PV 展示文案
 */
function getVolumeNameLabel(row: PersistentVolumeClaimListVo): string {
  return row.volumeName || '未绑定'
}

/**
 * 获取容量的展示文案
 * @description 请求与实际容量合并展示，形如「请求 5Gi · 实际 5Gi」；实际容量未分配时只展示请求容量
 * @param row - 持久卷声明列表行数据
 * @returns 容量展示文案
 */
function getCapacityLabel(row: PersistentVolumeClaimListVo): string {
  const request = formatQuantity(row.requestStorage)
  const capacity = formatQuantity(row.capacityStorage)
  if (request && capacity) return `请求 ${request} · 实际 ${capacity}`
  if (request) return `请求 ${request}`
  if (capacity) return `实际 ${capacity}`
  return '-'
}

// ==================== Lifecycle ====================
onMounted(() => {
  void fetchNamespaceOptions()
  void fetchPersistentVolumeClaims()
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
