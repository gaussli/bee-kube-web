# Storage 实体设计

> 本文件解耦自 [feature-design.md](./feature-design.md)，集中描述 Storage 的常量定义与原始类型定义。

## 文档约定

本系列实体设计文档统一遵循以下类型引用规范，以支撑后续基于文档准确生成代码、避免 AI 幻觉自我扩展：

1. **枚举（string literal 联合类型）**：均使用「枚举定义见」指向 `## Storage 常量定义` 章节中的 `###` 定义，不复述取值列表。
2. **类型只被引用 1 次**：直接就地展开其子字段，不抽独立 `###` 定义。
3. **类型被引用 ≥ 2 次**：抽为独立 `###` 定义，引用处使用「定义见」指向该锚点，不重复展开子字段（含内联字段一并抽离）。
4. **跨文件已定义的类型**：允许引用 `entity-kubernetes-design.md`（Kubernetes 通用/原始定义收口文件）、`entity-common-design.md`（全局通用类型收口文件）以及资源 design 文档。本文不重复定义或展开。资源 design 文档之间禁止互相引用（**唯一例外：可引用 `entity-pod-design.md` 的 Pod 类型**）。当前引用示例：`Quantity`/`Condition`/`PersistentVolumeAccessMode` 均来自 `entity-kubernetes-design.md`。
5. 类型名、常量名一律使用 `` ` `` 包裹；链接锚点以 VS Code 自动生成为准（英文标题 `### Xxx` → `#xxx`，首字母小写）。

> 简言之：**枚举 → 枚举定义见；复用 ≥2 次 → 定义见；仅用 1 次 → 直接展开；跨文件共用 → 仅引用收口文件。**

## Storage 类型定义（/src/types/kubernetes/storage.ts）

## Storage 常量定义（`/src/config/kubernetes/storage.ts`）

### PersistentVolumePhase

PersistentVolume 的存储状态类型，描述卷的可用性与绑定阶段。

#### _persistentVolumePhases (internal const)
- 'Pending' （label: '未就绪'）
- 'Available' （label: '可用'）
- 'Bound' （label: '已绑定'）
- 'Released' （label: '已释放'）
- 'Failed' （label: '失败'）

#### PersistentVolumePhase (derived from _persistentVolumePhases)
```ts
export type PersistentVolumePhase = (typeof _persistentVolumePhases)[number]['value']
```

### PersistentVolumeMode

PersistentVolume 的卷模式，描述卷暴露为块设备或文件系统。

#### _persistentVolumeModes (internal const)
- 'Block' （label: '块设备'）
- 'Filesystem' （label: '文件系统'）

#### PersistentVolumeMode (derived from _persistentVolumeModes)
```ts
export type PersistentVolumeMode = (typeof _persistentVolumeModes)[number]['value']
```

### PersistentVolumeReclaimPolicy

PersistentVolume 的回收策略，决定卷在绑定的 PVC 被释放后的处置方式。

#### _persistentVolumeReclaimPolicies (internal const)
- 'Delete' （label: '删除底层卷'）
- 'Retain' （label: '保留卷，等待人工回收'）
- 'Recycle' （label: '清理后重新可用（已废弃）'）

#### PersistentVolumeReclaimPolicy (derived from _persistentVolumeReclaimPolicies)
```ts
export type PersistentVolumeReclaimPolicy = (typeof _persistentVolumeReclaimPolicies)[number]['value']
```

### PersistentVolumeClaimPhase

PersistentVolumeClaim 的绑定状态类型，描述 PVC 与底层卷的绑定阶段。

#### _persistentVolumeClaimPhases (internal const)
- 'Pending' （label: '未绑定，等待绑定'）
- 'Bound' （label: '已绑定到 PersistentVolume'）
- 'Lost' （label: '绑定的底层 PersistentVolume 已丢失，数据不可恢复'）

#### PersistentVolumeClaimPhase (derived from _persistentVolumeClaimPhases)
```ts
export type PersistentVolumeClaimPhase = (typeof _persistentVolumeClaimPhases)[number]['value']
```

### PersistentVolumeClaimModifyVolumeStatus

PersistentVolumeClaim 的卷属性变更状态类型。

#### _persistentVolumeClaimModifyVolumeStatuses (internal const)
- 'Pending' （label: '因未满足条件（如 VolumeAttributesClass 不存在）无法变更'）
- 'InProgress' （label: '卷属性变更进行中'）
- 'Infeasible' （label: 'CSI 驱动拒绝该请求，需指定有效的 VolumeAttributesClass'）

