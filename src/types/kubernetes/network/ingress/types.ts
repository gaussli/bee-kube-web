/**
 * Ingress 资源实体类型定义
 * @module types/kubernetes/network/ingress/types
 */

import type { Protocol } from '@/config/kubernetes/core'
import type { PathType } from '@/config/kubernetes/network/ingress'

import type { TypedLocalObjectReference } from '../../types'

/**
 * Ingress 规格信息
 */
export interface IngressSpec {
  /** 关联的 IngressClass 名称；也可由 kubernetes.io/ingress.class 注解指定，但字段优先 */
  ingressClassName?: string
  /** 默认后端，处理未匹配任何规则的请求；rules 未指定时必须设置 */
  defaultBackend?: IngressBackend
  /** 主机路由规则列表；未指定或无匹配时流量发往默认后端 */
  rules?: IngressRule[]
  /** TLS 配置，目前仅支持 443 单端口 */
  tls?: IngressTLS[]
}

/**
 * Ingress 路由规则
 */
export interface IngressRule {
  /** 完全限定域名（RFC 3986），可为精确域名（如 foo.bar.com）或通配符域名（如 *.foo.com）；不区分 IP、不支持端口；为空则路由所有流量 */
  host?: string
  /** HTTP 路由规则值，若未指定默认 http catch-all */
  http?: HTTPIngressRuleValue
}

/**
 * HTTP 路由规则
 */
export interface HTTPIngressRuleValue {
  /** 路径集合，映射请求到后端 */
  paths: HTTPIngressPath[]
}

/**
 * HTTP 路径
 */
export interface HTTPIngressPath {
  /** 匹配的 URL 路径，须以 '/' 开头；使用 PathType 'Exact'/'Prefix' 时必填 */
  path?: string
  /** 路径匹配类型 */
  pathType: PathType
  /** 后端服务端点 */
  backend: IngressBackend
}

/**
 * Ingress 后端
 */
export interface IngressBackend {
  /** 作为后端的 Service，与 resource 互斥 */
  service?: IngressServiceBackend
  /** 对命名空间内其他 Kubernetes 资源的引用，与 service 互斥；若指定则 service 不得设置 */
  resource?: TypedLocalObjectReference
}

/**
 * Ingress 后端 Service 引用
 */
export interface IngressServiceBackend {
  /** Service 名称 */
  name: string
  /** 引用 Service 的端口，名称或端口号二选一 */
  port?: ServiceBackendPort
}

/**
 * Ingress 后端引用的 Service 端口
 */
export interface ServiceBackendPort {
  /** 端口名称，与 number 互斥 */
  name?: string
  /** 端口号，与 name 互斥 */
  number?: number
}

/**
 * Ingress TLS 传输层安全配置
 */
export interface IngressTLS {
  /** TLS 证书包含的主机列表，须与 tlsSecret 名称匹配；默认使用负载均衡控制器的通配符主机 */
  hosts?: string[]
  /** 用于终止 443 端口 TLS 流量的 Secret 名称；可选以支持仅基于 SNI 的 TLS 路由 */
  secretName?: string
}

/**
 * Ingress 当前状态（对应源码 IngressStatus）
 */
export interface IngressStatusObj {
  /** 负载均衡器当前状态 */
  loadBalancer?: IngressLoadBalancerStatus
}

/**
 * Ingress 负载均衡器状态
 */
export interface IngressLoadBalancerStatus {
  /** 负载均衡器入口点列表 */
  ingress?: IngressLoadBalancerIngress[]
}

/**
 * Ingress 负载均衡器单个入口点状态
 */
export interface IngressLoadBalancerIngress {
  /** 基于 IP 的入口地址 */
  ip?: string
  /** 基于 DNS 的入口主机名 */
  hostname?: string
  /** 该负载均衡器暴露的端口信息 */
  ports?: IngressPortStatus[]
}

/**
 * Ingress 负载均衡器入口端口状态
 */
export interface IngressPortStatus {
  /** 端口号 */
  port: number
  /** 协议，'TCP' / 'UDP' / 'SCTP' */
  protocol: Protocol
  /** 服务端口问题记录，格式为 CamelCase 或 'foo.example.com/CamelCase'，最大长度 316 */
  error?: string
}
