/**
 * Kubernetes 工作负载（Workload）通用类型定义
 * 包含标签选择器、历史版本、Deployment、StatefulSet、DaemonSet、Job 与 CronJob 原始类型
 * @module types/kubernetes/workload/types
 */

import type { ConcurrencyPolicy, CronJobConditionType } from '@/config/kubernetes/workload/cronjob'
import type { DaemonSetConditionType, DaemonSetUpdateStrategyType } from '@/config/kubernetes/workload/daemonset'
import type { DeploymentConditionType, DeploymentUpdateStrategyType } from '@/config/kubernetes/workload/deployment'
import type { JobConditionType } from '@/config/kubernetes/workload/job'
import type {
  PodManagementPolicyType,
  StatefulSetConditionType,
  StatefulSetUpdateStrategyType,
} from '@/config/kubernetes/workload/statefulset'

import type { PodSpec } from '../pod/types'
import type { Metadata, Quantity } from '../types'

// ==================== 1. 标签选择器 ====================

/**
 * 标签表达式运算符枚举
 * @remarks
 * - In: 标签值在给定列表中
 * - NotIn: 标签值不在给定列表中
 * - Exists: 标签键存在
 * - DoesNotExist: 标签键不存在
 */
export type LabelExpressionOperator = 'In' | 'NotIn' | 'Exists' | 'DoesNotExist'

/**
 * 标签表达式
 * 定义单个标签匹配条件
 */
export interface LabelExpression {
  /** 标签键 */
  key: string
  /** 匹配运算符 */
  operator: LabelExpressionOperator
  /** 匹配值列表（operator 为 Exists / DoesNotExist 时不生效） */
  values: string[]
}

/**
 * 标签选择器
 * 通过标签组合筛选目标资源集合
 */
export interface LabelSelector {
  /** 基于等值匹配的标签（AND 关系） */
  matchLabels: Record<string, string>
  /** 基于表达式的匹配条件（与 matchLabels 为 AND 关系） */
  matchExpressions: LabelExpression[]
}

// ==================== 2. 历史版本 ====================

/**
 * 历史版本
 */
export interface HistoryRevision {
  /** 修订版本号 */
  revision: number
  /** 变更原因 */
  changeCause: string
  /** 创建时间 */
  createAt: string
  /** 是否为当前活跃版本 */
  active: boolean
}

// ==================== 3. Deployment 原始类型 ====================

/**
 * Deployment 更新策略
 */
export interface DeploymentUpdateStrategy {
  /** 策略类型，来自 `/src/config/kubernetes/workload/deployment.ts` */
  type: DeploymentUpdateStrategyType
  /** 滚动更新属性 */
  rollingUpdate: Record<string, string>
}

/**
 * Pod 模板规格
 */
export interface PodTemplateSpec {
  /** Pod 模板的元数据，包括 labels 与 annotations；其 labels 必须与 selector 匹配，否则会被控制器拒绝 */
  metadata: Metadata
  /** Pod 的规格定义，描述容器的实际运行期望 */
  spec: PodSpec
}

/**
 * Deployment 规格信息
 */
export interface DeploymentSpec {
  /** 期望副本数，默认为 1 */
  replicas: number
  /** Pod 标签选择器，须匹配 Pod 模板的标签 */
  selector: LabelSelector
  /** 用于替换旧 Pod 的更新策略 */
  strategy: DeploymentUpdateStrategy
  /** 新 Pod 就绪后被视为可用的最小秒数，默认为 0 */
  minReadySeconds: number
  /** 保留的旧 ReplicaSet 数量，用于回滚，默认为 10 */
  revisionHistoryLimit: number
  /** 是否暂停部署 */
  paused: boolean
  /** 部署进度超时时间，超过则视为失败，默认为 600 */
  progressDeadlineSeconds: number
  /** 将要创建的 Pod 模板，其标签须匹配上方 selector 的标签选择器 */
  template: PodTemplateSpec
}

/**
 * Deployment 状态条件
 */
export interface DeploymentCondition {
  /** 条件类型（Available / Progressing / ReplicaFailure） */
  type: DeploymentConditionType
  /** 条件状态，取值为 'True' / 'False' / 'Unknown' 之一 */
  status: string
  /** 该条件最后一次更新的时间 */
  lastUpdateTime: string
  /** 条件状态上一次发生切换的时间 */
  lastTransitionTime: string
  /** 条件最后一次切换的原因 */
  reason: string
  /** 描述切换细节的可读消息 */
  message: string
}

