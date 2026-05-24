/**
 * Ingress 资源类型定义
 * @module types/kubernetes/network/ingress
 */
import type { BaseEntity, PageReq } from '@/types/common'
import type { IngressLoadBalancer, IngressRule, IngressTLS } from './types'

/**
 * Ingress 响应数据
 * @extends BaseEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface IngressResp extends BaseEntity {
  /** 资源 UID */
  uid: string
  /** Ingress 名称 */
  name: string
  /** 所属集群 ID */
  clusterId: string
  /** 所属集群名称 */
  clusterName?: string
  /** 所属命名空间 */
  namespace: string
  /** 描述信息（取自 annotations.bee.kube/description） */
  description: string
  /** 负载均衡器入口地址列表 */
  loadBalancer?: IngressLoadBalancer[]
  /** Ingress 类名（对应 IngressClassName 资源名称） */
  ingressClassName?: string
  /** 转发规则列表 */
  rules: IngressRule[]
  /** TLS 证书配置列表 */
  tls?: IngressTLS[]
}

/**
 * Ingress 查询请求参数
 * @extends PageReq 继承分页请求（含 page, pageSize）
 */
export interface IngressQueryReq extends PageReq {
  /** Ingress 名称（模糊匹配） */
  name?: string
  /** Ingress 类名 */
  ingressClassName?: string
  /** 标签选择器（key=value 格式，多个用逗号分隔） */
  labelSelector?: string
}

/**
 * Ingress 创建/更新请求参数
 */
export interface IngressReq {
  /** Ingress 名称 */
  name: string
  /** 命名空间名称 */
  namespace: string
  /** Ingress 类名（对应 IngressClassName 资源名称） */
  ingressClassName?: string
  /** 转发规则列表 */
  rules: IngressRule[]
  /** TLS 证书配置列表 */
  tls?: IngressTLS[]
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
}

/**
 * Ingress 标签更新请求
 */
export interface IngressLabelsReq {
  /** 标签键值对 */
  labels: Record<string, string>
  /** 操作（1: 新增；2: 移除；3: 全量替换） */
  operation: number
}

/**
 * Ingress 注解更新请求
 */
export interface IngressAnnotationsReq {
  /** 注解键值对 */
  annotations: Record<string, string>
  /** 操作（1: 新增；2: 移除；3: 全量替换） */
  operation: number
}
