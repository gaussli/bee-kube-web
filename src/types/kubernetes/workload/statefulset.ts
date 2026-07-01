/**
 * StatefulSet 资源相关类型定义
 * @module types/kubernetes/workload/statefulset
 */
import type { PageForm } from '@/types/common'
import type { IngressListVo } from '@/types/kubernetes/network/ingress'
import type { ServiceListVo } from '@/types/kubernetes/network/service'
import type { PodListVo } from '@/types/kubernetes/pod'
import type { Condition, ContainerResource, Event, Metadata, Namespaced } from '../types'
import type { HistoryRevision, NodeAffinity, PodAffinity, PodAntiAffinity, RestartPolicy, Toleration } from './types'

/**
 * StatefulSet 状态枚举
 * @remarks
 * - Running: 运行中（所有 Pod 正常运行）
 * - Available: 部分就绪（至少一个副本可用，但未全部就绪）
 * - Stopped: 已停止（副本数缩容为 0）
 * - Creating: 创建中（正在创建 Pod）
 * - Updating: 更新中（正在执行滚动更新）
 * - Terminating: 终止中（正在删除）
 * - CreateTimeout: 创建超时（Pod 创建超时）
 * - UpdateTimeout: 更新超时（更新过程超时）
 * - Failed: 失败异常（创建或更新过程出现错误）
 * - Unknown: 未知状态
 */
export type StatefulSetStatus = 'Running' | 'Available' | 'Stopped' | 'Creating' | 'Updating' | 'Terminating' | 'CreateTimeout' | 'UpdateTimeout' | 'Failed' | 'Unknown'

/**
 * StatefulSet 条件类型枚举
 * - Available: StatefulSet 至少有一个可用副本
 * - Progressing: StatefulSet 正在处理中
 * - ReplicaFailure: StatefulSet 副本创建失败
 */
export type StatefulSetConditionType = 'Available' | 'Progressing' | 'ReplicaFailure'

/**
 * StatefulSet 更新策略枚举
 * - RollingUpdate: 滚动更新策略（按序逐个更新 Pod）
 * - OnDelete: 手动删除策略（仅当 Pod 被手动删除时才重建）
 */
export type StatefulSetStrategyType = 'RollingUpdate' | 'OnDelete'

/**
 * StatefulSet Pod 管理策略枚举
 * - OrderedReady: 按序就绪（按序号逐个启动和更新 Pod）
 * - Parallel: 并行管理（所有 Pod 并行启动和更新）
 */
export type PodManagementPolicyType = 'OrderedReady' | 'Parallel'

// ==================== 1. 查询表单 ====================

/**
 * StatefulSet 查询请求参数
 * @extends PageForm 继承分页请求（含 page, pageSize）
 */
export interface StatefulSetQueryForm extends PageForm {
  /** StatefulSet ID */
  id: string
  /** StatefulSet 名称（模糊匹配） */
  name: string
  /** 命名空间名称 */
  namespace: string
  /** StatefulSet 状态 */
  status: string
}

// ==================== 2. 列表对象 ====================

/**
 * StatefulSet 列表对象响应数据
 * @extends Namespaced 继承命名空间类型（含 clusterId, clusterName, namespace 等）
 */
export interface StatefulSetListVo extends Namespaced {
  /** 资源 UID */
  uid: string
  /** StatefulSet 名称 */
  name: string
  /** 描述信息 */
  description?: string
  /** 状态 */
  status: StatefulSetStatus
  /** 状态描述信息（如异常原因） */
  statusMessage?: string
  /** 期望副本数 */
  replicas: number
  /** 就绪副本数 */
  readyReplicas: number
  /** 关联的服务名 */
  serviceName: string
  /** 更新策略 */
  strategyType: StatefulSetStrategyType
  /** Pod 管理策略 */
  podManagementPolicy: PodManagementPolicyType
  /** 是否可删除 */
  deletable?: boolean
}

// ==================== 3. 详情对象 ====================