/**
 * Deployment 状态信息
 */
export interface DeploymentStatusObj {
  /** Deployment 控制器已观测到的 generation 代次 */
  observedGeneration: number
  /** 匹配选择器且未终止的 Pod 总数 */
  replicas: number
  /** 匹配选择器、且已应用期望模板 spec 的 Pod 总数 */
  updatedReplicas: number
  /** 匹配选择器、且处于 Ready 状态的 Pod 总数 */
  readyReplicas: number
  /** 匹配选择器、且至少就绪 minReadySeconds 的可用 Pod 总数 */
  availableReplicas: number
  /** 不可用 Pod 总数，即尚未达到 100% 可用容量所需的 Pod；包括运行中但尚未就绪、或尚未创建的 Pod */
  unavailableReplicas: number
  /** 匹配选择器且正在终止的 Pod 总数；此类 Pod 具有非空的 deletionTimestamp 且尚未进入 Failed/Succeeded 阶段；需启用 DeploymentReplicaSetTerminatingReplicas featureGate，默认开启 */
  terminatingReplicas: number
  /** Deployment 当前状态的最新观测条件列表 */
  conditions: DeploymentCondition[]
  /** Deployment 的哈希冲突计数；控制器在为新 ReplicaSet 生成名称时用作冲突避免机制 */
  collisionCount: number
}

// ==================== 4. StatefulSet 原始类型 ====================

/**
 * StatefulSet 持久卷声明模板
 * 为每个 Pod 按序创建独立的 PVC，实现稳定持久存储
 */
export interface StatefulSetVolumeClaimTemplate {
  /** 模板名称，作为 Pod 内 volumeMount 的引用标识 */
  name: string
  /** 存储类名称，为空时使用集群默认 StorageClass */
  storageClass?: string
  /** PVC 访问模式，如 ReadWriteOnce / ReadWriteMany */
  accessModes: string[]
  /** 存储容量，如 10Gi */
  capacity: Quantity
  /** 挂载目录的文件权限位，如 0644 */
  mode?: number
}

/**
 * StatefulSet 更新策略
 */
export interface StatefulSetUpdateStrategy {
  /** 策略类型，来自 `/src/config/kubernetes/workload/statefulset.ts` */
  type: StatefulSetUpdateStrategyType
  /** 滚动更新属性 */
  rollingUpdate: Record<string, string>
}

/**
 * StatefulSet 规格信息
 */
export interface StatefulSetSpec {
  /** 期望副本数，默认为 1 */
  replicas: number
  /** 关联的无头 Service 名称，StatefulSet 为每个 Pod 生成稳定的网络标识 `<pod>-<sts>.<service>.<ns>.svc` */
  serviceName: string
  /** Pod 标签选择器，须匹配 Pod 模板的标签 */
  selector: LabelSelector
  /** Pod 管理策略，来自 `/src/config/kubernetes/workload/statefulset.ts` */
  podManagementPolicy: PodManagementPolicyType
  /** 用于替换旧 Pod 的更新策略 */
  updateStrategy: StatefulSetUpdateStrategy
  /** 新 Pod 就绪后被视为可用的最小秒数，默认为 0 */
  minReadySeconds: number
  /** 保留的旧 ControllerRevision 数量，用于回滚，默认为 10 */
  revisionHistoryLimit: number
  /** 将要创建的 Pod 模板，其标签须匹配上方 selector 的标签选择器 */
  template: PodTemplateSpec
  /** 持久卷声明模板，StatefulSet 为每个 Pod 按序创建独立的 PVC 实现稳定持久存储 */
  volumeClaimTemplates: StatefulSetVolumeClaimTemplate[]
}

/**
 * StatefulSet 状态条件
 */
