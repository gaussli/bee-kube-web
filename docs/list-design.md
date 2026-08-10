# 列表页通用设计规范

本文档为平台 Kubernetes 资源列表页的统一设计开发指导规范，覆盖 Node、Namespace、CustomResourceDefinition、Pod、Workload、Config、Network、Storage、Security 全部模块的通用设计模式、交互约定与实现规范。

> **层级说明**：

---

# 路由约定

## 命名规范

列表页路由命名遵循 `{domain}:{module}:{resource}` 格式，当模块与资源相同时退化为 `{domain}:{resource}`（如 Namespace）：

```
kubernetes:workload:deployment        // Kubernetes 工作负载 - Deployment
kubernetes:namespace                  // Kubernetes - 命名空间（模块即资源，无子 module）
kubernetes:network:service            // Kubernetes 网络 - Service
kubernetes:storage:persistentvolumeclaim  // Kubernetes 存储 - PersistentVolumeClaim
```

## 路径模式

| 资源类别 | 路径模式 | 示例 |
| --- | --- | --- |
| Kubernetes 集群内资源（命名空间级） | `/kubernetes/clusters/:clusterUid/{resources}` | Deployments, Services, PersistentVolumeClaims |
| Kubernetes 集群内资源（集群级） | `/kubernetes/clusters/:clusterUid/{resources}` | Namespaces, Nodes |

**路径参数**：
- `clusterUid`：集群唯一标识，由 `useKubernetesStore.activeClusterId` 维护

## 路由权限

列表页路由的 `meta.permission` 遵循 `{domain}:{module}:{resource}:view` 格式，模块与资源名相同时退化为 `{domain}:{resource}:view`：

```
kubernetes:workload:deployment:view        // Kubernetes 工作负载 - Deployment 查看
kubernetes:namespace:view                  // Kubernetes 命名空间 - 查看（模块即资源）
kubernetes:network:service:view            // Kubernetes 网络 - Service 查看
kubernetes:storage:persistentvolumeclaim:view  // Kubernetes 存储 - PersistentVolumeClaim 查看
```

## 路由速查

| 模块 | 资源 | 路由名称 | 列表路径 | 类别 |
| --- | --- | --- | --- | --- |
| Node | Node | `kubernetes:node` | `/kubernetes/clusters/:clusterUid/nodes` | 集群级 |
| Namespace | Namespace | `kubernetes:namespace` | `/kubernetes/clusters/:clusterUid/namespaces` | 集群级 |
| CustomResourceDefinition | CustomResourceDefinition | `kubernetes:customresourcedefinition` | `/kubernetes/clusters/:clusterUid/customresourcedefinitions` | 集群级 |
| Pod | Pod | `kubernetes:pod` | `/kubernetes/clusters/:clusterUid/pods` | 命名空间级 |
| Workload | Deployment | `kubernetes:workload:deployment` | `/kubernetes/clusters/:clusterUid/deployments` | 命名空间级 |
| Workload | StatefulSet | `kubernetes:workload:statefulset` | `/kubernetes/clusters/:clusterUid/statefulsets` | 命名空间级 |
| Workload | DaemonSet | `kubernetes:workload:daemonset` | `/kubernetes/clusters/:clusterUid/daemonsets` | 命名空间级 |
| Workload | Job | `kubernetes:workload:job` | `/kubernetes/clusters/:clusterUid/jobs` | 命名空间级 |
| Workload | CronJob | `kubernetes:workload:cronjob` | `/kubernetes/clusters/:clusterUid/cronjobs` | 命名空间级 |
| Config | ConfigMap | `kubernetes:config:configmap` | `/kubernetes/clusters/:clusterUid/configmaps` | 命名空间级 |
| Config | Secret | `kubernetes:config:secret` | `/kubernetes/clusters/:clusterUid/secrets` | 命名空间级 |
| Network | Service | `kubernetes:network:service` | `/kubernetes/clusters/:clusterUid/services` | 命名空间级 |
| Network | Ingress | `kubernetes:network:ingress` | `/kubernetes/clusters/:clusterUid/ingresses` | 命名空间级 |
| Network | NetworkPolicy | `kubernetes:network:networkpolicy` | `/kubernetes/clusters/:clusterUid/networkpolicies` | 命名空间级 |
| Storage | PersistentVolume | `kubernetes:storage:persistentvolume` | `/kubernetes/clusters/:clusterUid/persistentvolumes` | 集群级 |
| Storage | PersistentVolumeClaim | `kubernetes:storage:persistentvolumeclaim` | `/kubernetes/clusters/:clusterUid/persistentvolumeclaims` | 命名空间级 |
| Storage | StorageClass | `kubernetes:storage:storageclass` | `/kubernetes/clusters/:clusterUid/storageclasses` | 集群级 |
| Security | ServiceAccount | `kubernetes:security:serviceaccount` | `/kubernetes/clusters/:clusterUid/serviceaccounts` | 命名空间级 |
| Security | Role | `kubernetes:security:role` | `/kubernetes/clusters/:clusterUid/roles` | 命名空间级 |
| Security | ClusterRole | `kubernetes:security:clusterrole` | `/kubernetes/clusters/:clusterUid/clusterroles` | 集群级 |
| Security | RoleBinding | `kubernetes:security:rolebinding` | `/kubernetes/clusters/:clusterUid/rolebindings` | 命名空间级 |
| Security | ClusterRoleBinding | `kubernetes:security:clusterrolebinding` | `/kubernetes/clusters/:clusterUid/clusterrolebindings` | 集群级 |

---

# 页面布局

列表页采用**三层弹性布局**（flex column），各层固定职责，通过 CSS 弹性盒模型实现表格区独占剩余高度并独立滚动。

## 布局模版

```
BeePage
├── BeePageHeader                                // 页面标题区，各列表页通过 v-bind 绑定
│   ├── icon: {resource-icon}
│   ├── title: "{中文标题}"
│   └── description: "{功能描述}"
│       （icon、title、description 均从 pageMeta 常量获取，各资源的具体定义见"资源个性化"对应子节）
└── BeeCard（class: page-body）                   // 主体容器
    ├── .page-body__toolbar                      // 工具栏（flex row，固定高度）
    │   ├── BeeInputSearch（flex:1）              // 搜索框，搜索字段由各资源独立定义
    │   ├── BeeSelect × N                        // 筛选下拉
    │   ├── BeeButton: 搜索 / 重置
    │   ├── 分隔线                                // （仅 create 权限存在 + create 按钮存在时显示）
    │   └── BeeButton: 新增 / YAML（需 create 权限）
    ├── .page-body__table                        // 表格区（flex:1 + min-height:0，独立滚动）
    │   └── BeeTable（selectable 多选模式）
    └── .page-body__footer                       // 底栏（flex row + space-between，固定高度）
        ├── 左侧操作组
        │   ├── BeeButton: 取消选择
        │   ├── BeeButton: 批量删除（需 delete 权限）
        │   ├── BeeButton: 导出（需 view 权限）
        │   └── BeeButton: 导入（需 create 权限）
        └── 右侧：BeePagination（page / pageSize 双绑定，pageSizes: [10, 20, 50]）
```

## CSS 关键样式

```scss
.page-body {
  display: flex; flex-direction: column;
  flex: 1; min-height: 0;
  overflow: hidden;
  gap: 16px;
  padding: 16px;

  .page-body__toolbar {
    display: flex; gap: 8px; align-items: center;

    &-search {
      flex: 1; min-width: 0;
    }

    &-separator {
      width: 1px; height: 40%;
      background: $color-border-tertiary;
      margin: 0 8px;
    }
  }

  .page-body__table {
    flex: 1; min-height: 0;
  }

  .page-body__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;

    &-actions {
      display: flex; gap: 8px; align-items: center;
    }
  }
}
```

**核心原理**：父容器 `flex column` + `overflow:hidden` 约束高度；`.page-body__table` 设 `flex:1; min-height:0` 独占剩余空间并允许内部滚动；工具栏和底栏保持固定高度。

## 通用元素

### BeePageHeader

页面标题区，通过 `v-bind` 绑定 `pageMeta` 常量（由各资源 config 文件导出），包含 `icon`（SVG 图标名称）、`title`（中文标题）、`description`（功能描述）。各资源的 `pageMeta` 具体值见"资源个性化"对应章节。

### toolbar 工具栏容器（包含搜索条件和创建按钮组）

工具栏位于 `.page-body__toolbar`，包含以下元素：

| 元素 | 组件 | 说明 |
| --- | --- | --- |
| 搜索框 | `BeeInputSearch` | 搜索字段由各资源独立定义，绑定 `searchKey` |
| 筛选下拉 | `BeeSelect` × N | 状态筛选、类型筛选等，绑定 `queryForm.xxx` |
| 搜索按钮 | `BeeButton` | 点击触发 `handleSearch()` |
| 重置按钮 | `BeeButton` | 点击触发 `handleReset()` |
| 分隔线 | `<div>` | 仅当 `create` 权限存在且该资源支持创建时显示 |
| 新增按钮 | `BeeButton` | 跳转创建页（表单模式），需 `create` 权限 |
| YAML 新建按钮 | `BeeButton` | 跳转创建页（YAML 模式），需 `create` 权限 |

各资源的具体搜索条件和筛选选项见"资源个性化"对应章节。

### table 表格容器（包含资源列表数据）

表格区位于 `.page-body__table`，使用 `BeeTable`（`selectable` 多选模式）+ `BeeTableColumn` 组合。列组件体系如下：

| 组件 | 用途 | 适用资源 |
| --- | --- | --- |
| `BeeNodeInfoCell` | 节点首列（UID + 图标 + 名称 + IP + 描述） | Node |
| `BeeNamespaceInfoCell` | 命名空间首列（UID + 图标 + 名称 + 描述） | Namespace |
| `BeeCustomResourceDefinitionInfoCell` | CRD 首列（UID + 图标 + 名称 + 描述） | CustomResourceDefinition |
| `BeePodInfoCell` | Pod 首列（UID + 图标 + 名称 + IP） | Pod |
| `BeeWorkloadInfoCell` | 工作负载首列（UID + 图标 + 名称 + 描述） | Deployment, StatefulSet, DaemonSet, Job, CronJob |
| `BeeConfigInfoCell` | 配置首列（UID + 图标 + 名称 + 描述） | ConfigMap, Secret |
| `BeeNetworkInfoCell` | 网络首列（UID + 图标 + 名称 + 描述） | Service, Ingress, NetworkPolicy |
| `BeeStorageInfoCell` | 存储首列（UID + 图标 + 名称 + 描述） | PersistentVolume, PersistentVolumeClaim, StorageClass |
| `BeeSecurityInfoCell` | 安全首列（UID + 图标 + 名称 + 描述） | ServiceAccount, Role, ClusterRole, RoleBinding, ClusterRoleBinding |
| `BeeTableCommonCell` | 通用两行单元格（text + subtext） | 所有资源 |
| `BeeResourceUsageCell` | 资源使用率单元格（进度条 + 百分比） | Node 等含资源使用率的资源 |
| `BeeStatusCell` | 状态标签（圆点 + 中文标签 + 英文标签 + 帮助） | 所有资源 |
| `BeeAuditCell` | 审计信息（头像 + 时间 + 字段名） | 所有资源 |
| `BeeActionCell` | 行操作（≤3 平铺，>3 收起菜单） | 所有资源 |

**列顺序约定**：
1. **首列**：资源信息列，使用模块对应的 `BeeXxxInfoCell` 组件
2. **中间列**：核心属性列（状态、指标、策略、审计等）
3. **末尾列**：操作列，`fixed: right`，宽度 150px

**表格状态处理**：

| 状态 | 组件/Props | 说明 |
| --- | --- | --- |
| 加载中 | `BeeTable` props `v-loading="loading"` | 请求未完成时展示加载骨架/遮罩 |
| 无数据 | `BeeTable` props `empty-text="暂无{资源名}"` | 列表为空时展示空状态占位 |
| 请求失败 | `loadData()` 中 `try/catch` 捕获 | `BeeMessage.error` 由 request 拦截器统一处理 |

各资源的具体数据列配置见"资源个性化"对应章节。

### footer 底部容器（包含左侧批量操作按钮组 + 右侧分页组件）

底栏位于 `.page-body__footer`，使用 `flex row + space-between` 布局：

| 区域 | 内容 |
| --- | --- |
| 左侧操作组 | `BeeButton: 取消选择`、`BeeButton: 批量删除 (N)`（需 `delete` 权限）、`BeeButton: 导出`（需 `view` 权限）、`BeeButton: 导入`（需 `create` 权限） |
| 右侧 | `BeePagination`，`page` 和 `pageSize` 双绑定，`pageSizes: [10, 20, 50]`，`@change` / `@update:page-size` 事件触发 `loadData()` |

