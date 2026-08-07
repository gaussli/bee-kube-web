# 列表页通用设计规范

本文档以 **Deployment（无状态应用）** 和 **Namespace（命名空间）** 为参考标准，覆盖平台中所有 Kubernetes 资源列表页的通用设计模式与规范，涵盖 workload、config、network、storage、security、crd、node、namespace 全部模块。

> **层级说明**：
> - **通用层**（§1~12）：所有资源列表页共用的结构和约定，此层内容无例外
> - **分类层**（§附录）：按资源的 namespace 归属、首列组件、继承链做分类，本章描述差异
> - **特化层**：各资源的具体差异（列配置、操作项、筛选条件）在其专属设计文档中说明

---

## 1. 路由约定

### 1.1 路由命名

列表页路由命名遵循 `{domain}:{module}:{resource}` 格式：

```
kubernetes:workload:deployment        // Kubernetes 工作负载 - Deployment
kubernetes:namespace                  // Kubernetes - 命名空间（模块即资源，无子 module）
kubernetes:network:service            // Kubernetes 网络 - Service
kubernetes:storage:pvc                // Kubernetes 存储 - PVC
platform:system:user                  // 平台管理 - 用户
```

当模块与资源相同时（如 namespace），命名退化为 `{domain}:{resource}`。

### 1.2 路径模式

| 资源类别 | 路径模式 | 示例 |
| --- | --- | --- |
| Kubernetes 集群内资源 | `/kubernetes/clusters/:clusterUid/{resources}` | Deployments, Services, PVC |
| Kubernetes 平台级资源 | `/kubernetes/clusters/:clusterUid/{resources}` | Namespaces |
| Platform 资源 | `/platform/{resources}` | Users, Roles |

### 1.3 权限

每个列表页路由的 `meta.permission` 对应 `view` 权限，如 `kubernetes:workload:deployment:view`、`kubernetes:namespace:view`。

### 1.4 参考示例

| 维度 | Deployment | Namespace |
| --- | --- | --- |
| 路由名 | `kubernetes:workload:deployment` | `kubernetes:namespace` |
| 路径 | `/kubernetes/clusters/:clusterUid/workload/deployment` | `/kubernetes/clusters/:clusterUid/namespace` |
| view 权限 | `kubernetes:workload:deployment:view` | `kubernetes:namespace:view` |

**路径参数**：
- `clusterUid`：集群唯一标识，由 `useKubernetesStore.activeClusterId` 维护

### 1.5 全部资源路由速查

| 模块 | 资源 | 路由名称 | 列表路径 | 类别 |
| --- | --- | --- | --- | --- |
| Node | Node | `kubernetes:node` | `/kubernetes/clusters/:clusterUid/nodes` | 集群级 |
| Namespace | Namespace | `kubernetes:namespace` | `/kubernetes/clusters/:clusterUid/namespaces` | 集群级 |
| Crd | CustomResourceDefinition | `kubernetes:crd:customresourcedefinition` | `/kubernetes/clusters/:clusterUid/crd` | 集群级 |
| Pod | Pod | `kubernetes:pod` | `/kubernetes/clusters/:clusterUid/pods` | 命名空间级 |
| Workload | Deployment | `kubernetes:workload:deployment` | `/kubernetes/clusters/:clusterUid/workload/deployment` | 命名空间级 |
| Workload | StatefulSet | `kubernetes:workload:statefulset` | `/kubernetes/clusters/:clusterUid/workload/statefulset` | 命名空间级 |
| Workload | DaemonSet | `kubernetes:workload:daemonset` | `/kubernetes/clusters/:clusterUid/workload/daemonset` | 命名空间级 |
| Workload | Job | `kubernetes:workload:job` | `/kubernetes/clusters/:clusterUid/workload/job` | 命名空间级 |
| Workload | CronJob | `kubernetes:workload:cronjob` | `/kubernetes/clusters/:clusterUid/workload/cronjob` | 命名空间级 |
| Config | ConfigMap | `kubernetes:config:configmap` | `/kubernetes/clusters/:clusterUid/config/configmap` | 命名空间级 |
| Config | Secret | `kubernetes:config:secret` | `/kubernetes/clusters/:clusterUid/config/secret` | 命名空间级 |
| Network | Service | `kubernetes:network:service` | `/kubernetes/clusters/:clusterUid/network/service` | 命名空间级 |
| Network | Ingress | `kubernetes:network:ingress` | `/kubernetes/clusters/:clusterUid/network/ingress` | 命名空间级 |
| Network | NetworkPolicy | `kubernetes:network:networkpolicy` | `/kubernetes/clusters/:clusterUid/network/networkpolicy` | 命名空间级 |
| Storage | PersistentVolume | `kubernetes:storage:persistentvolume` | `/kubernetes/clusters/:clusterUid/storage/persistentvolume` | 集群级 |
| Storage | PersistentVolumeClaim | `kubernetes:storage:persistentvolumeclaim` | `/kubernetes/clusters/:clusterUid/storage/persistentvolumeclaim` | 命名空间级 |
| Storage | StorageClass | `kubernetes:storage:storageclass` | `/kubernetes/clusters/:clusterUid/storage/storageclass` | 集群级 |
| Security | ServiceAccount | `kubernetes:security:serviceaccount` | `/kubernetes/clusters/:clusterUid/security/serviceaccount` | 命名空间级 |
| Security | Role | `kubernetes:security:role` | `/kubernetes/clusters/:clusterUid/security/role` | 命名空间级 |
| Security | ClusterRole | `kubernetes:security:clusterrole` | `/kubernetes/clusters/:clusterUid/security/clusterrole` | 集群级 |
| Security | RoleBinding | `kubernetes:security:rolebinding` | `/kubernetes/clusters/:clusterUid/security/rolebinding` | 命名空间级 |
| Security | ClusterRoleBinding | `kubernetes:security:clusterrolebinding` | `/kubernetes/clusters/:clusterUid/security/clusterrolebinding` | 集群级 |

