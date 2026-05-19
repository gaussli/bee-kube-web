/**
 * Service 资源类型定义
 * @module types/kubernetes/service
 */
import type { BaseEntity, PageReq } from '@/types/common'

/**
 * Service 端口配置
 */
export interface ServicePort {
  /** 端口名称 */
  name?: string
  /** 协议 */
  protocol: string
  /** 服务端口 */
  port: number
  /** 目标端口 */
  targetPort: number | string
  /** 节点端口（仅 NodePort/LoadBalancer） */
  nodePort?: number
}

/**
 * Service 负载均衡器配置
 */
export interface ServiceLoadBalancer {
  /** 负载均衡器 IP */
  ip?: string
  /** 入口点列表 */
  ingress?: Array<{
    ip?: string
    hostname?: string
  }>
}

/**
 * Service 响应数据
 * @extends BaseEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface ServiceResp extends BaseEntity {
  /** Service 名称 */
  name: string
  /** 所属命名空间 */
  namespace: string
  /** 所属集群 ID */
  clusterId: string
  /** 所属集群名称 */
  clusterName?: string
  /** Service 类型（ClusterIP, NodePort, LoadBalancer, ExternalName） */
  type: 'ClusterIP' | 'NodePort' | 'LoadBalancer' | 'ExternalName'
  /** 集群 IP */
  clusterIp: string
  /** 外部 IP 列表 */
  external Ips?: string[]
  /** 端口配置列表 */
  ports: ServicePort[]
  /** 标签选择器 */
  selector?: Record<string, string>
  /** 负载均衡器配置 */
  loadBalancer?: ServiceLoadBalancer
  /** 外部名称（仅 ExternalName 类型） */
  externalName?: string
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
  /** 是否可删除 */
  deletable?: boolean
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
  /** 标签选择器 */
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
  type: 'ClusterIP' | 'NodePort' | 'LoadBalancer' | 'ExternalName'
  /** 集群 IP（ClusterIP 类型可选，ExternalName 类型不支持） */
  clusterIp?: string
  /** 端口配置列表 */
  ports: ServicePort[]
  /** 标签选择器 */
  selector?: Record<string, string>
  /** 外部名称（ExternalName 类型必需） */
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
