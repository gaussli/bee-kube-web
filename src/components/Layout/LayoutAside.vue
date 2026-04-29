<template>
  <aside class="aside" :style="{ width: appStore.sidebarOpened ? '220px' : '64px' }">
    <div class="logo">
      <img src="@/assets/vue.svg" alt="logo" />
      <span v-show="appStore.sidebarOpened">Bee Kube</span>
    </div>

    <!-- 集群选择模块（仅集群管理tab显示） -->
    <div v-if="appStore.currentTab === 'cluster'" class="cluster-selector">
      <el-select v-model="currentClusterId" placeholder="选择集群" size="default" class="cluster-select" :collapse-tags="!appStore.sidebarOpened" @change="handleClusterChange">
        <template #prefix>
          <el-icon><Connection /></el-icon>
        </template>
        <el-option v-for="cluster in clusterList" :key="cluster.id" :label="cluster.name" :value="cluster.id">
          <div class="cluster-option">
            <span>{{ cluster.name }}</span>
            <el-tag v-if="cluster.status !== 'healthy'" size="small" type="danger">异常</el-tag>
          </div>
        </el-option>
      </el-select>
      <div v-show="appStore.sidebarOpened" class="cluster-actions">
        <el-tooltip content="添加集群" placement="top">
          <el-button circle :icon="Plus" size="small" @click="handleAddCluster" />
        </el-tooltip>
        <el-tooltip content="删除集群" placement="top" :disabled="clusterList.length <= 1">
          <el-button circle :icon="Delete" size="small" type="danger" :disabled="clusterList.length <= 1" @click="handleDeleteCluster" />
        </el-tooltip>
      </div>
    </div>

    <el-menu :default-active="route.path" :collapse="!appStore.sidebarOpened" :collapse-transition="false" router class="aside-menu">
      <template v-for="item in currentMenuList" :key="item.id">
        <el-menu-item v-if="!item.children?.length" :index="item.frontPath || '/'">
          <el-icon>
            <component :is="getIcon(item.frontIcon)" />
          </el-icon>
          <template #title>{{ item.name }}</template>
        </el-menu-item>
        <el-sub-menu v-else :index="item.frontPath || item.code">
          <template #title>
            <el-icon>
              <component :is="getIcon(item.frontIcon)" />
            </el-icon>
            <span>{{ item.name }}</span>
          </template>
          <el-menu-item v-for="child in item.children" :key="child.id" :index="child.frontPath || '/'">
            {{ child.name }}
          </el-menu-item>
        </el-sub-menu>
      </template>
    </el-menu>

    <!-- 添加集群 Dialog -->
    <BeeDialog v-model="addClusterDialogVisible" title="添加集群" @confirm="handleConfirmAdd">
      <el-form ref="addFormRef" :model="addClusterForm" :rules="addClusterRules" label-width="80px">
        <el-form-item label="集群名称" prop="name">
          <el-input v-model="addClusterForm.name" placeholder="请输入集群名称" />
        </el-form-item>
        <el-form-item label="API 地址" prop="apiServer">
          <el-input v-model="addClusterForm.apiServer" placeholder="请输入 Kubernetes API Server 地址" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="addClusterForm.description" placeholder="请输入描述信息" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
    </BeeDialog>

    <!-- 删除集群 Dialog -->
    <BeeDialog v-model="deleteClusterDialogVisible" title="确认删除" @confirm="handleConfirmDelete">
      <div class="delete-content">
        <p>
          确定要删除集群 <strong>{{ currentCluster?.name }}</strong> 吗？
        </p>
        <el-alert type="warning" :closable="false" show-icon>
          <template #title> 删除后需要重新添加才能使用该集群 </template>
        </el-alert>
      </div>
    </BeeDialog>
  </aside>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Delete, Plus, Connection } from '@element-plus/icons-vue'
import { HomeFilled, Setting, Odometer, Box, FolderOpened, Cpu, Document, Collection, Monitor, DocumentCopy, Lock } from '@element-plus/icons-vue'
import { useAppStore, useUserStore } from '@/stores'
import BeeDialog from '@/components/BeeDialog/index.vue'
import type { Component } from 'vue'
import type { CurrentMenu } from '@/types'

defineOptions({ name: 'LayoutAside' })

interface ClusterInfo {
  id: string
  name: string
  apiServer: string
  status: 'healthy' | 'unhealthy'
  description?: string
}

const props = defineProps<{
  menus: CurrentMenu[]
}>()

const appStore = useAppStore()
const userStore = useUserStore()
const route = useRoute()