> **Pod 说明**：Pod 目前仅作为 Deployment 详情页的子 Tab 存在。上表为其未来独立列表页的设计路由。

---

## 2. 页面结构

列表页采用**三层弹性布局**（flex column），各层固定职责，通过 CSS 弹性盒模型实现表格区独占剩余高度并独立滚动。

### 2.1 模板结构

```
BeePage
├── BeePageHeader                                // 页面标题区
│   ├── icon: {resource-icon}
│   ├── title: "{中文标题}"
│   └── description: "{功能描述}"
│       （icon、title、description 均从 pageMeta 常量获取）
└── BeeCard（class: page-body）                   // 主体容器
    ├── .page-body__toolbar                      // 工具栏（flex row，固定高度）
    │   ├── BeeInputSearch（flex:1）              // 搜索框，搜索字段由各资源独立定义
    │   ├── BeeSelect × N                        // 筛选下拉（见附录 A：筛选清单）
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

### 2.2 CSS 关键样式

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

---

## 3. 展示列规范

### 3.1 标准列组件

| 组件 | 用途 | 适用资源 |
| --- | --- | --- |
| `BeeClusterInfoCell` | 集群首列（UID + 图标 + 名称 + 描述） | Cluster |
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
| `BeeStatusCell` | 状态标签（圆点 + 中文标签 + 英文标签 + 帮助） | 所有资源 |
| `BeeAuditCell` | 审计信息（头像 + 时间 + 字段名） | 所有资源 |
| `BeeActionCell` | 行操作（≤3 平铺，>3 收起菜单） | 所有资源 |

### 3.2 列顺序约定

1. **首列**：资源信息列，使用模块对应的 `BeeXxxInfoCell` 组件（UID + 图标 + 名称 + 描述）
2. **中间列**：核心属性列（状态、指标、策略、审计等）
3. **末尾列**：操作列，`fixed: right`，宽度 150px

### 3.3 参考示例

各模块选取代表性资源展示列配置，按资源路由顺序排列。

#### 3.3.1 节点 — Node（集群级）

| 列宽 | 组件 | 关键属性 |
| --- | --- | --- |
| 500px | `BeeNodeInfoCell` | `uid`, `name`, `ip`, `description`, `icon-size: 32` |
| 180px | `BeeStatusCell` | `status`, `statusMsg`, `options: NODE_STATUS_OPTIONS` |
| 180px | `BeeTableCommonCell` | `text: "cpuUsage / cpuTotal"`, `subtext: "CPU"` |
| 180px | `BeeTableCommonCell` | `text: "memUsage / memTotal"`, `subtext: "内存"` |
| 120px | `BeeTableCommonCell` | `text: podCount`, `subtext: "Pod 数"` |
| 160px | `BeeTableCommonCell` | `text: kubeletVersion`, `subtext: "Kubelet 版本"` |
| 200px | `BeeAuditCell` | `username: createBy`, `datetime: createAt` |
| 150px | `BeeActionCell` | `actions: getActions(row)` |

> **Node 特殊说明**：
> - 无创建路由，节点由集群自动发现
> - CPU/内存列可通过进度条增强可视化
> - 行操作含：隔离(Cordon) / 恢复(Uncordon) / 驱逐(Drain)

#### 3.3.2 命名空间 — Namespace（集群级）

| 列宽 | 组件 | 关键属性 |
| --- | --- | --- |
| 500px | `BeeNamespaceInfoCell` | `uid`, `name`, `description`, `icon-size: 32` |
| min-160px | `BeeStatusCell` | `status`, `statusMsg`, `options: NAMESPACE_STATUS_OPTIONS` |
| 200px | `BeeAuditCell` | `username: createBy`, `datetime: createAt`, `field-name: "创建人 / 时间"` |
| 200px | `BeeAuditCell` | `username: updateBy`, `datetime: updateAt`, `field-name: "更新人 / 时间"` |
| 150px | `BeeActionCell` | `actions: getActions(row)` |

#### 3.3.3 CRD — CustomResourceDefinition（集群级）

| 列宽 | 组件 | 关键属性 |
| --- | --- | --- |
| 500px | `BeeCustomResourceDefinitionInfoCell` | `uid`, `name`, `description`, `icon-size: 32` |
| 250px | `BeeTableCommonCell` | `text: group`, `subtext: "API 组"` |
| 120px | `BeeTableCommonCell` | `text: version`, `subtext: "版本"` |
| 160px | `BeeTableCommonCell` | `text: scope`, `subtext: "作用范围"` |
| 200px | `BeeAuditCell` | `username: createBy`, `datetime: createAt` |
| 150px | `BeeActionCell` | `actions: getActions(row)` |

#### 3.3.4 Pod（命名空间级）

| 列宽 | 组件 | 关键属性 |
| --- | --- | --- |
| 500px | `BeePodInfoCell` | `uid`, `name`, `ip`, `icon-size: 32` |
| 200px | `BeeTableCommonCell` | `text: namespace`, `subtext: "命名空间"` |
| 200px | `BeeTableCommonCell` | `text: nodeName`, `subtext: "所在节点"` |
| 160px | `BeeStatusCell` | `status: phase`, `options: POD_STATUS_OPTIONS` |
| 120px | `BeeTableCommonCell` | `text: restartCount`, `subtext: "重启次数"` |
| 160px | `BeeTableCommonCell` | `text: age`, `subtext: "运行时长"` |
| 150px | `BeeActionCell` | `actions: getActions(row)` |

> **Pod 特殊说明**：特有操作含查看日志、打开终端(exec)

#### 3.3.5 工作负载 — Deployment（命名空间级）

| 列宽 | 组件 | 关键属性 |
| --- | --- | --- |
| 500px | `BeeWorkloadInfoCell` | `uid`, `name`, `description`, `icon: kubernetes-deployment`, `icon-size: 32` |
| 200px | `BeeTableCommonCell` | `text: namespace`, `subtext: "命名空间"` |
| 160px | `BeeStatusCell` | `status`, `statusMsg`, `options: DEPLOYMENT_STATUS_OPTIONS` |
| 120px | `BeeTableCommonCell` | `text: "readyReplicas / replicas"`, `subtext: "副本数"` |
| 160px | `BeeTableCommonCell` | `text: 策略中文名`, `subtext: strategyType` |
| 200px | `BeeAuditCell` | `username: createBy`, `datetime: createAt` |
| 200px | `BeeAuditCell` | `username: updateBy`, `datetime: updateAt` |
| 150px | `BeeActionCell` | `actions: getActions(row)` |

#### 3.3.6 配置 — ConfigMap（命名空间级）

| 列宽 | 组件 | 关键属性 |
| --- | --- | --- |
| 500px | `BeeConfigInfoCell` | `uid`, `name`, `description`, `icon-size: 32` |
| 200px | `BeeTableCommonCell` | `text: namespace`, `subtext: "命名空间"` |
| 160px | `BeeTableCommonCell` | `text: dataCount + " 条"`, `subtext: "数据条目"` |
| 160px | `BeeStatusCell` | `status`, `statusMsg`, `options: CONFIGMAP_STATUS_OPTIONS` |
| 200px | `BeeAuditCell` | `username: createBy`, `datetime: createAt` |
| 200px | `BeeAuditCell` | `username: updateBy`, `datetime: updateAt` |
| 150px | `BeeActionCell` | `actions: getActions(row)` |

#### 3.3.7 配置 — Secret（命名空间级）

| 列宽 | 组件 | 关键属性 |
| --- | --- | --- |
| 500px | `BeeConfigInfoCell` | `uid`, `name`, `description`, `icon-size: 32` |
| 200px | `BeeTableCommonCell` | `text: namespace`, `subtext: "命名空间"` |
| 160px | `BeeTableCommonCell` | `text: type`, `subtext: "类型"` |
| 160px | `BeeTableCommonCell` | `text: dataCount + " 条"`, `subtext: "数据条目"` |
| 200px | `BeeAuditCell` | `username: createBy`, `datetime: createAt` |
| 200px | `BeeAuditCell` | `username: updateBy`, `datetime: updateAt` |
| 150px | `BeeActionCell` | `actions: getActions(row)` |

#### 3.3.8 网络 — Service（命名空间级）

| 列宽 | 组件 | 关键属性 |
| --- | --- | --- |
| 500px | `BeeNetworkInfoCell` | `uid`, `name`, `description`, `icon-size: 32` |
| 200px | `BeeTableCommonCell` | `text: namespace`, `subtext: "命名空间"` |
| 180px | `BeeTableCommonCell` | `text: clusterIP`, `subtext: "集群 IP"` |
| 160px | `BeeTableCommonCell` | `text: "ports列表"`, `subtext: "端口"` |
| 120px | `BeeTableCommonCell` | `text: type`, `subtext: "类型"` |
| 200px | `BeeAuditCell` | `username: createBy`, `datetime: createAt` |
| 200px | `BeeAuditCell` | `username: updateBy`, `datetime: updateAt` |
| 150px | `BeeActionCell` | `actions: getActions(row)` |

#### 3.3.9 网络 — Ingress（命名空间级）

| 列宽 | 组件 | 关键属性 |
| --- | --- | --- |
| 500px | `BeeNetworkInfoCell` | `uid`, `name`, `description`, `icon-size: 32` |
| 200px | `BeeTableCommonCell` | `text: namespace`, `subtext: "命名空间"` |
| 300px | `BeeTableCommonCell` | `text: host+path`, `subtext: "规则"` |
| 200px | `BeeTableCommonCell` | `text: serviceName:port`, `subtext: "后端"` |
| 200px | `BeeAuditCell` | `username: createBy`, `datetime: createAt` |
| 200px | `BeeAuditCell` | `username: updateBy`, `datetime: updateAt` |
| 150px | `BeeActionCell` | `actions: getActions(row)` |

#### 3.3.10 存储 — PersistentVolume（集群级）

| 列宽 | 组件 | 关键属性 |
| --- | --- | --- |
| 500px | `BeeStorageInfoCell` | `uid`, `name`, `description`, `icon-size: 32` |
| 160px | `BeeTableCommonCell` | `text: "storageSize"`, `subtext: "容量"` |
| 160px | `BeeTableCommonCell` | `text: accessModes`, `subtext: "访问模式"` |
| 140px | `BeeTableCommonCell` | `text: reclaimPolicy`, `subtext: "回收策略"` |
| 160px | `BeeStatusCell` | `status: phase`, `options: PV_PHASE_OPTIONS` |
| 200px | `BeeAuditCell` | `username: createBy`, `datetime: createAt` |
| 200px | `BeeAuditCell` | `username: updateBy`, `datetime: updateAt` |
| 150px | `BeeActionCell` | `actions: getActions(row)` |

#### 3.3.11 存储 — PersistentVolumeClaim（命名空间级）

| 列宽 | 组件 | 关键属性 |
| --- | --- | --- |
| 500px | `BeeStorageInfoCell` | `uid`, `name`, `description`, `icon-size: 32` |
| 200px | `BeeTableCommonCell` | `text: namespace`, `subtext: "命名空间"` |
| 160px | `BeeTableCommonCell` | `text: "storageSize"`, `subtext: "容量"` |
| 160px | `BeeTableCommonCell` | `text: accessModes`, `subtext: "访问模式"` |
| 300px | `BeeTableCommonCell` | `text: volumeName`, `subtext: "绑定的 PV"` |
| 160px | `BeeStatusCell` | `status: phase`, `options: PVC_PHASE_OPTIONS` |
| 200px | `BeeAuditCell` | `username: createBy`, `datetime: createAt` |
| 150px | `BeeActionCell` | `actions: getActions(row)` |

#### 3.3.12 存储 — StorageClass（集群级）

| 列宽 | 组件 | 关键属性 |
| --- | --- | --- |
| 500px | `BeeStorageInfoCell` | `uid`, `name`, `description`, `icon-size: 32` |
| 200px | `BeeTableCommonCell` | `text: provisioner`, `subtext: "制备器"` |
| 160px | `BeeTableCommonCell` | `text: reclaimPolicy`, `subtext: "回收策略"` |
| 160px | `BeeTableCommonCell` | `text: 是/否`, `subtext: "默认存储类"` |
| 200px | `BeeAuditCell` | `username: createBy`, `datetime: createAt` |
| 150px | `BeeActionCell` | `actions: getActions(row)` |

#### 3.3.13 安全 — Role / ClusterRole（命名空间级 / 集群级）

| 列宽 | 组件 | 关键属性 |
| --- | --- | --- |
| 500px | `BeeSecurityInfoCell` | `uid`, `name`, `description`, `icon-size: 32` |
| (namespace 仅 Role) | `BeeTableCommonCell` | `text: namespace`, `subtext: "命名空间"` |
| 160px | `BeeTableCommonCell` | `text: ruleCount + " 条"`, `subtext: "规则数"` |
| 200px | `BeeAuditCell` | `username: createBy`, `datetime: createAt` |
| 200px | `BeeAuditCell` | `username: updateBy`, `datetime: updateAt` |
| 150px | `BeeActionCell` | `actions: getActions(row)` |

#### 3.3.14 安全 — RoleBinding / ClusterRoleBinding

| 列宽 | 组件 | 关键属性 |
| --- | --- | --- |
| 500px | `BeeSecurityInfoCell` | `uid`, `name`, `description`, `icon-size: 32` |
| (namespace 仅 RoleBinding) | `BeeTableCommonCell` | `text: namespace`, `subtext: "命名空间"` |
| 180px | `BeeTableCommonCell` | `text: roleRef.name`, `subtext: "绑定角色"` |
| 250px | `BeeTableCommonCell` | `text: "subjects摘要"`, `subtext: "授权主体"` |
| 200px | `BeeAuditCell` | `username: createBy`, `datetime: createAt` |
| 150px | `BeeActionCell` | `actions: getActions(row)` |

---

## 4. 筛选与搜索

### 4.1 筛选条件清单

不同资源类别的筛选条件差异：

| 资源类别 | 搜索框 | namespace 筛选 | 状态筛选 | 其他 |
| --- | --- | --- | --- | --- |
| **命名空间级资源**（Deployment, StatefulSet, Service, ConfigMap, Secret, PVC 等） | ✅ `searchKey` → 映射到资源定义的查询字段 | ✅ `queryForm.namespace` | ✅ `queryForm.status` | 按需 |
| **集群级资源**（Node, Namespace, CRD, PV, StorageClass, ClusterRole 等） | ✅ `searchKey` → 映射到资源定义的查询字段 | ❌ 无 | ✅ `queryForm.status` | 按需 |

命名空间级资源**必须**有 namespace 筛选；集群级资源**禁止** namespace 筛选。

### 4.2 命名空间选项加载

```typescript
// 命名空间级资源在 Data Loading 分区加载 namespace 选项
import { getNamespacePage } from '@/api/kubernetes/namespace'
const namespaceOptions = ref<SelectOption[]>([])

