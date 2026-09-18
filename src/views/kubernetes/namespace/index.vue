<template>
  <BeePage>
    <!-- 页面 Header -->
    <BeePageHeader v-bind="NAMESPACE_PAGE_META" />

    <!-- 页面 Body -->
    <BeeCard class="page-body">
      <!-- 工具栏 -->
      <div class="page-body__toolbar">
        <BeeSearchInput v-model="searchKey" class="page-body__toolbar-search" placeholder="按 UID / 名称搜索" />
        <BeeSelect v-model="queryForm.status" :options="NAMESPACE_STATUS_OPTIONS" placeholder="状态筛选" />
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
          :data="namespaces"
          :loading="loading"
          row-key="uid"
          selectable
          @selection-change="handleSelectionChange"
        >
          <!-- 命名空间信息列 -->
          <BeeTableColumn :width="500">
            <template #default="{ row }">
              <NamespaceInfoCell :description="row.description" :name="row.name" :uid="row.uid" />
            </template>
          </BeeTableColumn>
          <!-- 状态列 -->
          <BeeTableColumn :min-width="160">
            <template #default="{ row }">
              <BeeStatusCell :options="NAMESPACE_STATUS_OPTIONS" :status="row.status" :status-msg="row.statusMsg" />
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
          @change="fetchNamespaces"
        />
      </div>
    </BeeCard>

    <!-- 单个删除 Dialog -->
    <BeeDialog
      v-model="deleteDialogConfig.visible"
      icon="basic-delete"
      :loading="deleteDialogConfig.loading"
      title="删除命名空间"
      type="danger"
      @confirm="handleConfirmDelete"
    >
      <span>
        您确认删除 <strong>{{ selectedRow?.name || '' }}</strong> 命名空间吗？
      </span>
    </BeeDialog>

    <!-- 批量删除 Dialog -->
    <BeeDialog
      v-model="batchDeleteDialogConfig.visible"
      icon="basic-delete"
      :loading="batchDeleteDialogConfig.loading"
      title="批量删除命名空间"
      type="danger"
      @confirm="handleConfirmBatchDelete"
    >
      <BeeBatchDeleteDialogContent :delete-data="selectedRows" resource-type="命名空间" />
    </BeeDialog>
  </BeePage>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

import { useRoute } from 'vue-router'

import BeeButton from '@/components/base/BeeButton/index.vue'
import BeeDialog from '@/components/base/BeeDialog/index.vue'
import BeePagination from '@/components/base/BeePagination/index.vue'
import BeeSearchInput from '@/components/base/BeeSearchInput/index.vue'
import BeeSelect from '@/components/base/BeeSelect/index.vue'
import BeeTableColumn from '@/components/BeeTable/BeeTableColumn.vue'
import BeeTable from '@/components/BeeTable/index.vue'
import BeeActionCell from '@/components/business/BeeActionCell/index.vue'
import BeeAuditCell from '@/components/business/BeeAuditCell/index.vue'
import BeeBatchDeleteDialogContent from '@/components/business/BeeDialogContent/BeeBatchDeleteDialogContent.vue'
import BeePageHeader from '@/components/business/BeePageHeader/index.vue'
import BeeStatusCell from '@/components/business/BeeStatusCell/index.vue'
import BeeCard from '@/components/layout/BeeCard/index.vue'
import BeePage from '@/components/layout/BeePage/index.vue'

import { NAMESPACE_PAGE_META, NAMESPACE_STATUS_OPTIONS } from '@/config/kubernetes/namespace'
import { useKubernetesStore } from '@/stores'

import NamespaceInfoCell from './components/NamespaceInfoCell/index.vue'
import { useNamespaceAction } from './composables/useAction'
import { useNamespaceFetch } from './composables/useFetch'
import { useNamespacePermission } from './composables/usePermission'
import { useNamespaceTable } from './composables/useTable'

defineOptions({ name: 'NamespacePage' })

// ==================== Computed ====================
/** 当前集群 UID */
const clusterUid = computed(
  () => (useRoute().params.clusterUid as string) || useKubernetesStore().activeClusterUid || '',
)

// ==================== Namespace Composables ====================
const { permissionMap } = useNamespacePermission()
const { tableRef, loading, selectedRow, selectedRows, handleSelectionChange } = useNamespaceTable()
const { queryForm, pageData, namespaces, fetchNamespaces } = useNamespaceFetch(clusterUid, loading)
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
} = useNamespaceAction(
  clusterUid,
  permissionMap,
  queryForm,
  pageData,
  fetchNamespaces,
  tableRef,
  selectedRow,
  selectedRows,
)

// ==================== Lifecycle ====================
onMounted(() => {
  void fetchNamespaces()
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
