# Entity Namespace 设计文档

## 文档约定

- 标题（`###` 章节）使用纯英文，中文说明置于标题下方的「定义说明」行，避免中文锚点乱码。
- 类型名、常量名一律使用 `` ` `` 包裹，以区分普通文本。
- 类型引用规律：枚举 → 「枚举定义见」；类型仅引用 1 次 → 就地展开；引用 ≥ 2 次 → 抽独立 `###` + 「定义见」；根类型（Spec / StatusObj）保留。
- 多资源共用枚举/类型统一收口到 `entity-kubernetes-design.md`；资源设计文档之间禁止互相引用，本文档不引用其他资源文档。

## Namespace 常量定义（/src/config/kubernetes/namespace.ts）

### NAMESPACE_PAGE_META

Namespace 列表页面元数据配置。

- icon: 'kubernetes-namespace' （页面图标）
- title: '命名空间管理' （页面标题）
- description: '命名空间（Namespace）是 Kubernetes 集群中用于资源隔离的虚拟集群，可以将集群划分为多个独立的工作空间，实现项目、团队或环境之间的资源隔离和管理。' （页面描述）

### NamespaceStatus

Namespace 状态选项，用于列表筛选与展示，含状态值、中文标签与配色。

#### _namespaceStatuses (internal const)
- 'Active' （label: '活跃', color: COLOR_SUCCESS）
- 'Terminating' （label: '终止中', color: COLOR_PRIMARY）

#### NamespaceStatuses (derived from _namespaceStatuses)
```ts
export type NamespaceStatuses = (typeof _namespaceStatuses)[number]['value']
```

#### NAMESPACE_STATUS_OPTIONS (options with '所有状态')
```ts
export const NAMESPACE_STATUS_OPTIONS = [
  { value: undefined, label: '所有状态' },
  ..._namespaceStatuses,
]
```

### NamespacePhase

Namespace 的生命周期阶段。

#### _namespacePhases (internal const)
- { value: 'Active', label: '活跃' }
- { value: 'Terminating', label: '终止中' }

#### NamespacePhase (derived from _namespacePhases)
```ts
export type NamespacePhase = (typeof _namespacePhases)[number]['value']
```

### FinalizerName

Namespace 终结器名称，标识在删除命名空间前必须清空的终结逻辑。

#### _finalizerNames (internal const)
- 'kubernetes' （label: 'Kubernetes 内置终结器，负责清理命名空间内所有资源'）

#### FinalizerName (derived from _finalizerNames)
```ts
export type FinalizerName = (typeof _finalizerNames)[number]['value']
```

### NamespaceConditionType

Namespace 条件类型，描述命名空间删除过程中的各类观测状态。

#### _namespaceConditionTypes (internal const)
- 'NamespaceDeletionDiscoveryFailure' （label: '资源发现失败'）
- 'NamespaceDeletionContentFailure' （label: '内容删除失败'）
- 'NamespaceDeletionGroupVersionParsingFailure' （label: 'GroupVersion 解析失败'）
- 'NamespaceContentRemaining' （label: '仍有残留内容'）
- 'NamespaceFinalizersRemaining' （label: '仍有 finalizer 未清空'）

#### NamespaceConditionType (derived from _namespaceConditionTypes)
```ts
export type NamespaceConditionType = (typeof _namespaceConditionTypes)[number]['value']
```

## Namespace 原始类型定义（/src/types/kubernetes/namespace/types.ts）

### NamespaceSpec

Namespace 的行为规格定义。

- finalizers?: `FinalizerName[]` （终结器列表，须全部清空后命名空间才能从存储中永久删除；枚举定义见 [`FinalizerName`](#finalizername)）

### NamespaceStatusObj

Namespace 的当前状态信息。

- phase?: `NamespacePhase` （命名空间当前生命周期阶段，枚举定义见 [`NamespacePhase`](#namespacephase)）
- conditions?: `Condition<NamespaceConditionType>[]` （命名空间当前状态的最新观测条件列表，条件类型枚举定义见 [`NamespaceConditionType`](#namespaceconditiontype)；条件结构定义见 [`Condition`](entity-kubernetes-design.md#condition)）