export interface StatefulSetCondition {
  /** 条件类型（Available / Progressing / ReplicaFailure），来自 `/src/config/kubernetes/workload/statefulset.ts` */
  type: StatefulSetConditionType
  /** 条件状态，取值为 'True' / 'False' / 'Unknown' 之一 */
  status: string
  /** 该条件最后一次更新的时间 */
  lastUpdateTime: string
  /** 条件状态上一次发生切换的时间 */
  lastTransitionTime: string
  /** 条件最后一次切换的原因 */
  reason: string
  /** 描述切换细节的可读消息 */
  message: string
}

/**
 * StatefulSet 状态信息
 */
export interface StatefulSetStatusObj {
  /** StatefulSet 控制器已观测到的 generation 代次 */
  observedGeneration: number
  /** 匹配选择器且未终止的 Pod 总数 */
  replicas: number
  /** 匹配选择器、且处于 Ready 状态的 Pod 总数 */
  readyReplicas: number
  /** 当前版本（currentRevision）下已就绪且匹配模板的 Pod 总数 */
  currentReplicas: number
  /** 匹配选择器、且已应用期望模板 spec 的 Pod 总数 */
  updatedReplicas: number
  /** 当前正在使用的 ControllerRevision 名称 */
  currentRevision: string
  /** 更新目标 ControllerRevision 名称 */
  updateRevision: string
  /** StatefulSet 的哈希冲突计数；控制器在为新 ControllerRevision 生成名称时用作冲突避免机制 */
  collisionCount: number
  /** StatefulSet 当前状态的最新观测条件列表 */
  conditions: StatefulSetCondition[]
}

// ==================== 5. DaemonSet 原始类型 ====================

/**
 * DaemonSet 更新策略
 */
export interface DaemonSetUpdateStrategy {
  /** 策略类型，来自 `/src/config/kubernetes/workload/daemonset.ts` */
  type: DaemonSetUpdateStrategyType
  /** 滚动更新属性 */
  rollingUpdate: Record<string, string>
}

/**
 * DaemonSet 规格信息
 */
export interface DaemonSetSpec {
  /** Pod 标签选择器，须匹配 Pod 模板的标签；DaemonSet 不支持独立 selector，其值为只读派生 */
  selector: LabelSelector
  /** 新 Pod 就绪后被视为可用的最小秒数，默认为 0 */
  minReadySeconds: number
  /** 用于替换旧 Pod 的更新策略 */
  updateStrategy: DaemonSetUpdateStrategy
  /** 将要创建的 Pod 模板，其标签须匹配上方 selector 的标签选择器 */
  template: PodTemplateSpec
}

/**
 * DaemonSet 状态条件
 */
export interface DaemonSetCondition {
  /** 条件类型（Available / Progressing / ReplicaFailure / Misconfigured），来自 `/src/config/kubernetes/workload/daemonset.ts` */
  type: DaemonSetConditionType
  /** 条件状态，取值为 'True' / 'False' / 'Unknown' 之一 */
  status: string
  /** 该条件最后一次更新的时间 */
  lastUpdateTime: string
  /** 条件状态上一次发生切换的时间 */
  lastTransitionTime: string
  /** 条件最后一次切换的原因 */
  reason: string
  /** 描述切换细节的可读消息 */
  message: string
}

/**
 * DaemonSet 状态信息
 */
export interface DaemonSetStatusObj {
  /** DaemonSet 控制器已观测到的 generation 代次 */
  observedGeneration: number
  /** 应当在节点上调度的目标 Pod 总数 */
  desiredNumberScheduled: number
  /** 当前已调度（含运行中）的 Pod 总数 */
  currentNumberScheduled: number
  /** 处于 Ready 状态的 Pod 总数 */
  numberReady: number
  /** 至少就绪 minReadySeconds 的可用 Pod 总数 */
  numberAvailable: number
  /** 不可用 Pod 总数 */
  numberUnavailable: number
  /** 已应用期望模板 spec 的 Pod 总数 */
  updatedNumberScheduled: number
  /** DaemonSet 的哈希冲突计数；控制器在为新 ControllerRevision 生成名称时用作冲突避免机制 */
  collisionCount: number
  /** DaemonSet 当前状态的最新观测条件列表 */
  conditions: DaemonSetCondition[]
}

// ==================== 6. Job 原始类型 ====================

/**
 * Job 规格信息
 */
