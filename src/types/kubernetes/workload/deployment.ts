/**
 * Deployment 资源相关类型定义
 * @module types/kubernetes/workload/deployment
 *
 * @remarks
 * 类型分区及对象简述（按文档功能描述出现顺序排列）：
 *   1. 查看 Deployment 列表
 *      - DeploymentQueryForm：Deployment 查询条件请求对象
 *      - DeploymentListVo：Deployment 列表项响应对象
 *   2. 查看 Deployment 详情
 *      - DeploymentDetailVo：Deployment 详情响应对象
 *   3. 查看 Deployment YAML
 *      - DeploymentYamlVo：Deployment YAML 响应对象
 *   4. 查看 Deployment 关联 Pod 列表
 *      - DeploymentPodQueryForm：Deployment 关联 Pod 查询条件请求对象
 *      - DeploymentPodListVo：Deployment 关联 Pod 列表项响应对象
 *   5. 查看 Deployment 历史版本列表
 *      - DeploymentHistoryRevisionQueryForm：Deployment 历史版本查询条件请求对象
 *      - DeploymentHistoryRevisionListVo：Deployment 历史版本列表项响应对象
 *   6. 查看 Deployment 关联网络资源
 *      - DeploymentNetworkVo：Deployment 关联网络资源响应对象
 *      - DeploymentServiceListVo：Deployment 关联 Service 列表项响应对象
 *      - DeploymentIngressListVo：Deployment 关联 Ingress 列表项响应对象
 *   7. 查看 Deployment 监控数据
 *      - DeploymentMonitorVo：Deployment 监控响应对象
 *   8. 创建
 *      - DeploymentCreateForm：Deployment 创建请求对象
 *   9. 更新
 *      - DeploymentUpdateForm：Deployment 更新请求对象
 *   10. 扩缩容
 *      - DeploymentScaleForm：Deployment 扩缩容请求对象
 *   11. 回滚
 *      - DeploymentRollbackForm：Deployment 回滚请求对象
 */
import type { AuditEntity, DeletableEntity, PageForm, UidEntity } from '@/types/common'

import type { ServiceType } from '@/config/kubernetes/network/service'
import type { PodStatus } from '@/config/kubernetes/pod'
import type { DeploymentStatus, DeploymentUpdateStrategyType } from '@/config/kubernetes/workload/deployment'

import type { Clustered, Namespaced, ObjectMeta } from '../types'

import type { HistoryRevision, DeploymentStatusObj, DeploymentSpec } from './types'

/**
 * Deployment 查询条件请求对象
 * @extends UidEntity 继承 UID 类型
 * @extends PageForm 继承分页请求
 */
export interface DeploymentQueryForm extends UidEntity, PageForm {
  /** Deployment 名称 */
  name: string
  /** 命名空间名称 */
  namespace: string
  /** Deployment 状态 */
  status: DeploymentStatus
}

/**
 * Deployment 列表项响应对象
 * @extends UidEntity 继承 UID 类型
 * @extends Clustered 继承集群类型
 * @extends Namespaced 继承命名空间类型
 * @extends AuditEntity 继承审计实体类型
 * @extends DeletableEntity 继承可删除类型
 */
export interface DeploymentListVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  /** Deployment 名称 */
  name: string
  /** 描述 */
  description?: string
  /** 状态 */
  status: DeploymentStatus
  /** 状态信息 */
  statusMsg?: string
  /** 期望副本数 */
  replicas: number
  /** 就绪副本数 */
  readyReplicas: number
  /** 更新策略 */
  updateStrategyType: DeploymentUpdateStrategyType
}

/**
 * Deployment 详情响应对象
 * @extends UidEntity 继承 UID 类型
 * @extends Clustered 继承集群类型
 * @extends Namespaced 继承命名空间类型
 * @extends AuditEntity 继承审计实体类型
 * @extends DeletableEntity 继承可删除类型
 */
export interface DeploymentDetailVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  /** 描述信息 */
  description?: string
  /** 状态标签 */
  status: DeploymentStatus
  /** 状态信息 */
  statusMsg?: string
  /** Deployment 的资源元数据 */
  metadata: ObjectMeta
  /** Deployment 的规格定义 */
  spec: DeploymentSpec
  /** Deployment 的观测状态 */
  statusObj: DeploymentStatusObj
}

