/**
 * Kubernetes Secret 配置资源常量配置
 * @module config/kubernetes/config/secret
 */

/** Secret 类型标签映射 */
export const SECRET_TYPE_LABEL_MAP = {
  'Opaque': '不透明',
  'kubernetes.io/service-account-token': '服务账号令牌',
  'kubernetes.io/dockercfg': 'Docker 配置（旧版）',
  'kubernetes.io/dockerconfigjson': 'Docker 配置',
  'kubernetes.io/basic-auth': '基础认证',
  'kubernetes.io/ssh-auth': 'SSH 认证',
  'kubernetes.io/tls': 'TLS 证书',
  'bootstrap.kubernetes.io/token': '引导令牌',
} as const

/** Secret 类型 */
export type SecretType = keyof typeof SECRET_TYPE_LABEL_MAP