async function loadNamespaceOptions() {
  const list = await getNamespacePage(clusterUid.value, { mode: 'simple' })
  namespaceOptions.value = [
    { label: '全部命名空间', value: '' },
    ...list.map(ns => ({ label: ns.name, value: ns.name }))
  ]
}
```

集群级资源跳过此步骤。

### 4.3 搜索与重置逻辑

**搜索**：点击搜索时 `pagination.page = 1`，将 `searchKey` 同时映射到资源的 `uid` 和 `name` 字段实现多字段模糊搜索。

**重置**：清空 `queryForm` 所有字段、`searchKey`、分页参数，重新加载数据。

### 4.4 分页

- 使用 `BeePagination`，`page` 和 `pageSize` 双绑定
- 默认 `pageSizes: [10, 20, 50]`
- `pagination` 与 `queryForm` 分离维护：`queryForm` 只存过滤条件，分页参数在 API 调用处展开
- `@change` / `@update:page-size` 事件触发 `loadData()`

```typescript
// queryForm 初始化（空对象，属性通过搜索动态增删）
const queryForm = reactive<Partial<XxxQueryForm>>({})

// API 调用时展开
const { list, total } = await getXxxPage(clusterUid, {
  ...queryForm,
  page: pagination.page,
  pageSize: pagination.pageSize,
})
```

---

## 5. 数据类型

### 5.1 查询请求（QueryForm）

```typescript
export interface XxxQueryForm extends UidEntity, PageForm {
  name?: string        // 名称，用于模糊匹配
  namespace?: string   // 仅命名空间级资源
  status?: string      // 状态筛选
  // ... 资源特有筛选字段
}
```

### 5.2 列表响应（ListVo）—— 继承链选择

根据资源类别选择基类型组合：

| 资源类别 | 继承链 | 示例 |
| --- | --- | --- |
| **集群内 + 命名空间级** | `UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity` | Deployment, Service |
| **集群内 + 集群级** | `UidEntity, Clustered, AuditEntity, DeletableEntity` | Namespace, Node |
| **平台级** | `UidEntity, AuditEntity, DeletableEntity` | User, Role |

### 5.3 实体继承链参考

| 基类型 | 提供字段 | 适用场景 |
| --- | --- | --- |
| `UidEntity` | `uid` | 所有 K8s 资源 |
| `Clustered` | `clusterUid`, `clusterName` | 集群内资源 |
| `Namespaced` | `namespaceUid`, `namespace` | 命名空间级资源 |
| `AuditEntity` | `createAt`, `createBy`, `updateAt`, `updateBy` | 需要审计的资源 |
| `DeletableEntity` | `deletable` | 支持删除的资源 |

### 5.4 参考示例

**Deployment（命名空间级）**：

```typescript
export interface DeploymentListVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  name: string
  description?: string
  status: DeploymentStatus
  statusMessage?: string
  replicas: number
  readyReplicas: number
  strategyType: DeploymentStrategyType
}
```

**Namespace（集群级）**：

```typescript
export interface NamespaceListVo extends UidEntity, Clustered, AuditEntity, DeletableEntity {
  name: string
  description?: string
  status: string
  statusMsg?: string
  type: NamespaceType
}
```

---

## 6. 行操作

### 6.1 操作列实现方式

行操作统一使用 `BeeActionCell` + `getActions(row)` 模式。`getActions(row)` 返回 `ActionItem[]`，`BeeActionCell` 根据操作数量自动调整展示：≤3 项平铺，>3 项收起至下拉菜单。

### 6.2 标准操作项清单

行操作分为**通用操作**（默认所有资源支持）和**模块特有操作**两类。

#### 6.2.1 通用操作

| 操作 | icon | 权限 | 说明 |
| --- | --- | --- | --- |
| 详情 | `basic-view` | `view` | 跳转详情页 |
| 编辑 | `basic-edit` | `edit` | 跳转编辑页（表单模式） |
| 编辑 YAML | `basic-code` | `edit` | 跳转编辑页（YAML 模式） |
| 删除 | `basic-delete` | `delete` | 弹窗确认后删除，条件：`row.deletable !== false`（Node 除外） |

#### 6.2.2 节点特有操作

| 操作 | icon | 权限 | 说明 |
| --- | --- | --- | --- |
| 隔离 (Cordon) | `kubernetes-cordon` | `edit` | 标记节点不可调度，已有 Pod 不受影响 |
| 恢复 (Uncordon) | `kubernetes-uncordon` | `edit` | 恢复节点可调度 |
| 驱逐 (Drain) | `kubernetes-drain` | `edit` | 迁移节点上所有 Pod 后标记不可调度 |

#### 6.2.3 命名空间特有操作

| 操作 | icon | 权限 | 说明 |
| --- | --- | --- | --- |
| 资源配额 | `kubernetes-quota` | `edit` | 管理命名空间的 ResourceQuota 和 LimitRange |

#### 6.2.4 Pod 特有操作

| 操作 | icon | 权限 | 说明 |
| --- | --- | --- | --- |
| 查看日志 | `basic-log` | `view` | 打开 Pod 日志查看面板 |
| 终端 (exec) | `basic-terminal` | `edit` | 打开 Web 终端连接到 Pod |
| 删除 Pod | `basic-delete` | `delete` | 删除单个 Pod（对应控制器会自动重建） |

#### 6.2.5 工作负载特有操作

| 操作 | icon | 权限 | 适用资源 | 说明 |
| --- | --- | --- | --- | --- |
| 扩缩容 | `{resource-icon}` | `edit` | Deployment, StatefulSet | 弹窗修改副本数 |
| 重启 | `basic-refresh` | `edit` | Deployment, StatefulSet, DaemonSet | 触发滚动重启 |
| 回滚 | `{resource-icon}` | `edit` | Deployment, StatefulSet | 弹窗选择历史版本回滚 |
| 触发执行 | `basic-play` | `edit` | CronJob | 手动触发一次 Job 执行 |
| 暂停/恢复 | `basic-pause` / `basic-play` | `edit` | CronJob | 暂停/恢复定时调度 |

### 6.3 工具栏操作

| 操作 | 权限 | 行为 |
| --- | --- | --- |
| 新增 | `create` | 跳转创建页（表单模式） |
| YAML 新建 | `create` | 跳转创建页（YAML 模式） |

### 6.4 底部操作

| 操作 | 权限 | 行为 |
| --- | --- | --- |
| 取消选择 | — | 清空 `selectedRows` |
| 批量删除 (N) | `delete` | 区分可删除/不可删除行 |
| 导出 | `view` | 导出当前筛选结果 |
| 导入 | `create` | 导入 YAML 创建资源 |

---

## 7. 权限模型

### 7.1 权限标识命名

```
{domain}:{module}:{resource}:{action}
```

示例：`kubernetes:workload:deployment:view`、`kubernetes:namespace:view`

### 7.2 权限粒度

| 粒度 | 说明 |
| --- | --- |
| 页面级 | 路由守卫 `to.meta.permission` 控制页面访问 |
| UI 级 | `v-if="perm.xxx"` 控制按钮显隐 |
| 行级 | `getActions(row)` 中按权限过滤操作项 |

### 7.3 权限预计算模式

在 `<script setup>` 顶层预计算权限对象，避免模板/循环中重复调用 `hasPermission()`：

```typescript
const { hasPermission } = usePermission()