#### PersistentVolumeClaimModifyVolumeStatus (derived from _persistentVolumeClaimModifyVolumeStatuses)
```ts
export type PersistentVolumeClaimModifyVolumeStatus = (typeof _persistentVolumeClaimModifyVolumeStatuses)[number]['value']
```

### VolumeBindingMode

StorageClass 的卷绑定模式，决定 PersistentVolume 在何时创建与绑定。

#### _volumeBindingModes (internal const)
- 'Immediate' （label: '创建 PVC 后立即创建并绑定底层卷'）
- 'WaitForFirstConsumer' （label: '延迟绑定，直到 Pod 首次消费该 PVC 时才创建并绑定底层卷'）

#### VolumeBindingMode (derived from _volumeBindingModes)
```ts
export type VolumeBindingMode = (typeof _volumeBindingModes)[number]['value']
```

### PersistentVolumeClaimConditionType

PersistentVolumeClaim 的状态条件类型。

#### _persistentVolumeClaimConditionTypes (internal const)
- 'Resizing' （label: '正在调整存储大小'）
- 'FileSystemResizePending' （label: '等待文件系统扩容'）

#### PersistentVolumeClaimConditionType (derived from _persistentVolumeClaimConditionTypes)
```ts
export type PersistentVolumeClaimConditionType = (typeof _persistentVolumeClaimConditionTypes)[number]['value']
```

### NodeSelectorOperator

节点选择器匹配运算符，用于节点标签/字段的匹配条件。

#### _nodeSelectorOperators (internal const)
- 'In' （label: '值在 values 列表中'）
- 'NotIn' （label: '值不在 values 列表中'）
- 'Exists' （label: '标签或字段存在'）
- 'DoesNotExist' （label: '标签或字段不存在'）
- 'Gt' （label: '值大于 values[0]'）
- 'Lt' （label: '值小于 values[0]'）

#### NodeSelectorOperator (derived from _nodeSelectorOperators)
```ts
export type NodeSelectorOperator = (typeof _nodeSelectorOperators)[number]['value']
```

## Storage 原始类型定义 （`/src/types/kubernetes/storage/types.ts`）

### StorageClassSpec

StorageClass 的规格定义，描述存储供应器及其默认卷参数。