**分页模式**：`pagination` 与 `queryForm` 分离维护 — `queryForm` 只存过滤条件，分页参数在 API 调用处展开：

```typescript
// queryForm 初始化（空对象，属性通过搜索动态增删）
const queryForm = reactive<Partial<XxxQueryForm>>({})

// API 调用时展开
const { list, total } = await getXxxList(clusterUid, {
  ...queryForm,
  page: pagination.page,
  pageSize: pagination.pageSize,
})
```

---

# 关键操作 & 逻辑

## onMounted — 加载列表数据逻辑

### 权限

列表页由路由守卫 `to.meta.permission` 控制页面访问权限，权限标识格式为 `{domain}:{module}:{resource}:view`。页面内通过 `usePermission()` composable 的 `hasPermission()` 方法进行 UI 级和行级权限控制。

### 行为

页面挂载时执行以下加载流程：

1. 从路由参数获取 `clusterUid`
2. 加载下拉选项数据（如命名空间选项等） — 依赖资源类别
3. 调用 `loadData()` 加载表格数据

```typescript
async function loadData() {
  loading.value = true
  try {
    const { list, total } = await getXxxList(clusterUid.value, {
      ...queryForm,
      page: pagination.page,
      pageSize: pagination.pageSize,
    })
    tableData.value = list
    pagination.total = total
  } catch (e) {
    tableData.value = []
    pagination.total = 0
    // BeeMessage.error 由 request 拦截器统一处理
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
  // 命名空间级资源额外调用：
  // loadNamespaceOptions()
})
```

**命名空间选项加载**（仅命名空间级资源）：

```typescript
import { getNamespaceList } from '@/api/kubernetes/namespace'
const namespaceOptions = ref<SelectOption[]>([])

async function loadNamespaceOptions() {
  const list = await getNamespaceList(clusterUid.value, { mode: 'simple' })
  namespaceOptions.value = [
    { label: '全部命名空间', value: '' },
    ...list.map(ns => ({ label: ns.name, value: ns.name }))
  ]
}
```

集群级资源跳过此步骤。

## 工具栏容器 — 搜索逻辑

点击"搜索"按钮触发 `handleSearch()`：

1. 重置分页 `pagination.page = 1`
2. 将 `searchKey` 同时映射到资源的 `uid` 和 `name` 字段（实现多字段模糊搜索）
3. 调用 `loadData()`

```typescript
function handleSearch() {
  pagination.page = 1
  queryForm.uid = searchKey.value || undefined
  queryForm.name = searchKey.value || undefined
  loadData()
}
```

各资源绑定到 `searchKey` 的具体字段可能不同，详见"资源个性化"中"搜索条件"表格。

## 工具栏容器 — 重置逻辑

点击"重置"按钮触发 `handleReset()`：

1. 清空 `searchKey.value = ''`
2. 重置 `queryForm` 所有字段为初始值
3. 重置分页 `pagination.page = 1; pagination.pageSize = 10`
4. 调用 `loadData()`

```typescript
function handleReset() {
  searchKey.value = ''
  Object.keys(queryForm).forEach(key => delete queryForm[key])
  pagination.page = 1
  pagination.pageSize = 10
  loadData()
}
```

## 工具栏容器 — 创建逻辑

点击"新增"按钮触发路由跳转至创建页（表单模式）：

```typescript
function handleCreate() {
  router.push({
    name: '{domain}:{module}:{resource}:create',
    params: { clusterUid: clusterUid.value }
  })
}
```

需 `create` 权限（`perm.create === true`）控制按钮显隐。

## 工具栏容器 — 创建 YAML 逻辑

点击"YAML 新建"按钮触发路由跳转至创建页（YAML 模式），使用独立的 `:create:yaml` 路由名称（无 `query` 参数）：

```typescript
function handleCreateYaml() {
  router.push({
    name: '{domain}:{module}:{resource}:create:yaml',
    params: { clusterUid: clusterUid.value }
  })
}
```

需 `create` 权限控制按钮显隐。

## 行内 — 详情逻辑

点击行操作"详情"触发路由跳转至详情页：

```typescript
function handleViewDetail(row: XxxListVo) {
  router.push({
    name: '{domain}:{module}:{resource}:detail',
    params: { clusterUid: clusterUid.value, uid: row.uid }
  })
}
```

在 `getActions(row)` 中返回 `view` 权限的操作项：

```typescript
if (perm.view) {
  actions.push({ label: '详情', icon: 'basic-view', onClick: () => handleViewDetail(row) })
}
```

## 行内 — 编辑逻辑

点击行操作"编辑"触发路由跳转至编辑页（表单模式）：

```typescript
function handleEdit(row: XxxListVo) {
  router.push({
    name: '{domain}:{module}:{resource}:edit',
    params: { clusterUid: clusterUid.value, uid: row.uid }
  })
}
```

点击"编辑 YAML"触发路由跳转至编辑页（YAML 模式），使用独立的 `:edit:yaml` 路由名称（无 `query` 参数）：

```typescript
function handleEditYaml(row: XxxListVo) {
  router.push({
    name: '{domain}:{module}:{resource}:edit:yaml',
    params: { clusterUid: clusterUid.value, uid: row.uid }
  })
}
```

需 `edit` 权限控制按钮显隐。部分资源（如 Job）创建后不可编辑，不提供编辑操作。

## 行内 — 删除逻辑

### 单个删除流程

1. 点击行操作"删除" → 记录 `currentTargetRow` 为目标行
2. 弹出 `BeeDialog`，显示 "确定要删除 **{资源名}** **{name}** 吗？"
3. 资源有级联风险时追加警告文本（如 Namespace："删除命名空间将同时删除该命名空间下的所有资源！"）
4. 确认 → 调用 `deleteXxx(row.uid)` → 成功提示（`BeeMessage.success`）→ 刷新列表
5. 条件：`row.deletable !== false` 且该资源支持删除

**需添加级联删除警告的资源**：

| 资源 | 级联风险 |
| --- | --- |
| Namespace | 删除命名空间将同时删除该命名空间下的所有资源 |
| PersistentVolume | 删除 PersistentVolume 可能导致已绑定的 PersistentVolumeClaim 状态异常 |
| PersistentVolumeClaim | 删除 PersistentVolumeClaim 可能导致绑定的 PersistentVolume 被连带删除（当 PV 回收策略为 Delete 时） |

```vue
<BeeDialog v-model="deleteDialogVisible" title="确认删除" @confirm="handleConfirmDelete">
  <p>确定要删除 <strong>{{ currentTargetRow?.name }}</strong> 吗？</p>
  <p v-if="warningText" class="warning-text">{{ warningText }}</p>
</BeeDialog>
```

### 删除确认后执行

```typescript
async function handleConfirmDelete() {
  if (!currentTargetRow.value) return
  await deleteXxx(currentTargetRow.value.uid)
  BeeMessage.success('删除成功')
  deleteDialogVisible.value = false
  loadData()
}
```

## 底部容器 — 取消选择逻辑

点击底部"取消选择"按钮清空 `selectedRows`：

```typescript
function handleClearSelection() {
  selectedRows.value = []
  // 同时清理表格组件内部选中状态（如有 ref 引用）
}
```

通过 `v-if="selectedRows.length > 0"` 控制按钮显隐。

## 底部容器 — 批量删除逻辑

1. 勾选多行 → 点击底部"批量删除 (N)"（N 为选中数量）
2. `computed` 区分：
   - `deletableRows`：`row.deletable !== false` 的行
   - `nonDeletableRows`：`row.deletable === false` 的行
3. 弹窗中分别展示不可删除行（黄色标签）和可删除行
4. 如果仅存在不可删除行 → 仅展示警告，不执行删除
5. 确认 → 调用 `deleteXxxs(deletableRows.value.map(r => r.uid))` → 成功提示 → `handleClearSelection()` → 刷新

```typescript
const deletableRows = computed(() => selectedRows.value.filter(row => row.deletable !== false))
const nonDeletableRows = computed(() => selectedRows.value.filter(row => row.deletable === false))

async function handleConfirmBatchDelete() {
  if (deletableRows.value.length === 0) return
  const ids = deletableRows.value.map(r => r.uid)
  await deleteXxxs(ids)
  BeeMessage.success(`已删除 ${ids.length} 个资源`)
  batchDeleteDialogVisible.value = false
  handleClearSelection()
  loadData()
}
```

## 底部容器 — 导入逻辑

点击底部"导入"按钮触发 YAML 导入流程（打开导入面板/弹窗，选择 YAML 文件后调用 API 创建资源），成功提示后刷新列表。

需 `create` 权限控制按钮显隐。

## 底部容器 — 导出逻辑

点击底部"导出"按钮导出当前筛选结果（调用导出 API，传入当前 `queryForm` 条件）。

需 `view` 权限控制按钮显隐。

---

# 脚本结构

所有列表页按以下分区组织 `<script setup>`：

| 分区 | 内容 | 说明 |
| --- | --- | --- |
| Composables & Route | `useRouter` / `useRoute` / `usePermission` | 路由和组合式函数 |
| Reactive State | `ref` / `reactive` | `clusterUid`、`searchKey`、`loading`、`tableData`、`pagination`、`queryForm` 等 |
| Options | 下拉选项 / 标签映射 | `STATUS_OPTIONS`、`{RESOURCE}_STRATEGY_LABEL_MAP` 等 |
| Data Loading | `loadData()` + 辅助函数 | 含 `loadNamespaceOptions()`（仅命名空间级资源） |
| Search & Reset | `handleSearch()` / `handleReset()` | 搜索时 `pagination.page = 1` |
| Selection | `handleSelectionChange()` / `handleClearSelection()` | 多选逻辑 |
| CRUD: Create/Edit/View | 路由跳转函数 | `handleCreate()`、`handleCreateYaml()`、`handleEdit()`、`handleEditYaml()`、`handleViewDetail()` |
| CRUD: Delete | 删除确认 + 执行 | 单个 / 批量删除 |
| Specific Actions | 资源特有操作处理函数 | 按"资源个性化"各资源子节定义实现，如 `handleScale(row)`、`handleRestart(row)`、`handleRollback(row)`、`handleCordon(row)`、`handleDrain(row)`、`handleViewLogs(row)`、`handleTerminal(row)`、`handleTriggerJob(row)` 等 |
| Row Actions | `getActions(row): ActionItem[]` | 按权限 + 行条件构建操作数组（`BeeActionCell` 模式） |
| Lifecycle | `onMounted` | 初始加载 |

**权限缓存模式**：在 `<script setup>` 顶层预计算权限对象，避免模板/循环中重复调用 `hasPermission()`：

```typescript
const { hasPermission } = usePermission()

const perm: Record<string, boolean> = {
  create: hasPermission('{domain}:{module}:{resource}:create'),
  edit: hasPermission('{domain}:{module}:{resource}:edit'),
  view: hasPermission('{domain}:{module}:{resource}:view'),
  delete: hasPermission('{domain}:{module}:{resource}:delete'),
}
```

**搜索映射模式**：`searchKey` 变量绑定搜索输入框，`handleSearch` 中将 `searchKey` 同时映射到多个字段，实现多字段模糊搜索。

**分页模式**：`pagination` 和 `queryForm` 分离维护 — `queryForm` 只存过滤条件，分页参数在 API 调用处展开。`queryForm` 初始化为 `reactive<Partial<XxxQueryForm>>({})`（空对象），属性通过搜索/重置动态增删。

**权限粒度**：

| 粒度 | 说明 |
| --- | --- |
| 页面级 | 路由守卫 `to.meta.permission` 控制页面访问 |
| UI 级 | `v-if="perm.xxx"` 或 `v-permission` 指令控制按钮显隐 |
| 行级 | `getActions(row)` 中按权限过滤操作项 |

---

# 资源个性化

以下按模块分类列出所有资源的 PageHeader 内容、数据列配置、搜索条件、工具栏操作、列操作和底部操作的个性化差异。

## Node

### PageHeader 内容（`v-bind="NODE_PAGE_META"`，来源：`src/config/kubernetes/node.ts`）

| icon | title | description |
| --- | --- | --- |
| `kubernetes-node` | 节点 | 节点（Node）是 Kubernetes 集群中的工作机器，负责运行容器化应用（Pod）。通过节点管理可以查看集群中所有节点的运行状态、资源使用情况，并支持节点调度控制等运维操作。 |

### 数据列

