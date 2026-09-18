<template>
  <BeePage>
    <!-- 页面 Header -->
    <BeePageHeader v-bind="STORAGECLASS_PAGE_META" />

    <!-- 页面 Body -->
    <BeeCard class="page-body">
      <!-- 工具栏 -->
      <div class="page-body__toolbar">
        <BeeSearchInput
          v-model="searchKey"
          class="page-body__toolbar-search"
          placeholder="按 UID / 名称 / 存储提供者搜索"
        />
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
          :data="storageClasses"
          :loading="loading"
          row-key="uid"
          selectable
          @selection-change="handleSelectionChange"
        >
          <!-- 存储类信息列 -->
          <BeeTableColumn :width="500">
            <template #default="{ row }">
              <StorageClassInfoCell
                :description="row.description"
                :is-default="row.isDefault"
                :name="row.name"
                :uid="row.uid"
              />
            </template>
          </BeeTableColumn>
          <!-- 存储提供者列 -->
          <BeeTableColumn :width="200">
            <template #default="{ row }">
              <BeeTableCommonCell :label="row.provisioner" sublabel="存储提供者" />
            </template>
          </BeeTableColumn>
          <!-- 回收策略列 -->
          <BeeTableColumn :width="200">
            <template #default="{ row }">
              <BeeTableCommonCell
                :label="getReclaimPolicyLabel(row.reclaimPolicy)"
                :sublabel="row.reclaimPolicy || '-'"
              />
            </template>
          </BeeTableColumn>
          <!-- 绑定模式列 -->
          <BeeTableColumn :width="200">
            <template #default="{ row }">
              <BeeTableCommonCell
                :label="getVolumeBindingModeLabel(row.volumeBindingMode)"
                :sublabel="row.volumeBindingMode || '-'"
              />
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
          @change="fetchStorageClasses"
        />
      </div>
    </BeeCard>

    <!-- 单个删除 Dialog -->
    <BeeDialog
      v-model="deleteDialogConfig.visible"
      icon="basic-delete"
      :loading="deleteDialogConfig.loading"
      title="删除存储类"
      type="danger"
      @confirm="handleConfirmDelete"
    >
      <span>
        您确认删除 <strong>{{ selectedRow?.name || '' }}</strong> 存储类吗？
      </span>
    </BeeDialog>

    <!-- 批量删除 Dialog -->
    <BeeDialog
      v-model="batchDeleteDialogConfig.visible"
      icon="basic-delete"
      :loading="batchDeleteDialogConfig.loading"
      title="批量删除存储类"
      type="danger"
      @confirm="handleConfirmBatchDelete"
    >
      <BeeBatchDeleteDialogContent :delete-data="selectedRows" resource-type="存储类" />
    </BeeDialog>
  </BeePage>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

import { useRoute } from 'vue-router'

import type { PersistentVolumeReclaimPolicy } from '@/config/kubernetes/storage/persistentvolume'
import type { VolumeBindingMode } from '@/config/kubernetes/storage/storageclass'

import BeeButton from '@/components/base/BeeButton/index.vue'
import BeeDialog from '@/components/base/BeeDialog/index.vue'
import BeePagination from '@/components/base/BeePagination/index.vue'
import BeeSearchInput from '@/components/base/BeeSearchInput/index.vue'
import BeeTableColumn from '@/components/BeeTable/BeeTableColumn.vue'
import BeeTableCommonCell from '@/components/BeeTable/BeeTableCommonCell.vue'
import BeeTable from '@/components/BeeTable/index.vue'
import BeeActionCell from '@/components/business/BeeActionCell/index.vue'
import BeeAuditCell from '@/components/business/BeeAuditCell/index.vue'
import BeeBatchDeleteDialogContent from '@/components/business/BeeDialogContent/BeeBatchDeleteDialogContent.vue'
import BeePageHeader from '@/components/business/BeePageHeader/index.vue'
import BeeCard from '@/components/layout/BeeCard/index.vue'
import BeePage from '@/components/layout/BeePage/index.vue'

import { PERSISTENTVOLUME_RECLAIM_POLICY_OPTIONS } from '@/config/kubernetes/storage/persistentvolume'
import { STORAGECLASS_PAGE_META, VOLUME_BINDING_MODE_OPTIONS } from '@/config/kubernetes/storage/storageclass'
import { useKubernetesStore } from '@/stores'

import StorageClassInfoCell from './components/StorageClassInfoCell/index.vue'
import { useStorageClassAction } from './composables/useAction'
import { useStorageClassFetch } from './composables/useFetch'
import { useStorageClassPermission } from './composables/usePermission'
import { useStorageClassTable } from './composables/useTable'

defineOptions({ name: 'StorageClassPage' })

// ==================== Computed ====================
/** 当前集群 UID */
const clusterUid = computed(
  () => (useRoute().params.clusterUid as string) || useKubernetesStore().activeClusterUid || '',
)

// ==================== StorageClass Composables ====================
const { permissionMap } = useStorageClassPermission()
const { tableRef, loading, selectedRow, selectedRows, handleSelectionChange } = useStorageClassTable()
const { queryForm, pageData, storageClasses, fetchStorageClasses } = useStorageClassFetch(clusterUid, loading)
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
} = useStorageClassAction(
  clusterUid,
  permissionMap,
  queryForm,
  pageData,
  fetchStorageClasses,
  tableRef,
  selectedRow,
  selectedRows,
)

// ==================== Method ====================
/**
 * 获取回收策略的展示文案
 * @description 取选项中文文案，未知值回落原始值，均缺失显示 '-'
 * @param policy - 回收策略
 * @returns 回收策略展示文案
 */
function getReclaimPolicyLabel(policy?: PersistentVolumeReclaimPolicy): string {
  if (!policy) return '-'
  return PERSISTENTVOLUME_RECLAIM_POLICY_OPTIONS.find(item => item.value === policy)?.label || policy
}

/**
 * 获取卷绑定模式的展示文案
 * @description 取选项中文文案，未知值回落原始值，均缺失显示 '-'
 * @param mode - 卷绑定模式
 * @returns 卷绑定模式展示文案
 */
function getVolumeBindingModeLabel(mode?: VolumeBindingMode): string {
  if (!mode) return '-'
  return VOLUME_BINDING_MODE_OPTIONS.find(item => item.value === mode)?.label || mode
}

// ==================== Lifecycle ====================
onMounted(() => {
  void fetchStorageClasses()
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
