# Deployment（无状态应用）设计文档

---

## 2. 路由架构

- **列表页** — `kubernetes:workload:deployment`
  - 路径: `/kubernetes/clusters/:clusterUid/deployments`
  - 权限: `kubernetes:workload:deployment:view`
- **详情页** — `kubernetes:workload:deployment:detail`
  - 路径: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name`
  - 权限: `kubernetes:workload:deployment:view`
- **创建页（表单）** — `kubernetes:workload:deployment:create`
  - 路径: `/kubernetes/clusters/:clusterUid/deployments/create`
  - 权限: `kubernetes:workload:deployment:create`
- **创建页（YAML）** — `kubernetes:workload:deployment:create:yaml`
  - 路径: `/kubernetes/clusters/:clusterUid/deployments/create/yaml`
  - 权限: `kubernetes:workload:deployment:create`
- **编辑页（表单）** — `kubernetes:workload:deployment:edit`
  - 路径: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/edit`
  - 权限: `kubernetes:workload:deployment:edit`
- **编辑页（YAML）** — `kubernetes:workload:deployment:edit:yaml`
  - 路径: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/edit/yaml`
  - 权限: `kubernetes:workload:deployment:edit`

**路径参数说明**：

- `clusterUid`：集群唯一标识，由 `useKubernetesStore.activeClusterId` 维护
- `namespace`：命名空间名称，详情/编辑页路由参数
- `name`：Deployment 资源名称，详情/编辑页路由参数

---

## 3. 列表页设计

Deployment 列表页遵循 [列表页通用设计规范](./list-design.md)，以下为 Deployment 的特化配置。

### 3.1 页面元信息

图标 `kubernetes-deployment`、标题 "无状态应用"、描述文本均从 `@/config/kubernetes/workload/deployment.ts` 中的 `DEPLOYMENT_PAGE_META` 获取。

### 3.2 展示列

| 列宽 | 组件 | 属性 | 说明 |
| --- | --- | --- | --- |
| 500px | `BeeWorkloadInfoCell` | `uid`, `name`, `description`, `icon: kubernetes-deployment` | 资源图标 + 名称 + UID |
| 200px | `BeeTableCommonCell` | `text: namespace`, `subtext: "命名空间"` | 所属命名空间 |
| 160px | `BeeStatusCell` | `status`, `statusMsg`, `options: DEPLOYMENT_STATUS_OPTIONS` | 状态 |
| 120px | `BeeTableCommonCell` | `text: "readyReplicas / replicas"`, `subtext: "副本数"` | 就绪/期望副本 |
| 160px | `BeeTableCommonCell` | `text: 策略中文名`, `subtext: strategyType` | 更新策略 |
| 200px | `BeeAuditCell` | `username: createBy`, `datetime: createAt` | 创建信息 |
| 200px | `BeeAuditCell` | `username: updateBy`, `datetime: updateAt` | 更新信息 |
| 150px | `BeeActionCell` | `actions: getActions(row)` | 操作列 |

### 3.3 筛选条件

| 组件 | 绑定字段 | 说明 |
| --- | --- | --- |
| `BeeInputSearch` | `searchKey` | 映射到 `uid` + `name` |
| `BeeSelect` (w: 300) | `queryForm.namespace` | 命名空间筛选 |
| `BeeSelect` | `queryForm.status` | `DEPLOYMENT_STATUS_OPTIONS` |

### 3.4 数据类型

```typescript
export interface DeploymentQueryForm extends UidEntity, PageForm {
  name: string
  namespace: string
  status: string
}

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

### 3.5 行操作

| 操作 | icon | 权限 | 显示条件 |
| --- | --- | --- | --- |
| 详情 | `basic-view` | `view` | 始终 |
| 编辑 | `basic-edit` | `edit` | 始终 |
| 编辑 YAML | `basic-code` | `edit` | 始终 |
| 扩缩容 | `kubernetes-namespace` | `edit` | 始终 |
| 重启 | `basic-refresh` | `edit` | 始终 |
| 回滚 | `kubernetes-namespace` | `edit` | 始终 |
| 删除 | `basic-delete` | `delete` | `row.deletable !== false` |

