/**
 * Deployment 资源相关类型定义
 * @module types/kubernetes/workload/deployment
 */
import type { PageForm } from '@/types/common'
import type { IngressListVo } from '@/types/kubernetes/network/ingress'
import type { ServiceListVo } from '@/types/kubernetes/network/service'
import type { PodListVo } from '@/types/kubernetes/pod'
import type { Condition, ContainerResource, Event, Metadata, Namespaced } from '../types'
import type { HistoryRevision, NodeAffinity, PodAffinity, PodAntiAffinity, RestartPolicy, Toleration } from './types'

/**
 * Deployment 状态枚举
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
export type DeploymentStatus = 'Running' | 'Available' | 'Stopped' | 'Creating' | 'Updating' | 'Terminating' | 'CreateTimeout' | 'UpdateTimeout' | 'Failed' | 'Unknown'

/**
 * Deployment 条件类型枚举
 * - Available: Deployment 至少有一个可用副本
 * - Progressing: Deployment 正在处理中
 * - ReplicaFailure: Deployment 副本创建失败
 */
export type DeploymentConditionType = 'Available' | 'Progressing' | 'ReplicaFailure'

/**
 * Deployment 策略枚举
 * - RollingUpdate: 滚动更新策略（逐步替换旧版本 Pod）
 * - Recreate: 重建策略（先删除旧 Pod，再创建新 Pod）
 */
export type DeploymentStrategyType = 'RollingUpdate' | 'Recreate'

// ==================== 1. 查询表单 ====================

/**
 * Deployment 查询请求参数
 * @extends PageForm 继承分页请求（含 page, pageSize）
 */
export interface DeploymentQueryForm extends PageForm {
  /** Deployment ID */
  id: string
  /** Deployment 名称（模糊匹配） */
  name: string
  /** 命名空间名称 */
  namespace: string
  /** Deployment 状态 */
  status: string
}

// ==================== 2. 列表对象 ====================

/**
 * Deployment 列表对象响应数据
 * @extends Namespaced 继承命名空间类型（含 clusterId, clusterName, namespace 等）
 */
export interface DeploymentListVo extends Namespaced {
  /** 资源 UID */
  uid: string
  /** Deployment 名称 */
  name: string
  /** 描述信息 */
  description?: string
  /** 状态 */
  status: DeploymentStatus
  /** 状态描述信息（如异常原因） */
  statusMessage?: string
  /** 期望副本数 */
  replicas: number
  /** 就绪副本数 */
  readyReplicas: number
  /** 更新策略 */
  strategyType: DeploymentStrategyType
  /** 是否可删除 */
  deletable?: boolean
}

// ==================== 3. 详情对象 ====================

/**
 * Deployment 详情响应数据
 * 组合多个子对象，提供完整详情信息
 */
export interface DeploymentDetailVo {
  /** 基础信息 */
  basic: DeploymentBasicVo
  /** 副本信息 */
  replicas: DeploymentReplicasVo
  /** 元数据信息 */
  metadata: DeploymentMetadataVo
  /** 资源信息 */
  resource: DeploymentResourceVo
  /** 条件列表 */
  conditions: DeploymentConditionVo[]
  /** 更新策略 */
  strategy: DeploymentStrategyVo
}

/**
 * Deployment 基础信息响应
 * 用于下拉选择、关联引用等场景，仅返回核心标识字段
 * @extends Namespaced 继承命名空间类型（含 clusterId, clusterName, namespace 等）
 */
export interface DeploymentBasicVo extends Namespaced {
  /** 资源 UID */
  uid: string
  /** Deployment 名称 */
  name: string
  /** 描述信息 */
  description: string
  /** 状态 */
  status: DeploymentStatus
  /** 状态描述信息 */
  statusMsg: string
  /** 是否可删除 */
  deletation: string
  /** 版本计数 */
  generation: number
  /** 标签选择器 */
  selector: Record<string, string>
}

/**
 * Deployment 副本信息响应
 */
export interface DeploymentReplicasVo {
  /** 期望副本数 */
  replicas: number
  /** 就绪副本数 */
  readyReplicas: number
  /** 就绪副本数 */
  readyReplicas: number
  /** 已更新副本数 */
  updatedReplicas: number
}