/**
 * StatefulSet 详情响应数据
 * 组合多个子对象，提供完整详情信息
 */
export interface StatefulSetDetailVo {
  /** 基础信息 */
  basic: StatefulSetBasicVo
  /** 副本信息 */
  replicas: StatefulSetReplicasVo
  /** 元数据信息 */
  metadata: StatefulSetMetadataVo
  /** 资源信息 */
  resource: StatefulSetResourceVo
  /** 条件列表 */
  conditions: StatefulSetConditionVo[]
  /** 更新策略 */
  strategy: StatefulSetStrategyVo
  /** 高级配置 */
  advanced: StatefulSetAdvancedVo
}

/**
 * StatefulSet 基础信息响应
 * 用于下拉选择、关联引用等场景，仅返回核心标识字段
 * @extends Namespaced 继承命名空间类型（含 clusterId, clusterName, namespace 等）
 */
export interface StatefulSetBasicVo extends Namespaced {
  /** 资源 UID */
  uid: string
  /** StatefulSet 名称 */
  name: string
  /** 描述信息 */
  description: string
  /** 状态 */
  status: StatefulSetStatus
  /** 状态描述信息 */
  statusMsg: string
  /** 是否可删除 */
  deletation: string
  /** 版本计数 */
  generation: number
  /** 标签选择器 */
  selector: Record<string, string>
  /** 关联的服务名 */
  serviceName: string
  /** 当前版本号 */
  currentRevision: string
  /** 更新版本号 */
  updateRevision: string
}

/**
 * StatefulSet 副本信息响应
 */
export interface StatefulSetReplicasVo {
  /** 期望副本数 */
  replicas: number
  /** 就绪副本数 */
  readyReplicas: number
  /** 可用副本数 */
  availableReplicas: number
  /** 已更新副本数 */
  updatedReplicas: number
}

/**
 * StatefulSet 元数据响应
 * @extends Metadata 继承元数据类型（含 labels, annotations）
 */
export interface StatefulSetMetadataVo extends Metadata {}

/**
 * StatefulSet 资源信息响应
 * @extends ContainerResource 继承容器资源类型（含 request, limit）
 */
export interface StatefulSetResourceVo extends ContainerResource {}

/**
 * StatefulSet 条件响应
 * @extends Condition 继承条件类型
 */
export interface StatefulSetConditionVo extends Condition<StatefulSetConditionType> {}

/**
 * StatefulSet 更新策略响应
 */
export interface StatefulSetStrategyVo {
  /** 策略类型 */
  type: StatefulSetStrategyType
  /** 分区序号（仅 RollingUpdate 策略生效，用于金丝雀发布） */
  partition: number
  /** Pod 管理策略 */
  podManagementPolicy: PodManagementPolicyType
}

/**
 * StatefulSet Pod 列表响应
 * @extends PodListVo 继承 Pod 列表响应类型
 */
export interface StatefulSetPodListVo extends PodListVo {}

/**
 * StatefulSet 调度策略响应
 * 包含节点选择器、亲和性规则和容忍度配置
 */
export interface StatefulSetScheduleVo {
  /** 节点选择器（通过节点标签筛选调度目标节点） */
  nodeSelector: Record<string, string>
  /** 亲和性规则 */
  affinity: {
    /** 节点亲和性 */
    nodeAffinity: NodeAffinity
    /** Pod 亲和性 */
    podAffinity: PodAffinity
    /** Pod 反亲和性 */
    podAntiAffinity: PodAntiAffinity
  }
  /** 容忍度配置列表 */
  tolerations: Toleration[]
}

/**
 * StatefulSet 历史版本响应
 * @extends HistoryRevision 继承历史版本类型
 */
export interface StatefulSetHistoryRevisionListVo extends HistoryRevision {}

/**
 * StatefulSet 网络资源响应
 * 包含关联的 Service 和 Ingress 列表
 */