/**
 * Deployment YAML 响应对象
 */
export interface DeploymentYamlVo {
  /** Deployment 的完整 YAML 文本 */
  yaml: string
}

/**
 * Deployment 关联 Pod 查询条件请求对象
 * @extends UidEntity 继承 UID 类型
 * @extends PageForm 继承分页请求
 */
export interface DeploymentPodQueryForm extends UidEntity, PageForm {
  /** Pod 名称 */
  name: string
  /** Pod 状态 */
  status: PodStatus
}

/**
 * Deployment 关联 Pod 列表项响应对象
 * @extends UidEntity 继承 UID 类型
 * @extends AuditEntity 继承审计实体类型
 */
export interface DeploymentPodListVo extends UidEntity, AuditEntity {
  /** Pod 名称 */
  name: string
  /** Pod IP */
  ip: string
  /** Pod 状态 */
  status: PodStatus
  /** Pod 状态信息 */
  statusMsg: string
  /** Pod 重启次数 */
  restarts: number
  /** Pod 所属节点 IP */
  nodeIp: string
  /** Pod 所属节点名称 */
  nodeName: string
  /** Pod 就绪容器数量 */
  readyContainerCount: number
  /** Pod 容器总数 */
  containerCount: number
}

/**
 * Deployment 历史版本查询条件请求对象
 * @extends PageForm 继承分页请求
 */
export interface DeploymentHistoryRevisionQueryForm extends PageForm {
  /** 版本名称 */
  revision: number
  /** 变更原因 */
  changeCause: string
}

/**
 * Deployment 历史版本列表项响应对象
 * @extends HistoryRevision 继承历史版本结构
 */
export interface DeploymentHistoryRevisionListVo extends HistoryRevision {}

/**
 * Deployment 关联网络资源响应对象
 * 包含关联的 Service 和 Ingress 列表
 */
export interface DeploymentNetworkVo {
  /** 关联的 Service 列表 */
  services: DeploymentServiceListVo[]
  /** 关联的 Ingress 列表 */
  ingresses: DeploymentIngressListVo[]
}

/**
 * Deployment 关联 Service 列表项响应对象
 * @extends UidEntity 继承 UID 基础实体（含 uid）
 * @extends AuditEntity 继承审计基础实体（含 createBy / createAt 等）
 */
export interface DeploymentServiceListVo extends UidEntity, AuditEntity {
  /** Service 名称 */
  name: string
  /** Service 描述 */
  description: string
  /** Service 类型（来自 /src/config/kubernetes/network/service.ts） */
  type: ServiceType
  /** 集群内部 IP（ClusterIP / NodePort / LoadBalancer 类型自动分配） */
  clusterIp: string
  /** 外部域名（仅 ExternalName 类型生效） */
  externalName: string
  /** 是否为 Headless Service（clusterIp 为 None） */
  headless: boolean
}

/**
 * Deployment 关联 Ingress 列表项响应对象
 * @extends UidEntity 继承 UID 基础实体（含 uid）
 * @extends AuditEntity 继承审计基础实体（含 createBy / createAt 等）
 */
export interface DeploymentIngressListVo extends UidEntity, AuditEntity {
  /** Ingress 名称 */
  name: string
  /** Ingress 描述 */
  description: string
  /** Ingress 类名（对应 IngressClassName 资源名称） */
  ingressClassName?: string
}

/** Deployment 监控响应对象 */
export interface DeploymentMonitorVo {}

/** Deployment 创建请求对象 */
export interface DeploymentCreateForm {
  /** Deployment 描述 */
  description?: string
  /** Deployment 的资源元数据 */
  metadata: ObjectMeta
  /** Deployment 的规格定义 */
  spec: DeploymentSpec
}

/** Deployment 更新请求对象 */
export interface DeploymentUpdateForm {
  /** Deployment 描述 */
  description?: string
  /** Deployment 的资源元数据 */
  metadata: ObjectMeta
  /** Deployment 的规格定义 */
  spec: DeploymentSpec
}

/** Deployment 扩缩容请求对象 */
export interface DeploymentScaleForm {
  /** 期望副本数 */
  replicas: number
}

/** Deployment 回滚请求对象 */
export interface DeploymentRollbackForm {
  /** 目标历史版本号 */
  revision: number
}