/**
 * Deployment 元数据响应
 * @extends Metadata 继承元数据类型（含 labels, annotations）
 */
export interface DeploymentMetadataVo extends Metadata {}

/**
 * Deployment 资源信息响应
 * @extends ContainerResource 继承容器资源类型（含 request, limit）
 */
export interface DeploymentResourceVo extends ContainerResource {}

/**
 * Deployment 条件响应
 * @extends Condition 继承条件类型
 */
export interface DeploymentConditionVo extends Condition<DeploymentConditionType> {}

/**
 * Deployment 更新策略响应
 */
export interface DeploymentStrategyVo {
  /** 策略类型 */
  type: DeploymentStrategyType
  /** 最大不可用副本数 */
  maxUnavailable: string
  /** 最大超出副本数 */
  maxSurge: string
}

// ==================== 4. 其他响应对象 ====================

/**
 * Deployment Pod 列表响应
 * @extends PodListVo 继承 Pod 列表响应类型
 */
export interface DeploymentPodListVo extends PodListVo {}

/**
 * Deployment 调度策略响应
 * 包含节点选择器、亲和性规则和容忍度配置
 */
export interface DeploymentScheduleVo {
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
 * Deployment 历史版本响应
 * @extends HistoryRevision 继承历史版本类型
 */
export interface DeploymentHistoryRevisionVo extends HistoryRevision {}

/**
 * Deployment 网络资源响应
 * 包含关联的 Service 和 Ingress 列表
 */
export interface DeploymentNetworkVo {
  /** 关联的 Service 列表 */
  services: ServiceListVo[]
  /** 关联的 Ingress 列表 */
  ingresses: IngressListVo[]
}

/**
 * Deployment 容器挂载配置
 */
export interface DeploymentContainerMount {
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
 * Deployment 存储列表响应
 */
export interface DeploymentStorageListVo {
  /** 存储名称 */
  name: string
  /** 存储类型 */
  type: string
  /** 额外字段 */
  extraFields: Record<string, string>
  /** 容器挂载列表 */
  containerMounts: DeploymentContainerMount[]
}

/**
 * Deployment 事件列表响应
 * @extends Event 继承事件类型
 */
export interface DeploymentEventVo extends Event {}

/**
 * Deployment 监控响应数据
 * TODO: 待补充监控相关属性（如 CPU、内存使用率等）
 */
export interface DeploymentMonitorVo {}

/**
 * Deployment 高级配置信息
 */
export interface DeploymentAdvancedVo {
  /**
   * 重启策略
   * @remarks
   * 针对 Deployment 必须为 Always，且不可编辑
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
 * Deployment 创建请求参数
 */
export interface DeploymentCreateForm {
  /** Deployment 名称 */
  name: string
  /** 命名空间名称 */
  namespace: string
  /** 副本数 */
  replicas?: number
  /** 更新策略 */
  strategy?: DeploymentStrategyType
  /** 标签选择器 */
  selector?: Record<string, string>
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
}

// ==================== 6. 编辑表单 ====================

/**
 * Deployment 编辑请求参数
 */
export interface DeploymentUpdateForm {
  /** Deployment 名称 */
  name: string
  /** 命名空间名称 */
  namespace: string
  /** 副本数 */
  replicas?: number
  /** 更新策略 */
  strategy?: DeploymentStrategyType
  /** 标签选择器 */
  selector?: Record<string, string>
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
}

// ==================== 7. 标签表单 ====================

/**
 * Deployment 标签更新请求
 */
export interface DeploymentLabelForm {
  /** 标签键值对 */
  labels: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}

// ==================== 8. 注解表单 ====================

/**
 * Deployment 注解更新请求
 */
export interface DeploymentAnnotationForm {
  /** 注解键值对 */
  annotations: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}

// ==================== 9. 其他表单对象（尾部） ====================

/**
 * Deployment 扩缩容请求
 */
export interface DeploymentScaleForm {
  /** 期望副本数 */
  replicas: number
}

/**
 * Deployment YAML 导入请求
 * 通过 YAML 格式导入 Deployment 配置
 */
export interface DeploymentYamlForm {
  /** YAML 配置内容 */
  yaml: string
}