- provisioner: string （存储供应器标识（如 kubernetes.io/aws-ebs），决定由哪个外部供应器创建底层卷，必填）
- parameters?: Record<string, string> （传递给供应器的参数，因供应器而异）
- reclaimPolicy?: `PersistentVolumeReclaimPolicy` （由该 StorageClass 创建卷的默认回收策略，枚举定义见 [`PersistentVolumeReclaimPolicy`](#persistentvolumereclaimpolicy)）
- mountOptions?: string[] （由该 StorageClass 创建卷的默认挂载选项）
- allowVolumeExpansion?: boolean （是否允许通过编辑 PVC 扩大卷容量，默认 false）
- volumeBindingMode?: `VolumeBindingMode` （卷绑定模式，枚举定义见 [`VolumeBindingMode`](#volumebindingmode)）
- allowedTopologies?: `TopologySelectorTerm[]` （限制由该 StorageClass 创建卷可使用的拓扑（节点、Zone 等））
  - matchLabelExpressions: `TopologySelectorLabelRequirement[]` （拓扑标签匹配表达式列表）
    - key: string （拓扑标签的 key，须为已知拓扑标签，如 topology.kubernetes.io/zone）
    - values: string[] （匹配该 key 的拓扑标签值集合，如 ["zone1","zone2"]）

### PersistentVolumeClaimSpec

PersistentVolumeClaim 的规格定义，描述 PVC 的访问模式、容量申请与数据源。

- accessModes?: `PersistentVolumeAccessMode[]` （访问模式，枚举定义见 [`PersistentVolumeAccessMode`](entity-kubernetes-design.md#persistentvolumeaccessmode)）
- selector?: `LabelSelector` （标签选择器，用于匹配目标 PersistentVolume；定义见 [`LabelSelector`](entity-kubernetes-design.md#labelselector)）
- storageClassName?: string （关联的 StorageClass 名称；空字符串表示无类（延迟绑定））
- volumeName?: string （预绑定的 PersistentVolume 名称）
- resources?: `VolumeResourceRequirements` （资源申请，定义见 [`VolumeResourceRequirements`](#volumeresourcerequirements)）
- volumeMode?: `PersistentVolumeMode` （卷模式，枚举定义见 [`PersistentVolumeMode`](#persistentvolumemode)）
- dataSource?: `TypedLocalObjectReference` （数据源引用，须为已有 PersistentVolumeClaim 或 VolumeSnapshot，定义见 [`TypedLocalObjectReference`](entity-kubernetes-design.md#typedlocalobjectreference)）
- dataSourceRef?: `TypedObjectReference` （数据源引用，优先于 dataSource；可跨命名空间引用（须开启 CrossNamespaceVolumeDataSource），定义见 [`TypedObjectReference`](#typedobjectreference)）
- volumeAttributesClassName?: string （卷属性类名称，引用 VolumeAttributesClass；可在 PVC 创建后动态修改以调整卷运行时属性（如 CSI 磁盘性能档位），为空表示不应用）

### VolumeResourceRequirements

卷资源申请，描述 PVC 的存储容量申请与上限。

- requests?: Record<string, `Quantity`> （申请资源量，如 {storage: '10Gi'}，定义见 [`Quantity`](entity-kubernetes-design.md#quantity)）
- limits?: Record<string, `Quantity`> （资源上限，如 {storage: '20Gi'}，定义见 [`Quantity`](entity-kubernetes-design.md#quantity)）

### TypedObjectReference

类型化对象引用（可跨命名空间），指向数据源对象。

- apiGroup?: string （被引用对象所属 API 组；不指定时 Kind 须属于 core API 组；第三方类型必填）
- kind: string （被引用对象的类型（Kind））
- name: string （被引用对象的名称）
- namespace?: string （被引用对象所在命名空间；指定后需开启 CrossNamespaceVolumeDataSource 特性门控，并由 ReferenceGrant 授权）

### PersistentVolumeClaimStatusObj

PersistentVolumeClaim 的观测状态，描述绑定阶段与扩容进度。

- phase?: `PersistentVolumeClaimPhase` （绑定状态，枚举定义见 [`PersistentVolumeClaimPhase`](#persistentvolumeclaimphase)）
- accessModes?: `PersistentVolumeAccessMode[]` （实际绑定的访问模式，枚举定义见 [`PersistentVolumeAccessMode`](entity-kubernetes-design.md#persistentvolumeaccessmode)）
- capacity?: Record<`ResourceName`, `Quantity`> （实际绑定的容量（资源列表），如 {storage: '10Gi'}，定义见 [`ResourceName`](entity-kubernetes-design.md#resourcename)、[`Quantity`](entity-kubernetes-design.md#quantity)）
- conditions?: `Condition<PersistentVolumeClaimConditionType>[]` （状态条件列表，条件类型枚举定义见 [`PersistentVolumeClaimConditionType`](#persistentvolumeclaimconditiontype)，条件结构定义见 [`Condition`](entity-kubernetes-design.md#condition)）
- allocatedResources?: Record<`ResourceName`, `Quantity`> （已分配资源（资源列表），含容量；扩容中可大于实际容量，定义见 [`ResourceName`](entity-kubernetes-design.md#resourcename)、[`Quantity`](entity-kubernetes-design.md#quantity)）
- allocatedResourceStatuses?: Record<string, string> （各资源扩容状态，key 为资源名（如 storage））
- currentVolumeAttributesClassName?: string （当前生效的 VolumeAttributesClass 名称；为空表示未应用）
- modifyVolumeStatus?: `ModifyVolumeStatus` （卷属性变更操作状态，定义见 [`ModifyVolumeStatus`](#modifyvolumestatus)）

### ModifyVolumeStatus

卷属性变更操作状态，描述正在协调的 VolumeAttributesClass 变更。

- targetVolumeAttributesClassName?: string （正在协调的目标 VolumeAttributesClass 名称）
- status: `PersistentVolumeClaimModifyVolumeStatus` （变更状态，枚举定义见 [`PersistentVolumeClaimModifyVolumeStatus`](#persistentvolumeclaimmodifyvolumestatus)）

### PersistentVolumeSpec

PersistentVolume 的规格定义，描述卷的容量、访问模式与存储后端来源。

- capacity?: Record<string, `Quantity`> （存储容量，如 {storage: '20Gi'}，定义见 [`Quantity`](entity-kubernetes-design.md#quantity)）
- accessModes?: `PersistentVolumeAccessMode[]` （访问模式，枚举定义见 [`PersistentVolumeAccessMode`](entity-kubernetes-design.md#persistentvolumeaccessmode)）
- persistentVolumeReclaimPolicy?: `PersistentVolumeReclaimPolicy` （回收策略，枚举定义见 [`PersistentVolumeReclaimPolicy`](#persistentvolumereclaimpolicy)）
- storageClassName?: string （关联的 StorageClass 名称；'' 表示无类）
- claimRef?: 绑定的 PersistentVolumeClaim 引用
  - namespace: string （PVC 所在命名空间）
  - name: string （PVC 名称）
- persistentVolumeSource?: `PersistentVolumeSource` （存储后端来源，定义见 [`PersistentVolumeSource`](#persistentvolumesource)）
- volumeMode?: `PersistentVolumeMode` （卷模式，枚举定义见 [`PersistentVolumeMode`](#persistentvolumemode)）
- mountOptions?: string[] （挂载选项，如 ro、noexec、soft）
- nodeAffinity?: `VolumeNodeAffinity` （节点亲和性限制；local 类型必须配置，定义见 [`VolumeNodeAffinity`](#volumenodeaffinity)）
- volumeAttributesClassName?: string （卷属性类名称，引用 VolumeAttributesClass；为空表示不应用；需启用 VolumeAttributesClass featureGate）

### PersistentVolumeStatusObj

PersistentVolume 的观测状态，描述卷的可用性与绑定阶段。

- phase?: `PersistentVolumePhase` （状态，枚举定义见 [`PersistentVolumePhase`](#persistentvolumephase)）
- reason?: string （状态原因（通常为失败原因））
- message?: string （状态描述消息）
- lastPhaseTransitionTime?: string （最近一次 phase 切换时间）

### PersistentVolumeSource

PersistentVolume 的存储后端来源（联合类型，仅可设置其一）。

- hostPath?: `HostPathVolumeSource` （宿主机路径来源，定义见 [`HostPathVolumeSource`](entity-kubernetes-design.md#hostpathvolumesource)）
- local?: `LocalVolumeSource` （节点本地存储来源，定义见 [`LocalVolumeSource`](#localvolumesource)）
- nfs?: `NFSVolumeSource` （NFS 网络存储来源，定义见 [`NFSVolumeSource`](entity-kubernetes-design.md#nfsvolumesource)）
- csi?: `CSIVolumeSource` （CSI 驱动存储来源，定义见 [`CSIVolumeSource`](#csivolumesource)）

### LocalVolumeSource

节点本地存储来源，使用节点上的本地挂载路径。

- path: string （节点上的本地挂载路径）
- fsType?: string （文件系统类型，如 ext4 / xfs）
- nodeAffinity?: `VolumeNodeAffinity` （节点亲和性；local 类型必须设置，仅允许 required 节点选择，定义见 [`VolumeNodeAffinity`](#volumenodeaffinity)）

### CSIVolumeSource

CSI 驱动存储来源，使用 CSI 驱动管理的卷。

- driver: string （CSI 驱动名称，须唯一标识）
- volumeHandle: string （卷在存储后端的唯一标识）
- readOnly?: boolean （是否只读挂载，默认 false）
- fsType?: string （文件系统类型）
- volumeAttributes?: Record<string, string> （驱动自定义属性键值对）

### VolumeNodeAffinity

卷节点亲和性，限定卷可被调度的节点。

- required?: `NodeSelector` （强制匹配的节点选择器，须设置 nodeSelectorTerms 限定可调度节点，定义见 [`NodeSelector`](#nodeselector)）

### NodeSelector

节点选择器，通过标签/字段选择限定可调度节点。

- nodeSelectorTerms: `NodeSelectorTerm[]` （节点选择器项列表，各项之间为 OR 关系，定义见 [`NodeSelectorTerm`](#nodeselectorterm)）

### NodeSelectorTerm

节点选择器项，由匹配表达式或匹配字段组成（各项之间 AND 关系）。

- matchExpressions?: `NodeSelectorRequirement[]` （基于节点标签的匹配条件，多个条件之间为 AND 关系，定义见 [`NodeSelectorRequirement`](#nodeselectorrequirement)）
- matchFields?: `NodeSelectorRequirement[]` （基于节点字段的匹配条件，多个条件之间为 AND 关系，定义见 [`NodeSelectorRequirement`](#nodeselectorrequirement)）

### NodeSelectorRequirement

节点选择器匹配条件，描述对节点标签/字段的单个匹配规则。

- key: string （标签或字段名）
- operator: `NodeSelectorOperator` （操作符，枚举定义见 [`NodeSelectorOperator`](#nodeselectoroperator)）
- values?: string[] （匹配值列表，当 operator 为 Gt/Lt 时只能包含一个元素）
