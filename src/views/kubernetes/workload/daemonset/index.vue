<template>
  <div class="daemonset-table">
    <div class="page-header">
      <BeeAlert type="info" label="DaemonSet 确保所有（或部分）节点运行一个 Pod 副本，常用于日志收集、监控等场景。" />
      <BeePageTitle :icon="Monitor" title="守护进程" description="管理 Kubernetes DaemonSet 资源。" />
    </div>
    <div class="page-body">
      <div class="table-query">
        <div class="table-query-left">
          <BeeInputSearch v-model="searchKey" placeholder="按名称搜索" @search="handleSearch" />
          <BeeSelect v-model="queryForm.clusterId" placeholder="选择集群" :options="clusterOptions" @change="handleClusterChange" />
          <BeeSelect v-model="queryForm.namespace" placeholder="选择命名空间" :options="namespaceOptions" @change="handleNamespaceChange" />
        </div>
        <div class="table-query-right">
          <BeeButton @click="handleReset"><template #icon><Refresh /></template>刷新</BeeButton>
          <el-divider v-if="hasPermission('kubernetes:workload:daemonset:create')" direction="vertical" />
          <BeeButton v-if="hasPermission('kubernetes:workload:daemonset:create')" type="primary" @click="handleCreate"><template #icon><Plus /></template>新增</BeeButton>
        </div>
      </div>
      <div class="table-body">
        <el-table v-loading="loading" :data="tableData" height="100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="60" align="center" />
          <el-table-column min-width="150">
            <template #header><IconLabel :icon="Monitor" label="名称" /></template>
            <template #default="{ row }"><el-link type="primary" @click="handleViewDetail(row)">{{ row.name }}</el-link></template>
          </el-table-column>
          <el-table-column min-width="120"><template #header><IconLabel :icon="FolderOpened" label="命名空间" /></template><template #default="{ row }"><span>{{ row.namespace }}</span></template></el-table-column>
          <el-table-column min-width="150"><template #header><IconLabel :icon="Grid" label="集群" /></template><template #default="{ row }"><span>{{ row.clusterName || row.clusterId }}</span></template></el-table-column>
          <el-table-column width="120"><template #header><IconLabel :icon="Cpu" label="期望" /></template><template #default="{ row }"><span>{{ row.desiredNumberScheduled }}</span></template></el-table-column>
          <el-table-column width="100"><template #header><IconLabel :icon="CircleCheck" label="就绪" /></template><template #default="{ row }"><span :class="row.numberReady === row.desiredNumberScheduled ? 'replicas-ready' : 'replicas-pending'">{{ row.numberReady }}</span></template></el-table-column>
          <el-table-column width="100"><template #header><IconLabel :icon="InfoFilled" label="可用" /></template><template #default="{ row }"><span>{{ row.numberAvailable }}</span></template></el-table-column>
          <el-table-column width="180"><template #header><IconLabel :icon="Clock" label="创建时间" /></template><template #default="{ row }"><TimeCell :time="row.createAt" /></template></el-table-column>
          <el-table-column width="200" fixed="right">
            <template #header><IconLabel :icon="EditPen" label="操作" /></template>
            <template #default="{ row }">
              <el-tooltip content="编辑" placement="top"><el-button v-if="hasPermission('kubernetes:workload:daemonset:edit')" circle :icon="EditPen" size="default" @click="handleEdit(row)" /></el-tooltip>
              <el-tooltip content="详情" placement="top"><el-button circle :icon="View" size="default" @click="handleViewDetail(row)" /></el-tooltip>
              <el-tooltip v-if="hasPermission('kubernetes:workload:daemonset:delete')" content="删除" placement="top"><el-button circle :icon="Delete" size="default" @click="handleDelete(row)" /></el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table-footer">
        <div><BeeButton v-if="hasPermission('kubernetes:workload:daemonset:delete')" type="danger" :disabled="selectedRows.length === 0" @click="handleBatchDelete"><template #icon><Delete /></template>批量删除 ({{ selectedRows.length }})</BeeButton></div>
        <el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.pageSize" :total="pagination.total" :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next, jumper" @size-change="loadData" @current-change="loadData" />
      </div>
    </div>
    <BeeDialog v-model="deleteDialogVisible" title="确认删除" @confirm="handleConfirmDelete"><div class="dialog-content"><p>确定要删除 DaemonSet <strong>{{ currentTargetRow?.name }}</strong> 吗？</p></div></BeeDialog>
    <BeeDialog v-model="batchDeleteDialogVisible" title="确认删除" @confirm="handleConfirmBatchDelete"><div class="dialog-content"><p>确定要删除选中的 <strong>{{ selectedRows.length }}</strong> 个 DaemonSet 吗？</p><div class="delete-tags"><BeeTag v-for="row in selectedRows" :key="row.id">{{ row.name }}</BeeTag></div></div></BeeDialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Monitor, Refresh, Plus, EditPen, Delete, View, FolderOpened, Grid, Cpu, Clock, CircleCheck, InfoFilled } from '@element-plus/icons-vue'
