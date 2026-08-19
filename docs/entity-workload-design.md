# Workload 实体设计

## 文档约定

本系列实体设计文档统一遵循以下类型引用规范，以支撑后续基于文档准确生成代码、避免 AI 幻觉自我扩展：

1. **枚举（string literal 联合类型）**：均使用「枚举定义见」指向 `## Workload 常量定义` 章节中的 `###` 定义，不复述取值列表。
2. **类型只被引用 1 次**：直接就地展开其子字段，不抽独立 `###` 定义。
3. **类型被引用 ≥ 2 次**：抽为独立 `###` 定义，引用处使用「定义见」指向该锚点，不重复展开子字段（含内联字段一并抽离）。
4. **跨文件已定义的类型**：允许引用 `entity-kubernetes-design.md`（Kubernetes 通用/原始定义收口文件）、`entity-common-design.md`（全局通用类型收口文件）。本文不重复定义或展开。多资源共用的枚举放入 `entity-kubernetes-design.md` 的常量定义章节，多资源共用的类型放入其类型定义章节。资源 design 文档之间禁止互相引用（**本文（workload）是唯一可引用 `entity-pod-design.md` 的资源文档**，如 `PodSpec`）。当前引用示例：`LabelSelector`/`LabelSelectorOperator`/`Metadata`/`ObjectMeta`/`Quantity`/`Condition` 来自 `entity-kubernetes-design.md`；`PodSpec` 来自 `entity-pod-design.md`。
5. 类型名、常量名一律使用 `` ` `` 包裹；链接锚点以 VS Code 自动生成为准（英文标题 `### Xxx` → `#xxx`，首字母小写）。

> 简言之：**枚举 → 枚举定义见；复用 ≥2 次 → 定义见；仅用 1 次 → 直接展开；跨文件共用 → 仅引用 entity-kubernetes-design.md。**

## Workload 类型定义（/src/types/kubernetes/workload.ts）

## Workload 常量定义（`/src/config/kubernetes/workload.ts`）

### DeploymentUpdateStrategyType

Deployment 的更新策略类型，决定替换旧 Pod 时采用的滚动或重建方式。

#### _deploymentUpdateStrategyTypes (internal const)
- 'RollingUpdate' （label: '滚动更新'）
- 'Recreate' （label: '重建'）

#### DeploymentUpdateStrategyType (derived from _deploymentUpdateStrategyTypes)
```ts
export type DeploymentUpdateStrategyType = (typeof _deploymentUpdateStrategyTypes)[number]['value']
```

### StatefulSetUpdateStrategyType

StatefulSet 的更新策略类型，决定替换旧 Pod 时采用的滚动或删除触发方式。

#### _statefulSetUpdateStrategyTypes (internal const)
- 'RollingUpdate' （label: '滚动更新'）
- 'OnDelete' （label: '删除时更新'）

#### StatefulSetUpdateStrategyType (derived from _statefulSetUpdateStrategyTypes)
```ts
export type StatefulSetUpdateStrategyType = (typeof _statefulSetUpdateStrategyTypes)[number]['value']
```

### DaemonSetUpdateStrategyType

DaemonSet 的更新策略类型，决定替换节点 Pod 时采用的滚动或删除触发方式。

#### _daemonSetUpdateStrategyTypes (internal const)
- 'RollingUpdate' （label: '滚动更新'）
- 'OnDelete' （label: '删除时更新'）

#### DaemonSetUpdateStrategyType (derived from _daemonSetUpdateStrategyTypes)
```ts
export type DaemonSetUpdateStrategyType = (typeof _daemonSetUpdateStrategyTypes)[number]['value']
```

### PodManagementPolicyType

StatefulSet 的 Pod 管理策略类型，决定 Pod 的创建/删除顺序与就绪校验方式。

#### _podManagementPolicyTypes (internal const)
- 'OrderedReady' （label: '按序就绪'）
- 'Parallel' （label: '并行管理'）

#### PodManagementPolicyType (derived from _podManagementPolicyTypes)
```ts
export type PodManagementPolicyType = (typeof _podManagementPolicyTypes)[number]['value']
```

### PersistentVolumeClaimRetentionPolicyType

StatefulSet 的 PVC 保留策略类型，决定缩容或删除时卷声明的保留或回收方式。

