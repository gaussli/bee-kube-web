/**
 * Kubernetes Service 网络资源常量配置
 * @module config/kubernetes/network/service
 */

import type { Option, ResourcePageMeta } from '@/config/kubernetes/common'

/** Service 列表页面功能元数据 */
export const SERVICE_PAGE_META: ResourcePageMeta = {
  icon: 'kubernetes-service',
  title: '服务',
  description:
    '服务（Service）是 Kubernetes 中用于定义一组 Pod 访问策略的抽象，通过固定虚拟 IP 或域名将请求负载均衡到后端 Pod，屏蔽 Pod 动态调度带来的地址变化。',
}

/** Service 类型原始数据（用于派生类型） */
const _serviceTypes = [
  { value: 'ClusterIP', label: '集群内访问' },
  { value: 'NodePort', label: '集群外访问' },
  { value: 'LoadBalancer', label: '负载均衡' },
  { value: 'ExternalName', label: '外部域名' },
] as const

/** Service 类型 */
export type ServiceType = (typeof _serviceTypes)[number]['value']

/** Service 类型配置选项 */
export const SERVICE_TYPE_OPTIONS: Option[] = [..._serviceTypes]

/** Service 会话亲和性类型原始数据（用于派生类型） */
const _serviceAffinities = [
  { value: 'ClientIP', label: '基于客户端 IP' },
  { value: 'None', label: '无会话亲和性' },
] as const

/** Service 会话亲和性类型 */
export type ServiceAffinity = (typeof _serviceAffinities)[number]['value']

/** Service 会话亲和性类型配置选项 */
export const SERVICE_AFFINITY_OPTIONS: Option[] = [..._serviceAffinities]

/** Service 外部流量策略原始数据（用于派生类型） */
const _serviceExternalTrafficPolicies = [
  { value: 'Cluster', label: '所有端点' },
  { value: 'Local', label: '仅本地节点' },
] as const

/** Service 外部流量策略 */
export type ServiceExternalTrafficPolicy = (typeof _serviceExternalTrafficPolicies)[number]['value']

/** Service 外部流量策略配置选项 */
export const SERVICE_EXTERNAL_TRAFFIC_POLICY_OPTIONS: Option[] = [..._serviceExternalTrafficPolicies]

/** Service 内部流量策略原始数据（用于派生类型） */
const _serviceInternalTrafficPolicies = [
  { value: 'Cluster', label: '所有端点' },
  { value: 'Local', label: '仅本地节点' },
] as const

/** Service 内部流量策略 */
export type ServiceInternalTrafficPolicy = (typeof _serviceInternalTrafficPolicies)[number]['value']

/** Service 内部流量策略配置选项 */
export const SERVICE_INTERNAL_TRAFFIC_POLICY_OPTIONS: Option[] = [..._serviceInternalTrafficPolicies]

/** Service IP 家族类型原始数据（用于派生类型） */
const _ipFamilies = [
  { value: 'IPv4', label: 'IPv4' },
  { value: 'IPv6', label: 'IPv6' },
  { value: '', label: '未指定' },
] as const

/** Service IP 家族类型 */
export type IPFamily = (typeof _ipFamilies)[number]['value']

/** Service IP 家族类型配置选项 */
export const IP_FAMILY_OPTIONS: Option[] = [..._ipFamilies]

/** Service IP 家族分配策略原始数据（用于派生类型） */
const _ipFamilyPolicies = [
  { value: 'SingleStack', label: '单栈' },
  { value: 'PreferDualStack', label: '优先双栈' },
  { value: 'RequireDualStack', label: '强制双栈' },
] as const

/** Service IP 家族分配策略 */
export type IPFamilyPolicy = (typeof _ipFamilyPolicies)[number]['value']

/** Service IP 家族分配策略配置选项 */
export const IP_FAMILY_POLICY_OPTIONS: Option[] = [..._ipFamilyPolicies]

/** Service 流量分布偏好原始数据（用于派生类型） */
const _trafficDistributions = [
  { value: 'PreferSameZone', label: '同可用区' },
  { value: 'PreferSameNode', label: '同节点' },
  { value: 'PreferClose', label: '就近' },
] as const

/** Service 流量分布偏好 */
export type TrafficDistribution = (typeof _trafficDistributions)[number]['value']

/** Service 流量分布偏好配置选项 */
export const TRAFFIC_DISTRIBUTION_OPTIONS: Option[] = [..._trafficDistributions]

/** 负载均衡器入口 IP 模式原始数据（用于派生类型） */
const _loadBalancerIPModes = [
  { value: 'VIP', label: '虚拟 IP' },
  { value: 'Proxy', label: '代理' },
] as const

/** 负载均衡器入口 IP 模式 */
export type LoadBalancerIPMode = (typeof _loadBalancerIPModes)[number]['value']

/** 负载均衡器入口 IP 模式配置选项 */
export const LOAD_BALANCER_IP_MODE_OPTIONS: Option[] = [..._loadBalancerIPModes]

/** Service 条件类型原始数据（用于派生类型） */
const _serviceConditionTypes = [
  { value: 'LoadBalancerPortsError', label: '端口分配出错' },
  { value: 'LoadBalancerMixedProtocolNotSupported', label: '协议混合不兼容' },
] as const

/** Service 条件类型 */
export type ServiceConditionType = (typeof _serviceConditionTypes)[number]['value']

/** Service 条件类型配置选项 */
export const SERVICE_CONDITION_TYPE_OPTIONS: Option[] = [..._serviceConditionTypes]
