/**
 * Service 资源类型定义
 * @module types/kubernetes/network/service
 */
import type { BaseEntity, PageReq } from '@/types/common'
import type { ServicePort } from './types'

/**
 * Service 类型枚举
 * @remarks
 * - ClusterIP: 集群内部 IP 暴露（默认类型，仅集群内可访问）
 * - NodePort: 节点端口暴露（每个节点上开放固定端口，外部可通过 `<NodeIP>:<NodePort>` 访问）
 * - LoadBalancer: 负载均衡器暴露（由云厂商提供外部 LB，自动分配公网 IP）
 * - ExternalName: 外部域名映射（将 Service 映射为集群外部域名，通过 DNS CNAME 转发）
 */
export type ServiceType = 'ClusterIP' | 'NodePort' | 'LoadBalancer' | 'ExternalName'

/**
 * Service 响应数据
 * @extends BaseEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface ServiceResp extends BaseEntity {
  /** 资源 UID */
  uid: string
  /** Service 名称 */
  name: string
  /** 所属集群 ID */
  clusterId: string
  /** 所属集群名称 */
  clusterName?: string
  /** 所属命名空间 */
  namespace: string
  /** 描述信息 */
  description: string
  /** Service 类型 */
  type: ServiceType
  /** 端口配置列表 */
  ports: ServicePort[]
  /** 标签选择器（匹配目标 Pod 的标签） */
  selector?: Record<string, string>
  /** 集群内部 IP（ClusterIP / NodePort / LoadBalancer 类型自动分配） */
  clusterIp: string
  /** 外部域名（仅 ExternalName 类型生效） */
  externalName?: string
}

/**
 * Service 查询请求参数
 * @extends PageReq 继承分页请求（含 page, pageSize）
 */
export interface ServiceQueryReq extends PageReq {
  /** Service 名称（模糊匹配） */
  name?: string
  /** Service 类型 */
  type?: string
  /** 标签选择器（key=value 格式，多个用逗号分隔） */
  labelSelector?: string
}

/**
 * Service 创建/更新请求参数
 */
export interface ServiceReq {
  /** Service 名称 */
  name: string
  /** 命名空间名称 */
  namespace: string
  /** Service 类型 */
  type: ServiceType
  /** 集群 IP（ClusterIP 类型可选指定，ExternalName 类型不支持） */
  clusterIp?: string
  /** 端口配置列表 */
  ports: ServicePort[]
  /** 标签选择器（匹配目标 Pod 的标签） */
  selector?: Record<string, string>
  /** 外部域名（ExternalName 类型必需） */
  externalName?: string
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
}

/**
 * Service 标签更新请求
 */
export interface ServiceLabelsReq {
  /** 标签键值对 */
  labels: Record<string, string>
  /** 操作（1: 新增；2: 移除；3: 全量替换） */
  operation: number
}

/**
 * Service 注解更新请求
 */
export interface ServiceAnnotationsReq {
  /** 注解键值对 */
  annotations: Record<string, string>
  /** 操作（1: 新增；2: 移除；3: 全量替换） */
  operation: number
}