| 列宽 | 组件 | NodeListVo 字段 | 其他组件属性 |
| --- | --- | --- | --- |
| 500px | 【首列】`BeeNodeInfoCell` | `uid`, `name`, `ip`, `description` | `icon-size: 32` |
| 180px | 【中间列】`BeeStatusCell` | `status`, `statusMsg` | `options: NODE_STATUS_OPTIONS` |
| 160px | 【中间列】`BeeResourceUsageCell` | `percentage: cpuUsage` | `fieldName: "CPU"` |
| 160px | 【中间列】`BeeResourceUsageCell` | `percentage: memUsage` | `fieldName: "内存"` |
| 120px | 【中间列】`BeeTableCommonCell` | `text: podCount` | `subtext: "Pod 数"` |
| 160px | 【中间列】`BeeTableCommonCell` | `text: kubeletVersion` | `subtext: "Kubelet 版本"` |
| 200px | 【中间列】`BeeAuditCell` | `username: createBy`, `datetime: createAt` | |
| 150px | 【末尾列】`BeeActionCell` | ❌ 无 | `actions: getActions(row)` |

### 搜索条件

| NodeQueryForm 字段 | 字段类型 | Vue 响应式属性 | 展示组件 | 选项来源 |
| --- | --- | --- | --- | --- |
| uid | string | searchKey | BeeInputSearch | ❌ 无 |
| name | string | searchKey | BeeInputSearch | ❌ 无 |
| status | string | queryForm.status | BeeSelect | NODE_STATUS_OPTIONS |

### Toolbar 工具栏操作

### 列操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 详情 | `basic-view` | `view` | 查看节点（Node）详情 | 跳转详情页 | ❌ |
| 编辑 | `basic-edit` | `edit` | 编辑节点 | 跳转编辑页（表单模式） | ❌ |
| 编辑 YAML | `basic-yaml` | `edit` | 编辑节点 YAML | 跳转编辑页（YAML 模式） | ❌ |
| 隔离 | `kubernetes-cordon` | `edit` | 将节点标记为不可调度，使其不再接受新 Pod 调度，常用于维护前准备 | 调用 `handleCordon(row)`，弹出二次确认框 | ✅ |
| 恢复 | `kubernetes-uncordon` | `edit` | 恢复节点可调度状态 | 调用 `handleUncordon(row)`，弹出二次确认框 | ✅ |
| 驱逐 | `kubernetes-drain` | `edit` | 迁移节点上所有 Pod 后标记不可调度 | 调用 `handleDrain(row)`，弹出二次确认框 | ✅ |

### Footer 底部操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 取消选择 | `basic-clear` | — | 清空当前表格多选 | 调用 `handleClearSelection()` | ❌ |
| 导出 | `basic-export` | `view` | 导出当前筛选结果 | 调用导出 API | ❌ |

> **Node 特殊说明**：节点（Node）没有开放创建和删除功能。

---

## Namespace

### PageHeader 内容（`v-bind="NAMESPACE_PAGE_META"`，来源：`src/config/kubernetes/namespace.ts`）

| icon | title | description |
| --- | --- | --- |
| `kubernetes-namespace` | 命名空间 | 命名空间（Namespace）是 Kubernetes 集群中用于资源隔离的虚拟集群，可以将集群划分为多个独立的工作空间，实现项目、团队或环境之间的资源隔离和管理。 |

### 数据列

| 列宽 | 组件 | NamespaceListVo 字段 | 其他组件属性 |
| --- | --- | --- | --- |
| 500px | 【首列】`BeeNamespaceInfoCell` | `uid`, `name`, `description` | `icon-size: 32` |
| min-160px | 【中间列】`BeeStatusCell` | `status`, `statusMsg` | `options: NAMESPACE_STATUS_OPTIONS` |
| 200px | 【中间列】`BeeAuditCell` | `username: createBy`, `datetime: createAt` | `fieldName: "创建人 / 时间"` |
| 200px | 【中间列】`BeeAuditCell` | `username: updateBy`, `datetime: updateAt` | `fieldName: "更新人 / 时间"` |
| 150px | 【末尾列】`BeeActionCell` | ❌ 无 | `actions: getActions(row)` |

### 搜索条件

| NamespaceQueryForm 字段 | 字段类型 | Vue 响应式属性 | 展示组件 | 选项来源 |
| --- | --- | --- | --- | --- |
| uid | string | searchKey | BeeInputSearch | ❌ 无 |
| name | string | searchKey | BeeInputSearch | ❌ 无 |
| status | string | queryForm.status | BeeSelect | NAMESPACE_STATUS_OPTIONS |

### Toolbar 工具栏操作

| 操作 | icon | 权限 | 说明 | 行为 |
| --- | --- | --- | --- | --- |
| 新增 | — | `create` | 创建命名空间 | 跳转创建页（表单模式） |
| YAML 新建 | — | `create` | 通过 YAML 创建命名空间 | 跳转创建页（YAML 模式） |

### 列操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 详情 | `basic-view` | `view` | 查看命名空间详情 | 跳转详情页 | ❌ |
| 编辑 | `basic-edit` | `edit` | 编辑命名空间 | 跳转编辑页（表单模式） | ❌ |
| 编辑 YAML | `basic-yaml` | `edit` | 编辑命名空间 YAML | 跳转编辑页（YAML 模式） | ❌ |
| 资源配额 | `kubernetes-quota` | `edit` | 管理命名空间的 ResourceQuota 和 LimitRange | 打开配额管理面板 | ✅ |
| 删除 | `basic-delete` | `delete` | 删除命名空间（含级联警告） | 弹出确认框（含级联警告文本）后删除 | ❌ |

### Footer 底部操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 取消选择 | `basic-clear` | — | 清空当前表格多选 | 调用 `handleClearSelection()` | ❌ |
| 批量删除 | `basic-delete` | `delete` | 批量删除命名空间 | 区分可删除/不可删除行，弹出确认框 | ❌ |
| 导入 | `basic-import` | `create` | 导入 YAML | 打开导入面板 | ❌ |
| 导出 | `basic-export` | `view` | 导出当前筛选结果 | 调用导出 API | ❌ |

> **Namespace 特殊说明**：
> - 集群级资源，无 namespace 筛选，无 Namespaced 继承
> - 删除时需级联警告："删除命名空间将同时删除该命名空间下的所有资源！"

---

## CustomResourceDefinition

### PageHeader 内容（`v-bind="CUSTOMRESOURCEDEFINITION_PAGE_META"`，来源：`src/config/kubernetes/customresourcedefinition.ts`）

| icon | title | description |
| --- | --- | --- |
| `kubernetes-customresourcedefinition` | 自定义资源定义 | 自定义资源定义（CustomResourceDefinition）是 Kubernetes 中用于扩展 API 的机制，允许用户创建自定义资源类型，实现对 Kubernetes 集群功能的定制化扩展。 |

### 数据列

| 列宽 | 组件 | CustomResourceDefinitionListVo 字段 | 其他组件属性 |
| --- | --- | --- | --- |
| 500px | 【首列】`BeeCustomResourceDefinitionInfoCell` | `uid`, `name`, `description` | `icon-size: 32` |
| 250px | 【中间列】`BeeTableCommonCell` | `text: group` | `subtext: "API 组"` |
| 120px | 【中间列】`BeeTableCommonCell` | `text: version` | `subtext: "版本"` |
| 160px | 【中间列】`BeeTableCommonCell` | `text: scope` | `subtext: "作用范围"` |
| 200px | 【中间列】`BeeAuditCell` | `username: createBy`, `datetime: createAt` | |
| 200px | 【中间列】`BeeAuditCell` | `username: updateBy`, `datetime: updateAt` | |
| 150px | 【末尾列】`BeeActionCell` | ❌ 无 | `actions: getActions(row)` |

### 搜索条件

| CustomResourceDefinitionQueryForm 字段 | 字段类型 | Vue 响应式属性 | 展示组件 | 选项来源 |
| --- | --- | --- | --- | --- |
| uid | string | searchKey | BeeInputSearch | ❌ 无 |
| name | string | searchKey | BeeInputSearch | ❌ 无 |

### Toolbar 工具栏操作

| 操作 | icon | 权限 | 说明 | 行为 |
| --- | --- | --- | --- | --- |
| 新增 | — | `create` | 创建 CRD | 跳转创建页（表单模式） |
| YAML 新建 | — | `create` | 通过 YAML 创建 CRD | 跳转创建页（YAML 模式） |

### 列操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 详情 | `basic-view` | `view` | 查看 CRD 详情 | 跳转详情页 | ❌ |
| 编辑 | `basic-edit` | `edit` | 编辑 CRD | 跳转编辑页（表单模式） | ❌ |
| 编辑 YAML | `basic-yaml` | `edit` | 编辑 CRD YAML | 跳转编辑页（YAML 模式） | ❌ |
| 删除 | `basic-delete` | `delete` | 删除 CRD | 弹出确认框后删除 | ❌ |

### Footer 底部操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 取消选择 | `basic-clear` | — | 清空当前表格多选 | 调用 `handleClearSelection()` | ❌ |
| 批量删除 | `basic-delete` | `delete` | 批量删除 CRD | 区分可删除/不可删除行，弹出确认框 | ❌ |
| 导入 | `basic-import` | `create` | 导入 YAML | 打开导入面板 | ❌ |
| 导出 | `basic-export` | `view` | 导出当前筛选结果 | 调用导出 API | ❌ |

---

## Pod

### PageHeader 内容（`v-bind="POD_PAGE_META"`，来源：`src/config/kubernetes/pod.ts`）

| icon | title | description |
| --- | --- | --- |
| `kubernetes-pod` | 容器组 | 容器组（Pod）是 Kubernetes 中最小的可部署计算单元，由一个或多个共享网络和存储资源的容器组成。 |

### 数据列

| 列宽 | 组件 | PodListVo 字段 | 其他组件属性 |
| --- | --- | --- | --- |
| 500px | 【首列】`BeePodInfoCell` | `uid`, `name`, `ip` | `icon-size: 32` |
| 200px | 【中间列】`BeeTableCommonCell` | `text: namespace` | `subtext: "命名空间"` |
| 200px | 【中间列】`BeeTableCommonCell` | `text: nodeName` | `subtext: "所在节点"` |
| 160px | 【中间列】`BeeStatusCell` | `status`, `statusMsg` | `options: POD_STATUS_OPTIONS` |
| 120px | 【中间列】`BeeTableCommonCell` | `text: restartCount` | `subtext: "重启次数"` |
| 160px | 【中间列】`BeeTableCommonCell` | `text: age` | `subtext: "运行时长"` |
| 200px | 【中间列】`BeeAuditCell` | `username: createBy`, `datetime: createAt` | |
| 150px | 【末尾列】`BeeActionCell` | ❌ 无 | `actions: getActions(row)` |

### 搜索条件

| PodQueryForm 字段 | 字段类型 | Vue 响应式属性 | 展示组件 | 选项来源 |
| --- | --- | --- | --- | --- |
| uid | string | searchKey | BeeInputSearch | ❌ 无 |
| name | string | searchKey | BeeInputSearch | ❌ 无 |
| namespace | string | queryForm.namespace | BeeSelect | `loadNamespaceOptions()` |
| status | string | queryForm.status | BeeSelect | POD_STATUS_OPTIONS |

### Toolbar 工具栏操作

### 列操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 详情 | `basic-view` | `view` | 查看 Pod 详情 | 跳转详情页 | ❌ |
| 查看日志 | `kubernetes-log` | `view` | 打开 Pod 日志查看面板 | 打开日志面板 | ✅ |
| 终端 | `kubernetes-terminal` | `edit` | 打开 Web 终端连接到 Pod | 打开终端连接 | ✅ |
| 删除 | `basic-delete` | `delete` | 删除 Pod（控制器会自动重建） | 弹出确认框后删除 | ❌ |

### Footer 底部操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 取消选择 | `basic-clear` | — | 清空当前表格多选 | 调用 `handleClearSelection()` | ❌ |
| 批量删除 | `basic-delete` | `delete` | 批量删除 Pod | 区分可删除/不可删除行，弹出确认框 | ❌ |
| 导出 | `basic-export` | `view` | 导出当前筛选结果 | 调用导出 API | ❌ |

> **Pod 特殊说明**：Pod（Pod）没有开放新增和编辑功能。

---

## Workload — Deployment

### PageHeader 内容（`v-bind="DEPLOYMENT_PAGE_META"`，来源：`src/config/kubernetes/workload/deployment.ts`）

| icon | title | description |
| --- | --- | --- |
| `kubernetes-deployment` | 无状态应用 | 无状态应用（Deployment）是 Kubernetes 中用于管理无状态工作负载的控制器，支持应用的部署、扩缩容、滚动更新和回滚等操作。 |