const perm: Record<string, boolean> = {
  create: hasPermission('kubernetes:workload:deployment:create'),
  edit: hasPermission('kubernetes:workload:deployment:edit'),
  view: hasPermission('kubernetes:workload:deployment:view'),
  delete: hasPermission('kubernetes:workload:deployment:delete'),
}
```

---

## 8. 删除流程

### 8.1 单个删除

1. 点击行操作"删除" → `currentTargetRow` 记录目标行
2. 弹出 `BeeDialog`，显示 "确定要删除 **{resource}** **{name}** 吗？"
3. 资源有级联风险时，追加警告文本（如 Namespace："删除命名空间将同时删除该命名空间下的所有资源！"）
4. 确认 → 调用 `delete{Resource}(...)` → 成功提示 → 刷新列表

### 8.2 批量删除

1. 勾选多行 → 点击底部"批量删除 (N)"
2. `computed` 过滤：
   - `deletableRows`：`row.deletable !== false` 的行
   - `nonDeletableRows`：`row.deletable === false` 的行
3. 弹窗中分别展示不可删除行（黄色标签）和可删除行
4. 如果仅存在不可删除行 → 仅展示警告，不执行删除
5. 确认 → 调用 `delete{Resource}s(...)` → 成功提示 → 清空选中 → 刷新

---

## 9. 脚本结构

所有列表页按以下分区组织 `<script setup>`：

| 分区 | 内容 | 说明 |
| --- | --- | --- |
| Composables & Route | `useRouter` / `useRoute` / `usePermission` | 路由和组合式函数 |
| Reactive State | `ref` / `reactive` | `clusterUid`、`searchKey`、`loading`、`tableData`、`pagination`、`queryForm` 等 |
| Options | 下拉选项 / 标签映射 | `STATUS_OPTIONS`、`{RESOURCE}_STRATEGY_LABEL_MAP` 等 |
| Data Loading | `loadData()` + 辅助函数 | 含 `loadNamespaceOptions()`（仅命名空间级资源） |
| Search & Reset | `handleSearch()` / `handleReset()` | 搜索时 `pagination.page = 1` |
| Selection | `handleSelectionChange()` / `handleClearSelection()` | 多选逻辑 |
| CRUD: Create/Edit/View | 路由跳转函数 | `handleCreate()`、`handleEdit()`、`handleViewDetail()` |
| CRUD: Delete | 删除确认 + 执行 | 单个 / 批量删除 |
| Row Actions | `getActions(row): ActionItem[]` | 按权限 + 行条件构建操作数组（`BeeActionCell` 模式） |
| Lifecycle | `onMounted` | 初始加载 |

### 9.1 权限缓存

```typescript
const perm: Record<string, boolean> = {
  create: hasPermission('{domain}:{module}:{resource}:create'),
  edit: hasPermission('{domain}:{module}:{resource}:edit'),
  view: hasPermission('{domain}:{module}:{resource}:view'),
  delete: hasPermission('{domain}:{module}:{resource}:delete'),
}
```

### 9.2 搜索映射

```typescript
// searchKey 映射到各资源定义的查询字段（示例：Deployment 映射到 uid + name）
function handleSearch() {
  pagination.page = 1
  queryForm.uid = searchKey.value || undefined
  queryForm.name = searchKey.value || undefined
  loadData()
}
```

---

## 10. 组件依赖

### 10.1 自定义组件

| 组件 | 用途 |
| --- | --- |
| `BeePage` | 页面容器 |
| `BeePageHeader` | 页面标题（图标 + 标题 + 描述） |
| `BeeCard` | 卡片容器 |
| `BeeInputSearch` | 搜索输入框 |
| `BeeSelect` | 下拉选择器 |
| `BeeButton` | 按钮 |
| `BeeTable` / `BeeTableColumn` | 表格 |
| `BeeClusterInfoCell` | 集群首列 |
| `BeeNodeInfoCell` | 节点首列 |
| `BeeNamespaceInfoCell` | 命名空间首列 |
| `BeeCustomResourceDefinitionInfoCell` | CRD 首列 |
| `BeePodInfoCell` | Pod 首列 |
| `BeeWorkloadInfoCell` | 工作负载首列 |
| `BeeConfigInfoCell` | 配置首列 |
| `BeeNetworkInfoCell` | 网络首列 |
| `BeeStorageInfoCell` | 存储首列 |
| `BeeSecurityInfoCell` | 安全首列 |
| `BeeTableCommonCell` | 通用两行单元格 |
| `BeeStatusCell` | 状态标签（圆点 + 中文 + 英文 + 帮助） |
| `BeeAuditCell` | 审计信息（头像 + 时间 + 字段名） |
| `BeeActionCell` | 行操作（平铺 / 收起菜单自适应） |
| `BeePagination` | 分页组件 |
| `BeeDialog` | 确认对话框 |
| `BeeTag` | 标签（删除确认弹窗中展示目标资源名） |

### 10.2 外部依赖

| 模块 | 用途 | 必需? |
| --- | --- | --- |
| `usePermission()` | 权限检查 composable | ✅ |
| `useKubernetesStore` | 获取当前集群上下文 | ✅ |
| `useRoute` / `useRouter` | 路由参数读取与导航 | ✅ |
| `get{Resource}Page()` | 分页查询 API | ✅ |
| `getNamespacePage()` | 命名空间选项加载 | 仅命名空间级资源 |
| `{RESOURCE}_STATUS_OPTIONS` | 状态选项常量 | ✅ |
| `{RESOURCE}_PAGE_META` | 页面元信息（icon/title/description） | ✅ |

---

## 11. 数据流

```
用户操作 → hasPermission(check) → 路由守卫 / UI 显隐控制
    │
    ▼
