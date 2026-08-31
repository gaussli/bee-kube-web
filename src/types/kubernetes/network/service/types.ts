/**
 * Service 资源实体类型定义
 * @module types/kubernetes/network/service/types
 */

import type { Condition } from '@/types/kubernetes/types'

import type { Protocol } from '@/config/kubernetes/core'
import type {
  ServiceType,
  ServiceAffinity,
  ServiceExternalTrafficPolicy,
  ServiceInternalTrafficPolicy,
  LoadBalancerIPMode,
  ServiceConditionType,
  IPFamily,
  IPFamilyPolicy,
  TrafficDistribution,
} from '@/config/kubernetes/network/service'

/**
 * Service 规格信息
 */
export interface ServiceSpec {
  /** 端口列表 */
  ports?: ServicePort[]
  /** 标签选择器，匹配目标 Pod；ExternalName 忽略 */
  selector?: Record<string, string>
  /** 集群内部 IP；'None' 为 Headless；ExternalName 须空 */
  clusterIP?: string
  /** dual-stack 集群内部 IP 列表；单栈时与 clusterIP 一致 */
  clusterIPs?: string[]
  /** 暴露方式，为空时默认 'ClusterIP' */
  type?: ServiceType
  /** 节点额外接受的外部 IP，非 K8s 管理 */
  externalIPs?: string[]
  /** 负载均衡器外部 IP，已废弃（Deprecated） */
  loadBalancerIP?: string
  /** 允许访问的客户端源 IP 白名单（CIDR），仅云负载均衡器生效 */
  loadBalancerSourceRanges?: string[]
  /** 会话亲和性，为空时默认 'None' */
  sessionAffinity?: ServiceAffinity
  /** ExternalName 外部别名，须小写 RFC-1123 主机名 */
  externalName?: string
  /** 外部流量策略，默认 'Cluster' */
  externalTrafficPolicy?: ServiceExternalTrafficPolicy
  /** LoadBalancer + Local 时的健康检查节点端口 */
  healthCheckNodePort?: number
  /** 未就绪 Pod 也发布为端点 */
  publishNotReadyAddresses?: boolean
  /** 会话亲和性配置 */
  sessionAffinityConfig?: SessionAffinityConfig
  /** 分配的 IP 家族列表（如 ['IPv4'] / ['IPv6']） */
  ipFamilies?: IPFamily[]
  /** IP 家族分配策略 */
  ipFamilyPolicy?: IPFamilyPolicy
  /** LoadBalancer 是否自动分配 NodePort，默认 true；为 false 时需手动配置 */
  allocateLoadBalancerNodePorts?: boolean
  /** 负载均衡器类别，仅 LoadBalancer 可设且不可改 */
  loadBalancerClass?: string
  /** 内部流量策略，默认 'Cluster' */
  internalTrafficPolicy?: ServiceInternalTrafficPolicy
  /** 流量分布偏好；枚举定义见 `entity-network-design.md` 的 `TrafficDistribution`，当前代码层尚未实现，暂用 string */
  trafficDistribution?: TrafficDistribution
}

/**
 * Service 端口信息
 */
export interface ServicePort {
  /** 端口名称，须唯一且为 DNS_LABEL；单端口时可选 */
  name?: string
  /** 网络协议，默认 'TCP' */
  protocol?: Protocol
  /** 应用层协议提示；IANA 标准名或 'kubernetes.io/' 前缀或自定义前缀 */
  appProtocol?: string
  /** Service 暴露的端口 */
  port: number
  /** 目标 Pod 端口；未指定则等同 port；clusterIP=None 时忽略 */
  targetPort?: number | string
  /** NodePort/LoadBalancer 在各节点暴露的端口；通常由系统分配 */
  nodePort?: number
}

/**
 * Service 会话亲和性配置
 */
export interface SessionAffinityConfig {
  /** 基于客户端 IP 的会话亲和性配置 */
  clientIP?: ClientIPConfig
}

/**
 * 基于客户端 IP 的会话亲和性配置
 */
export interface ClientIPConfig {
  /** 会话保持时长（秒），须 0 < 值 ≤ 86400；默认 10800（3 小时） */
  timeoutSeconds?: number
}

/**
 * Service 观测状态（对应源码 ServiceStatus）
 */
export interface ServiceStatusObj {
  /** 负载均衡器当前状态，存在时返回 */
  loadBalancer?: LoadBalancerStatus
  /** Service 当前状态条件列表 */
  conditions?: Condition<ServiceConditionType>[]
}

/**
 * 负载均衡器当前状态
 */
export interface LoadBalancerStatus {
  /** 外部负载均衡器对外暴露的入口地址列表 */
  ingress?: LoadBalancerIngress[]
}

/**
 * 负载均衡器的入口地址
 */
export interface LoadBalancerIngress {
  /** 负载均衡器 IP 地址 */
  ip?: string
  /** 负载均衡器主机名 */
  hostname?: string
  /** IP 模式，仅当 ip 字段存在时可设置 */
  ipMode?: LoadBalancerIPMode
  /** 端口状态列表 */
  ports?: PortStatus[]
}

/**
 * 负载均衡器入口的端口状态
 */
export interface PortStatus {
  /** 端口号 */
  port: number
  /** 协议，'TCP' / 'UDP' / 'SCTP'，默认 'TCP' */
  protocol?: Protocol
  /** 端口分配错误信息，格式为 CamelCase 或 'domain.example.com/CamelCase' 风格 */
  error?: string
}
