<template>
  <BeePage class="secret-page">
    <!-- 页面标题 -->
    <BeeCard class="secret-page__header">
      <BeePageTitle
        icon="kubernetes-namespace"
        title="密钥"
        description="密钥（Secret）用于存储敏感配置数据，如密码、Token、TLS 证书、Docker 仓库凭证等，实现敏感信息与工作负载的解耦。"
      />
    </BeeCard>

    <!-- 页面内容 -->
    <BeeCard class="secret-page__body">
      <!-- 查询表单 -->
      <div class="table-toolbar">
        <BeeInputSearch v-model="searchKey" placeholder="按 UID / 名称搜索" class="table-toolbar__search" />
        <BeeSelect
          v-model="queryForm.namespace"
          placeholder="命名空间筛选"
          :options="namespaceOptions"
          :width="300"
          :menu-height="300"
        />
        <BeeSelect v-model="queryForm.type" placeholder="类型筛选" :options="typeOptions" :width="300" />
        <BeeButton icon="basic-search" @click="handleSearch"> 搜索 </BeeButton>
        <BeeButton icon="basic-refresh" @click="handleReset"> 重置 </BeeButton>
        <BeeButton
          v-if="hasPermission('kubernetes:config:secret:create')"
          type="primary"
          icon="basic-create"
          @click="handleCreate"
        >
          新增
        </BeeButton>
      </div>

      <!-- 表格主体 -->
      <div class="table-body">
        <BeeTable :data="tableData" :loading="loading" selectable @selection-change="handleSelectionChange">
          <BeeTableColumn :width="400">
            <template #default="{ row }">
              <BeeSecretInfoCell
                :uid="row.uid"
                :name="row.name"
                :description="row.description"
                :icon-size="32"
                icon="kubernetes-namespace"
              />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="200">
            <template #default="{ row }">
              <BeeTableCommonCell :text="row.namespace" subtext="命名空间" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="320">
            <template #default="{ row }">
              <BeeTableCommonCell :text="row.type" subtext="类型" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="120">
            <template #default="{ row }">
              <BeeTableCommonCell :text="String(row.dataKeysCount ?? 0)" subtext="数据项" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="120">
            <template #default="{ row }">
              <BeeTableCommonCell :text="String(row.refs?.length ?? 0)" subtext="关联工作负载" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="200">
            <template #default="{ row }">
              <BeeAuditCell :username="row.createBy" :datetime="row.createAt" field-name="创建人 / 时间" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="200">
            <template #default="{ row }">
              <BeeAuditCell :username="row.updateBy" :datetime="row.updateAt" field-name="更新人 / 时间" />
            </template>
          </BeeTableColumn>
          <BeeTableColumn :width="150" fixed="right">
            <template #default="{ row }">
              <BeeActionCell :actions="getActions(row)" />
            </template>
          </BeeTableColumn>
        </BeeTable>
      </div>

      <!-- 表格底部 -->
      <div class="table-footer">
        <div>
          <BeeButton
            v-if="hasPermission('kubernetes:config:secret:delete')"
            type="danger"
            :disabled="selectedRows.length === 0"
            @click="handleBatchDelete"
          >
            批量删除 ({{ selectedRows.length }})
          </BeeButton>
        </div>
        <BeePagination
          v-model="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50]"
          @change="loadData"
        />
      </div>
    </BeeCard>

    <!-- 单个删除 Dialog -->
    <BeeDialog v-model="deleteDialogVisible" title="确认删除" @confirm="handleConfirmDelete">
      <div class="dialog-content">
        <p>
          确定要删除 Secret <strong>{{ currentTargetRow?.name }}</strong> 吗？
        </p>
      </div>
    </BeeDialog>

    <!-- 批量删除 Dialog -->
    <BeeDialog v-model="batchDeleteDialogVisible" title="确认删除" @confirm="handleConfirmBatchDelete">
      <div class="dialog-content">
        <p>
          确定要删除选中的 <strong>{{ selectedRows.length }}</strong> 个 Secret 吗？
        </p>
        <div class="delete-secret-tags">
          <BeeTag v-for="row in selectedRows" :key="row.id">
            {{ row.name }}
          </BeeTag>
        </div>
      </div>
    </BeeDialog>
  </BeePage>
</template>

<script setup lang="ts">
/**
 * Secret 管理页面
 * @module views/kubernetes/config/secret
 */
import { onMounted, reactive, ref } from 'vue'

import { useRoute, useRouter } from 'vue-router'

import type { SecretQueryReq, SecretListResp } from '@/types/kubernetes/config/secret'
import type { NamespaceSimpleListResp } from '@/types/kubernetes/namespace'

import type { ActionItem } from '@/components/BeeActionCell/index.vue'

import { getSecretList, deleteSecret, deleteSecrets } from '@/api/kubernetes/config/secret'
import { getNamespacePage } from '@/api/kubernetes/namespace'

