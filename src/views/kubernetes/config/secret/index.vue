<template>
  <BeePage>
    <!-- 页面 Header -->
    <BeePageHeader v-bind="SECRET_PAGE_META" />

    <!-- 页面 Body -->
    <BeeCard class="page-body">
      <!-- 工具栏 -->
      <div class="page-body__toolbar">
        <BeeInputSearch v-model="searchKey" class="page-body__toolbar-search" placeholder="按 UID / 名称搜索" />
        <BeeSelect v-model="queryForm.namespace" :options="namespaceOptions" placeholder="命名空间筛选" :width="200" />
        <BeeSelect v-model="queryForm.type" :options="SECRET_TYPE_OPTIONS" placeholder="类型筛选" :width="200" />
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
          :data="secrets"
          :loading="loading"
          row-key="uid"
          selectable
          @selection-change="handleSelectionChange"
        >
          <!-- 密钥信息列 -->
          <BeeTableColumn :width="500">
            <template #default="{ row }">
              <SecretInfoCell :description="row.description" :name="row.name" :uid="row.uid" />
            </template>
          </BeeTableColumn>
          <!-- 命名空间列 -->
          <BeeTableColumn :width="200">
            <template #default="{ row }">
              <BeeTableCommonCell :label="row.namespace" sublabel="命名空间" />
            </template>
          </BeeTableColumn>
          <!-- 类型列 -->
          <BeeTableColumn :width="250">
            <template #default="{ row }">
              <BeeTableCommonCell
                :label="SECRET_TYPE_OPTIONS.find(item => item.value === row.type)?.label || row.type"
                :sublabel="row.type"
              />
            </template>
          </BeeTableColumn>
          <!-- 配置项列 -->
          <BeeTableColumn :width="140">
            <template #default="{ row }">
              <BeeTableCommonCell :label="String(row.dataCount ?? 0)" sublabel="配置项" />
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
          @change="fetchSecrets"
        />
      </div>
    </BeeCard>

    <!-- 单个删除 Dialog -->
    <BeeDialog
      v-model="deleteDialogConfig.visible"
      icon="basic-delete"
      :loading="deleteDialogConfig.loading"
      title="删除密钥"
      type="danger"
      @confirm="handleConfirmDelete"
    >
      <span>
        您确认删除 <strong>{{ selectedRow?.name || '' }}</strong> 密钥吗？
      </span>
    </BeeDialog>

    <!-- 批量删除 Dialog -->
    <BeeDialog
      v-model="batchDeleteDialogConfig.visible"
      icon="basic-delete"
      :loading="batchDeleteDialogConfig.loading"
      title="批量删除密钥"
      type="danger"
      @confirm="handleConfirmBatchDelete"
    >
      <BeeBatchDeleteDialogContent :delete-data="selectedRows" resource-type="密钥" />
    </BeeDialog>
  </BeePage>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

import { useRoute } from 'vue-router'

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

import { SECRET_PAGE_META, SECRET_TYPE_OPTIONS } from '@/config/kubernetes/config/secret'
import { useKubernetesStore } from '@/stores'

import { useNamespaceFetch } from '../../namespace/composables/useFetch'

import SecretInfoCell from './components/SecretInfoCell/index.vue'
import { useSecretAction } from './composables/useAction'
import { useSecretFetch } from './composables/useFetch'
import { useSecretPermission } from './composables/usePermission'
import { useSecretTable } from './composables/useTable'

defineOptions({ name: 'SecretPage' })

// ==================== Computed ====================
/** 当前集群 UID */
const clusterUid = computed(
  () => (useRoute().params.clusterUid as string) || useKubernetesStore().activeClusterUid || '',
)

// ==================== Namespace Composables ====================
const { namespaceOptions, fetchNamespaceOptions } = useNamespaceFetch(clusterUid)

// ==================== Secret Composables ====================
const { permissionMap } = useSecretPermission()
const { tableRef, loading, selectedRow, selectedRows, handleSelectionChange } = useSecretTable()
const { queryForm, pageData, secrets, fetchSecrets } = useSecretFetch(clusterUid, loading)
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
} = useSecretAction(clusterUid, permissionMap, queryForm, pageData, fetchSecrets, tableRef, selectedRow, selectedRows)

// ==================== Lifecycle ====================
onMounted(() => {
  void fetchNamespaceOptions()
  void fetchSecrets()
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
