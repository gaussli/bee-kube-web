/**
 * Kubernetes 工作负载（Workload）通用类型定义
 * 包含重启策略、亲和性、容忍度等与工作负载调度相关的数据结构
 * @module types/kubernetes/workload/types
 */

/**
 * 工作负载重启策略枚举
 * @remarks
 * - Always: 始终重启（默认策略，适用于长运行服务，如 Deployment、StatefulSet）
 * - OnFailure: 失败时重启（适用于一次性任务，如 Job）
 * - Never: 从不重启（适用于不间断任务，如 CronJob 产生的 Pod）
 */
export type RestartPolicy = 'Always' | 'OnFailure' | 'Never'

/**
 * 容忍度运算符枚举
 * @remarks
 * - Equal: 精确匹配（需同时指定 value，要求 key、value、effect 三者同时相等才满足）
 * - Exists: 存在性匹配（仅需 key 和 effect 匹配，value 可省略）
 */
export type TolerationOperator = 'Equal' | 'Exists'

/**
 * 容忍度效果枚举
 * @remarks
 * - NoSchedule: 不允许调度（不具备对应容忍度的 Pod 不会被调度到该节点）
 * - PreferNoSchedule: 尽量不调度（不具备对应容忍度的 Pod 尽量避免调度到该节点）
 * - NoExecute: 不允许执行（不具备对应容忍度的已运行 Pod 将被驱逐）
 */
export type TolerationEffect = 'NoSchedule' | 'PreferNoSchedule' | 'NoExecute'

/**
 * 容忍度配置
 * 允许 Pod 调度到带有匹配污点（Taint）的节点上
 */
export interface Toleration {
  /** 污点键（与节点 Taint 的 key 匹配） */
  key: string
  /** 匹配运算符 */
  operator: TolerationOperator
  /** 污点值（当 operator 为 Equal 时生效） */
  value: string
  /** 容忍效果（须与节点 Taint 的 effect 完全一致才生效） */
  effect: TolerationEffect
  /** 容忍宽限期（秒），仅当 effect 为 NoExecute 时生效；不填表示无限容忍 */
  tolerationSeconds: number
}

/**
 * 亲和性运算符枚举
 * @remarks
 * - In: 值在给定列表中
 * - NotIn: 值不在给定列表中
 * - Exists: 标签存在（无需 values）
 * - DoesNotExist: 标签不存在（无需 values）
 * - Gt: 大于（仅对数字值有效）
 * - Lt: 小于（仅对数字值有效）
 */
export type AffinityOperator = 'In' | 'NotIn' | 'Exists' | 'DoesNotExist' | 'Gt' | 'Lt'

/**
 * 亲和性匹配选择器
 * 用于节点亲和性（NodeAffinity）和 Pod 亲和性（PodAffinity）的匹配表达式
 */
export interface AffinityMatchSelector {
  /** 匹配键（节点标签的 key 或 Pod 标签的 key） */
  key: string
  /** 匹配运算符 */
  operator: AffinityOperator
  /** 匹配值列表（operator 为 Exists / DoesNotExist 时不生效） */
  values: string[]
}

/**
 * 标签选择器
 * 用于通过标签组合筛选目标资源集合
 */
export interface LabelSelector {
  /** 基于等值匹配的标签（AND 关系） */
  matchLabels: Record<string, string>
  /** 基于表达式的匹配条件（AND 关系，与 matchLabels 也是 AND 关系） */
  matchExpressions: AffinityMatchSelector[]
}

/**
 * 节点亲和性匹配条件
 * 定义单个调度硬/软规则的匹配项
 */
export interface NodeAffinityTerm {
  /** 节点标签匹配表达式 */
  matchExpressions: AffinityMatchSelector[]
  /** 节点字段匹配表达式 */
  matchFields: AffinityMatchSelector[]
}

/**
 * 带权重的节点亲和性匹配条件
 * 用于软亲和性规则，权重范围 1~100，值越大优先级越高
 */
export interface WeightedNodeAffinityTerm {
  /** 权重（1~100） */
  weight: number
  /** 节点亲和性条件 */
  term: NodeAffinityTerm
}

/**
 * 节点亲和性配置
 * 控制 Pod 调度到特定节点的倾向性
 */
export interface NodeAffinity {
  /** 必须满足的硬性调度条件（如不满足则 Pod 无法调度） */
  required: NodeAffinityTerm[]
  /** 优先满足的软性调度条件（尽量满足，非强制） */
  preferred: WeightedNodeAffinityTerm[]
}

/**
 * Pod 亲和性/反亲和性调度条件
 * 定义 Pod 相对于其他 Pod 的亲和或排斥规则
 */
export interface PodAffinityTerm {
  /** 通过标签选择目标 Pod 集合 */
  labelSelector: LabelSelector
  /** 目标 Pod 所在命名空间列表（不填或空数组表示当前命名空间） */
  namespaces: string[]
  /** 通过命名空间标签选择目标命名空间 */
  namespaceSelector: LabelSelector
  /** 拓扑域键（如 kubernetes.io/hostname 表示节点级别，failure-domain.beta.kubernetes.io/zone 表示可用区级别） */
  topologyKey: string
  /** 需匹配的标签键列表 */
  matchLabelKeys: string[]
  /** 需排除匹配的标签键列表 */
  mismatchLabelKeys: string[]
}

/**
 * 带权重的 Pod 亲和性调度条件
 * 用于软亲和性规则，权重范围 1~100
 */
export interface WeightedPodAffinityTerm {
  /** 权重（1~100） */
  weight: number
  /** Pod 亲和性条件 */
  term: PodAffinityTerm
}

/**
 * Pod 亲和性配置
 * 使 Pod 倾向于与符合特定条件的 Pod 调度到同一拓扑域
 */
export interface PodAffinity {
  /** 必须满足的硬性亲和要求 */
  required: PodAffinityTerm[]
  /** 优先满足的软性亲和要求 */
  preferred: WeightedPodAffinityTerm[]
}

/**
 * Pod 反亲和性配置
 * 使 Pod 倾向于远离符合特定条件的 Pod，调度到不同拓扑域
 */
export interface PodAntiAffinity {
  /** 必须满足的硬性反亲和要求 */
  required: PodAffinityTerm[]
  /** 优先满足的软性反亲和要求 */
  preferred: WeightedPodAffinityTerm[]
}

/**
 * 历史版本
 */
export interface Revision {
  /** 修订版本号 */
  revision: number
  /** 变更原因 */
  changeCause: string
  /** 创建时间 */
  createAt: string
  /** 是否为当前活跃版本 */
  active: boolean
}
