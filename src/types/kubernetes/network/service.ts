/**
 * Service 资源相关类型定义
 * @module types/kubernetes/network/service
 */
import type { PageForm } from '@/types/common'
import type { Namespaced } from '../types'
import type { ServicePort } from './types'

// ==================== 1. 基础枚举 ====================

/**
 * Service 类型枚举
 * @remarks
 * - ClusterIP: 集群内部 IP 暴露（默认类型，仅集群内可访问）
 * - NodePort: 节点端口暴露（每个节点上开放固定端口，外部可通过 `<NodeIP>:<NodePort>` 访问）
 * - LoadBalancer: 负载均衡器暴露（由云厂商提供外部 LB，自动分配公网 IP）
 * - ExternalName: 外部域名映射（将 Service 映射为集群外部域名，通过 DNS CNAME 转发）
 */
export type ServiceType = 'ClusterIP' | 'NodePort' | 'LoadBalancer' | 'ExternalName'

// ==================== 2. 查询表单 ====================

/**
 * Service 查询请求参数
 * @extends PageForm 继承分页请求（含 page, pageSize）
 */
export interface ServiceQueryReq extends PageForm {
  /** Service 名称（模糊匹配） */
  name?: string
  /** Service 类型 */
  type?: string
  /** 标签选择器（key=value 格式，多个用逗号分隔） */
  labelSelector?: string
}

// ==================== 3. 列表对象 ====================

/**
 * Service 列表对象响应数据
 * @extends Namespaced 继承命名空间级别基础实体（含 id, clusterId, clusterUid, clusterName, namespaceId, namespaceUid, namespace, createAt 等）
 */
export interface ServiceListVo extends Namespaced {
  /** 资源 UID */
  uid: string
  /** Service 名称 */
  name: string
  /** 描述信息 */
  description: string
  /** Service 类型 */
  type: ServiceType
  /** 集群内部 IP（ClusterIP / NodePort / LoadBalancer 类型自动分配） */
  clusterIp: string
  /** 端口配置列表 */
  ports?: ServicePort[]
  /** 标签选择器（匹配目标 Pod 的标签） */
  selector: Record<string, string>
  /** 外部域名（仅 ExternalName 类型生效） */
  externalName: string
  /** 是否为 Headless Service（clusterIp 为 None） */
  headless: boolean
}

// ==================== 4. 创建/编辑表单 ====================

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

// ==================== 5. 标签表单 ====================

/**
 * Service 标签更新请求
 */
export interface ServiceLabelsReq {
  /** 标签键值对 */
  labels: Record<string, string>
  /** 操作（1: 新增；2: 移除；3: 全量替换） */
  operation: number
}

// ==================== 6. 注解表单 ====================

/**
 * Service 注解更新请求
 */
export interface ServiceAnnotationsReq {
  /** 注解键值对 */
  annotations: Record<string, string>
  /** 操作（1: 新增；2: 移除；3: 全量替换） */
  operation: number
}