详细交互流程参见 [5. 操作功能与权限](#5-操作功能与权限)。

---

## 4. 详情页设计

### 4.1 页面结构

- **BeePage** — 页面根容器（class: `bee-page`，`flex column`，`gap: 16px`）
  - **BeeBackHeader** — 顶部返回栏
    - 返回按钮（icon: `basic-arrow-left`）— 跳转至 Deployment 列表页
    - title — "无状态应用详情"
    - 操作按钮组 — 编辑、重启、扩缩容、回滚、删除等（按权限显示）
  - **BeeResourceOverviewInfo** — 资源概览信息条（icon: `kubernetes-cluster`，size: 40）
    - namespace / name / description / status / createdAt
  - **BeeCard** — Tab 导航栏（class: `deployment-detail__tabs`）
    - Tab 列表（icon: `basic-id`）：[概览] [容器组] [调度策略] [部署历史] [关联网络] [挂载存储] [监控数据] [事件信息] [高级配置] [YAML]
  - **BeeCard** — Tab 内容区（class: `deployment-detail__content`，`flex:1`，`min-height:0`，可滚动）
    - 按 `activeTab` 条件渲染对应子组件

### 4.2 Tab 详情

#### 4.2.1 概览（overview）

概览面板是详情页的默认激活 Tab，展示 Deployment 的核心摘要信息，分为 7 个区块：

**① 副本统计**

- 左侧：环形进度图，显示就绪副本百分比，颜色按比例动态变化（100% 绿色，50%-100% 黄色，<50% 红色）
- 右侧：4 个统计卡片组成的 2×2 网格

| 指标       | 中文标签   | 英文标签           | 数据来源                          |
| ---------- | ---------- | ------------------ | --------------------------------- |
| 期望副本   | 期望副本   | Desired Replicas   | `data.replicas.replicas`          |
| 就绪副本   | 就绪副本   | Ready Replicas     | `data.replicas.readyReplicas`     |
| 可用副本   | 可用副本   | Available Replicas | `data.replicas.availableReplicas` |
| 已更新副本 | 已更新副本 | Updated Replicas   | `data.replicas.updatedReplicas`   |

**② 基本信息**

双列布局展示字段：

| 列 1                               | 列 2                                |
| ---------------------------------- | ----------------------------------- |
| 名称 (`data.basic.name`)           | 副本计数 (`data.replicas.replicas`) |
| UID (`data.basic.uid`)             | 集群名称 (`data.basic.clusterName`) |
| 标签选择器 (`data.basic.selector`) | 创建时间 (`data.basic.createAt`)    |
| 版本 (`v{data.basic.generation}`)  | 更新时间 (`data.basic.updateAt`)    |
| 创建者 (`data.basic.createBy`)     | -                                   |
| Namespace (`data.basic.namespace`) | -                                   |

**③ 标签**

以 Pill 样式展示 `data.metadata.labels` 的键值对。

**④ 注解**

以 Pill 样式展示 `data.metadata.annotations` 的键值对。

**⑤ 资源配额**

| 资源 | 请求值                         | 限制值                       |
| ---- | ------------------------------ | ---------------------------- |
| CPU  | `data.resource.request.cpu`    | `data.resource.limit.cpu`    |
| 内存 | `data.resource.request.memory` | `data.resource.limit.memory` |

CPU 使用 `formatCpu()` 格式化，内存使用自实现的 `formatMemoryBytes()` 按 B/Ki/Mi/Gi/Ti 自动转换。

**⑥ 条件列表**

表格展示 Deployment 的 Conditions，每行包含：

| 列   | 字段                  | 说明                                                   |
| ---- | --------------------- | ------------------------------------------------------ |
| 类型 | `cond.type`           | Available / Progressing / ReplicaFailure（映射为中文） |
| 状态 | `cond.status`         | True（绿色圆点）/ False（红色圆点）                    |
| 原因 | `cond.reason`         | 条件触发原因                                           |
| 消息 | `cond.message`        | 详细描述                                               |
| 时间 | `cond.lastUpdateTime` | 最后更新时间                                           |

**⑦ 更新策略**

| 字段           | 数据来源                                        | 说明                             |
| -------------- | ----------------------------------------------- | -------------------------------- |
| 更新策略       | `data.strategy.type`                            | 滚动更新 / 重建，含中英文标签    |
| 最大不可用量   | `maxUnavailable {data.strategy.maxUnavailable}` | 滚动更新时允许的最大不可用副本数 |
| 最大超出副本数 | `maxSurge {data.strategy.maxSurge}`             | 滚动更新时允许的最大超出副本数   |

#### 4.2.2 容器组（pods）

展示 Deployment 管理的 Pod 列表，具备独立的搜索和筛选能力。

**筛选栏**：

| 组件             | 绑定字段           | 说明                           |
| ---------------- | ------------------ | ------------------------------ |
| `BeeInputSearch` | `searchKey`        | 按 UID / 名称 / IP 搜索        |
| `BeeSelect`      | `queryForm.status` | 使用 `POD_STATUS_OPTIONS` 筛选 |

**表格列**：

| 列宽  | 组件                 | 属性                                                                  | 说明                |
| ----- | -------------------- | --------------------------------------------------------------------- | ------------------- |
| 500px | `BeePodInfoCell` | `uid`, `name`, `ip`, `icon: kubernetes-pod`（size: 32） | Pod UID + 名称 + IP |
| 120px | `BeeStatusCell`      | `status`, `statusMsg`                                                 | Pod 状态            |
| 100px | `BeeTableCommonCell` | `text: restarts`, `subtext: "重启次数"`                               | 容器重启次数        |
| 200px | `BeeTableCommonCell` | `text: nodeName`, `subtext: nodeIp`                                   | 调度节点 + 节点 IP  |
| 140px | `BeeTableCommonCell` | `text: "readyContainerCount / containerCount"`, `subtext: "就绪容器"` | 就绪容器 / 总容器   |
| 120px | `BeeTableCommonCell` | `text: cpuUsage`, `subtext: "CPU 使用率"`                             | Pod CPU 使用率      |
| 120px | `BeeTableCommonCell` | `text: memoryUsage`, `subtext: "内存使用率"`                          | Pod 内存使用率      |

**分页**：独立分页（pageSize 10/20/50），底部右对齐。

#### 4.2.3 其他 Tab（占位）

| Tab                    | 说明                                     | 实现状态 |
| ---------------------- | ---------------------------------------- | -------- |
| 调度策略（scheduling） | 节点选择器、亲和性规则、容忍度           | 占位     |
| 部署历史（history）    | 历史版本列表、版本回滚                   | 占位     |
| 关联网络（network）    | 关联的 Service / Ingress 列表            | 占位     |
| 挂载存储（storage）    | PVC 挂载信息、容器挂载路径               | 占位     |
| 监控数据（monitor）    | CPU / 内存使用率时序图                   | 占位     |
| 事件信息（events）     | Kubernetes Events 时间线                 | 占位     |
| 高级配置（advanced）   | 重启策略、主机网络、DNS 策略、服务账户等 | 占位     |
| YAML                   | YAML 配置查看与编辑                      | 占位     |

### 4.5 详情数据类型

```typescript
// 组合结构
interface DeploymentDetailVo {
  basic: DeploymentBasicVo // 基础信息
  replicas: DeploymentReplicasVo // 副本信息
  metadata: DeploymentMetadataVo // 元数据
  resource: DeploymentResourceVo // 资源信息
  conditions: DeploymentConditionVo[] // 条件列表
  strategy: DeploymentStrategyVo // 更新策略
  advanced: DeploymentAdvancedVo // 高级配置
}

// 基础信息
interface DeploymentBasicVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  name: string
  description?: string
  status: DeploymentStatus
  statusMsg?: string
  generation: number
  selector: Record<string, string>
}

// 副本信息
interface DeploymentReplicasVo {
  replicas: number // 期望副本数
  readyReplicas: number // 就绪副本数
  availableReplicas: number // 可用副本数
  updatedReplicas: number // 已更新副本数
}

// 更新策略
interface DeploymentStrategyVo {
  type: DeploymentStrategyType // RollingUpdate / Recreate
  maxUnavailable: string // 最大不可用副本数
  maxSurge: string // 最大超出副本数
}
```

---

## 5. 操作功能与权限

> 通用权限模型、删除流程、操作列展示规则等参见 [列表页通用设计规范 - 权限模型](./list-design.md#7-权限模型)。

### 5.1 权限标识

| 权限标识 | 粒度 | 控制范围 |
| --- | --- | --- |
| `kubernetes:workload:deployment:view` | 页面级 + 行级 | 路由守卫；行操作"详情"显隐 |
| `kubernetes:workload:deployment:create` | 页面级 + UI 级 | 路由守卫；"新增"/"YAML"/"导入"按钮显隐 |
| `kubernetes:workload:deployment:edit` | 页面级 + UI 级 | 路由守卫；"编辑"/"编辑 YAML"/"扩缩容"/"重启"/"回滚"显隐 |
| `kubernetes:workload:deployment:delete` | UI 级 | "批量删除"按钮、"删除"行操作显隐 |

### 5.2 Deployment 特有操作

#### 扩缩容

- 触发：行操作 → "扩缩容"
- 弹出对话框，修改 `replicas` 值
- 确认 → 调用 `scaleDeployment(clusterUid, namespace, name, { replicas })`

#### 重启

- 触发：行操作 → "重启"
- 确认 → 调用 `restartDeployment(clusterUid, namespace, name)`
- 成功后提示并刷新列表

#### 回滚

- 触发：行操作 → "回滚"
- 弹出版本选择对话框，展示历史版本列表
- 选择目标版本 → 调用 `rollbackDeployment(clusterUid, namespace, name, { revision })`

### 5.3 详情页操作

| 操作 | 位置 | 说明 |
| --- | --- | --- |
| 返回 | BeeBackHeader 左侧 | `window.history.back()` |
| 快捷操作 | BeeBackHeader 右侧 | 编辑、重启、扩缩容、回滚、删除（预留 `handleAction`） |

---

## 6. API 接口

### 6.1 接口清单

| 方法     | URL                                                                                       | 说明                                |
| -------- | ----------------------------------------------------------------------------------------- | ----------------------------------- |
| `GET`    | `/kubernetes/clusters/{clusterUid}/deployments`                                           | 获取 Deployment 分页列表            |
| `GET`    | `/kubernetes/clusters/{clusterUid}/namespaces/{namespace}/deployments/{name}`             | 获取 Deployment 详情                |
| `POST`   | `/kubernetes/clusters/{clusterUid}/namespaces/{namespace}/deployments`                    | 创建 Deployment                     |
| `PUT`    | `/kubernetes/clusters/{clusterUid}/namespaces/{namespace}/deployments/{name}`             | 更新 Deployment                     |
| `DELETE` | `/kubernetes/clusters/{clusterUid}/namespaces/{namespace}/deployments/{name}`             | 删除单个 Deployment                 |
| `DELETE` | `/kubernetes/clusters/{clusterUid}/namespaces/{namespace}/deployments/batch`              | 批量删除 Deployment                 |
| `POST`   | `/kubernetes/clusters/{clusterUid}/namespaces/{namespace}/deployments/{name}/scale`       | 扩缩容                              |
| `POST`   | `/kubernetes/clusters/{clusterUid}/namespaces/{namespace}/deployments/{name}/restart`     | 重启                                |
| `POST`   | `/kubernetes/clusters/{clusterUid}/namespaces/{namespace}/deployments/{name}/rollback`    | 回滚                                |
| `POST`   | `/kubernetes/clusters/{clusterUid}/namespaces/{namespace}/deployments/{name}/labels`      | 更新标签                            |
| `POST`   | `/kubernetes/clusters/{clusterUid}/namespaces/{namespace}/deployments/{name}/annotations` | 更新注解                            |
| `GET`    | `/kubernetes/clusters/{clusterUid}/namespaces/{namespace}/deployments/{name}/pods`        | 获取关联 Pod 列表（分页）           |
| `GET`    | `/kubernetes/clusters/{clusterUid}/namespaces/{namespace}/deployments/{name}/schedule`    | 获取调度策略                        |
| `GET`    | `/kubernetes/clusters/{clusterUid}/namespaces/{namespace}/deployments/{name}/history`     | 获取历史版本列表                    |
| `GET`    | `/kubernetes/clusters/{clusterUid}/namespaces/{namespace}/deployments/{name}/network`     | 获取关联网络资源                    |
| `GET`    | `/kubernetes/clusters/{clusterUid}/namespaces/{namespace}/deployments/{name}/storages`    | 获取挂载存储列表                    |
| `GET`    | `/kubernetes/clusters/{clusterUid}/namespaces/{namespace}/deployments/{name}/monitor`     | 获取监控数据                        |
| `GET`    | `/kubernetes/clusters/{clusterUid}/namespaces/{namespace}/deployments/{name}/yaml`        | 获取 YAML 配置                      |
| `GET`    | `/kubernetes/clusters/{clusterUid}/deployments/export`                                    | 导出 Deployment（CSV，响应为 blob） |
| `POST`   | `/kubernetes/clusters/{clusterUid}/deployments/import`                                    | 导入 Deployment                     |

### 6.2 分页查询参数

```typescript
interface DeploymentQueryForm extends UidEntity, PageForm {
  uid?: string // UID 搜索
  name?: string // 名称搜索（模糊匹配）
  namespace?: string // 命名空间筛选
  status?: string // 状态筛选
  page: number // 页码
  pageSize: number // 每页条数
}
```

### 6.3 命名空间选项加载

列表页通过 `getNamespacePage(clusterUid, { mode: 'simple' })` 获取简化命名空间列表（仅 `id`/`uid`/`name`），填充下拉选项，含 "全部命名空间" 默认项。

---

## 7. 状态与配置

### 7.1 Deployment 状态枚举

| 状态值          | 中文标签 | 状态色                 | 说明                |
| --------------- | -------- | ---------------------- | ------------------- |
| `Running`       | 运行中   | 绿色 (`COLOR_SUCCESS`) | 所有副本正常运行    |
| `Available`     | 部分就绪 | 绿色                   | 部分副本已就绪      |
| `Stopped`       | 已停止   | 灰色 (`COLOR_GRAY_70`) | 副本数为 0 或被停止 |
| `Creating`      | 创建中   | 蓝色 (`COLOR_PRIMARY`) | 正在创建资源        |
| `Updating`      | 更新中   | 蓝色                   | 正在执行滚动更新    |
| `Terminating`   | 终止中   | 蓝色                   | 正在删除资源        |
| `CreateTimeout` | 创建超时 | 红色 (`COLOR_DANGER`)  | 创建超时失败        |
| `UpdateTimeout` | 更新超时 | 红色                   | 更新超时失败        |
| `Failed`        | 失败异常 | 红色                   | 运行异常            |
| `Unknown`       | 未知     | 灰色                   | 状态未知            |

### 7.2 更新策略

| 策略值          | 中文标签 | 说明                               |
| --------------- | -------- | ---------------------------------- |
| `RollingUpdate` | 滚动更新 | 逐步替换旧版本 Pod，保证服务不中断 |
| `Recreate`      | 重建     | 先删除所有旧 Pod，再创建新 Pod     |

### 7.3 条件类型

| 条件类型         | 中文名称 | 说明                              |
| ---------------- | -------- | --------------------------------- |
| `Available`      | 可用     | Deployment 的最小可用副本数已满足 |
| `Progressing`    | 处理中   | Deployment 正在执行滚动更新       |
| `ReplicaFailure` | 副本失败 | 部分副本创建失败                  |

---

## 8. 组件依赖

### 8.1 自定义组件

| 组件                          | 用途                                   |
| ----------------------------- | -------------------------------------- |
| `BeePage`                     | 页面容器                               |
| `BeePageHeader`               | 页面标题（图标 + 标题 + 描述）         |
| `BeeCard`                     | 卡片容器                               |
| `BeeInputSearch`              | 搜索输入框                             |
| `BeeSelect`                   | 下拉选择器                             |
| `BeeButton`                   | 按钮                                   |
| `BeeTable` / `BeeTableColumn` | 表格                                   |
| `BeeWorkloadInfoCell`         | 工作负载首列信息（图标 + 名称 + UID）  |
| `BeePodInfoCell`              | Pod 首列信息（图标 + UID + 名称 + IP） |
| `BeeTableCommonCell`          | 通用两行单元格                         |
| `BeeStatusCell`               | 状态标签（圆点 + 中文 + 英文 + 帮助）  |
| `BeeAuditCell`                | 审计信息（头像 + 时间 + 字段名）       |
| `BeeActionCell`               | 行操作（平铺 / 收起菜单自适应）        |
| `BeePagination`               | 分页组件                               |
| `BeeDialog`                   | 确认对话框                             |
| `BeeTag`                      | 标签                                   |
| `BeeMessage`                  | 消息提示                               |
| `BeeBackHeader`               | 返回页头                               |
| `BeeSegmentedControl`         | 分段控制器（Tab 切换）                 |
| `BeeFieldItem`                | 字段名值对展示                         |
| `BeeResourceOverviewInfo`     | 资源概览信息条                         |

### 8.2 外部依赖

| 模块                                                          | 用途                |
| ------------------------------------------------------------- | ------------------- |
| `usePermission()`                                             | 权限检查 composable |
| `useKubernetesStore`                                          | 获取当前集群上下文  |
| `useRoute` / `useRouter`                                      | 路由参数读取与导航  |
| `calcPercentage` / `formatCpu`                                | 数值格式化工具      |
| `DEPLOYMENT_STATUS_OPTIONS` / `DEPLOYMENT_STRATEGY_LABEL_MAP` | 状态和策略常量配置  |

---

## 9. 数据流

```
用户操作 → hasPermission(check) → 路由守卫 / UI 显隐控制
    │
    ▼
列表页加载 → getNamespacePage(simple) → 命名空间选项
           → getDeploymentPage(clusterUid, queryForm) → tableData
    │
    ▼
点击详情 → getDeploymentDetail(clusterUid, namespace, name)
           → DeploymentDetailVo (basic, replicas, metadata, resource, conditions, strategy)
           → 各 Tab 按需加载子数据 (pods, schedule, history, network, storage, monitor)
```

**状态管理**：

- 列表页：`ref/reactive` 本地状态（`searchKey`, `queryForm`, `tableData`, `pagination`, `selectedRows`）
- 详情页：`ref` 持有 `DeploymentDetailVo`，通过 computed 向子 Tab 传递数据
- 全局状态：`clusterUid` 从路由参数获取，与 `useKubernetesStore.activeClusterId` 保持同步