import BeeActionCell from '@/components/BeeActionCell/index.vue'
import BeeAuditCell from '@/components/BeeAuditCell/index.vue'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeCard from '@/components/BeeCard/index.vue'
import BeeDialog from '@/components/BeeDialog/index.vue'
import BeeInputSearch from '@/components/BeeInputSearch/index.vue'
import { BeeMessage } from '@/components/BeeMessage'
import BeePage from '@/components/BeePage/index.vue'
import BeePageTitle from '@/components/BeePageTitle/index.vue'
import BeePagination from '@/components/BeePagination/index.vue'
import BeeSecretInfoCell from '@/components/BeeSecretInfoCell/index.vue'
import BeeSelect from '@/components/BeeSelect/index.vue'
import BeeTableColumn from '@/components/BeeTable/BeeTableColumn.vue'
import BeeTableCommonCell from '@/components/BeeTable/BeeTableCommonCell.vue'
import BeeTable from '@/components/BeeTable/index.vue'
import BeeTag from '@/components/BeeTag/index.vue'

import { usePermission } from '@/composables/usePermission'

defineOptions({ name: 'SecretManage' })

// ==================== Composables & Route ====================

const { hasPermission } = usePermission()
const route = useRoute()
const router = useRouter()

// ==================== Reactive State ====================

const clusterId = ref(route.params.clusterId as string)
const searchKey = ref('')
const loading = ref(false)
const tableData = ref<SecretListResp[]>([])
const selectedRows = ref<SecretListResp[]>([])
const deleteDialogVisible = ref(false)
const batchDeleteDialogVisible = ref(false)
const currentTargetRow = ref<SecretListResp | null>(null)

const queryForm = reactive<Partial<SecretQueryReq>>({})
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

// ==================== Options ====================

/** 命名空间选项 */
const namespaceOptions = ref<{ label: string; value: string | undefined }[]>([
  { label: '全部命名空间', value: undefined },
])

/** Secret 类型选项 */
const typeOptions = ref([
  { label: '全部类型', value: undefined },
  { label: 'Opaque', value: 'Opaque' },
  { label: 'kubernetes.io/tls', value: 'kubernetes.io/tls' },
  { label: 'kubernetes.io/dockerconfigjson', value: 'kubernetes.io/dockerconfigjson' },
  { label: 'kubernetes.io/basic-auth', value: 'kubernetes.io/basic-auth' },
  { label: 'kubernetes.io/ssh-auth', value: 'kubernetes.io/ssh-auth' },
  { label: 'kubernetes.io/service-account-token', value: 'kubernetes.io/service-account-token' },
  { label: 'kubernetes.io/dockercfg', value: 'kubernetes.io/dockercfg' },
  { label: 'kubernetes.io/boot-straph-token', value: 'kubernetes.io/boot-straph-token' },
])

// ==================== Data Loading ====================

/**
 * 加载命名空间选项
 * @remarks 通过 getNamespacePage mode=simple 获取简化列表，转换后填充下拉选项
 */
async function loadNamespaceOptions() {
  if (!clusterId.value) return
  try {
    const namespaces = (await getNamespacePage(clusterId.value, { mode: 'simple' })) as NamespaceSimpleListResp[]
    namespaceOptions.value = [
      { label: '全部命名空间', value: undefined },
      ...namespaces.map(ns => ({ label: ns.name, value: ns.name })),
    ]
  } catch {
    // 加载失败时保留默认选项
  }
}

/**
 * 加载 Secret 列表数据
 * @remarks 根据当前查询条件与分页参数获取 Secret 分页数据
 */
async function loadData() {
  if (!clusterId.value) {
    tableData.value = []
    return
  }
  loading.value = true
  try {
    const resp = await getSecretList(clusterId.value, {
      name: queryForm.name,
      namespace: queryForm.namespace || undefined,
      type: queryForm.type || undefined,
      page: pagination.page,
      pageSize: pagination.pageSize,
    })
    tableData.value = resp.list
    pagination.total = resp.total
  } finally {
    loading.value = false
  }
}

// ==================== Search & Reset ====================

/**
 * 搜索
 * @remarks 将 searchKey 同时映射到 id（精确匹配）和 name（模糊匹配）字段
 */
function handleSearch() {
  queryForm.id = searchKey.value
  queryForm.name = searchKey.value
  pagination.page = 1
  void loadData()
}

/**
 * 重置搜索条件
 */
function handleReset() {
  queryForm.id = undefined
  queryForm.name = undefined
  queryForm.namespace = undefined
  queryForm.type = undefined
  queryForm.labelSelector = undefined
  pagination.page = 1
  pagination.pageSize = 10
  searchKey.value = ''
  void loadData()
}

// ==================== Selection ====================