export interface JobSpec {
  /** 并行运行的最大 Pod 数量，默认为 1；Job 运行时可调整 */
  parallelism: number
  /** 需要成功完成的 Pod 数量，默认为 1 */
  completions: number
  /** 失败重试次数上限，超过后 Job 标记为 Failed，默认为 6 */
  backoffLimit: number
  /** Job 在节点上可存活的最长秒数，超时则标记失败并终止所有 Pod */
  activeDeadlineSeconds: number
  /** Job 完成后保留的秒数，超时由控制器清理；为空则永久保留；需启用 TTLAfterFinished featureGate */
  ttlSecondsAfterFinished: number
  /** 是否暂停 Job；暂停时控制器不再创建新 Pod，已存在 Pod 不强制删除 */
  suspend: boolean
  /** 将要创建的 Pod 模板；其标签作为 Job 的自动选择器，不可与已有 Job 冲突 */
  template: PodTemplateSpec
}

/**
 * Job 状态条件
 */
export interface JobCondition {
  /** 条件类型（Complete / Failed / Suspended / FailureTarget / SuccessCriteriaMet），来自 `/src/config/kubernetes/workload/job.ts` */
  type: JobConditionType
  /** 条件状态，取值为 'True' / 'False' / 'Unknown' 之一 */
  status: string
  /** 该条件最后一次更新的时间 */
  lastUpdateTime: string
  /** 条件状态上一次发生切换的时间 */
  lastTransitionTime: string
  /** 条件最后一次切换的原因 */
  reason: string
  /** 描述切换细节的可读消息 */
  message: string
}

/**
 * Job 状态信息
 */
export interface JobStatusObj {
  /** 当前处于运行状态（非成功/失败）的 Pod 总数 */
  active: number
  /** 已成功完成的 Pod 总数 */
  succeeded: number
  /** 已失败终止的 Pod 总数 */
  failed: number
  /** Job 首次被控制器接管的开始时间 */
  startTime: string
  /** Job 完成（成功或失败）的时间 */
  completionTime: string
  /** Job 当前状态的最新观测条件列表 */
  conditions: JobCondition[]
}

/**
 * Job 模板
 */
export interface JobTemplateSpec {
  /** Job 模板的元数据，包括 labels 与 annotations */
  metadata: Metadata
  /** Job 的规格定义 */
  spec: JobSpec
}

// ==================== 7. CronJob 原始类型 ====================

/**
 * CronJob 规格信息
 */
export interface CronJobSpec {
  /** Cron 调度表达式，如 '0 5 * * *' 表示每天 5 点执行一次 */
  schedule: string
  /** 并发策略，来自 `/src/config/kubernetes/workload/cronjob.ts` */
  concurrencyPolicy: ConcurrencyPolicy
  /** 调度错过后的最晚启动宽限秒数；超过则不再补执行并标记 MissSchedule */
  startingDeadlineSeconds?: number
  /** 是否暂停 CronJob；暂停后不再创建新 Job，已运行 Job 不受影响 */
  suspend: boolean
  /** 保留的成功 Job 历史数量上限，默认为 3 */
  successfulJobsHistoryLimit: number
  /** 保留的失败 Job 历史数量上限，默认为 1 */
  failedJobsHistoryLimit: number
  /** 每次触发所创建的 Job 模板 */
  jobTemplate: JobTemplateSpec
}

/**
 * CronJob 状态条件
 */
export interface CronJobCondition {
  /** 条件类型（Complete / Failed / Suspended），来自 `/src/config/kubernetes/workload/cronjob.ts` */
  type: CronJobConditionType
  /** 条件状态，取值为 'True' / 'False' / 'Unknown' 之一 */
  status: string
  /** 该条件最后一次更新的时间 */
  lastUpdateTime: string
  /** 条件状态上一次发生切换的时间 */
  lastTransitionTime: string
  /** 条件最后一次切换的原因 */
  reason: string
  /** 描述切换细节的可读消息 */
  message: string
}

/**
 * CronJob 状态信息
 */
export interface CronJobStatusObj {
  /** 当前正在运行的 Job 总数 */
  active: number
  /** 最近一次成功触发 Job 的时间 */
  lastScheduleTime: string
  /** 最近一次成功完成 Job 的时间 */
  lastSuccessfulTime: string
  /** CronJob 当前状态的最新观测条件列表 */
  conditions: CronJobCondition[]
}
