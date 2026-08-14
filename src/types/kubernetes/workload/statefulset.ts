/**
 * StatefulSet 资源相关类型定义
 * @module types/kubernetes/workload/statefulset
 *
 * @remarks
 * 类型分区及对象简述（按文档功能描述出现顺序排列）：
 *   1. 查看 StatefulSet 列表
 *      - StatefulSetQueryForm：StatefulSet 查询条件请求对象
 *      - StatefulSetListVo：StatefulSet 列表项响应对象
 *   2. 查看 StatefulSet 详情
 *      - StatefulSetDetailVo：StatefulSet 详情响应对象
 *   3. 查看 StatefulSet YAML
 *      - StatefulSetYamlVo：StatefulSet YAML 响应对象
 *   4. 查看 StatefulSet 关联 Pod 列表
 *      - StatefulSetPodQueryForm：StatefulSet 关联 Pod 查询条件请求对象
 *      - StatefulSetPodListVo：StatefulSet 关联 Pod 列表项响应对象
 *   5. 查看 StatefulSet 历史版本列表
 *      - StatefulSetHistoryRevisionQueryForm：StatefulSet 历史版本查询条件请求对象
 *      - StatefulSetHistoryRevisionListVo：StatefulSet 历史版本列表项响应对象
 *   6. 查看 StatefulSet 关联网络资源
 *      - StatefulSetNetworkVo：StatefulSet 关联网络资源响应对象
 *      - StatefulSetServiceListVo：StatefulSet 关联 Service 列表项响应对象
 *      - StatefulSetIngressListVo：StatefulSet 关联 Ingress 列表项响应对象
 *   7. 查看 StatefulSet 监控数据
 *      - StatefulSetMonitorVo：StatefulSet 监控响应对象
 *   8. 创建
 *      - StatefulSetCreateForm：StatefulSet 创建请求对象
 *   9. 更新
 *      - StatefulSetUpdateForm：StatefulSet 更新请求对象
 *   10. 扩缩容
 *      - StatefulSetScaleForm：StatefulSet 扩缩容请求对象
 *   11. 滚动更新分区
 *      - StatefulSetPartitionForm：StatefulSet 滚动更新分区请求对象
 *   12. 回滚
 *      - StatefulSetRollbackForm：StatefulSet 回滚请求对象
 */
import type { AuditEntity, DeletableEntity, PageForm, UidEntity } from '@/types/common'

import type { ServiceType } from '@/config/kubernetes/network/service'
import type { PodStatus } from '@/config/kubernetes/pod'
import type { StatefulSetStatus, StatefulSetUpdateStrategyType } from '@/config/kubernetes/workload/statefulset'

import type { Clustered, Namespaced, ObjectMeta } from '../types'

import type { HistoryRevision, StatefulSetSpec, StatefulSetStatusObj } from './types'

/**
 * StatefulSet 查询条件请求对象
 * @extends UidEntity 继承 UID 类型
 * @extends PageForm 继承分页请求
 */
export interface StatefulSetQueryForm extends UidEntity, PageForm {
  /** StatefulSet 名称 */
  name: string
  /** 命名空间名称 */
  namespace: string
  /** StatefulSet 状态 */
  status: StatefulSetStatus
}

/**
 * StatefulSet 列表项响应对象
 * @extends UidEntity 继承 UID 类型
 * @extends Clustered 继承集群类型
 * @extends Namespaced 继承命名空间类型
 * @extends AuditEntity 继承审计实体类型
 * @extends DeletableEntity 继承可删除类型
 */
export interface StatefulSetListVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  /** StatefulSet 名称 */
  name: string
  /** 描述 */
  description?: string
  /** 状态 */
  status: StatefulSetStatus
  /** 状态信息 */
  statusMsg?: string
  /** 期望副本数 */
  replicas: number
  /** 就绪副本数 */
  readyReplicas: number
  /** 当前版本就绪副本数 */
  currentReplicas: number
  /** 更新策略 */
  updateStrategyType: StatefulSetUpdateStrategyType
}

/**
 * StatefulSet 详情响应对象
 * @extends UidEntity 继承 UID 类型
 * @extends Clustered 继承集群类型
 * @extends Namespaced 继承命名空间类型
 * @extends AuditEntity 继承审计实体类型
 * @extends DeletableEntity 继承可删除类型
 */
