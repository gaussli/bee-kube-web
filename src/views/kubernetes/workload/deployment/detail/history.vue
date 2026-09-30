<template>
  <div class="deployment-history">
    <!-- 工具栏 -->
    <div class="deployment-history__toolbar">
      <BeeSearchInput
        v-model="searchForm.revision"
        class="deployment-history__toolbar-search"
        placeholder="按版本号搜索"
      />
      <BeeSearchInput
        v-model="searchForm.changeCause"
        class="deployment-history__toolbar-search"
        placeholder="按变更原因搜索"
      />
      <BeeButton icon="basic-search" @click="handleSearch"> 搜索 </BeeButton>
      <BeeButton icon="basic-refresh" @click="handleReset"> 重置 </BeeButton>
    </div>

    <!-- 表格 -->
    <div class="deployment-history__table">
      <BeeTable :data="revisions" :loading="loading" row-key="revision">
        <!-- 版本号 -->
        <BeeTableColumn :width="120">
          <template #default="{ row }">
            <BeeTableCommonCell :label="String(row.revision)" sublabel="版本号" />
          </template>
        </BeeTableColumn>
        <!-- 版本状态 -->
        <BeeTableColumn :width="140">
          <template #default="{ row }">
            <BeeCapsule
              :label="row.active ? '当前版本' : '历史版本'"
              size="small"
              :type="row.active ? 'success' : 'default'"
            />
          </template>
        </BeeTableColumn>
        <!-- 变更原因 -->
        <BeeTableColumn :width="360">
          <template #default="{ row }">
            <BeeTableCommonCell :label="row.changeCause" sublabel="变更原因" />
          </template>
        </BeeTableColumn>
        <!-- 创建时间 -->
        <BeeTableColumn :width="200">
          <template #default="{ row }">
            <BeeTableCommonCell :label="row.createAt" sublabel="创建时间" />
          </template>
        </BeeTableColumn>
        <!-- 操作 -->
        <BeeTableColumn fixed="right" :width="100">
          <template #default="{ row }">
            <BeeActionCell :actions="getRowActions(row)" />
          </template>
        </BeeTableColumn>
      </BeeTable>
    </div>

    <!-- 底栏 -->
    <div class="deployment-history__footer">
      <BeePagination
        v-model:page="pageData.page"
        v-model:page-size="pageData.pageSize"
        :total="pageData.total"
        @change="fetchRevisions"
      />
    </div>

    <!-- 回滚确认 Dialog -->
    <BeeDialog
      v-model="rollbackDialog.visible"
      icon="kubernetes-rollback"
      :loading="rollbackDialog.loading"
      title="回滚无状态应用"
      type="primary"
      @confirm="handleConfirmRollback"
    >
      <span>
        您确认将无状态应用 <strong>{{ deploymentName }}</strong> 回滚到版本
        <strong>{{ rollbackDialog.revision }}</strong> 吗？
      </span>
    </BeeDialog>
  </div>
</template>

<script setup lang="ts">
/**
 * Deployment 详情 - 部署历史
 * @module views/kubernetes/workload/deployment/detail/history
 * @description 按版本号倒序展示历史版本（Revision），支持按版本号 / 变更原因筛选与回滚到指定版本
 */
import { computed, onMounted, reactive, ref } from 'vue'

import { useRoute } from 'vue-router'

import type {
  DeploymentHistoryRevisionListVo,
  DeploymentHistoryRevisionQueryForm,
} from '@/types/kubernetes/workload/deployment'

import { getDeploymentHistoryRevisionList, rollbackDeployment } from '@/api/kubernetes/workload/deployment'

import BeeButton from '@/components/base/BeeButton/index.vue'
import BeeCapsule from '@/components/base/BeeCapsule/index.vue'
import BeeDialog from '@/components/base/BeeDialog/index.vue'
import { BeeMessage } from '@/components/base/BeeMessage'
import BeePagination from '@/components/base/BeePagination/index.vue'
import BeeSearchInput from '@/components/base/BeeSearchInput/index.vue'
import BeeTableColumn from '@/components/BeeTable/BeeTableColumn.vue'
import BeeTableCommonCell from '@/components/BeeTable/BeeTableCommonCell.vue'
import BeeTable from '@/components/BeeTable/index.vue'
import BeeActionCell, { type ActionItem } from '@/components/business/BeeActionCell/index.vue'