// 集群列表
const clusterList = ref<ClusterInfo[]>([
  { id: '1', name: '生产集群', apiServer: 'https://k8s-prod.example.com:6443', status: 'healthy', description: '生产环境 Kubernetes 集群' },
  { id: '2', name: '测试集群', apiServer: 'https://k8s-test.example.com:6443', status: 'healthy', description: '测试环境 Kubernetes 集群' },
  { id: '3', name: '开发集群', apiServer: 'https://k8s-dev.example.com:6443', status: 'unhealthy', description: '开发环境 Kubernetes 集群' }
])
const currentClusterId = ref(clusterList.value[0]?.id || '')
const currentCluster = computed(() => clusterList.value.find(c => c.id === currentClusterId.value))

// 添加集群
const addClusterDialogVisible = ref(false)
const addFormRef = ref<FormInstance>()
const addClusterForm = reactive({
  name: '',
  apiServer: '',
  description: ''
})
const addClusterRules: FormRules = {
  name: [{ required: true, message: '请输入集群名称', trigger: 'blur' }],
  apiServer: [
    { required: true, message: '请输入 API Server 地址', trigger: 'blur' },
    { type: 'url', message: '请输入有效的 URL 地址', trigger: 'blur' }
  ]
}

// 删除集群
const deleteClusterDialogVisible = ref(false)

function handleClusterChange(clusterId: string) {
  const cluster = clusterList.value.find(c => c.id === clusterId)
  if (cluster) {
    ElMessage.success(`已切换到集群: ${cluster.name}`)
    // TODO: 切换集群后重新加载集群相关数据
  }
}

function handleAddCluster() {
  addClusterForm.name = ''
  addClusterForm.apiServer = ''
  addClusterForm.description = ''
  addClusterDialogVisible.value = true
}

async function handleConfirmAdd() {
  if (!addFormRef.value) return
  await addFormRef.value.validate()
  const newCluster: ClusterInfo = {
    id: Date.now().toString(),
    name: addClusterForm.name,
    apiServer: addClusterForm.apiServer,
    status: 'healthy',
    description: addClusterForm.description
  }
  clusterList.value.push(newCluster)
  currentClusterId.value = newCluster.id
  ElMessage.success('添加集群成功')
  addClusterDialogVisible.value = false
}

function handleDeleteCluster() {
  if (!currentCluster.value || clusterList.value.length <= 1) return
  deleteClusterDialogVisible.value = true
}

function handleConfirmDelete() {
  if (!currentCluster.value) return
  const deletedName = currentCluster.value.name
  const index = clusterList.value.findIndex(c => c.id === currentClusterId.value)
  clusterList.value.splice(index, 1)
  currentClusterId.value = clusterList.value[0]?.id || ''
  ElMessage.success(`已删除集群: ${deletedName}`)
  deleteClusterDialogVisible.value = false
}

// 根据当前 tab 获取菜单列表
const currentMenuList = computed(() => {
  if (appStore.currentTab === 'cluster') {
    // 集群管理菜单
    const clusterMenus = userStore.getClusterMenus()
    return clusterMenus || []
  } else {
    // 平台管理菜单：dashboard 在首位 + 系统管理菜单
    const dashboardMenu: CurrentMenu = {
      id: 'dashboard',
      code: 'dashboard',
      name: '仪表盘',
      frontPath: '/dashboard',
      frontIcon: 'HomeFilled',
      type: 1
    }
    return [dashboardMenu, ...props.menus]
  }
})

const iconMap: Record<string, Component> = {
  HomeFilled,
  Setting,
  Odometer,
  Box,
  FolderOpened,
  Cpu,
  Document,
  Collection,
  Monitor,
  DocumentCopy,
  Lock,
  User: () => import('@element-plus/icons-vue').then(m => m.User),
  Avatar: () => import('@element-plus/icons-vue').then(m => m.Avatar),
  Menu: () => import('@element-plus/icons-vue').then(m => m.Menu),
  Goods: () => import('@element-plus/icons-vue').then(m => m.Goods)
}

function getIcon(iconName?: string): Component {
  return iconName ? iconMap[iconName] || HomeFilled : HomeFilled
}
</script>

<style lang="scss" scoped>
.aside {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: none;
  transition: width 0.3s;

  .logo {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    height: 60px;
    padding: 0 $spacing-md;
    background: none;
    font-weight: bold;

    img {
      width: 32px;
      height: 32px;
    }
  }

  .cluster-selector {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    margin: 0 8px 8px;

    .cluster-select {
      flex: 1;

      :deep(.el-select__wrapper) {
        background: rgba(255, 255, 255, 0.1);
      }
    }

    .cluster-actions {
      display: flex;
      gap: 4px;
    }
  }

  .cluster-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .aside-menu {
    flex: 1;
    border-right: none;
    background: transparent;
    overflow-y: auto;

    :deep(.el-menu--inline) {
      background: none;
    }
  }
}

.delete-content {
  p {
    margin-bottom: 12px;
  }
}
</style>