/**
 * 表格选中行变化
 * @param rows
 * @remarks BeeTable 的 selection-change 事件固定返回 Record<string, unknown>[]，需通过 unknown 桥接断言为目标类型
 */
function handleSelectionChange(rows: Record<string, unknown>[]) {
  selectedRows.value = rows as unknown as SecretListResp[]
}

// ==================== CRUD: Create / Edit / View ====================

/** 跳转创建页面 */
function handleCreate() {
  router.push({ name: 'kubernetes:config:secret:create', params: { clusterId: clusterId.value } }).catch(() => {})
}

/**
 * 跳转编辑页面
 * @param row
 */
function handleEdit(row: SecretListResp) {
  router
    .push({
      name: 'kubernetes:config:secret:edit',
      params: { clusterId: row.clusterId },
      query: { namespace: row.namespace, name: row.name },
    })
    .catch(() => {})
}

/**
 * 跳转详情页面
 * @param row
 */
function handleViewDetail(row: SecretListResp) {
  router
    .push({
      name: 'kubernetes:config:secret:detail',
      params: { clusterId: row.clusterId },
      query: { namespace: row.namespace, name: row.name },
    })
    .catch(() => {})
}

/**
 * 编辑 YAML
 * @param row
 */
function handleEditYaml(row: SecretListResp) {
  BeeMessage.info(`编辑 YAML: ${row.name}`)
}

// ==================== CRUD: Delete ====================

/**
 * 打开删除确认弹窗
 * @param row
 */
function handleDelete(row: SecretListResp) {
  currentTargetRow.value = row
  deleteDialogVisible.value = true
}

/** 确认单个删除 */
async function handleConfirmDelete() {
  if (!currentTargetRow.value) return
  try {
    await deleteSecret(currentTargetRow.value.clusterId, currentTargetRow.value.namespace, currentTargetRow.value.name)
    BeeMessage.success('删除成功')
    deleteDialogVisible.value = false
    currentTargetRow.value = null
    await loadData()
  } catch (err) {
    console.error('[handleConfirmDelete]', err)
  }
}

/** 打开批量删除确认弹窗 */
function handleBatchDelete() {
  batchDeleteDialogVisible.value = true
}

/** 确认批量删除 */
async function handleConfirmBatchDelete() {
  if (selectedRows.value.length === 0) return
  const targetClusterId = selectedRows.value[0].clusterId
  const targetNamespace = selectedRows.value[0].namespace
  const names = selectedRows.value.map(row => row.name)
  try {
    await deleteSecrets(targetClusterId, targetNamespace, names)
    BeeMessage.success(`成功删除 ${names.length} 个 Secret`)
    batchDeleteDialogVisible.value = false
    selectedRows.value = []
    await loadData()
  } catch (err) {
    console.error('[handleConfirmBatchDelete]', err)
  }
}

// ==================== Row Actions ====================

/** 页面级权限缓存，避免每个 row 都重复调用 hasPermission */
const perm: Record<string, boolean> = {
  edit: hasPermission('kubernetes:config:secret:edit'),
  view: hasPermission('kubernetes:config:secret:view'),
  delete: hasPermission('kubernetes:config:secret:delete'),
}

/**
 * 构建行操作数组
 * @param row - 当前行数据
 * @returns 操作项数组
 * @remarks 按权限和 row.deletable 条件过滤，由调用方负责
 */
function getActions(row: SecretListResp): ActionItem[] {
  const actions: ActionItem[] = []
  // 查看权限
  if (perm.view) {
    actions.push({ value: 'view', label: '详情', icon: 'basic-view', handler: () => handleViewDetail(row) })
  }
  // 编辑权限：编辑、编辑 YAML
  if (perm.edit) {
    actions.push(
      { value: 'edit', label: '编辑', icon: 'basic-edit', handler: () => handleEdit(row) },
      { value: 'yamledit', label: '编辑 YAML', icon: 'basic-code', handler: () => handleEditYaml(row) },
    )
  }
  // 删除权限 + deletable 条件
  if (perm.delete && row.deletable !== false) {
    actions.push({ value: 'delete', label: '删除', icon: 'basic-delete', handler: () => handleDelete(row) })
  }

  return actions
}

// ==================== Lifecycle ====================

onMounted(() => {
  void loadNamespaceOptions()
  void loadData()
})
</script>

<style lang="scss" scoped>
.secret-page {
  .secret-page__body {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    overflow: hidden;

    .table-toolbar {
      display: flex;
      gap: $spacing-8;
      align-items: center;
      padding: $spacing-16 0;

      &__search {
        flex: 1;
        min-width: 0;
      }
    }

    .table-body {
      flex: 1;
      min-height: 0;
    }

    .table-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: $spacing-16 0;
    }
  }
}

.dialog-content {
  strong {
    color: $color-primary;
  }
}

.delete-secret-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 12px 0;
}
</style>
