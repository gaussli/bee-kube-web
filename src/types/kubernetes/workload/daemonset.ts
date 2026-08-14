/**
 * DaemonSet 资源相关类型定义
 * @module types/kubernetes/workload/daemonset
 *
 * @remarks
 * 类型分区及对象简述（按文档功能描述出现顺序排列）：
 *   1. 查看 DaemonSet 列表
 *      - DaemonSetQueryForm：DaemonSet 查询条件请求对象
 *      - DaemonSetListVo：DaemonSet 列表项响应对象
 *   2. 查看 DaemonSet 详情
 *      - DaemonSetDetailVo：DaemonSet 详情响应对象
 *   3. 查看 DaemonSet YAML
 *      - DaemonSetYamlVo：DaemonSet YAML 响应对象
 *   4. 查看 DaemonSet 关联 Pod 列表
 *      - DaemonSetPodQueryForm：DaemonSet 关联 Pod 查询条件请求对象
 *      - DaemonSetPodListVo：DaemonSet 关联 Pod 列表项响应对象
 *   5. 查看 DaemonSet 历史版本列表
 *      - DaemonSetHistoryRevisionQueryForm：DaemonSet 历史版本查询条件请求对象
 *      - DaemonSetHistoryRevisionListVo：DaemonSet 历史版本列表项响应对象
 *   6. 查看 DaemonSet 关联网络资源
 *      - DaemonSetNetworkVo：DaemonSet 关联网络资源响应对象
 *      - DaemonSetServiceListVo：DaemonSet 关联 Service 列表项响应对象
 *      - DaemonSetIngressListVo：DaemonSet 关联 Ingress 列表项响应对象
 *   7. 查看 DaemonSet 监控数据
 *      - DaemonSetMonitorVo：DaemonSet 监控响应对象
 *   8. 创建
 *      - DaemonSetCreateForm：DaemonSet 创建请求对象
 *   9. 更新
 *      - DaemonSetUpdateForm：DaemonSet 更新请求对象
 *   10. 回滚
 *      - DaemonSetRollbackForm：DaemonSet 回滚请求对象
 */
import type { AuditEntity, DeletableEntity, PageForm, UidEntity } from '@/types/common'

import type { ServiceType } from '@/config/kubernetes/network/service'
import type { PodStatus } from '@/config/kubernetes/pod'
import type { DaemonSetStatus, DaemonSetUpdateStrategyType } from '@/config/kubernetes/workload/daemonset'

import type { Clustered, Namespaced, ObjectMeta } from '../types'

import type { DaemonSetSpec, DaemonSetStatusObj, HistoryRevision } from './types'

/**
 * DaemonSet 查询条件请求对象
 * @extends UidEntity 继承 UID 类型
 * @extends PageForm 继承分页请求
 */
export interface DaemonSetQueryForm extends UidEntity, PageForm {
  /** DaemonSet 名称 */
  name: string
  /** 命名空间名称 */
  namespace: string
  /** DaemonSet 状态 */
  status: DaemonSetStatus
}

/**
 * DaemonSet 列表项响应对象
 * @extends UidEntity 继承 UID 类型
 * @extends Clustered 继承集群类型
 * @extends Namespaced 继承命名空间类型
 * @extends AuditEntity 继承审计实体类型
 * @extends DeletableEntity 继承可删除类型
 */
export interface DaemonSetListVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  /** DaemonSet 名称 */
  name: string
  /** 描述 */
  description?: string
  /** 状态 */
  status: DaemonSetStatus
  /** 状态信息 */
  statusMsg?: string
  /** 目标调度 Pod 总数 */
  desiredNumberScheduled: number
  /** 就绪 Pod 数 */
  numberReady: number
  /** 更新策略 */
  updateStrategyType: DaemonSetUpdateStrategyType
}

