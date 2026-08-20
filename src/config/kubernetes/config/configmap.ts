/**
 * Kubernetes ConfigMap 配置资源常量配置
 * @module config/kubernetes/config/configmap
 */

import type { ResourcePageMeta } from '../common'

/** ConfigMap 列表页面功能元数据 */
export const CONFIGMAP_PAGE_META: ResourcePageMeta = {
  icon: 'kubernetes-configmap',
  title: '配置',
  description:
    '配置（ConfigMap）是 Kubernetes 中用于存储非敏感配置数据的资源对象，支持以键值对形式管理应用的配置信息。',
}