列表页加载 → [loadNamespaceOptions()]        // 仅命名空间级资源
          → get{Resource}Page(clusterUid, queryForm) → tableData
    │
    ▼
分页/搜索/筛选 → 更新 queryForm / pagination → loadData()
              → get{Resource}Page(clusterUid, { ...queryForm, page, pageSize })
```

**状态管理**：
- `ref/reactive` 本地状态（`searchKey`、`queryForm`、`tableData`、`pagination`、`selectedRows`）
- `clusterUid` 从路由参数获取，与 `useKubernetesStore.activeClusterId` 保持同步
- 所有状态均为组件级，不跨页面共享

---

## 12. 开发检查清单

实现新资源列表页时，确保覆盖以下要素：

1. **查总表** → 在附录 A 中找到目标资源，确认其类别、首列组件、筛选条件、特有操作
2. **路由定义** → name / path / permission / meta（参考 §1.5 路由速查表）
3. **类型定义** → `{Resource}QueryForm extends PageForm`、`{Resource}ListVo extends ...`（参考 §5）
4. **API 层** → `get{Resource}Page(params)` 返回 `PageVo<{Resource}ListVo>`
5. **页面结构** → BeePage → BeePageHeader + BeeCard（toolbar / table / footer）（参考 §2）
6. **首列组件** → 按附录 A 选择：`BeeWorkloadInfoCell` / `BeeNamespaceInfoCell` / `BeePodInfoCell`
7. **列配置** → 参考 §3.3 对应模块的列配置示例
8. **namespace 筛选** → 命名空间级：必须；集群级：不添加
9. **loadNamespaceOptions** → 命名空间级：需加载；集群级：跳过
10. **权限缓存** → `perm` 对象在 `<script>` 顶层预计算（参考 §7.3）
11. **搜索映射** → `searchKey` → 资源定义的搜索字段（各资源独立定义）
12. **分页模式** → `pagination` 与 `queryForm` 分离（参考 §4.4）
13. **多选功能** → `selectedRows`、取消选择、批量删除
14. **操作列** → `BeeActionCell` + `getActions(row)`，按 §6.2 添加模块特有操作
15. **操作确认** → 单个删除 / 批量删除（区分可删除/不可删除行）
16. **删除警告** → 有级联删除风险的资源需添加 `warning-text`（参考 §8.1）

---

## 附录 A：全部资源特性总表

### A.1 工作负载 (Workload)

| 资源 | 英文名 | 类别 | 首列组件 | namespace筛选 | 核心列 | 特有操作 |
| --- | --- | --- | --- | --- | --- | --- |
| Deployment | 无状态应用 | 命名空间级 | `BeeWorkloadInfoCell` | ✅ | 状态、副本数、策略 | 扩缩容、重启、回滚 |
| StatefulSet | 有状态应用 | 命名空间级 | `BeeWorkloadInfoCell` | ✅ | 状态、副本数、策略 | 扩缩容、重启 |
| DaemonSet | 守护进程 | 命名空间级 | `BeeWorkloadInfoCell` | ✅ | 状态、节点数、策略 | 重启 |
| Job | 任务 | 命名空间级 | `BeeWorkloadInfoCell` | ✅ | 状态、完成数、持续时间 | — |
| CronJob | 定时任务 | 命名空间级 | `BeeWorkloadInfoCell` | ✅ | 状态、调度规则、上次执行 | 触发执行、暂停/恢复 |
| Pod | 容器组 | 命名空间级 | `BeePodInfoCell` | ✅ | 状态、节点、IP、重启次数 | 日志、终端、删除 |

### A.2 配置 (Config)

| 资源 | 英文名 | 类别 | 首列组件 | namespace筛选 | 核心列 | 特有操作 |
| --- | --- | --- | --- | --- | --- | --- |
| ConfigMap | 配置项 | 命名空间级 | `BeeConfigInfoCell` | ✅ | 数据条目数 | — |
| Secret | 保密字典 | 命名空间级 | `BeeConfigInfoCell` | ✅ | 类型、数据条目数 | — |

### A.3 网络 (Network)

| 资源 | 英文名 | 类别 | 首列组件 | namespace筛选 | 核心列 | 特有操作 |
| --- | --- | --- | --- | --- | --- | --- |
| Service | 服务 | 命名空间级 | `BeeNetworkInfoCell` | ✅ | ClusterIP、端口、类型 | — |
| Ingress | 路由 | 命名空间级 | `BeeNetworkInfoCell` | ✅ | 规则(Host+Path)、Service后端 | — |
| NetworkPolicy | 网络策略 | 命名空间级 | `BeeNetworkInfoCell` | ✅ | PodSelector、PolicyTypes | — |

### A.4 存储 (Storage)

| 资源 | 英文名 | 类别 | 首列组件 | namespace筛选 | 核心列 | 特有操作 |
| --- | --- | --- | --- | --- | --- | --- |
| PersistentVolume | 持久卷 | 集群级 | `BeeStorageInfoCell` | ❌ | 容量、访问模式、回收策略、状态(Phase) | — |
| PersistentVolumeClaim | 持久卷声明 | 命名空间级 | `BeeStorageInfoCell` | ✅ | 容量、访问模式、绑定PV | — |
| StorageClass | 存储类 | 集群级 | `BeeStorageInfoCell` | ❌ | Provisioner、回收策略、是否默认 | — |

### A.5 安全 (Security)

| 资源 | 英文名 | 类别 | 首列组件 | namespace筛选 | 核心列 | 特有操作 |
| --- | --- | --- | --- | --- | --- | --- |
| ServiceAccount | 服务账号 | 命名空间级 | `BeeSecurityInfoCell` | ✅ | 关联Secret数 | — |
| Role | 角色 | 命名空间级 | `BeeSecurityInfoCell` | ✅ | 规则数 | — |
| ClusterRole | 集群角色 | 集群级 | `BeeSecurityInfoCell` | ❌ | 规则数 | — |
| RoleBinding | 角色绑定 | 命名空间级 | `BeeSecurityInfoCell` | ✅ | 绑定Role、Subjects | — |
| ClusterRoleBinding | 集群角色绑定 | 集群级 | `BeeSecurityInfoCell` | ❌ | 绑定ClusterRole、Subjects | — |

### A.6 节点 (Node)

| 资源 | 英文名 | 类别 | 首列组件 | namespace筛选 | 核心列 | 特有操作 |
| --- | --- | --- | --- | --- | --- | --- |
| Node | 节点 | 集群级 | `BeeNodeInfoCell` | ❌ | CPU/内存使用率、Pod数、Kubelet版本、状态 | 隔离(Cordon)、驱逐(Drain) |

**Node 特殊说明**：
- 使用 `BeeNodeInfoCell`（含 IP 展示）
- 无创建路由（节点由集群自动发现注册）
- 列信息突出资源水位：CPU 使用率、内存使用率（可用进度条展示）
- 特有操作：隔离(Cordon, 禁止新 Pod 调度) / 恢复隔离(Uncordon) / 驱逐(Drain, 迁移现有 Pod)

### A.7 CRD

| 资源 | 英文名 | 类别 | 首列组件 | namespace筛选 | 核心列 | 特有操作 |
| --- | --- | --- | --- | --- | --- | --- |
| CustomResourceDefinition | 自定义资源定义 | 集群级 | `BeeCustomResourceDefinitionInfoCell` | ❌ | Group、Version、Scope(Namespaced/Cluster)、状态 | — |

### A.8 命名空间 (Namespace)

| 资源 | 英文名 | 类别 | 首列组件 | namespace筛选 | 核心列 | 特有操作 |
| --- | --- | --- | --- | --- | --- | --- |
| Namespace | 命名空间 | 集群级 | `BeeNamespaceInfoCell` | ❌ | 状态、类型 | 资源配额 |

**Namespace 特殊说明**：
- 集群级资源，无 namespace 筛选，无 Namespaced 继承
- 使用 `BeeNamespaceInfoCell`（无 UID 展示）
- 删除时需级联警告："删除命名空间将同时删除该命名空间下的所有资源！"

---

### A.9 分类速查对照

| 维度 | 命名空间级资源 | 集群级资源 |
| --- | --- | --- |
| **继承链** | `UidEntity + Clustered + Namespaced + AuditEntity + DeletableEntity` | `UidEntity + Clustered + AuditEntity + DeletableEntity` |
| **首列组件** | 模块专属组件（`BeeWorkloadInfoCell`、`BeeNetworkInfoCell`、`BeeStorageInfoCell`、`BeeSecurityInfoCell`、`BeeConfigInfoCell`、`BeePodInfoCell`） | 模块专属组件（`BeeNodeInfoCell`、`BeeNamespaceInfoCell`、`BeeCustomResourceDefinitionInfoCell`、`BeeStorageInfoCell`、`BeeSecurityInfoCell`） |
| **namespace 筛选** | ✅ 必须 | ❌ 不适用 |
| **loadNamespaceOptions** | ✅ 需要 | ❌ 不需要 |
| **搜索字段** | 各资源独立定义，典型：`uid`+`name` | 各资源独立定义，典型：`name` |
| **删除级联警告** | ❌（常规资源） | ✅（如 Namespace / PV 等有级联风险的资源） |

## 附录 B：新增资源开发流程

1. **确定资源类别** → 查附录 A，确定继承链、筛选条件
2. **定义 types** → 创建 `{Resource}QueryForm` 和 `{Resource}ListVo`
3. **定义 API** → 创建 `get{Resource}Page()`
4. **创建页面** → 按第 2 章模板结构搭建，按资源类别裁剪
5. **对照检查清单** → 完成第 12 章的所有检查项
