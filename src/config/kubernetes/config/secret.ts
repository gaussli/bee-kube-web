/**
 * Kubernetes Secret 配置资源常量配置
 * @module config/kubernetes/config/secret
 */

import type { Option, ResourcePageMeta } from '../common'

/** Secret 列表页面功能元数据 */
export const SECRET_PAGE_META: ResourcePageMeta = {
  icon: 'kubernetes-secret',
  title: '密钥',
  description:
    '密钥（Secret）是 Kubernetes 中用于存储敏感信息（如密码、令牌、密钥）的资源对象，通过加密方式保障数据安全。',
}

/** Secret 类型原始数据（用于派生类型） */
const _secretTypes = [
  { value: 'Opaque', label: '不透明' },
  { value: 'kubernetes.io/service-account-token', label: '服务账号令牌' },
  { value: 'kubernetes.io/dockercfg', label: 'Docker 配置（旧版）' },
  { value: 'kubernetes.io/dockerconfigjson', label: 'Docker 配置' },
  { value: 'kubernetes.io/basic-auth', label: '基础认证' },
  { value: 'kubernetes.io/ssh-auth', label: 'SSH 认证' },
  { value: 'kubernetes.io/tls', label: 'TLS 证书' },
  { value: 'bootstrap.kubernetes.io/token', label: '引导令牌' },
] as const

/** Secret 类型 */
export type SecretType = (typeof _secretTypes)[number]['value']

/** Secret 类型配置选项 */
export const SECRET_TYPE_OPTIONS: Option[] = [..._secretTypes]