### 数据列

| 列宽 | 组件 | DeploymentListVo 字段 | 其他组件属性 |
| --- | --- | --- | --- |
| 500px | 【首列】`BeeWorkloadInfoCell` | `uid`, `name`, `description` | `icon: kubernetes-deployment`, `icon-size: 32` |
| 200px | 【中间列】`BeeTableCommonCell` | `text: namespace` | `subtext: "命名空间"` |
| 160px | 【中间列】`BeeStatusCell` | `status`, `statusMsg` | `options: DEPLOYMENT_STATUS_OPTIONS` |
| 120px | 【中间列】`BeeTableCommonCell` | `text: readyReplicas + '/' + replicas` | `subtext: "副本数"` |
| 160px | 【中间列】`BeeTableCommonCell` | `text: DEPLOYMENT_STRATEGY_LABEL_MAP[strategyType]` | `subtext: strategyType` |
| 200px | 【中间列】`BeeAuditCell` | `username: createBy`, `datetime: createAt` | |
| 200px | 【中间列】`BeeAuditCell` | `username: updateBy`, `datetime: updateAt` | |
| 150px | 【末尾列】`BeeActionCell` | ❌ 无 | `actions: getActions(row)` |

### 搜索条件

| DeploymentQueryForm 字段 | 字段类型 | Vue 响应式属性 | 展示组件 | 选项来源 |
| --- | --- | --- | --- | --- |
| uid | string | searchKey | BeeInputSearch | ❌ 无 |
| name | string | searchKey | BeeInputSearch | ❌ 无 |
| namespace | string | queryForm.namespace | BeeSelect | `loadNamespaceOptions()` |
| status | string | queryForm.status | BeeSelect | DEPLOYMENT_STATUS_OPTIONS |

### Toolbar 工具栏操作

| 操作 | icon | 权限 | 说明 | 行为 |
| --- | --- | --- | --- | --- |
| 新增 | — | `create` | 创建 Deployment | 跳转创建页（表单模式） |
| YAML 新建 | — | `create` | 通过 YAML 创建 Deployment | 跳转创建页（YAML 模式） |

### 列操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 详情 | `basic-view` | `view` | 查看 Deployment 详情 | 跳转详情页 | ❌ |
| 编辑 | `basic-edit` | `edit` | 编辑 Deployment | 跳转编辑页（表单模式） | ❌ |
| 编辑 YAML | `basic-yaml` | `edit` | 编辑 Deployment YAML | 跳转编辑页（YAML 模式） | ❌ |
| 扩缩容 | `kubernetes-scale` | `edit` | 修改副本数 | 调用 `handleScale(row)`，弹窗输入目标副本数 | ✅ |
| 重启 | `kubernetes-restart` | `edit` | 触发滚动重启 | 调用 `handleRestart(row)`，弹出确认框后执行 | ✅ |
| 回滚 | `kubernetes-rollback` | `edit` | 选择历史版本回滚 | 调用 `handleRollback(row)`，弹窗选择历史版本后执行 | ✅ |
| 删除 | `basic-delete` | `delete` | 删除 Deployment | 弹出确认框后删除 | ❌ |

### Footer 底部操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 取消选择 | `basic-clear` | — | 清空当前表格多选 | 调用 `handleClearSelection()` | ❌ |
| 批量删除 | `basic-delete` | `delete` | 批量删除 Deployment | 区分可删除/不可删除行，弹出确认框 | ❌ |
| 导入 | `basic-import` | `create` | 导入 YAML | 打开导入面板 | ❌ |
| 导出 | `basic-export` | `view` | 导出当前筛选结果 | 调用导出 API | ❌ |

---

## Workload — StatefulSet

### PageHeader 内容（`v-bind="STATEFULSET_PAGE_META"`，来源：`src/config/kubernetes/workload/statefulset.ts`）

| icon | title | description |
| --- | --- | --- |
| `kubernetes-statefulset` | 有状态应用 | 有状态应用（StatefulSet）是 Kubernetes 中用于管理有状态工作负载的控制器，为每个 Pod 提供稳定的网络标识和持久存储。 |

### 数据列

| 列宽 | 组件 | StatefulSetListVo 字段 | 其他组件属性 |
| --- | --- | --- | --- |
| 500px | 【首列】`BeeWorkloadInfoCell` | `uid`, `name`, `description` | `icon: kubernetes-statefulset`, `icon-size: 32` |
| 200px | 【中间列】`BeeTableCommonCell` | `text: namespace` | `subtext: "命名空间"` |
| 160px | 【中间列】`BeeStatusCell` | `status`, `statusMsg` | `options: STATEFULSET_STATUS_OPTIONS` |
| 120px | 【中间列】`BeeTableCommonCell` | `text: readyReplicas + '/' + replicas` | `subtext: "副本数"` |
| 160px | 【中间列】`BeeTableCommonCell` | `text: podManagementPolicy` | `subtext: "Pod 管理策略"` |
| 200px | 【中间列】`BeeAuditCell` | `username: createBy`, `datetime: createAt` | |
| 200px | 【中间列】`BeeAuditCell` | `username: updateBy`, `datetime: updateAt` | |
| 150px | 【末尾列】`BeeActionCell` | ❌ 无 | `actions: getActions(row)` |

### 搜索条件

| StatefulSetQueryForm 字段 | 字段类型 | Vue 响应式属性 | 展示组件 | 选项来源 |
| --- | --- | --- | --- | --- |
| uid | string | searchKey | BeeInputSearch | ❌ 无 |
| name | string | searchKey | BeeInputSearch | ❌ 无 |
| namespace | string | queryForm.namespace | BeeSelect | `loadNamespaceOptions()` |
| status | string | queryForm.status | BeeSelect | STATEFULSET_STATUS_OPTIONS |

### Toolbar 工具栏操作

| 操作 | icon | 权限 | 说明 | 行为 |
| --- | --- | --- | --- | --- |
| 新增 | — | `create` | 创建 StatefulSet | 跳转创建页（表单模式） |
| YAML 新建 | — | `create` | 通过 YAML 创建 StatefulSet | 跳转创建页（YAML 模式） |

### 列操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 详情 | `basic-view` | `view` | 查看 StatefulSet 详情 | 跳转详情页 | ❌ |
| 编辑 | `basic-edit` | `edit` | 编辑 StatefulSet | 跳转编辑页（表单模式） | ❌ |
| 编辑 YAML | `basic-yaml` | `edit` | 编辑 StatefulSet YAML | 跳转编辑页（YAML 模式） | ❌ |
| 扩缩容 | `kubernetes-scale` | `edit` | 修改副本数 | 调用 `handleScale(row)`，弹窗输入目标副本数 | ✅ |
| 重启 | `kubernetes-restart` | `edit` | 触发滚动重启 | 调用 `handleRestart(row)`，弹出确认框后执行 | ✅ |
| 回滚 | `kubernetes-rollback` | `edit` | 选择历史版本回滚 | 调用 `handleRollback(row)`，弹窗选择历史版本后执行 | ✅ |
| 删除 | `basic-delete` | `delete` | 删除 StatefulSet | 弹出确认框后删除 | ❌ |

### Footer 底部操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 取消选择 | `basic-clear` | — | 清空当前表格多选 | 调用 `handleClearSelection()` | ❌ |
| 批量删除 | `basic-delete` | `delete` | 批量删除 StatefulSet | 区分可删除/不可删除行，弹出确认框 | ❌ |
| 导入 | `basic-import` | `create` | 导入 YAML | 打开导入面板 | ❌ |
| 导出 | `basic-export` | `view` | 导出当前筛选结果 | 调用导出 API | ❌ |

---

## Workload — DaemonSet

### PageHeader 内容（`v-bind="DAEMONSET_PAGE_META"`，来源：`src/config/kubernetes/workload/daemonset.ts`）

| icon | title | description |
| --- | --- | --- |
| `kubernetes-daemonset` | 守护应用 | 守护应用（DaemonSet）是 Kubernetes 中用于确保每个节点运行一个 Pod 副本的控制器，常用于日志采集、监控代理、存储驱动等节点级守护服务。 |

### 数据列

| 列宽 | 组件 | DaemonSetListVo 字段 | 其他组件属性 |
| --- | --- | --- | --- |
| 500px | 【首列】`BeeWorkloadInfoCell` | `uid`, `name`, `description` | `icon: kubernetes-daemonset`, `icon-size: 32` |
| 200px | 【中间列】`BeeTableCommonCell` | `text: namespace` | `subtext: "命名空间"` |
| 160px | 【中间列】`BeeStatusCell` | `status`, `statusMsg` | `options: DAEMONSET_STATUS_OPTIONS` |
| 160px | 【中间列】`BeeTableCommonCell` | `text: readyNodes + '/' + nodeCount` | `subtext: "就绪节点数"` |
| 200px | 【中间列】`BeeAuditCell` | `username: createBy`, `datetime: createAt` | |
| 200px | 【中间列】`BeeAuditCell` | `username: updateBy`, `datetime: updateAt` | |
| 150px | 【末尾列】`BeeActionCell` | ❌ 无 | `actions: getActions(row)` |

### 搜索条件

| DaemonSetQueryForm 字段 | 字段类型 | Vue 响应式属性 | 展示组件 | 选项来源 |
| --- | --- | --- | --- | --- |
| uid | string | searchKey | BeeInputSearch | ❌ 无 |
| name | string | searchKey | BeeInputSearch | ❌ 无 |
| namespace | string | queryForm.namespace | BeeSelect | `loadNamespaceOptions()` |
| status | string | queryForm.status | BeeSelect | DAEMONSET_STATUS_OPTIONS |

### Toolbar 工具栏操作

| 操作 | icon | 权限 | 说明 | 行为 |
| --- | --- | --- | --- | --- |
| 新增 | — | `create` | 创建 DaemonSet | 跳转创建页（表单模式） |
| YAML 新建 | — | `create` | 通过 YAML 创建 DaemonSet | 跳转创建页（YAML 模式） |

### 列操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 详情 | `basic-view` | `view` | 查看 DaemonSet 详情 | 跳转详情页 | ❌ |
| 编辑 | `basic-edit` | `edit` | 编辑 DaemonSet | 跳转编辑页（表单模式） | ❌ |
| 编辑 YAML | `basic-yaml` | `edit` | 编辑 DaemonSet YAML | 跳转编辑页（YAML 模式） | ❌ |
| 重启 | `kubernetes-restart` | `edit` | 触发滚动重启 | 调用 `handleRestart(row)`，弹出确认框后执行 | ✅ |
| 删除 | `basic-delete` | `delete` | 删除 DaemonSet | 弹出确认框后删除 | ❌ |

### Footer 底部操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 取消选择 | `basic-clear` | — | 清空当前表格多选 | 调用 `handleClearSelection()` | ❌ |
| 批量删除 | `basic-delete` | `delete` | 批量删除 DaemonSet | 区分可删除/不可删除行，弹出确认框 | ❌ |
| 导入 | `basic-import` | `create` | 导入 YAML | 打开导入面板 | ❌ |
| 导出 | `basic-export` | `view` | 导出当前筛选结果 | 调用导出 API | ❌ |

---

## Workload — Job

### PageHeader 内容（`v-bind="JOB_PAGE_META"`，来源：`src/config/kubernetes/workload/job.ts`）

| icon | title | description |
| --- | --- | --- |
| `kubernetes-job` | 任务 | 任务（Job）用于运行一次性批量任务，任务完成后 Pod 会自动终止，适用于数据处理、备份、定时计算等场景。 |

### 数据列

| 列宽 | 组件 | JobListVo 字段 | 其他组件属性 |
| --- | --- | --- | --- |
| 500px | 【首列】`BeeWorkloadInfoCell` | `uid`, `name`, `description` | `icon: kubernetes-job`, `icon-size: 32` |
| 200px | 【中间列】`BeeTableCommonCell` | `text: namespace` | `subtext: "命名空间"` |
| 160px | 【中间列】`BeeStatusCell` | `status`, `statusMsg` | `options: JOB_STATUS_OPTIONS` |
| 160px | 【中间列】`BeeTableCommonCell` | `text: succeeded + '/' + completions` | `subtext: "完成进度"` |
| 160px | 【中间列】`BeeTableCommonCell` | `text: duration` | `subtext: "运行时长"` |
| 200px | 【中间列】`BeeAuditCell` | `username: createBy`, `datetime: createAt` | |
| 200px | 【中间列】`BeeAuditCell` | `username: updateBy`, `datetime: updateAt` | |
| 150px | 【末尾列】`BeeActionCell` | ❌ 无 | `actions: getActions(row)` |