#### _persistentVolumeClaimRetentionPolicyTypes (internal const)
- 'Retain' （label: '保留'）
- 'Delete' （label: '删除'）

#### PersistentVolumeClaimRetentionPolicyType (derived from _persistentVolumeClaimRetentionPolicyTypes)
```ts
export type PersistentVolumeClaimRetentionPolicyType = (typeof _persistentVolumeClaimRetentionPolicyTypes)[number]['value']
```

### ConcurrencyPolicy

CronJob 的并发策略类型，决定上一轮 Job 未结束时新 Job 的处置方式。

#### _concurrencyPolicies (internal const)
- 'Allow' （label: '允许并发'）
- 'Forbid' （label: '禁止并发'）
- 'Replace' （label: '替换旧任务'）

#### ConcurrencyPolicy (derived from _concurrencyPolicies)
```ts
export type ConcurrencyPolicy = (typeof _concurrencyPolicies)[number]['value']
```

### CompletionMode

Job 的 Pod 完成追踪模式，决定 Pod 完成是否带索引。

#### _completionModes (internal const)
- 'NonIndexed' （label: '非索引模式，达到 completions 个成功 Pod 即完成'）
- 'Indexed' （label: '索引模式，Pod 按 0 至 completions-1 分配索引，需每个索引均完成'）

#### CompletionMode (derived from _completionModes)
```ts
export type CompletionMode = (typeof _completionModes)[number]['value']
```

### PodReplacementPolicy

Job 的 Pod 替换策略，决定何时创建替换 Pod。

#### _podReplacementPolicies (internal const)
- 'TerminatingOrFailed' （label: 'Pod 处于终止（有 deletionTimestamp）或失败状态时即重建'）
- 'Failed' （label: '等待先前 Pod 完全终止（Failed 或 Succeeded）后再重建'）

#### PodReplacementPolicy (derived from _podReplacementPolicies)
```ts
export type PodReplacementPolicy = (typeof _podReplacementPolicies)[number]['value']
```

### DeploymentConditionType

Deployment 的状态条件类型，描述其可用性与进度状况。

#### _deploymentConditionTypes (internal const)
- 'Available' （label: '可用'）
- 'Progressing' （label: '处理中'）
- 'ReplicaFailure' （label: '副本失败'）

#### DeploymentConditionType (derived from _deploymentConditionTypes)
```ts
export type DeploymentConditionType = (typeof _deploymentConditionTypes)[number]['value']
```

### StatefulSetConditionType

StatefulSet 的状态条件类型，描述其可用性与进度状况。

#### _statefulSetConditionTypes (internal const)
- 'Available' （label: '可用'）
- 'Progressing' （label: '处理中'）
- 'ReplicaFailure' （label: '副本失败'）

#### StatefulSetConditionType (derived from _statefulSetConditionTypes)
```ts
export type StatefulSetConditionType = (typeof _statefulSetConditionTypes)[number]['value']
```

### DaemonSetConditionType

DaemonSet 的状态条件类型，描述其可用性与进度状况。

#### _daemonSetConditionTypes (internal const)
- 'Available' （label: '可用'）
- 'Progressing' （label: '处理中'）
- 'ReplicaFailure' （label: '副本失败'）
- 'Misconfigured' （label: '配置错误'）

#### DaemonSetConditionType (derived from _daemonSetConditionTypes)
```ts
export type DaemonSetConditionType = (typeof _daemonSetConditionTypes)[number]['value']
```

### JobConditionType

Job 的状态条件类型，描述其完成、失败与暂停状况。

#### _jobConditionTypes (internal const)
- 'Complete' （label: '已完成'）
- 'Failed' （label: '已失败'）
- 'Suspended' （label: '已暂停'）
- 'FailureTarget' （label: '目标失败'）
- 'SuccessCriteriaMet' （label: '满足成功标准'）

#### JobConditionType (derived from _jobConditionTypes)
```ts
export type JobConditionType = (typeof _jobConditionTypes)[number]['value']
```

### CronJobConditionType

CronJob 的状态条件类型，描述其完成、失败与暂停状况。

#### _cronJobConditionTypes (internal const)
- 'Complete' （label: '已完成'）
- 'Failed' （label: '已失败'）
- 'Suspended' （label: '已暂停'）

