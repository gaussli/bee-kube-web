/**
 * Kubernetes 工作负载（Workload）通用类型定义
 * 包含重启策略、容忍度、标签选择器、亲和性、历史版本等调度相关数据结构
 * @module types/kubernetes/workload/types
 */

// ==================== 1. 基础枚举 ====================

/**
 * 工作负载重启策略枚举
 * @remarks
 * - Always: 始终重启（适用于 Deployment、StatefulSet 等长运行服务）
 * - OnFailure: 失败时重启（适用于 Job 等一次性任务）
 * - Never: 从不重启（适用于 CronJob 产生的 Pod）
 */
export type RestartPolicy = 'Always' | 'OnFailure' | 'Never'

// ==================== 2. 容忍度 ====================

/**
 * 容忍度运算符枚举
 * @remarks
 * - Equal: 精确匹配（key、value、effect 三者同时相等才满足）
 * - Exists: 存在性匹配（仅 key 和 effect 匹配，value 可省略）
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
  /** 污点值（operator 为 Equal 时生效） */
  value: string
  /** 容忍效果（须与节点 Taint 的 effect 完全一致） */
  effect: TolerationEffect
  /** 容忍宽限期（秒），仅 effect 为 NoExecute 时生效；不填表示无限容忍 */
  tolerationSeconds: number
}

// ==================== 3. 标签选择器 ====================

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

// ==================== 4. 节点选择器 ====================

/**
 * 节点选择器运算符枚举
 * @remarks
 * - In: 值在给定列表中
 * - NotIn: 值不在给定列表中
 * - Exists: 标签存在（无需 values）
 * - DoesNotExist: 标签不存在（无需 values）
 * - Gt: 大于（仅对数字值有效）
 * - Lt: 小于（仅对数字值有效）
 */
export type NodeExpressionOperator = 'In' | 'NotIn' | 'Exists' | 'DoesNotExist' | 'Gt' | 'Lt'

/**
 * 节点选择器表达式
 * 定义单个节点标签匹配条件
 */
export interface NodeExpression {
  /** 节点标签键 */
  key: string
  /** 匹配运算符 */
  operator: NodeExpressionOperator
  /** 匹配值列表（operator 为 Exists / DoesNotExist 时不生效） */
  values: string[]
}

// ==================== 5. 节点亲和性 ====================

/**
 * 节点亲和性匹配条件
 * 定义单个调度硬/软规则的匹配项
 */
export interface NodeAffinityTerm {
  /** 节点标签匹配表达式列表 */
  matchExpressions: NodeExpression[]
}

/**
 * 带权重的节点亲和性匹配条件
 * 用于软亲和性规则，权重 1~100，值越大优先级越高
 */
export interface WeightedNodeAffinityTerm extends NodeAffinityTerm {
  /** 权重（1~100） */
  weight: number
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

// ==================== 6. Pod 亲和性 ====================

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
 * 用于软亲和性规则，权重 1~100
 * @extends PodAffinityTerm 继承 Pod 亲和性条件的所有属性
 */
export interface WeightedPodAffinityTerm extends PodAffinityTerm {
  /** 权重（1~100） */
  weight: number
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

// ==================== 7. 历史版本 ====================

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