export interface StatefulSetNetworkVo {
  /** 关联的 Service 列表 */
  services: ServiceListVo[]
  /** 关联的 Ingress 列表 */
  ingresses: IngressListVo[]
}

/**
 * StatefulSet 容器挂载配置
 */
export interface StatefulSetContainerMount {
  /** 容器 ID */
  containerId: string
  /** 容器名称 */
  container: string
  /** 挂载路径 */
  mountPath: string
  /** 子路径 */
  subPath: string
}

/**
 * StatefulSet 存储列表响应
 */
export interface StatefulSetStorageListVo {
  /** 存储名称 */
  name: string
  /** 存储类型 */
  type: string
  /** 额外字段 */
  extraFields: Record<string, string>
  /** 容器挂载列表 */
  containerMounts: StatefulSetContainerMount[]
}

/**
 * StatefulSet 事件列表响应
 * @extends Event 继承事件类型
 */
export interface StatefulSetEventListVo extends Event {}

/**
 * StatefulSet 监控响应数据
 * TODO: 待补充监控相关属性（如 CPU、内存使用率等）
 */
export interface StatefulSetMonitorVo {}

/**
 * StatefulSet 高级配置信息
 */
export interface StatefulSetAdvancedVo {
  /**
   * 重启策略
   * @remarks
   * 针对 StatefulSet 必须为 Always，且不可编辑
   */
  restartPolicy: RestartPolicy
  /** Pod 优雅退出时间（秒，默认 30） */
  terminationGracePeriodSeconds: number
  /** 使用主机网络 */
  hostNetwork: boolean
  /** DNS 策略 */
  dnsPolicy: string
  /** 服务账户名称 */
  serviceAccountName: string
  /** 自动挂载服务账户令牌 */
  automountServiceAccountToken: boolean
  /** 主机名 */
  hostname: string
  /** 子域名 */
  subdomain: string
  /** 镜像拉取密钥列表 */
  imagePullSecrets: string[]
  /** 优先级类 */
  priorityClass: string
}

// ==================== 5. 创建表单 ====================

/**
 * StatefulSet 创建请求参数
 */
export interface StatefulSetCreateForm {
  /** StatefulSet 名称 */
  name: string
  /** 命名空间名称 */
  namespace: string
  /** 副本数 */
  replicas: number
  /** 关联的服务名 */
  serviceName: string
  /** 更新策略 */
  strategyType: StatefulSetStrategyType
  /** Pod 管理策略 */
  podManagementPolicy: PodManagementPolicyType
  /** 标签选择器 */
  selector: Record<string, string>
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
}

// ==================== 6. 编辑表单 ====================

/**
 * StatefulSet 编辑请求参数
 */
export interface StatefulSetUpdateForm {
  /** StatefulSet 名称 */
  name: string
  /** 命名空间名称 */
  namespace: string
  /** 副本数 */
  replicas?: number
  /** 关联的服务名 */
  serviceName?: string
  /** 更新策略 */
  strategyType?: StatefulSetStrategyType
  /** Pod 管理策略 */
  podManagementPolicy?: PodManagementPolicyType
  /** 标签选择器 */
  selector?: Record<string, string>
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
}

// ==================== 7. 标签表单 ====================

/**
 * StatefulSet 标签更新请求
 */
export interface StatefulSetLabelForm {
  /** 标签键值对 */
  labels: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}

// ==================== 8. 注解表单 ====================

/**
 * StatefulSet 注解更新请求
 */
export interface StatefulSetAnnotationForm {
  /** 注解键值对 */
  annotations: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}

// ==================== 9. 其他表单对象（尾部） ====================

/**
 * StatefulSet 扩缩容请求
 */
export interface StatefulSetScaleForm {
  /** 期望副本数 */
  replicas: number
}

/**
 * StatefulSet YAML 导入请求
 * 通过 YAML 格式导入 StatefulSet 配置
 */
export interface StatefulSetYamlForm {
  /** YAML 配置内容 */
  yaml: string
}