### 搜索条件

| JobQueryForm 字段 | 字段类型 | Vue 响应式属性 | 展示组件 | 选项来源 |
| --- | --- | --- | --- | --- |
| uid | string | searchKey | BeeInputSearch | ❌ 无 |
| name | string | searchKey | BeeInputSearch | ❌ 无 |
| namespace | string | queryForm.namespace | BeeSelect | `loadNamespaceOptions()` |
| status | string | queryForm.status | BeeSelect | JOB_STATUS_OPTIONS |

### Toolbar 工具栏操作

| 操作 | icon | 权限 | 说明 | 行为 |
| --- | --- | --- | --- | --- |
| 新增 | — | `create` | 创建 Job | 跳转创建页（表单模式） |
| YAML 新建 | — | `create` | 通过 YAML 创建 Job | 跳转创建页（YAML 模式） |

### 列操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 详情 | `basic-view` | `view` | 查看 Job 详情 | 跳转详情页 | ❌ |
| 删除 | `basic-delete` | `delete` | 删除 Job | 弹出确认框后删除 | ❌ |

### Footer 底部操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 取消选择 | `basic-clear` | — | 清空当前表格多选 | 调用 `handleClearSelection()` | ❌ |
| 批量删除 | `basic-delete` | `delete` | 批量删除 Job | 区分可删除/不可删除行，弹出确认框 | ❌ |
| 导入 | `basic-import` | `create` | 导入 YAML | 打开导入面板 | ❌ |
| 导出 | `basic-export` | `view` | 导出当前筛选结果 | 调用导出 API | ❌ |

> **Job 特殊说明**：Job 创建后不可编辑，仅支持查看和删除操作，不提供编辑和编辑 YAML 操作。

---

## Workload — CronJob

### PageHeader 内容（`v-bind="CRONJOB_PAGE_META"`，来源：`src/config/kubernetes/workload/cronjob.ts`）

| icon | title | description |
| --- | --- | --- |
| `kubernetes-cronjob` | 定时任务 | 定时任务（CronJob）用于定时运行任务，按照 Cron 表达式调度 Job 执行。 |

### 数据列

| 列宽 | 组件 | CronJobListVo 字段 | 其他组件属性 |
| --- | --- | --- | --- |
| 500px | 【首列】`BeeWorkloadInfoCell` | `uid`, `name`, `description` | `icon: kubernetes-cronjob`, `icon-size: 32` |
| 200px | 【中间列】`BeeTableCommonCell` | `text: namespace` | `subtext: "命名空间"` |
| 160px | 【中间列】`BeeStatusCell` | `status`, `statusMsg` | `options: CRONJOB_STATUS_OPTIONS` |
| 200px | 【中间列】`BeeTableCommonCell` | `text: schedule` | `subtext: "调度规则"` |
| 160px | 【中间列】`BeeTableCommonCell` | `text: lastScheduleTime` | `subtext: "上次执行"` |
| 200px | 【中间列】`BeeAuditCell` | `username: createBy`, `datetime: createAt` | |
| 200px | 【中间列】`BeeAuditCell` | `username: updateBy`, `datetime: updateAt` | |
| 150px | 【末尾列】`BeeActionCell` | ❌ 无 | `actions: getActions(row)` |

### 搜索条件

| CronJobQueryForm 字段 | 字段类型 | Vue 响应式属性 | 展示组件 | 选项来源 |
| --- | --- | --- | --- | --- |
| uid | string | searchKey | BeeInputSearch | ❌ 无 |
| name | string | searchKey | BeeInputSearch | ❌ 无 |
| namespace | string | queryForm.namespace | BeeSelect | `loadNamespaceOptions()` |
| status | string | queryForm.status | BeeSelect | CRONJOB_STATUS_OPTIONS |

### Toolbar 工具栏操作

| 操作 | icon | 权限 | 说明 | 行为 |
| --- | --- | --- | --- | --- |
| 新增 | — | `create` | 创建 CronJob | 跳转创建页（表单模式） |
| YAML 新建 | — | `create` | 通过 YAML 创建 CronJob | 跳转创建页（YAML 模式） |

### 列操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 详情 | `basic-view` | `view` | 查看 CronJob 详情 | 跳转详情页 | ❌ |
| 编辑 | `basic-edit` | `edit` | 编辑 CronJob | 跳转编辑页（表单模式） | ❌ |
| 编辑 YAML | `basic-yaml` | `edit` | 编辑 CronJob YAML | 跳转编辑页（YAML 模式） | ❌ |
| 触发执行 | `kubernetes-play` | `edit` | 手动触发一次 Job 执行 | 调用 `handleTriggerJob(row)`，弹出确认框后执行 | ✅ |
| 暂停/恢复 | `kubernetes-pause` / `kubernetes-play` | `edit` | 暂停或恢复定时调度 | 调用 `handleToggleSchedule(row)`，弹出确认框后执行 | ✅ |
| 删除 | `basic-delete` | `delete` | 删除 CronJob | 弹出确认框后删除 | ❌ |

### Footer 底部操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 取消选择 | `basic-clear` | — | 清空当前表格多选 | 调用 `handleClearSelection()` | ❌ |
| 批量删除 | `basic-delete` | `delete` | 批量删除 CronJob | 区分可删除/不可删除行，弹出确认框 | ❌ |
| 导入 | `basic-import` | `create` | 导入 YAML | 打开导入面板 | ❌ |
| 导出 | `basic-export` | `view` | 导出当前筛选结果 | 调用导出 API | ❌ |

---

## Config — ConfigMap

### PageHeader 内容（`v-bind="CONFIGMAP_PAGE_META"`，来源：`src/config/kubernetes/config/configmap.ts`）

| icon | title | description |
| --- | --- | --- |
| `kubernetes-configmap` | 配置项 | 配置（ConfigMap）是 Kubernetes 中用于存储非敏感配置数据的资源对象，支持以键值对形式管理应用的配置信息。 |

### 数据列

| 列宽 | 组件 | ConfigMapListVo 字段 | 其他组件属性 |
| --- | --- | --- | --- |
| 500px | 【首列】`BeeConfigInfoCell` | `uid`, `name`, `description` | `icon-size: 32` |
| 200px | 【中间列】`BeeTableCommonCell` | `text: namespace` | `subtext: "命名空间"` |
| 160px | 【中间列】`BeeTableCommonCell` | `text: dataCount + " 条"` | `subtext: "数据条目"` |
| 200px | 【中间列】`BeeAuditCell` | `username: createBy`, `datetime: createAt` | |
| 200px | 【中间列】`BeeAuditCell` | `username: updateBy`, `datetime: updateAt` | |
| 150px | 【末尾列】`BeeActionCell` | ❌ 无 | `actions: getActions(row)` |

### 搜索条件

| ConfigMapQueryForm 字段 | 字段类型 | Vue 响应式属性 | 展示组件 | 选项来源 |
| --- | --- | --- | --- | --- |
| uid | string | searchKey | BeeInputSearch | ❌ 无 |
| name | string | searchKey | BeeInputSearch | ❌ 无 |
| namespace | string | queryForm.namespace | BeeSelect | `loadNamespaceOptions()` |

> ConfigMap 无状态筛选字段。

### Toolbar 工具栏操作

| 操作 | icon | 权限 | 说明 | 行为 |
| --- | --- | --- | --- | --- |
| 新增 | — | `create` | 创建 ConfigMap | 跳转创建页（表单模式） |
| YAML 新建 | — | `create` | 通过 YAML 创建 ConfigMap | 跳转创建页（YAML 模式） |

### 列操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 详情 | `basic-view` | `view` | 查看 ConfigMap 详情 | 跳转详情页 | ❌ |
| 编辑 | `basic-edit` | `edit` | 编辑 ConfigMap | 跳转编辑页（表单模式） | ❌ |
| 编辑 YAML | `basic-yaml` | `edit` | 编辑 ConfigMap YAML | 跳转编辑页（YAML 模式） | ❌ |
| 管理数据 | `kubernetes-config` | `edit` | 管理键值对数据条目 | 打开数据管理面板 | ✅ |
| 删除 | `basic-delete` | `delete` | 删除 ConfigMap | 弹出确认框后删除 | ❌ |

### Footer 底部操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 取消选择 | `basic-clear` | — | 清空当前表格多选 | 调用 `handleClearSelection()` | ❌ |
| 批量删除 | `basic-delete` | `delete` | 批量删除 ConfigMap | 区分可删除/不可删除行，弹出确认框 | ❌ |
| 导入 | `basic-import` | `create` | 导入 YAML | 打开导入面板 | ❌ |
| 导出 | `basic-export` | `view` | 导出当前筛选结果 | 调用导出 API | ❌ |

---

## Config — Secret

### PageHeader 内容（`v-bind="SECRET_PAGE_META"`，来源：`src/config/kubernetes/config/secret.ts`）

| icon | title | description |
| --- | --- | --- |
| `kubernetes-secret` | 保密字典 | 密钥（Secret）是 Kubernetes 中用于存储敏感信息（如密码、令牌、密钥）的资源对象，通过加密方式保障数据安全。 |

### 数据列

| 列宽 | 组件 | SecretListVo 字段 | 其他组件属性 |
| --- | --- | --- | --- |
| 500px | 【首列】`BeeConfigInfoCell` | `uid`, `name`, `description` | `icon-size: 32` |
| 200px | 【中间列】`BeeTableCommonCell` | `text: namespace` | `subtext: "命名空间"` |
| 160px | 【中间列】`BeeTableCommonCell` | `text: SECRET_TYPE_LABEL_MAP[type]` | `subtext: "类型"` |
| 160px | 【中间列】`BeeTableCommonCell` | `text: dataCount + " 条"` | `subtext: "数据条目"` |
| 200px | 【中间列】`BeeAuditCell` | `username: createBy`, `datetime: createAt` | |
| 200px | 【中间列】`BeeAuditCell` | `username: updateBy`, `datetime: updateAt` | |
| 150px | 【末尾列】`BeeActionCell` | ❌ 无 | `actions: getActions(row)` |

### 搜索条件

| SecretQueryForm 字段 | 字段类型 | Vue 响应式属性 | 展示组件 | 选项来源 |
| --- | --- | --- | --- | --- |
| uid | string | searchKey | BeeInputSearch | ❌ 无 |
| name | string | searchKey | BeeInputSearch | ❌ 无 |
| namespace | string | queryForm.namespace | BeeSelect | `loadNamespaceOptions()` |
| type | string | queryForm.type | BeeSelect | SECRET_TYPE_OPTIONS |

### Toolbar 工具栏操作

| 操作 | icon | 权限 | 说明 | 行为 |
| --- | --- | --- | --- | --- |
| 新增 | — | `create` | 创建 Secret | 跳转创建页（表单模式） |
| YAML 新建 | — | `create` | 通过 YAML 创建 Secret | 跳转创建页（YAML 模式） |

### 列操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 详情 | `basic-view` | `view` | 查看 Secret 详情 | 跳转详情页 | ❌ |
| 编辑 | `basic-edit` | `edit` | 编辑 Secret | 跳转编辑页（表单模式） | ❌ |
| 编辑 YAML | `basic-yaml` | `edit` | 编辑 Secret YAML | 跳转编辑页（YAML 模式） | ❌ |
| 管理数据 | `kubernetes-config` | `edit` | 管理键值对数据条目 | 打开数据管理面板 | ✅ |
| 删除 | `basic-delete` | `delete` | 删除 Secret | 弹出确认框后删除 | ❌ |

### Footer 底部操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 取消选择 | `basic-clear` | — | 清空当前表格多选 | 调用 `handleClearSelection()` | ❌ |
| 批量删除 | `basic-delete` | `delete` | 批量删除 Secret | 区分可删除/不可删除行，弹出确认框 | ❌ |
| 导入 | `basic-import` | `create` | 导入 YAML | 打开导入面板 | ❌ |
| 导出 | `basic-export` | `view` | 导出当前筛选结果 | 调用导出 API | ❌ |

---

## Network — Service

### PageHeader 内容（`v-bind="SERVICE_PAGE_META"`，来源：`src/config/kubernetes/network/service.ts`）

| icon | title | description |
| --- | --- | --- |
| `kubernetes-service` | 服务 | 服务（Service）是 Kubernetes 中用于将一组 Pod 暴露为网络服务的资源对象，提供稳定的访问入口和负载均衡。 |

### 数据列