#### CronJobConditionType (derived from _cronJobConditionTypes)
```ts
export type CronJobConditionType = (typeof _cronJobConditionTypes)[number]['value']
```

## Workload 原始类型定义 （`/src/types/kubernetes/workload/types.ts`）

### PodTemplateSpec

Pod 模板规格，供各工作负载的 template 字段引用。

- metadata: `Metadata` （Pod 模板的元数据，包括 labels 与 annotations；其 labels 必须与 selector 匹配，否则会被控制器拒绝；定义见 [`Metadata`](entity-kubernetes-design.md#metadata)）
- spec: `PodSpec` （Pod 的规格定义，描述容器的实际运行期望；定义见 [entity-pod-design.md#podspec](entity-pod-design.md#podspec)）

### DeploymentSpec

Deployment 的规格信息，声明期望的 Pod 副本集形态。

- replicas: number （期望副本数，默认为 1）
- selector: `LabelSelector` （Pod 标签选择器，须匹配 Pod 模板的标签；定义见 [`LabelSelector`](entity-kubernetes-design.md#labelselector)）
- strategy: `DeploymentUpdateStrategy` （用于替换旧 Pod 的更新策略结构）
  - type: `DeploymentUpdateStrategyType` （更新策略类型，枚举定义见 [`DeploymentUpdateStrategyType`](#deploymentupdatestrategytype)）
  - rollingUpdate: `RollingUpdateDeployment` （滚动更新属性）
    - maxUnavailable?: number | string （最大不可用副本数）
    - maxSurge?: number | string （最大超出副本数）
- minReadySeconds: number （新 Pod 就绪后被视为可用的最小秒数，默认为 0）
- revisionHistoryLimit: number （保留的旧 ReplicaSet 数量，用于回滚，默认为 10）
- paused: boolean （是否暂停部署）
- progressDeadlineSeconds: number （部署进度超时时间，超过则视为失败，默认为 600）
- template: `PodTemplateSpec` （将要创建的 Pod 模板，其标签须匹配上方 selector 的标签选择器，定义见 [`PodTemplateSpec`](#podtemplatespec)）

### DeploymentStatusObj

Deployment 的运行时状态信息。

- observedGeneration: number （Deployment 控制器已观测到的 generation 代次）
- replicas: number （匹配选择器且未终止的 Pod 总数）
- updatedReplicas: number （匹配选择器、且已应用期望模板 spec 的 Pod 总数）
- readyReplicas: number （匹配选择器、且处于 Ready 状态的 Pod 总数）
- availableReplicas: number （匹配选择器、且至少就绪 minReadySeconds 的可用 Pod 总数）
- unavailableReplicas: number （不可用 Pod 总数，即尚未达到 100% 可用容量所需的 Pod；包括运行中但尚未就绪、或尚未创建的 Pod）
- terminatingReplicas: number （匹配选择器且正在终止的 Pod 总数；此类 Pod 具有非空的 deletionTimestamp 且尚未进入 Failed/Succeeded 阶段；需启用 DeploymentReplicaSetTerminatingReplicas featureGate，默认开启）
- conditions: `Condition<DeploymentConditionType>[]` （Deployment 当前状态的最新观测条件列表，条件类型枚举定义见 [`DeploymentConditionType`](#deploymentconditiontype)，条件结构定义见 [`Condition`](entity-kubernetes-design.md#condition)）
- collisionCount: number （Deployment 的哈希冲突计数；控制器在为新 ReplicaSet 生成名称时用作冲突避免机制）

### StatefulSetSpec

StatefulSet 的规格信息，声明有状态、稳定网络标识与持久存储的 Pod 集合。

- replicas: number （期望副本数，默认为 1）
- serviceName: string （关联的无头 Service 名称，StatefulSet 为每个 Pod 生成稳定的网络标识 `<pod>-<sts>.<service>.<ns>.svc`）
- selector: `LabelSelector` （Pod 标签选择器，须匹配 Pod 模板的标签；定义见 [`LabelSelector`](entity-kubernetes-design.md#labelselector)）
- podManagementPolicy: `PodManagementPolicyType` （Pod 管理策略，枚举定义见 [`PodManagementPolicyType`](#podmanagementpolicytype)）
- ordinals: `StatefulSetOrdinals` （Pod 序号配置，常用于将 StatefulSet 序号从非零值或自定义偏移开始）
  - start?: number （Pod 序号起始值，默认 0）
- updateStrategy: `StatefulSetUpdateStrategy` （用于替换旧 Pod 的更新策略结构）
  - type: `StatefulSetUpdateStrategyType` （更新策略类型，枚举定义见 [`StatefulSetUpdateStrategyType`](#statefulsetupdatestrategytype)）
  - rollingUpdate: `RollingUpdateStatefulSet` （滚动更新属性）
    - partition?: number （滚动更新分区序号，序号 >= partition 的 Pod 才被更新，常用于金丝雀发布）
    - maxUnavailable?: number | string （最大不可用副本数，需启用 MaxUnavailableStatefulSet featureGate）
- minReadySeconds: number （新 Pod 就绪后被视为可用的最小秒数，默认为 0）
- revisionHistoryLimit: number （保留的旧 ControllerRevision 数量，用于回滚，默认为 10）
- template: `PodTemplateSpec` （将要创建的 Pod 模板，其标签须匹配上方 selector 的标签选择器，定义见 [`PodTemplateSpec`](#podtemplatespec)）
- volumeClaimTemplates: `PersistentVolumeClaim[]` （持久卷声明模板数组，StatefulSet 为每个 Pod 按序创建独立的 PVC 实现稳定持久存储）
  - name: string （模板名称，作为 Pod 内 volumeMount 的引用标识）
  - storageClass?: string （存储类名称，为空时使用集群默认 StorageClass）
  - accessModes: `PersistentVolumeAccessMode[]` （PVC 访问模式，如 ReadWriteOnce / ReadWriteMany，枚举定义见 [`PersistentVolumeAccessMode`](entity-kubernetes-design.md#persistentvolumeaccessmode)）
  - capacity: `Quantity` （存储容量，如 10Gi；定义见 [`Quantity`](entity-kubernetes-design.md#quantity)）
  - mode?: number （挂载目录的文件权限位，如 0644）
- persistentVolumeClaimRetentionPolicy: `StatefulSetPersistentVolumeClaimRetentionPolicy` （缩容或删除 StatefulSet 时 PVC 的保留策略）
  - whenDeleted: `PersistentVolumeClaimRetentionPolicyType` （StatefulSet 被删除时 PVC 的保留策略，枚举定义见 [`PersistentVolumeClaimRetentionPolicyType`](#persistentvolumeclaimretentionpolicytype)）
  - whenScaled: `PersistentVolumeClaimRetentionPolicyType` （通过缩容删除 Pod 时 PVC 的保留策略，枚举定义见 [`PersistentVolumeClaimRetentionPolicyType`](#persistentvolumeclaimretentionpolicytype)）

### StatefulSetStatusObj

StatefulSet 的运行时状态信息。

- observedGeneration: number （StatefulSet 控制器已观测到的 generation 代次）
- replicas: number （匹配选择器且未终止的 Pod 总数）
- readyReplicas: number （匹配选择器、且处于 Ready 状态的 Pod 总数）
- availableReplicas: number （至少就绪 minReadySeconds 的可用 Pod 总数）
- currentReplicas: number （当前版本（currentRevision）下已就绪且匹配模板的 Pod 总数）
- updatedReplicas: number （匹配选择器、且已应用期望模板 spec 的 Pod 总数）
- currentRevision: string （当前正在使用的 ControllerRevision 名称）
- updateRevision: string （更新目标 ControllerRevision 名称）
- collisionCount: number （StatefulSet 的哈希冲突计数；控制器在为新 ControllerRevision 生成名称时用作冲突避免机制）
- conditions: `Condition<StatefulSetConditionType>[]` （StatefulSet 当前状态的最新观测条件列表，条件类型枚举定义见 [`StatefulSetConditionType`](#statefulsetconditiontype)，条件结构定义见 [`Condition`](entity-kubernetes-design.md#condition)）

### DaemonSetSpec

DaemonSet 的规格信息，声明每个节点运行一个 Pod 的守护进程集合。

- selector: `LabelSelector` （Pod 标签选择器，须匹配 Pod 模板的标签；DaemonSet 不支持独立 selector，其值为只读派生；定义见 [`LabelSelector`](entity-kubernetes-design.md#labelselector)）
- minReadySeconds: number （新 Pod 就绪后被视为可用的最小秒数，默认为 0）
- revisionHistoryLimit: number （保留的旧 ControllerRevision 数量，用于回滚，默认为 10）
- updateStrategy: `DaemonSetUpdateStrategy` 用于替换旧 Pod 的更新策略结构
  - type: `DaemonSetUpdateStrategyType` （更新策略类型，枚举定义见 [`DaemonSetUpdateStrategyType`](#daemonsetupdatestrategytype)）
  - rollingUpdate: `RollingUpdateDaemonSet` （滚动更新属性）
    - maxUnavailable?: number | string （滚动更新期间允许的最大不可用节点 Pod 数或比例，默认 1）
    - maxSurge?: number | string （滚动更新期间允许超出期望数的最大 Pod 数或比例，需 Kubernetes 1.21+）
- template: `PodTemplateSpec` （将要创建的 Pod 模板，其标签须匹配上方 selector 的标签选择器，定义见 [`PodTemplateSpec`](#podtemplatespec)）

### DaemonSetStatusObj

DaemonSet 的运行时状态信息。

- observedGeneration: number （DaemonSet 控制器已观测到的 generation 代次）
- desiredNumberScheduled: number （应当在节点上调度的目标 Pod 总数）
- currentNumberScheduled: number （当前已调度（含运行中）的 Pod 总数）
- numberReady: number （处于 Ready 状态的 Pod 总数）
- numberAvailable: number （至少就绪 minReadySeconds 的可用 Pod 总数）
- numberUnavailable: number （不可用 Pod 总数）
- updatedNumberScheduled: number （已应用期望模板 spec 的 Pod 总数）
- collisionCount: number （DaemonSet 的哈希冲突计数；控制器在为新 ControllerRevision 生成名称时用作冲突避免机制）
- conditions: `Condition<DaemonSetConditionType>[]` （DaemonSet 当前状态的最新观测条件列表，条件类型枚举定义见 [`DaemonSetConditionType`](#daemonsetconditiontype)，条件结构定义见 [`Condition`](entity-kubernetes-design.md#condition)）

### JobSpec

Job 的规格信息，声明一次性批处理任务的期望执行方式。

- parallelism: number （并行运行的最大 Pod 数量，默认为 1；Job 运行时可调整）
- completions: number （需要成功完成的 Pod 数量，默认为 1）
- backoffLimit: number （失败重试次数上限，超过后 Job 标记为 Failed，默认为 6）
- activeDeadlineSeconds: number （Job 在节点上可存活的最长秒数，超时则标记失败并终止所有 Pod）
- ttlSecondsAfterFinished: number （Job 完成后保留的秒数，超时由控制器清理；为空则永久保留；需启用 TTLAfterFinished featureGate）
- suspend: boolean （是否暂停 Job；暂停时控制器不再创建新 Pod，已存在 Pod 不强制删除）
- selector?: `LabelSelector` （Pod 标签选择器，由系统自动设置；仅在 manualSelector 为 true 时可由用户指定；定义见 [`LabelSelector`](entity-kubernetes-design.md#labelselector)）
- manualSelector?: boolean （是否手动指定 selector，为 false 时由系统根据 template 标签自动生成，默认 false）
- completionMode?: `CompletionMode` （Pod 完成追踪模式，枚举定义见 [`CompletionMode`](#completionmode)）
- podFailurePolicy?: `PodFailurePolicy` （Pod 失败策略，决定失败 Pod 是否计入 backoffLimit）
  - rules: `PodFailurePolicyRule[]` （失败策略规则列表，按顺序求值，最多 20 条）
    - action: `PodFailurePolicyAction` （命中规则时的动作，如 FailJob/FailIndex/Ignore/Count）
    - onExitCodes?: `PodFailurePolicyOnExitCodesRequirement` （基于容器退出码的要求）
    - onPodConditions?: `PodFailurePolicyOnPodConditionsPattern[]` （基于 Pod 条件的要求，最多 20 条）
- successPolicy?: `SuccessPolicy` （成功判定策略，使 Job 在 succeeded < completions 时提前判定完成，仅 Indexed 模式可用）
  - rules: `SuccessPolicyRule[]` （成功判定规则列表，按顺序求值，任意规则命中即成功，最多 20 条）
    - succeededIndexes?: string （需包含的已完成索引集合，如 '1,3-5,7'）
    - succeededCount?: number （需达成的最小已完成索引数）
- backoffLimitPerIndex?: number （每个索引独立的重试上限，仅 Indexed 模式可用；需启用 JobBackoffLimitPerIndex featureGate）
- maxFailedIndexes?: number （允许的最大失败索引数，达到后整体标记 Failed；需启用 JobBackoffLimitPerIndex featureGate）
- podReplacementPolicy?: `PodReplacementPolicy` （Pod 替换策略，枚举定义见 [`PodReplacementPolicy`](#podreplacementpolicy)）
- managedBy?: string （管理控制器的标识（域名前缀路径，如 acme.io/foo），为空时由 Job 控制器管理）
- template: `PodTemplateSpec` （将要创建的 Pod 模板；其标签作为 Job 的自动选择器，不可与已有 Job 冲突，定义见 [`PodTemplateSpec`](#podtemplatespec)）

### JobStatusObj

Job 的运行时状态信息。

- active: number （当前处于运行状态（非成功/失败）的 Pod 总数）
- succeeded: number （已成功完成的 Pod 总数）
- failed: number （已失败终止的 Pod 总数）
- terminating?: number （正在终止（有 deletionTimestamp）的 Pod 总数）
- ready?: number （处于 Ready 条件且未终止的活跃 Pod 总数）
- completedIndexes?: string （Indexed 模式下已完成索引文本，如 '1,3-5,7'）
- failedIndexes?: string （backoffLimitPerIndex 启用时的失败索引文本，如 '1,3-5,7'）
- uncountedTerminatedPods?: `UncountedTerminatedPods` （已终止但控制器尚未计入状态计数器的 Pod UID）
  - succeeded?: string[] （已成功 Pod 的 UID 集合）
  - failed?: string[] （已失败 Pod 的 UID 集合）
- startTime: string （Job 首次被控制器接管的开始时间）
- completionTime: string （Job 完成（成功或失败）的时间）
- conditions: `Condition<JobConditionType>[]` （Job 当前状态的最新观测条件列表，条件类型枚举定义见 [`JobConditionType`](#jobconditiontype)，条件结构定义见 [`Condition`](entity-kubernetes-design.md#condition)）

### CronJobSpec

CronJob 的规格信息，声明基于 Cron 表达式周期性创建的 Job。

- schedule: string （Cron 调度表达式，必填，如 '*/5 * * * *' 表示每 5 分钟执行一次）
- timeZone?: string （调度时区名称，如 'Asia/Shanghai'，为空时采用控制器进程时区）
- concurrencyPolicy: `ConcurrencyPolicy` （并发策略，枚举定义见 [`ConcurrencyPolicy`](#concurrencypolicy)）
- startingDeadlineSeconds?: number （调度错过后的最晚启动宽限秒数；超过则不再补执行并标记 MissSchedule）
- suspend: boolean （是否暂停 CronJob；暂停后不再创建新 Job，已运行 Job 不受影响）
- successfulJobsHistoryLimit: number （保留的成功 Job 历史数量上限，默认为 3）
- failedJobsHistoryLimit: number （保留的失败 Job 历史数量上限，默认为 1）
- jobTemplate: 每次触发所创建的 Job 模板结构
  - metadata: `ObjectMeta` （Job 模板的元数据，包括 labels 与 annotations；定义见 [`ObjectMeta`](entity-kubernetes-design.md#objectmeta)）
  - spec: `JobSpec` （Job 的规格定义，定义见 [`JobSpec`](#jobspec)）

### CronJobStatusObj

CronJob 的运行时状态信息。

- active: number （当前正在运行的 Job 总数）
- lastScheduleTime: string （最近一次成功触发 Job 的时间）
- lastSuccessfulTime: string （最近一次成功完成 Job 的时间）
- conditions: `Condition<CronJobConditionType>[]` （CronJob 当前状态的最新观测条件列表，条件类型枚举定义见 [`CronJobConditionType`](#cronjobconditiontype)，条件结构定义见 [`Condition`](entity-kubernetes-design.md#condition)）

### HistoryRevision

记录工作负载某次修订的历史版本信息。

- revision: number （修订版本号）
- changeCause: string （变更原因）
- createAt: string （创建时间）
- active: boolean （是否为当前活跃版本）