import { type DaemonSetQueryReq, type DaemonSetResp } from '@/types'
import { getDaemonSetPage, deleteDaemonSet, batchDeleteDaemonSet } from '@/api'
import { useKubernetesStore } from '@/stores'
import BeeAlert from '@/components/BeeAlert/index.vue'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeDialog from '@/components/BeeDialog/index.vue'
import BeeInputSearch from '@/components/BeeInputSearch/index.vue'
import BeePageTitle from '@/components/BeePageTitle/index.vue'
import BeeSelect from '@/components/BeeSelect/index.vue'
import BeeTag from '@/components/BeeTag/index.vue'
import IconLabel from '@/components/IconLabel/index.vue'
import TimeCell from '@/components/TimeCell/index.vue'
import { usePermission } from '@/composables/usePermission'

defineOptions({ name: 'DaemonSetManage' })
const { hasPermission } = usePermission()
const router = useRouter()
const kubernetesStore = useKubernetesStore()
const searchKey = ref('')
const loading = ref(false)
const tableData = ref<DaemonSetResp[]>([])
const selectedRows = ref<DaemonSetResp[]>([])
const deleteDialogVisible = ref(false)
const batchDeleteDialogVisible = ref(false)
const currentTargetRow = ref<DaemonSetResp | null>(null)
const queryForm = reactive<DaemonSetQueryReq>({ name: undefined, clusterId: kubernetesStore.activeClusterId || undefined, namespace: undefined, page: 1, pageSize: 10 })
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
const clusterOptions = ref([{ label: '默认集群', value: 'default' }])
const namespaceOptions = ref([{ label: '全部命名空间', value: undefined }, { label: 'default', value: 'default' }])
async function loadData() {
  if (!queryForm.clusterId) { tableData.value = []; return }
  loading.value = true
  try {
    const resp = await getDaemonSetPage({ ...queryForm, page: pagination.page, pageSize: pagination.pageSize })
    tableData.value = resp.list; pagination.total = resp.total
  } finally { loading.value = false }
}
function handleSearch() { queryForm.name = searchKey.value; pagination.page = 1; loadData() }
function handleClusterChange(value: string) { queryForm.clusterId = value; pagination.page = 1; loadData() }
function handleNamespaceChange(value: string) { queryForm.namespace = value; pagination.page = 1; loadData() }
function handleReset() { queryForm.name = undefined; queryForm.namespace = undefined; queryForm.page = 1; queryForm.pageSize = 10; pagination.page = 1; pagination.pageSize = 10; searchKey.value = ''; loadData() }
function handleSelectionChange(rows: DaemonSetResp[]) { selectedRows.value = rows }
function handleCreate() { router.push({ name: 'kubernetes:workload:daemonset:create' }) }
function handleEdit(row: DaemonSetResp) { router.push({ name: 'kubernetes:workload:daemonset:edit', query: { clusterId: row.clusterId, namespace: row.namespace, name: row.name } }) }
function handleViewDetail(row: DaemonSetResp) { router.push({ name: 'kubernetes:workload:daemonset:detail', query: { clusterId: row.clusterId, namespace: row.namespace, name: row.name } }) }
function handleDelete(row: DaemonSetResp) { currentTargetRow.value = row; deleteDialogVisible.value = true }
async function handleConfirmDelete() { if (!currentTargetRow.value) return; try { await deleteDaemonSet(currentTargetRow.value.clusterId, currentTargetRow.value.namespace, currentTargetRow.value.name); ElMessage.success('删除成功'); deleteDialogVisible.value = false; currentTargetRow.value = null; loadData() } catch {} }
function handleBatchDelete() { batchDeleteDialogVisible.value = true }
async function handleConfirmBatchDelete() { if (selectedRows.value.length === 0) return; const clusterId = selectedRows.value[0].clusterId; const namespace = selectedRows.value[0].namespace; const names = selectedRows.value.map(row => row.name); try { await batchDeleteDaemonSet(clusterId, namespace, names); ElMessage.success(`成功删除 ${names.length} 个 DaemonSet`); batchDeleteDialogVisible.value = false; selectedRows.value = []; loadData() } catch {} }
onMounted(() => { loadData() })
</script>

<style lang="scss" scoped>
.daemonset-table { height: 100%; display: flex; flex-direction: column; }
.page-header { flex-shrink: 0; padding: 16px 20px 0 20px; margin-bottom: 16px; background-color: $bg-page; }
.page-body { flex: 1; display: flex; flex-direction: column; min-height: 0; overflow: hidden; background-color: $bg-page; }
.table-query { flex-shrink: 0; display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; gap: 12px; .table-query-left { display: flex; align-items: center; gap: 12px; } }
.table-body { flex: 1; min-height: 0; overflow-y: auto; padding: 0 20px; :deep(.el-table) { height: 100%; th.el-table__cell { padding: 12px 0; } .el-button + .el-button { margin-left: 8px; } } .replicas-ready { color: $color-success; } .replicas-pending { color: $color-warning; } }
.table-footer { flex-shrink: 0; display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; }
.dialog-content { strong { color: $color-primary; } }
.delete-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
</style>
