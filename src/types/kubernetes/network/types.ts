/**
 * Kubernetes 网络资源通用类型定义
 * 包含 Service 端口、Ingress 规则、Ingress 负载均衡、Ingress TLS 等网络相关数据结构
 * @module types/kubernetes/network/types
 */

/**
 * Service 端口配置
 * 定义 Service 暴露端口与 Pod 端口的映射关系
 */
export interface ServicePort {
  /** 端口名称（IETF 规范，如 http、https、grpc） */
  name?: string
  /** 协议（TCP、UDP、SCTP） */
  protocol: string
  /** 对外暴露的服务端口 */
  port: number
  /** 目标 Pod 端口（支持数字端口或命名端口） */
  targetPort: number | string
  /** 节点端口（仅 NodePort / LoadBalancer 类型 Service 生效，范围 30000-32767） */
  nodePort?: number
}

/**
 * Ingress 负载均衡器入口信息
 */
export interface IngressLoadBalancer {
  /** 负载均衡器 IP 地址 */
  ip: string
  /** 负载均衡器主机名 */
  hostname: string
}

/**
 * Ingress 路径匹配类型
 * @remarks
 * - ImplementationSpecific: 由 Ingress Controller 自行决定匹配方式
 * - Exact: 精确匹配（大小写敏感）
 * - Prefix: 前缀匹配（如 /api 可匹配 /api/v1）
 */
export type IngressRulePathType = 'ImplementationSpecific' | 'Exact' | 'Prefix'

/**
 * Ingress 转发规则
 * 定义域名路径到后端 Service 的路由映射
 */
export interface IngressRule {
  /** 域名（不填表示匹配所有主机名） */
  host?: string
  /** 路径转发规则列表 */
  paths: {
    /** URL 路径（如 /api、/web） */
    path: string
    /** 路径匹配类型 */
    pathType: IngressRulePathType
    /** 后端 Service 名称 */
    serviceName: string
    /** 后端 Service 端口（支持数字端口或命名端口） */
    servicePort: number | string
  }[]
}

/**
 * Ingress TLS 证书配置
 */
export interface IngressTLS {
  /** 证书 Secret 名称（存储在 Kubernetes Secret 中） */
  secretName?: string
  /** 证书绑定的主机名列表（须与证书 SAN 匹配） */
  hosts?: string[]
}
