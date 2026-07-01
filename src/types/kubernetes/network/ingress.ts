/**
 * Ingress 资源相关类型定义
 * @module types/kubernetes/network/ingress
 */
import type { PageForm } from '@/types/common'
import type { Namespaced } from '../types'
import type { IngressLoadBalancer, IngressRule, IngressTLS } from './types'

// ==================== 1. 查询表单 ====================

/**
 * Ingress 查询请求参数
 * @extends PageForm 继承分页请求（含 page, pageSize）
 */
export interface IngressQueryReq extends PageForm {
  /** Ingress 名称（模糊匹配） */
  name?: string
  /** Ingress 类名 */
  ingressClassName?: string
  /** 标签选择器（key=value 格式，多个用逗号分隔） */
  labelSelector?: string
}

// ==================== 2. 列表对象 ====================

/**
 * Ingress 列表对象响应数据
 * @extends Namespaced 继承命名空间级别基础实体（含 id, clusterId, clusterUid, clusterName, namespaceId, namespaceUid, namespace, createAt 等）
 */
export interface IngressListVo extends Namespaced {
  /** 资源 UID */
  uid: string
  /** Ingress 名称 */
  name: string
  /** 描述信息（取自 annotations.bee.kube/description） */
  description: string
  /** Ingress 类名（对应 IngressClassName 资源名称） */
  ingressClassName?: string
  /** 负载均衡器入口地址列表 */
  loadBalancer?: IngressLoadBalancer[]
  /** 转发规则列表 */
  rules: IngressRule[]
  /** TLS 证书配置列表 */
  tls?: IngressTLS[]
}

// ==================== 3. 创建/编辑表单 ====================

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

// ==================== 4. 标签表单 ====================

/**
 * Ingress 标签更新请求
 */
export interface IngressLabelsReq {
  /** 标签键值对 */
  labels: Record<string, string>
  /** 操作（1: 新增；2: 移除；3: 全量替换） */
  operation: number
}

// ==================== 5. 注解表单 ====================

/**
 * Ingress 注解更新请求
 */
export interface IngressAnnotationsReq {
  /** 注解键值对 */
  annotations: Record<string, string>
  /** 操作（1: 新增；2: 移除；3: 全量替换） */
  operation: number
}
