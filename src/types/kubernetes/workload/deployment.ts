/**
 * Deployment 资源相关类型定义
 * @module types/kubernetes/workload/deployment
 */
import type { AuditEntity, DeletableEntity, PageForm, UidEntity } from '@/types/common'
import type { IngressListVo } from '@/types/kubernetes/network/ingress'
import type { ServiceListVo } from '@/types/kubernetes/network/service'
import type { PodListVo } from '@/types/kubernetes/pod'

import type {
  DeploymentConditionType,
  DeploymentStatus,
  DeploymentStrategyType,
} from '@/config/kubernetes/workload/deployment'

import type { MetadataAnnotationForm, MetadataLabelForm } from '../comomn'
import type { Clustered, Condition, ContainerResource, Metadata, Namespaced } from '../types'

import type { HistoryRevision, NodeAffinity, PodAffinity, PodAntiAffinity, RestartPolicy, Toleration } from './types'

/**
 * Deployment 查询请求参数
 * @extends UidEntity 继承 UID 类型
 * @extends PageForm 继承分页请求
 */
export interface DeploymentQueryForm extends UidEntity, PageForm {
  /** Deployment 名称（模糊匹配） */
  name: string
  /** 命名空间名称 */
  namespace: string
  /** Deployment 状态 */
  status: string
}

/**
 * Deployment 列表对象响应数据
 * @extends UidEntity 继承 UID 类型
 * @extends Clustered 继承集群类型
 * @extends Namespaced 继承命名空间类型
 * @extends AuditEntity 继承基础实体类型
 * @extends DeletableEntity 继承可删除类型
 */
export interface DeploymentListVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
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
}

/**
 * Deployment 详情对象响应数据
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
  /** 高级配置 */
  advanced: DeploymentAdvancedVo
}

/**
 * Deployment 基础信息响应数据
 * @extends UidEntity 继承 UID 类型
 * @extends Clustered 继承集群类型
 * @extends Namespaced 继承命名空间类型
 * @extends AuditEntity 继承基础实体类型
 * @extends DeletableEntity 继承可删除类型
 */
export interface DeploymentBasicVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  /** Deployment 名称 */
  name: string
  /** 描述信息 */
  description?: string
  /** 状态 */
  status: DeploymentStatus
  /** 状态描述信息（如异常原因） */
  statusMsg?: string
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
  /** 可用副本数 */
  availableReplicas: number
  /** 已更新副本数 */
  updatedReplicas: number
}

/**
 * Deployment 元数据响应
 * @extends Metadata 继承元数据类型
 */
export interface DeploymentMetadataVo extends Metadata {}

/**
 * Deployment 资源信息响应
 * @extends ContainerResource 继承容器资源类型
 */
export interface DeploymentResourceVo extends ContainerResource {}

/**
 * Deployment 条件响应
 * @extends Condition 继承条件类型
 */
export interface DeploymentConditionVo extends Condition<DeploymentConditionType> {}

/**
 * Deployment 更新策略响应数据
 */
export interface DeploymentStrategyVo {
  /** 策略类型 */
  type: DeploymentStrategyType
  /** 最大不可用副本数 */
  maxUnavailable: string
  /** 最大超出副本数 */
  maxSurge: string
}

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

/**
 * Deployment Pod 查询请求参数
 * @extends PageForm 继承分页请求
 */
export interface DeploymentPodQueryForm extends PageForm {
  /** Pod 名称（模糊匹配） */
  name: string
  /** Pod 状态 */
  status: string
}

/**
 * Deployment Pod 列表响应数据
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
export interface DeploymentHistoryRevisionListVo extends HistoryRevision {}

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
  containerMounts: {
    /** 容器 ID */
    containerId: string
    /** 容器名称 */
    container: string
    /** 挂载路径 */
    mountPath: string
    /** 子路径 */
    subPath: string
  }[]
}

/**
 * Deployment 监控响应数据
 * TODO: 待补充监控相关属性（如 CPU、内存使用率等）
 */
export interface DeploymentMonitorVo {}

/**
 * Deployment 创建请求参数
 */
export interface DeploymentCreateForm {}

/**
 * Deployment 编辑请求参数
 */
export interface DeploymentUpdateForm {}

/**
 * Deployment 标签更新请求
 */
export interface DeploymentLabelForm extends MetadataLabelForm {}

/**
 * Deployment 注解更新请求
 */
export interface DeploymentAnnotationForm extends MetadataAnnotationForm {}

/**
 * Deployment 扩缩容请求
 */
export interface DeploymentScaleForm {}

/**
 * Deployment YAML 导入请求
 * 通过 YAML 格式导入 Deployment 配置
 */
export interface DeploymentYamlForm {}