| 列宽 | 组件 | ServiceListVo 字段 | 其他组件属性 |
| --- | --- | --- | --- |
| 500px | 【首列】`BeeNetworkInfoCell` | `uid`, `name`, `description` | `icon-size: 32` |
| 200px | 【中间列】`BeeTableCommonCell` | `text: namespace` | `subtext: "命名空间"` |
| 180px | 【中间列】`BeeTableCommonCell` | `text: clusterIP` | `subtext: "集群 IP"` |
| 160px | 【中间列】`BeeTableCommonCell` | `text: ports.map(p => p.port).join(', ')` | `subtext: "端口"` |
| 120px | 【中间列】`BeeTableCommonCell` | `text: SERVICE_TYPE_LABEL_MAP[type]` | `subtext: "类型"` |
| 200px | 【中间列】`BeeAuditCell` | `username: createBy`, `datetime: createAt` | |
| 200px | 【中间列】`BeeAuditCell` | `username: updateBy`, `datetime: updateAt` | |
| 150px | 【末尾列】`BeeActionCell` | ❌ 无 | `actions: getActions(row)` |

### 搜索条件

| ServiceQueryForm 字段 | 字段类型 | Vue 响应式属性 | 展示组件 | 选项来源 |
| --- | --- | --- | --- | --- |
| uid | string | searchKey | BeeInputSearch | ❌ 无 |
| name | string | searchKey | BeeInputSearch | ❌ 无 |
| namespace | string | queryForm.namespace | BeeSelect | `loadNamespaceOptions()` |

> Service 无状态筛选字段。

### Toolbar 工具栏操作

| 操作 | icon | 权限 | 说明 | 行为 |
| --- | --- | --- | --- | --- |
| 新增 | — | `create` | 创建 Service | 跳转创建页（表单模式） |
| YAML 新建 | — | `create` | 通过 YAML 创建 Service | 跳转创建页（YAML 模式） |

### 列操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 详情 | `basic-view` | `view` | 查看 Service 详情 | 跳转详情页 | ❌ |
| 编辑 | `basic-edit` | `edit` | 编辑 Service | 跳转编辑页（表单模式） | ❌ |
| 编辑 YAML | `basic-yaml` | `edit` | 编辑 Service YAML | 跳转编辑页（YAML 模式） | ❌ |
| 删除 | `basic-delete` | `delete` | 删除 Service | 弹出确认框后删除 | ❌ |

### Footer 底部操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 取消选择 | `basic-clear` | — | 清空当前表格多选 | 调用 `handleClearSelection()` | ❌ |
| 批量删除 | `basic-delete` | `delete` | 批量删除 Service | 区分可删除/不可删除行，弹出确认框 | ❌ |
| 导入 | `basic-import` | `create` | 导入 YAML | 打开导入面板 | ❌ |
| 导出 | `basic-export` | `view` | 导出当前筛选结果 | 调用导出 API | ❌ |

---

## Network — Ingress

### PageHeader 内容（`v-bind="INGRESS_PAGE_META"`，来源：`src/config/kubernetes/network/ingress.ts`）

| icon | title | description |
| --- | --- | --- |
| `kubernetes-ingress` | 路由 | 路由（Ingress）是 Kubernetes 中用于管理集群外部 HTTP/HTTPS 访问的资源对象，支持基于域名和路径的流量路由。 |

### 数据列

| 列宽 | 组件 | IngressListVo 字段 | 其他组件属性 |
| --- | --- | --- | --- |
| 500px | 【首列】`BeeNetworkInfoCell` | `uid`, `name`, `description` | `icon-size: 32` |
| 200px | 【中间列】`BeeTableCommonCell` | `text: namespace` | `subtext: "命名空间"` |
| 300px | 【中间列】`BeeTableCommonCell` | `text: rules` | `subtext: "规则（host+paths）"` |
| 200px | 【中间列】`BeeTableCommonCell` | `text: backend` | `subtext: "后端（serviceName:port）"` |
| 200px | 【中间列】`BeeAuditCell` | `username: createBy`, `datetime: createAt` | |
| 200px | 【中间列】`BeeAuditCell` | `username: updateBy`, `datetime: updateAt` | |
| 150px | 【末尾列】`BeeActionCell` | ❌ 无 | `actions: getActions(row)` |

### 搜索条件

| IngressQueryForm 字段 | 字段类型 | Vue 响应式属性 | 展示组件 | 选项来源 |
| --- | --- | --- | --- | --- |
| uid | string | searchKey | BeeInputSearch | ❌ 无 |
| name | string | searchKey | BeeInputSearch | ❌ 无 |
| namespace | string | queryForm.namespace | BeeSelect | `loadNamespaceOptions()` |

### Toolbar 工具栏操作

| 操作 | icon | 权限 | 说明 | 行为 |
| --- | --- | --- | --- | --- |
| 新增 | — | `create` | 创建 Ingress | 跳转创建页（表单模式） |
| YAML 新建 | — | `create` | 通过 YAML 创建 Ingress | 跳转创建页（YAML 模式） |

### 列操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 详情 | `basic-view` | `view` | 查看 Ingress 详情 | 跳转详情页 | ❌ |
| 编辑 | `basic-edit` | `edit` | 编辑 Ingress | 跳转编辑页（表单模式） | ❌ |
| 编辑 YAML | `basic-yaml` | `edit` | 编辑 Ingress YAML | 跳转编辑页（YAML 模式） | ❌ |
| 删除 | `basic-delete` | `delete` | 删除 Ingress | 弹出确认框后删除 | ❌ |

### Footer 底部操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 取消选择 | `basic-clear` | — | 清空当前表格多选 | 调用 `handleClearSelection()` | ❌ |
| 批量删除 | `basic-delete` | `delete` | 批量删除 Ingress | 区分可删除/不可删除行，弹出确认框 | ❌ |
| 导入 | `basic-import` | `create` | 导入 YAML | 打开导入面板 | ❌ |
| 导出 | `basic-export` | `view` | 导出当前筛选结果 | 调用导出 API | ❌ |

---

## Network — NetworkPolicy

### PageHeader 内容（`v-bind="NETWORKPOLICY_PAGE_META"`，来源：`src/config/kubernetes/network/networkpolicy.ts`）

| icon | title | description |
| --- | --- | --- |
| `kubernetes-networkpolicy` | 网络策略 | 网络策略（NetworkPolicy）是 Kubernetes 中用于控制 Pod 之间网络通信的资源对象，通过定义入站和出站规则实现网络隔离。 |

### 数据列

| 列宽 | 组件 | NetworkPolicyListVo 字段 | 其他组件属性 |
| --- | --- | --- | --- |
| 500px | 【首列】`BeeNetworkInfoCell` | `uid`, `name`, `description` | `icon-size: 32` |
| 200px | 【中间列】`BeeTableCommonCell` | `text: namespace` | `subtext: "命名空间"` |
| 250px | 【中间列】`BeeTableCommonCell` | `text: podSelector` | `subtext: "Pod 选择器"` |
| 200px | 【中间列】`BeeTableCommonCell` | `text: policyTypes` | `subtext: "策略类型"` |
| 200px | 【中间列】`BeeAuditCell` | `username: createBy`, `datetime: createAt` | |
| 200px | 【中间列】`BeeAuditCell` | `username: updateBy`, `datetime: updateAt` | |
| 150px | 【末尾列】`BeeActionCell` | ❌ 无 | `actions: getActions(row)` |

### 搜索条件

| NetworkPolicyQueryForm 字段 | 字段类型 | Vue 响应式属性 | 展示组件 | 选项来源 |
| --- | --- | --- | --- | --- |
| uid | string | searchKey | BeeInputSearch | ❌ 无 |
| name | string | searchKey | BeeInputSearch | ❌ 无 |
| namespace | string | queryForm.namespace | BeeSelect | `loadNamespaceOptions()` |

### Toolbar 工具栏操作

| 操作 | icon | 权限 | 说明 | 行为 |
| --- | --- | --- | --- | --- |
| 新增 | — | `create` | 创建 NetworkPolicy | 跳转创建页（表单模式） |
| YAML 新建 | — | `create` | 通过 YAML 创建 NetworkPolicy | 跳转创建页（YAML 模式） |

### 列操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 详情 | `basic-view` | `view` | 查看 NetworkPolicy 详情 | 跳转详情页 | ❌ |
| 编辑 | `basic-edit` | `edit` | 编辑 NetworkPolicy | 跳转编辑页（表单模式） | ❌ |
| 编辑 YAML | `basic-yaml` | `edit` | 编辑 NetworkPolicy YAML | 跳转编辑页（YAML 模式） | ❌ |
| 删除 | `basic-delete` | `delete` | 删除 NetworkPolicy | 弹出确认框后删除 | ❌ |

### Footer 底部操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 取消选择 | `basic-clear` | — | 清空当前表格多选 | 调用 `handleClearSelection()` | ❌ |
| 批量删除 | `basic-delete` | `delete` | 批量删除 NetworkPolicy | 区分可删除/不可删除行，弹出确认框 | ❌ |
| 导入 | `basic-import` | `create` | 导入 YAML | 打开导入面板 | ❌ |
| 导出 | `basic-export` | `view` | 导出当前筛选结果 | 调用导出 API | ❌ |

---

## Storage — PersistentVolume

### PageHeader 内容（`v-bind="PERSISTENTVOLUME_PAGE_META"`，来源：`src/config/kubernetes/storage/persistentvolume.ts`）

| icon | title | description |
| --- | --- | --- |
| `kubernetes-persistentvolume` | 持久卷 | 持久卷（PersistentVolume）是 Kubernetes 集群中管理员预先配置的存储资源，独立于 Pod 生命周期，为应用提供持久化存储能力。 |

### 数据列

| 列宽 | 组件 | PersistentVolumeListVo 字段 | 其他组件属性 |
| --- | --- | --- | --- |
| 500px | 【首列】`BeeStorageInfoCell` | `uid`, `name`, `description` | `icon-size: 32` |
| 160px | 【中间列】`BeeTableCommonCell` | `text: storageSize` | `subtext: "容量"` |
| 160px | 【中间列】`BeeTableCommonCell` | `text: accessModes` | `subtext: "访问模式"` |
| 140px | 【中间列】`BeeTableCommonCell` | `text: reclaimPolicy` | `subtext: "回收策略"` |
| 160px | 【中间列】`BeeStatusCell` | `status: phase` | `options: PERSISTENTVOLUME_PHASE_OPTIONS` |
| 200px | 【中间列】`BeeAuditCell` | `username: createBy`, `datetime: createAt` | |
| 200px | 【中间列】`BeeAuditCell` | `username: updateBy`, `datetime: updateAt` | |
| 150px | 【末尾列】`BeeActionCell` | ❌ 无 | `actions: getActions(row)` |

### 搜索条件

| PersistentVolumeQueryForm 字段 | 字段类型 | Vue 响应式属性 | 展示组件 | 选项来源 |
| --- | --- | --- | --- | --- |
| uid | string | searchKey | BeeInputSearch | ❌ 无 |
| name | string | searchKey | BeeInputSearch | ❌ 无 |

> PersistentVolume 无状态和 namespace 筛选字段。

### Toolbar 工具栏操作

| 操作 | icon | 权限 | 说明 | 行为 |
| --- | --- | --- | --- | --- |
| 新增 | — | `create` | 创建 PersistentVolume | 跳转创建页（表单模式） |
| YAML 新建 | — | `create` | 通过 YAML 创建 PersistentVolume | 跳转创建页（YAML 模式） |

### 列操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 详情 | `basic-view` | `view` | 查看 PersistentVolume 详情 | 跳转详情页 | ❌ |
| 编辑 | `basic-edit` | `edit` | 编辑 PersistentVolume | 跳转编辑页（表单模式） | ❌ |
| 编辑 YAML | `basic-yaml` | `edit` | 编辑 PersistentVolume YAML | 跳转编辑页（YAML 模式） | ❌ |
| 删除 | `basic-delete` | `delete` | 删除 PersistentVolume（含级联警告） | 弹出确认框（含级联警告文本）后删除 | ❌ |


### Footer 底部操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 取消选择 | `basic-clear` | — | 清空当前表格多选 | 调用 `handleClearSelection()` | ❌ |
| 批量删除 | `basic-delete` | `delete` | 批量删除 PersistentVolume | 区分可删除/不可删除行，弹出确认框 | ❌ |
| 导入 | `basic-import` | `create` | 导入 YAML | 打开导入面板 | ❌ |
| 导出 | `basic-export` | `view` | 导出当前筛选结果 | 调用导出 API | ❌ |

> **PersistentVolume 特殊说明**：删除时需级联警告："删除 PersistentVolume 可能导致已绑定的 PersistentVolumeClaim 状态异常"。

---

## Storage — PersistentVolumeClaim

