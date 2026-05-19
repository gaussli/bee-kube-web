/**
 * Ingress 资源类型定义
 * @module types/kubernetes/ingress
 */
import type { BaseEntity, PageReq } from '@/types/common'

/**
 * Ingress TLS 配置
 */
export interface IngressTLS {
  /** 密钥名称 */
  secretName?: string
  /** 主机名列表 */
  hosts?: string[]
}

/**
 * Ingress 路径配置
 */
export interface IngressPath {
  /** 路径 */
  path: string
  /** 路径类型（ImplementationSpecific, Exact, Prefix） */
  pathType: 'ImplementationSpecific' | 'Exact' | 'Prefix'
  /** 后端服务名称 */
  serviceName: string
  /** 后端服务端口 */
  servicePort: number | string
}

/**
 * Ingress 规则配置
 */
export interface IngressRule {
  /** 主机名 */
  host?: string
  /** 路径列表 */
  paths: IngressPath[]
}

/**
 * Ingress 响应数据
 * @extends BaseEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface IngressResp extends BaseEntity {
  /** Ingress 名称 */
  name: string
  /** 所属命名空间 */
  namespace: string
  /** 所属集群 ID */
  clusterId: string
  /** 所属集群名称 */
  clusterName?: string
  /** Ingress 类名 */
  ingressClassName?: string
  /** 规则列表 */
  rules: IngressRule[]
  /** TLS 配置列表 */
  tls?: IngressTLS[]
  /** 入口地址列表 */
  loadBalancer?: Array<{
    ip?: string
    hostname?: string
    ports?: Array<{
      port: number
      protocol: string
      name?: string
    }>
  }>
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
  /** 是否可删除 */
  deletable?: boolean
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
  /** 标签选择器 */
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
  /** Ingress 类名 */
  ingressClassName?: string
  /** 规则列表 */
  rules: IngressRule[]
  /** TLS 配置列表 */
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