export interface StatefulSetDetailVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  /** 描述信息 */
  description?: string
  /** 状态标签 */
  status: StatefulSetStatus
  /** 状态信息 */
  statusMsg?: string
  /** StatefulSet 的资源元数据 */
  metadata: ObjectMeta
  /** StatefulSet 的规格定义 */
  spec: StatefulSetSpec
  /** StatefulSet 的观测状态 */
  statusObj: StatefulSetStatusObj
}

/**
 * StatefulSet YAML 响应对象
 */
export interface StatefulSetYamlVo {
  /** StatefulSet 的完整 YAML 文本 */
  yaml: string
}

/**
 * StatefulSet 关联 Pod 查询条件请求对象
 * @extends UidEntity 继承 UID 类型
 * @extends PageForm 继承分页请求
 */
export interface StatefulSetPodQueryForm extends UidEntity, PageForm {
  /** Pod 名称 */
  name: string
  /** Pod IP */
  ip: string
  /** Pod 状态 */
  status: PodStatus
}

/**
 * StatefulSet 关联 Pod 列表项响应对象
 * @extends UidEntity 继承 UID 类型
 * @extends AuditEntity 继承审计实体类型
 */
export interface StatefulSetPodListVo extends UidEntity, AuditEntity {
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
 * StatefulSet 历史版本查询条件请求对象
 * @extends PageForm 继承分页请求
 */
export interface StatefulSetHistoryRevisionQueryForm extends PageForm {
  /** 版本名称 */
  revision: number
  /** 变更原因 */
  changeCause: string
}

/**
 * StatefulSet 历史版本列表项响应对象
 * @extends HistoryRevision 继承历史版本结构
 */
export interface StatefulSetHistoryRevisionListVo extends HistoryRevision {}

/**
 * StatefulSet 关联网络资源响应对象
 * 包含关联的 Service 和 Ingress 列表
 */
export interface StatefulSetNetworkVo {
  /** 关联的 Service 列表 */
  services: StatefulSetServiceListVo[]
  /** 关联的 Ingress 列表 */
  ingresses: StatefulSetIngressListVo[]
}

/**
 * StatefulSet 关联 Service 列表项响应对象
 * @extends UidEntity 继承 UID 基础实体（含 uid）
 * @extends AuditEntity 继承审计基础实体（含 createBy / createAt 等）
 */
export interface StatefulSetServiceListVo extends UidEntity, AuditEntity {
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
 * StatefulSet 关联 Ingress 列表项响应对象
 * @extends UidEntity 继承 UID 基础实体（含 uid）
 * @extends AuditEntity 继承审计基础实体（含 createBy / createAt 等）
 */
export interface StatefulSetIngressListVo extends UidEntity, AuditEntity {
  /** Ingress 名称 */
  name: string
  /** Ingress 描述 */
  description: string
  /** Ingress 类名（对应 IngressClassName 资源名称） */
  ingressClassName?: string
}

/** StatefulSet 监控响应对象 */
export interface StatefulSetMonitorVo {}

/** StatefulSet 创建请求对象 */
export interface StatefulSetCreateForm {
  /** StatefulSet 描述 */
  description?: string
  /** StatefulSet 的资源元数据 */
  metadata: ObjectMeta
  /** StatefulSet 的规格定义 */
  spec: StatefulSetSpec
}

/** StatefulSet 更新请求对象 */
export interface StatefulSetUpdateForm {
  /** StatefulSet 描述 */
  description?: string
  /** StatefulSet 的资源元数据 */
  metadata: ObjectMeta
  /** StatefulSet 的规格定义 */
  spec: StatefulSetSpec
}

/** StatefulSet 扩缩容请求对象 */
export interface StatefulSetScaleForm {
  /** 期望副本数 */
  replicas: number
}

/** StatefulSet 滚动更新分区请求对象 */
export interface StatefulSetPartitionForm {
  /** 分区序号，序号大于等于该值的 Pod 才会被滚动更新 */
  partition: number
}

/** StatefulSet 回滚请求对象 */
export interface StatefulSetRollbackForm {
  /** 目标历史版本号 */
  revision: number
}