import { useDeploymentPermission } from '../composables/usePermission'

defineOptions({ name: 'DeploymentHistory' })

const route = useRoute()
const { permissionMap } = useDeploymentPermission()

// ==================== Computed ====================
/** 所属集群 UID（路由参数） */
const clusterUid = computed(() => route.params.clusterUid as string)
/** 所属命名空间名称（路由参数） */
const namespace = computed(() => route.params.namespace as string)
/** 被查看无状态应用名称（路由参数） */
const deploymentName = computed(() => route.params.name as string)

// ==================== Reactive State ====================
/** 列表加载态 */
const loading = ref(false)
/** 历史版本列表 */
const revisions = ref<DeploymentHistoryRevisionListVo[]>([])
/** 搜索表单：版本号用字符串承载输入中间态 */
const searchForm = reactive<{ revision: string; changeCause: string }>({ revision: '', changeCause: '' })
/** 分页数据 */
const pageData = reactive({ page: 1, pageSize: 10, total: 0 })
/** 回滚确认弹窗 */
const rollbackDialog = reactive<{ visible: boolean; loading: boolean; revision: number }>({
  visible: false,
  loading: false,
  revision: 0,
})

// ==================== Method ====================
/**
 * 加载历史版本列表
 */
async function fetchRevisions() {
  if (!clusterUid.value || !namespace.value || !deploymentName.value) {
    revisions.value = []
    pageData.total = 0
    return
  }
  const revision = Number(searchForm.revision)
  loading.value = true
  try {
    const { list, total, page, pageSize } = await getDeploymentHistoryRevisionList(
      clusterUid.value,
      namespace.value,
      deploymentName.value,
      {
        revision: searchForm.revision.trim() !== '' && Number.isFinite(revision) ? revision : undefined,
        changeCause: searchForm.changeCause || undefined,
        page: pageData.page,
        pageSize: pageData.pageSize,
      } satisfies Partial<DeploymentHistoryRevisionQueryForm>,
    )
    revisions.value = list
    pageData.total = total
    pageData.page = page
    pageData.pageSize = pageSize
  } catch {
    BeeMessage.error('加载部署历史失败')
  } finally {
    loading.value = false
  }
}

/**
 * 构建行操作
 * @param row - 当前行数据
 * @returns 操作项数组，当前版本无需回滚故返回空数组
 */
function getRowActions(row: DeploymentHistoryRevisionListVo): ActionItem[] {
  if (row.active || !permissionMap.edit) return []
  return [{ value: 'rollback', label: '回滚', icon: 'kubernetes-rollback', handler: () => handleRollback(row) }]
}

/**
 * 打开回滚确认弹窗
 * @param row - 当前行数据
 */
function handleRollback(row: DeploymentHistoryRevisionListVo) {
  rollbackDialog.revision = row.revision
  rollbackDialog.visible = true
}

/**
 * 确认回滚
 * @description 回滚成功后重新拉取历史版本列表，刷新各版本的活跃状态
 */
async function handleConfirmRollback() {
  if (!rollbackDialog.revision) {
    rollbackDialog.visible = false
    return
  }
  rollbackDialog.loading = true
  try {
    await rollbackDeployment(clusterUid.value, namespace.value, deploymentName.value, {
      revision: rollbackDialog.revision,
    })
    BeeMessage.success(`成功回滚到版本 ${rollbackDialog.revision}`)
    await fetchRevisions()
  } catch {
    BeeMessage.error('回滚无状态应用失败')
  } finally {
    rollbackDialog.loading = false
    rollbackDialog.visible = false
  }
}

// ==================== Handler ====================
/**
 * 搜索
 */
function handleSearch() {
  pageData.page = 1
  void fetchRevisions()
}

/**
 * 重置搜索条件
 */
function handleReset() {
  searchForm.revision = ''
  searchForm.changeCause = ''
  pageData.page = 1
  pageData.pageSize = 10
  void fetchRevisions()
}

// ==================== Lifecycle ====================
onMounted(() => {
  void fetchRevisions()
})
</script>

<style lang="scss" scoped>
.deployment-history {
  display: flex;
  gap: 16px;
  flex-flow: column;
  justify-content: flex-start;
  align-items: stretch;
  flex: 1;
  width: 100%;
  min-height: 0;
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
    flex-flow: row wrap;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