### PageHeader 内容（`v-bind="PERSISTENTVOLUMECLAIM_PAGE_META"`，来源：`src/config/kubernetes/storage/persistentvolumeclaim.ts`）

| icon | title | description |
| --- | --- | --- |
| `kubernetes-persistentvolumeclaim` | 持久卷声明 | 持久卷声明（PersistentVolumeClaim）是用户对持久卷的存储请求，支持指定容量、访问模式等存储需求，实现存储资源的动态申请与绑定。 |

### 数据列

| 列宽 | 组件 | PersistentVolumeClaimListVo 字段 | 其他组件属性 |
| --- | --- | --- | --- |
| 500px | 【首列】`BeeStorageInfoCell` | `uid`, `name`, `description` | `icon-size: 32` |
| 200px | 【中间列】`BeeTableCommonCell` | `text: namespace` | `subtext: "命名空间"` |
| 160px | 【中间列】`BeeTableCommonCell` | `text: storageSize` | `subtext: "容量"` |
| 160px | 【中间列】`BeeTableCommonCell` | `text: accessModes` | `subtext: "访问模式"` |
| 300px | 【中间列】`BeeTableCommonCell` | `text: volumeName` | `subtext: "绑定的 PersistentVolume"` |
| 160px | 【中间列】`BeeStatusCell` | `status: phase` | `options: PERSISTENTVOLUMECLAIM_PHASE_OPTIONS` |
| 200px | 【中间列】`BeeAuditCell` | `username: createBy`, `datetime: createAt` | |
| 200px | 【中间列】`BeeAuditCell` | `username: updateBy`, `datetime: updateAt` | |
| 150px | 【末尾列】`BeeActionCell` | ❌ 无 | `actions: getActions(row)` |

### 搜索条件

| PersistentVolumeClaimQueryForm 字段 | 字段类型 | Vue 响应式属性 | 展示组件 | 选项来源 |
| --- | --- | --- | --- | --- |
| uid | string | searchKey | BeeInputSearch | ❌ 无 |
| name | string | searchKey | BeeInputSearch | ❌ 无 |
| namespace | string | queryForm.namespace | BeeSelect | `loadNamespaceOptions()` |
| status | string | queryForm.status | BeeSelect | PERSISTENTVOLUMECLAIM_PHASE_OPTIONS |

### Toolbar 工具栏操作

| 操作 | icon | 权限 | 说明 | 行为 |
| --- | --- | --- | --- | --- |
| 新增 | — | `create` | 创建 PersistentVolumeClaim | 跳转创建页（表单模式） |
| YAML 新建 | — | `create` | 通过 YAML 创建 PersistentVolumeClaim | 跳转创建页（YAML 模式） |

### 列操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 详情 | `basic-view` | `view` | 查看 PVC 详情 | 跳转详情页 | ❌ |
| 编辑 | `basic-edit` | `edit` | 编辑 PVC | 跳转编辑页（表单模式） | ❌ |
| 编辑 YAML | `basic-yaml` | `edit` | 编辑 PVC YAML | 跳转编辑页（YAML 模式） | ❌ |
| 删除 | `basic-delete` | `delete` | 删除 PVC（含级联警告） | 弹出确认框（含级联警告文本）后删除 | ❌ |


### Footer 底部操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 取消选择 | `basic-clear` | — | 清空当前表格多选 | 调用 `handleClearSelection()` | ❌ |
| 批量删除 | `basic-delete` | `delete` | 批量删除 PVC | 区分可删除/不可删除行，弹出确认框 | ❌ |
| 导入 | `basic-import` | `create` | 导入 YAML | 打开导入面板 | ❌ |
| 导出 | `basic-export` | `view` | 导出当前筛选结果 | 调用导出 API | ❌ |

> **PersistentVolumeClaim 特殊说明**：删除时需级联警告："删除 PersistentVolumeClaim 可能导致绑定的 PersistentVolume 被连带删除（当 PV 回收策略为 Delete 时）"。

---

## Storage — StorageClass

### PageHeader 内容（`v-bind="STORAGECLASS_PAGE_META"`，来源：`src/config/kubernetes/storage/storageclass.ts`）

| icon | title | description |
| --- | --- | --- |
| `kubernetes-storageclass` | 存储类 | 存储类（StorageClass）是 Kubernetes 中用于定义动态存储制备策略的资源对象，管理员可配置不同的存储后端和参数供用户选择。 |

### 数据列

| 列宽 | 组件 | StorageClassListVo 字段 | 其他组件属性 |
| --- | --- | --- | --- |
| 500px | 【首列】`BeeStorageInfoCell` | `uid`, `name`, `description` | `icon-size: 32` |
| 200px | 【中间列】`BeeTableCommonCell` | `text: provisioner` | `subtext: "制备器"` |
| 160px | 【中间列】`BeeTableCommonCell` | `text: reclaimPolicy` | `subtext: "回收策略"` |
| 160px | 【中间列】`BeeTableCommonCell` | `text: isDefault ? '是' : '否'` | `subtext: "默认存储类"` |
| 200px | 【中间列】`BeeAuditCell` | `username: createBy`, `datetime: createAt` | |
| 200px | 【中间列】`BeeAuditCell` | `username: updateBy`, `datetime: updateAt` | |
| 150px | 【末尾列】`BeeActionCell` | ❌ 无 | `actions: getActions(row)` |

### 搜索条件

| StorageClassQueryForm 字段 | 字段类型 | Vue 响应式属性 | 展示组件 | 选项来源 |
| --- | --- | --- | --- | --- |
| uid | string | searchKey | BeeInputSearch | ❌ 无 |
| name | string | searchKey | BeeInputSearch | ❌ 无 |

> StorageClass 无状态和 namespace 筛选字段。

### Toolbar 工具栏操作

| 操作 | icon | 权限 | 说明 | 行为 |
| --- | --- | --- | --- | --- |
| 新增 | — | `create` | 创建 StorageClass | 跳转创建页（表单模式） |
| YAML 新建 | — | `create` | 通过 YAML 创建 StorageClass | 跳转创建页（YAML 模式） |

### 列操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 详情 | `basic-view` | `view` | 查看 StorageClass 详情 | 跳转详情页 | ❌ |
| 编辑 | `basic-edit` | `edit` | 编辑 StorageClass | 跳转编辑页（表单模式） | ❌ |
| 编辑 YAML | `basic-yaml` | `edit` | 编辑 StorageClass YAML | 跳转编辑页（YAML 模式） | ❌ |
| 删除 | `basic-delete` | `delete` | 删除 StorageClass | 弹出确认框后删除 | ❌ |

### Footer 底部操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 取消选择 | `basic-clear` | — | 清空当前表格多选 | 调用 `handleClearSelection()` | ❌ |
| 批量删除 | `basic-delete` | `delete` | 批量删除 StorageClass | 区分可删除/不可删除行，弹出确认框 | ❌ |
| 导入 | `basic-import` | `create` | 导入 YAML | 打开导入面板 | ❌ |
| 导出 | `basic-export` | `view` | 导出当前筛选结果 | 调用导出 API | ❌ |

---

## Security — ServiceAccount

### PageHeader 内容（`v-bind="SERVICEACCOUNT_PAGE_META"`，来源：`src/config/kubernetes/security/serviceaccount.ts`）

| icon | title | description |
| --- | --- | --- |
| `kubernetes-serviceaccount` | 服务账号 | 服务账号（ServiceAccount）是 Kubernetes 中为 Pod 提供身份认证的账户资源，用于控制 Pod 对 API Server 的访问权限。 |

### 数据列

| 列宽 | 组件 | ServiceAccountListVo 字段 | 其他组件属性 |
| --- | --- | --- | --- |
| 500px | 【首列】`BeeSecurityInfoCell` | `uid`, `name`, `description` | `icon-size: 32` |
| 200px | 【中间列】`BeeTableCommonCell` | `text: namespace` | `subtext: "命名空间"` |
| 160px | 【中间列】`BeeTableCommonCell` | `text: secretCount + " 个"` | `subtext: "关联 Secret"` |
| 200px | 【中间列】`BeeAuditCell` | `username: createBy`, `datetime: createAt` | |
| 200px | 【中间列】`BeeAuditCell` | `username: updateBy`, `datetime: updateAt` | |
| 150px | 【末尾列】`BeeActionCell` | ❌ 无 | `actions: getActions(row)` |

### 搜索条件

| ServiceAccountQueryForm 字段 | 字段类型 | Vue 响应式属性 | 展示组件 | 选项来源 |
| --- | --- | --- | --- | --- |
| uid | string | searchKey | BeeInputSearch | ❌ 无 |
| name | string | searchKey | BeeInputSearch | ❌ 无 |
| namespace | string | queryForm.namespace | BeeSelect | `loadNamespaceOptions()` |

### Toolbar 工具栏操作

| 操作 | icon | 权限 | 说明 | 行为 |
| --- | --- | --- | --- | --- |
| 新增 | — | `create` | 创建 ServiceAccount | 跳转创建页（表单模式） |
| YAML 新建 | — | `create` | 通过 YAML 创建 ServiceAccount | 跳转创建页（YAML 模式） |

### 列操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 详情 | `basic-view` | `view` | 查看 ServiceAccount 详情 | 跳转详情页 | ❌ |
| 编辑 | `basic-edit` | `edit` | 编辑 ServiceAccount | 跳转编辑页（表单模式） | ❌ |
| 编辑 YAML | `basic-yaml` | `edit` | 编辑 ServiceAccount YAML | 跳转编辑页（YAML 模式） | ❌ |
| 管理镜像拉取密钥 | `kubernetes-imagepullsecret` | `edit` | 管理关联的 imagePullSecrets | 打开管理面板 | ✅ |
| 删除 | `basic-delete` | `delete` | 删除 ServiceAccount | 弹出确认框后删除 | ❌ |

### Footer 底部操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 取消选择 | `basic-clear` | — | 清空当前表格多选 | 调用 `handleClearSelection()` | ❌ |
| 批量删除 | `basic-delete` | `delete` | 批量删除 ServiceAccount | 区分可删除/不可删除行，弹出确认框 | ❌ |
| 导入 | `basic-import` | `create` | 导入 YAML | 打开导入面板 | ❌ |
| 导出 | `basic-export` | `view` | 导出当前筛选结果 | 调用导出 API | ❌ |

---

## Security — Role

### PageHeader 内容（`v-bind="ROLE_PAGE_META"`，来源：`src/config/kubernetes/security/role.ts`）

| icon | title | description |
| --- | --- | --- |
| `kubernetes-role` | 角色 | 角色（Role）是 Kubernetes 中用于定义 API 资源访问权限规则集合的资源对象，作用于命名空间级别。 |

### 数据列

| 列宽 | 组件 | RoleListVo 字段 | 其他组件属性 |
| --- | --- | --- | --- |
| 500px | 【首列】`BeeSecurityInfoCell` | `uid`, `name`, `description` | `icon-size: 32` |
| 200px | 【中间列】`BeeTableCommonCell` | `text: namespace` | `subtext: "命名空间"` |
| 160px | 【中间列】`BeeTableCommonCell` | `text: ruleCount + " 条"` | `subtext: "规则数"` |
| 200px | 【中间列】`BeeAuditCell` | `username: createBy`, `datetime: createAt` | |
| 200px | 【中间列】`BeeAuditCell` | `username: updateBy`, `datetime: updateAt` | |
| 150px | 【末尾列】`BeeActionCell` | ❌ 无 | `actions: getActions(row)` |

### 搜索条件

| RoleQueryForm 字段 | 字段类型 | Vue 响应式属性 | 展示组件 | 选项来源 |
| --- | --- | --- | --- | --- |
| uid | string | searchKey | BeeInputSearch | ❌ 无 |
| name | string | searchKey | BeeInputSearch | ❌ 无 |
| namespace | string | queryForm.namespace | BeeSelect | `loadNamespaceOptions()` |

### Toolbar 工具栏操作

| 操作 | icon | 权限 | 说明 | 行为 |
| --- | --- | --- | --- | --- |
| 新增 | — | `create` | 创建 Role | 跳转创建页（表单模式） |
| YAML 新建 | — | `create` | 通过 YAML 创建 Role | 跳转创建页（YAML 模式） |

### 列操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 详情 | `basic-view` | `view` | 查看 Role 详情 | 跳转详情页 | ❌ |
| 编辑 | `basic-edit` | `edit` | 编辑 Role | 跳转编辑页（表单模式） | ❌ |
| 编辑 YAML | `basic-yaml` | `edit` | 编辑 Role YAML | 跳转编辑页（YAML 模式） | ❌ |
| 更新规则 | `kubernetes-rule` | `edit` | 管理角色的权限规则 | 打开规则管理面板 | ✅ |
| 删除 | `basic-delete` | `delete` | 删除 Role | 弹出确认框后删除 | ❌ |