/**
 * DaemonSet 详情响应对象
 * @extends UidEntity 继承 UID 类型
 * @extends Clustered 继承集群类型
 * @extends Namespaced 继承命名空间类型
 * @extends AuditEntity 继承审计实体类型
 * @extends DeletableEntity 继承可删除类型
 */
export interface DaemonSetDetailVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  /** 描述信息 */
  description?: string
  /** 状态标签 */
  status: DaemonSetStatus
  /** 状态信息 */
  statusMsg?: string
  /** DaemonSet 的资源元数据 */
  metadata: ObjectMeta
  /** DaemonSet 的规格定义 */
  spec: DaemonSetSpec
  /** DaemonSet 的观测状态 */
  statusObj: DaemonSetStatusObj
}

/**
 * DaemonSet YAML 响应对象
 */
export interface DaemonSetYamlVo {
  /** DaemonSet 的完整 YAML 文本 */
  yaml: string
}

/**
 * DaemonSet 关联 Pod 查询条件请求对象
 * @extends UidEntity 继承 UID 类型
 * @extends PageForm 继承分页请求
 */
export interface DaemonSetPodQueryForm extends UidEntity, PageForm {
  /** Pod 名称 */
  name: string
  /** Pod 状态 */
  status: PodStatus
}

/**
 * DaemonSet 关联 Pod 列表项响应对象
 * @extends UidEntity 继承 UID 类型
 * @extends AuditEntity 继承审计实体类型
 */
export interface DaemonSetPodListVo extends UidEntity, AuditEntity {
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
 * DaemonSet 历史版本查询条件请求对象
 * @extends PageForm 继承分页请求
 */
export interface DaemonSetHistoryRevisionQueryForm extends PageForm {
  /** 版本名称 */
  revision: number
  /** 变更原因 */
  changeCause: string
}

/**
 * DaemonSet 历史版本列表项响应对象
 * @extends HistoryRevision 继承历史版本结构
 */
export interface DaemonSetHistoryRevisionListVo extends HistoryRevision {}

/**
 * DaemonSet 关联网络资源响应对象
 * 包含关联的 Service 和 Ingress 列表
 */
export interface DaemonSetNetworkVo {
  /** 关联的 Service 列表 */
  services: DaemonSetServiceListVo[]
  /** 关联的 Ingress 列表 */
  ingresses: DaemonSetIngressListVo[]
}

/**
 * DaemonSet 关联 Service 列表项响应对象
 * @extends UidEntity 继承 UID 基础实体（含 uid）
 * @extends AuditEntity 继承审计基础实体（含 createBy / createAt 等）
 */
export interface DaemonSetServiceListVo extends UidEntity, AuditEntity {
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
 * DaemonSet 关联 Ingress 列表项响应对象
 * @extends UidEntity 继承 UID 基础实体（含 uid）
 * @extends AuditEntity 继承审计基础实体（含 createBy / createAt 等）
 */
export interface DaemonSetIngressListVo extends UidEntity, AuditEntity {
  /** Ingress 名称 */
  name: string
  /** Ingress 描述 */
  description: string
  /** Ingress 类名（对应 IngressClassName 资源名称） */
  ingressClassName?: string
}

/** DaemonSet 监控响应对象 */
export interface DaemonSetMonitorVo {}

/** DaemonSet 创建请求对象 */
export interface DaemonSetCreateForm {
  /** DaemonSet 描述 */
  description?: string
  /** DaemonSet 的资源元数据 */
  metadata: ObjectMeta
  /** DaemonSet 的规格定义 */
  spec: DaemonSetSpec
}

/** DaemonSet 更新请求对象 */
export interface DaemonSetUpdateForm {
  /** DaemonSet 描述 */
  description?: string
  /** DaemonSet 的资源元数据 */
  metadata: ObjectMeta
  /** DaemonSet 的规格定义 */
  spec: DaemonSetSpec
}

/** DaemonSet 回滚请求对象 */
export interface DaemonSetRollbackForm {
  /** 目标历史版本号 */
  revision: number
}