### Footer 底部操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 取消选择 | `basic-clear` | — | 清空当前表格多选 | 调用 `handleClearSelection()` | ❌ |
| 批量删除 | `basic-delete` | `delete` | 批量删除 Role | 区分可删除/不可删除行，弹出确认框 | ❌ |
| 导入 | `basic-import` | `create` | 导入 YAML | 打开导入面板 | ❌ |
| 导出 | `basic-export` | `view` | 导出当前筛选结果 | 调用导出 API | ❌ |

---

## Security — ClusterRole

### PageHeader 内容（`v-bind="CLUSTERROLE_PAGE_META"`，来源：`src/config/kubernetes/security/clusterrole.ts`）

| icon | title | description |
| --- | --- | --- |
| `kubernetes-role` | 集群角色 | 集群角色（ClusterRole）是 Kubernetes 中用于定义 API 资源访问权限规则集合的资源对象，作用于集群级别。 |

### 数据列

| 列宽 | 组件 | ClusterRoleListVo 字段 | 其他组件属性 |
| --- | --- | --- | --- |
| 500px | 【首列】`BeeSecurityInfoCell` | `uid`, `name`, `description` | `icon-size: 32` |
| 160px | 【中间列】`BeeTableCommonCell` | `text: ruleCount + " 条"` | `subtext: "规则数"` |
| 200px | 【中间列】`BeeAuditCell` | `username: createBy`, `datetime: createAt` | |
| 200px | 【中间列】`BeeAuditCell` | `username: updateBy`, `datetime: updateAt` | |
| 150px | 【末尾列】`BeeActionCell` | ❌ 无 | `actions: getActions(row)` |

> ClusterRole 为集群级资源，无 namespace 列。

### 搜索条件

| ClusterRoleQueryForm 字段 | 字段类型 | Vue 响应式属性 | 展示组件 | 选项来源 |
| --- | --- | --- | --- | --- |
| uid | string | searchKey | BeeInputSearch | ❌ 无 |
| name | string | searchKey | BeeInputSearch | ❌ 无 |

### Toolbar 工具栏操作

| 操作 | icon | 权限 | 说明 | 行为 |
| --- | --- | --- | --- | --- |
| 新增 | — | `create` | 创建 ClusterRole | 跳转创建页（表单模式） |
| YAML 新建 | — | `create` | 通过 YAML 创建 ClusterRole | 跳转创建页（YAML 模式） |

### 列操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 详情 | `basic-view` | `view` | 查看 ClusterRole 详情 | 跳转详情页 | ❌ |
| 编辑 | `basic-edit` | `edit` | 编辑 ClusterRole | 跳转编辑页（表单模式） | ❌ |
| 编辑 YAML | `basic-yaml` | `edit` | 编辑 ClusterRole YAML | 跳转编辑页（YAML 模式） | ❌ |
| 更新规则 | `kubernetes-rule` | `edit` | 管理集群角色的权限规则 | 打开规则管理面板 | ✅ |
| 删除 | `basic-delete` | `delete` | 删除 ClusterRole | 弹出确认框后删除 | ❌ |

### Footer 底部操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 取消选择 | `basic-clear` | — | 清空当前表格多选 | 调用 `handleClearSelection()` | ❌ |
| 批量删除 | `basic-delete` | `delete` | 批量删除 ClusterRole | 区分可删除/不可删除行，弹出确认框 | ❌ |
| 导入 | `basic-import` | `create` | 导入 YAML | 打开导入面板 | ❌ |
| 导出 | `basic-export` | `view` | 导出当前筛选结果 | 调用导出 API | ❌ |

---

## Security — RoleBinding

### PageHeader 内容（`v-bind="ROLEBINDING_PAGE_META"`，来源：`src/config/kubernetes/security/rolebinding.ts`）

| icon | title | description |
| --- | --- | --- |
| `kubernetes-rolebinding` | 角色绑定 | 角色绑定（RoleBinding）是 Kubernetes 中用于将 Role 授予用户、组或服务账户的资源对象。 |

### 数据列

| 列宽 | 组件 | RoleBindingListVo 字段 | 其他组件属性 |
| --- | --- | --- | --- |
| 500px | 【首列】`BeeSecurityInfoCell` | `uid`, `name`, `description` | `icon-size: 32` |
| 200px | 【中间列】`BeeTableCommonCell` | `text: namespace` | `subtext: "命名空间"` |
| 180px | 【中间列】`BeeTableCommonCell` | `text: roleRef.name` | `subtext: "绑定角色"` |
| 250px | 【中间列】`BeeTableCommonCell` | `text: subjects` | `subtext: "授权主体"` |
| 200px | 【中间列】`BeeAuditCell` | `username: createBy`, `datetime: createAt` | |
| 200px | 【中间列】`BeeAuditCell` | `username: updateBy`, `datetime: updateAt` | |
| 150px | 【末尾列】`BeeActionCell` | ❌ 无 | `actions: getActions(row)` |

### 搜索条件

| RoleBindingQueryForm 字段 | 字段类型 | Vue 响应式属性 | 展示组件 | 选项来源 |
| --- | --- | --- | --- | --- |
| uid | string | searchKey | BeeInputSearch | ❌ 无 |
| name | string | searchKey | BeeInputSearch | ❌ 无 |
| namespace | string | queryForm.namespace | BeeSelect | `loadNamespaceOptions()` |

### Toolbar 工具栏操作

| 操作 | icon | 权限 | 说明 | 行为 |
| --- | --- | --- | --- | --- |
| 新增 | — | `create` | 创建 RoleBinding | 跳转创建页（表单模式） |
| YAML 新建 | — | `create` | 通过 YAML 创建 RoleBinding | 跳转创建页（YAML 模式） |

### 列操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 详情 | `basic-view` | `view` | 查看 RoleBinding 详情 | 跳转详情页 | ❌ |
| 编辑 | `basic-edit` | `edit` | 编辑 RoleBinding | 跳转编辑页（表单模式） | ❌ |
| 编辑 YAML | `basic-yaml` | `edit` | 编辑 RoleBinding YAML | 跳转编辑页（YAML 模式） | ❌ |
| 管理授权主体 | `kubernetes-subject` | `edit` | 管理绑定的用户/组/ServiceAccount | 打开主体管理面板 | ✅ |
| 删除 | `basic-delete` | `delete` | 删除 RoleBinding | 弹出确认框后删除 | ❌ |

### Footer 底部操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 取消选择 | `basic-clear` | — | 清空当前表格多选 | 调用 `handleClearSelection()` | ❌ |
| 批量删除 | `basic-delete` | `delete` | 批量删除 RoleBinding | 区分可删除/不可删除行，弹出确认框 | ❌ |
| 导入 | `basic-import` | `create` | 导入 YAML | 打开导入面板 | ❌ |
| 导出 | `basic-export` | `view` | 导出当前筛选结果 | 调用导出 API | ❌ |

---

## Security — ClusterRoleBinding

### PageHeader 内容（`v-bind="CLUSTERROLEBINDING_PAGE_META"`，来源：`src/config/kubernetes/security/clusterrolebinding.ts`）

| icon | title | description |
| --- | --- | --- |
| `kubernetes-rolebinding` | 集群角色绑定 | 集群角色绑定（ClusterRoleBinding）是 Kubernetes 中用于将 ClusterRole 授予用户、组或服务账户的资源对象。 |

### 数据列

| 列宽 | 组件 | ClusterRoleBindingListVo 字段 | 其他组件属性 |
| --- | --- | --- | --- |
| 500px | 【首列】`BeeSecurityInfoCell` | `uid`, `name`, `description` | `icon-size: 32` |
| 180px | 【中间列】`BeeTableCommonCell` | `text: roleRef.name` | `subtext: "绑定角色"` |
| 250px | 【中间列】`BeeTableCommonCell` | `text: subjects` | `subtext: "授权主体"` |
| 200px | 【中间列】`BeeAuditCell` | `username: createBy`, `datetime: createAt` | |
| 200px | 【中间列】`BeeAuditCell` | `username: updateBy`, `datetime: updateAt` | |
| 150px | 【末尾列】`BeeActionCell` | ❌ 无 | `actions: getActions(row)` |

> ClusterRoleBinding 为集群级资源，无 namespace 列。

### 搜索条件

| ClusterRoleBindingQueryForm 字段 | 字段类型 | Vue 响应式属性 | 展示组件 | 选项来源 |
| --- | --- | --- | --- | --- |
| uid | string | searchKey | BeeInputSearch | ❌ 无 |
| name | string | searchKey | BeeInputSearch | ❌ 无 |

### Toolbar 工具栏操作

| 操作 | icon | 权限 | 说明 | 行为 |
| --- | --- | --- | --- | --- |
| 新增 | — | `create` | 创建 ClusterRoleBinding | 跳转创建页（表单模式） |
| YAML 新建 | — | `create` | 通过 YAML 创建 ClusterRoleBinding | 跳转创建页（YAML 模式） |

### 列操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 详情 | `basic-view` | `view` | 查看 ClusterRoleBinding 详情 | 跳转详情页 | ❌ |
| 编辑 | `basic-edit` | `edit` | 编辑 ClusterRoleBinding | 跳转编辑页（表单模式） | ❌ |
| 编辑 YAML | `basic-yaml` | `edit` | 编辑 ClusterRoleBinding YAML | 跳转编辑页（YAML 模式） | ❌ |
| 管理授权主体 | `kubernetes-subject` | `edit` | 管理绑定的用户/组/ServiceAccount | 打开主体管理面板 | ✅ |
| 删除 | `basic-delete` | `delete` | 删除 ClusterRoleBinding | 弹出确认框后删除 | ❌ |

### Footer 底部操作

| 操作 | icon | 权限 | 说明 | 行为 | 个性操作 |
| --- | --- | --- | --- | --- | --- |
| 取消选择 | `basic-clear` | — | 清空当前表格多选 | 调用 `handleClearSelection()` | ❌ |
| 批量删除 | `basic-delete` | `delete` | 批量删除 ClusterRoleBinding | 区分可删除/不可删除行，弹出确认框 | ❌ |
| 导入 | `basic-import` | `create` | 导入 YAML | 打开导入面板 | ❌ |
| 导出 | `basic-export` | `view` | 导出当前筛选结果 | 调用导出 API | ❌ |

---

# 开发检查清单

实现新资源列表页时，确保覆盖以下要素：

| # | 检查项 | 说明 |
| --- | --- | --- |
| 1 | 路由定义 | name / path / permission / meta（参考"路由速查"表） |
| 2 | 类型定义 | `{Resource}QueryForm extends PageForm`、`{Resource}ListVo`（命名空间级资源 extends `UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity`；集群级资源 extends `UidEntity, Clustered, AuditEntity, DeletableEntity`） |
| 3 | API 层 | `get{Resource}List(params)` 返回 `PageVo<{Resource}ListVo>` |
| 4 | 页面结构 | BeePage → BeePageHeader + BeeCard（toolbar / table / footer）（参考"布局模版"） |
| 5 | PageHeader 绑定 | `v-bind="{RESOURCE}_PAGE_META"`，icon / title / description 从 config 文件获取 |
| 6 | 首列组件 | 按资源类别选择对应的 `BeeXxxInfoCell` 组件 |
| 7 | 列配置 | 按"资源个性化"对应章节的"数据列"表格配置 |
| 8 | namespace 筛选 | 命名空间级：✅ 必须；集群级：❌ 不添加 |
| 9 | loadNamespaceOptions | 命名空间级：需加载；集群级：跳过 |
| 10 | 搜索条件 | 按"资源个性化"对应章节的"搜索条件"表格配置 |
| 11 | 权限缓存 | `perm` 对象在 `<script>` 顶层预计算（参考"脚本结构"章节） |
| 12 | 搜索映射 | `searchKey` → 资源定义的搜索字段 |
| 13 | 分页模式 | `pagination` 与 `queryForm` 分离（参考"通用元素 - footer"章节） |
| 14 | 多选功能 | `selectedRows`、取消选择、批量删除 |
| 15 | 操作列 | `BeeActionCell` + `getActions(row)`，按"资源个性化"对应章节添加特有操作 |
| 16 | 列操作确认 | 单个删除 / 批量删除（区分可删除/不可删除行） |
| 17 | 级联删除警告 | 有级联风险的资源（Namespace / PersistentVolume / PersistentVolumeClaim）需添加 `warning-text` |
| 18 | 表格状态 | `v-loading="loading"`、`empty-text="暂无{资源名}"`、`try/catch` 错误处理 |
