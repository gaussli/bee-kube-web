/**
 * NetworkPolicy 管理 Mock
 * @module mock/kubernetes/network/networkpolicy
 */
import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  NetworkPolicyCreateForm,
  NetworkPolicyDetailVo,
  NetworkPolicyExportQueryForm,
  NetworkPolicyListVo,
  NetworkPolicyQueryForm,
  NetworkPolicyUpdateForm,
  NetworkPolicyYamlVo,
} from '@/types/kubernetes/network/networkpolicy'

import { handleEventList } from '@/mock/utils'

import {
  mockNetworkPolicyDetail,
  mockNetworkPolicyEventList,
  mockNetworkPolicyList,
  mockNetworkPolicyYaml,
} from './data'

/**
 * 网络策略路由配置
 * @remarks
 * - GET    /kubernetes/clusters/:clusterUid/networkpolicies                                         - 获取网络策略列表
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name             - 获取网络策略详情
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name/yaml        - 获取网络策略 YAML
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name/events      - 获取网络策略事件列表
 * - POST   /kubernetes/clusters/:clusterUid/networkpolicies                                         - 创建网络策略
 * - POST   /kubernetes/clusters/:clusterUid/networkpolicies/yaml                                    - 创建网络策略（YAML）
 * - PUT    /kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name             - 更新网络策略
 * - PUT    /kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name/yaml        - 更新网络策略（YAML）
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name/labels      - 配置网络策略标签
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name/annotations - 配置网络策略注解
 * - DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name             - 删除网络策略
 * - DELETE /kubernetes/clusters/:clusterUid/networkpolicies                                         - 批量删除网络策略
 * - POST   /kubernetes/clusters/:clusterUid/networkpolicies/import                                  - 导入网络策略
 * - GET    /kubernetes/clusters/:clusterUid/networkpolicies/export                                  - 导出网络策略
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/networkpolicies',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<NetworkPolicyQueryForm> }) =>
      getNetworkPolicyList(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getNetworkPolicyDetail(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getNetworkPolicyYaml(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name/events',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }) =>
      getNetworkPolicyEventList(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/networkpolicies',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<NetworkPolicyCreateForm> }) =>
      createNetworkPolicy(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/networkpolicies/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      createNetworkPolicyYaml(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<NetworkPolicyUpdateForm> }) =>
      updateNetworkPolicy(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      updateNetworkPolicyYaml(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name/labels',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataLabelForm }) =>
      manageNetworkPolicyLabels(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name/annotations',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataAnnotationForm }) =>
      manageNetworkPolicyAnnotations(
        ctx.pathParams.clusterUid,
        ctx.pathParams.namespace,
        ctx.pathParams.name,
        ctx.data,
      ),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      deleteNetworkPolicy(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/networkpolicies',
    handler: (ctx: { pathParams: Record<string, string>; data: string[] }) =>
      deleteNetworkPolicies(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/networkpolicies/import',
    handler: (ctx: { pathParams: Record<string, string>; data: FormData }) =>
      importNetworkPolicy(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/networkpolicies/export',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<NetworkPolicyExportQueryForm> }) =>
      exportNetworkPolicy(ctx.pathParams.clusterUid, ctx.params),
  },
]

/**
 * 获取网络策略（NetworkPolicy）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的网络策略列表
 */
function getNetworkPolicyList(clusterUid: string, query: Partial<NetworkPolicyQueryForm>): PageVo<NetworkPolicyListVo> {
  console.log('[Mock] getNetworkPolicyList', clusterUid, query)
  const filtered = mockNetworkPolicyList.filter((d: NetworkPolicyListVo) => {
    if (query.namespace && d.namespace !== query.namespace) return false
    return true
  })
  const filteredUid = query.uid ? filtered.filter(d => d.uid === query.uid) : []
  const filteredName = query.name ? filtered.filter(d => d.name.includes(query.name as string)) : []
  const matched = query.uid || query.name ? Array.from(new Set([...filteredUid, ...filteredName])) : filtered
  const page = query.page || 1
  const pageSize = query.pageSize || 10
  return {
    list: matched.slice((page - 1) * pageSize, page * pageSize),
    total: matched.length,
    page,
    pageSize,
  }
}

/**
 * 获取网络策略（NetworkPolicy）详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 网络策略名称
 * @returns 网络策略详情
 */
function getNetworkPolicyDetail(clusterUid: string, namespace: string, name: string): NetworkPolicyDetailVo {
  console.log('[Mock] getNetworkPolicyDetail', clusterUid, namespace, name)
  return mockNetworkPolicyDetail
}

/**
 * 获取网络策略（NetworkPolicy）YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 网络策略名称
 * @returns 网络策略 YAML
 */
function getNetworkPolicyYaml(clusterUid: string, namespace: string, name: string): NetworkPolicyYamlVo {
  console.log('[Mock] getNetworkPolicyYaml', clusterUid, namespace, name)
  return { yaml: mockNetworkPolicyYaml }
}

/**
 * 获取网络策略（NetworkPolicy）事件（Event）列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 网络策略名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
function getNetworkPolicyEventList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<EventQueryForm>,
): PageVo<EventListVo> {
  console.log('[Mock] getNetworkPolicyEventList', clusterUid, namespace, name, query)
  return handleEventList(query, mockNetworkPolicyEventList)
}

/**
 * 创建网络策略（NetworkPolicy）
 * @param clusterUid - 集群 UID
 * @param data - 创建请求对象
 */
function createNetworkPolicy(clusterUid: string, data: Partial<NetworkPolicyCreateForm>): void {
  console.log('[Mock] createNetworkPolicy', clusterUid, data)
}

/**
 * 创建网络策略（NetworkPolicy）（YAML）
 * @param clusterUid - 集群 UID
 * @param yaml - 创建 YAML 文本
 */
function createNetworkPolicyYaml(clusterUid: string, yaml: string): void {
  console.log('[Mock] createNetworkPolicyYaml', clusterUid, yaml)
}

/**
 * 更新网络策略（NetworkPolicy）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 网络策略名称
 * @param data - 更新请求对象
 */
function updateNetworkPolicy(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<NetworkPolicyUpdateForm>,
): void {
  console.log('[Mock] updateNetworkPolicy', clusterUid, namespace, name, data)
}

/**
 * 更新网络策略（NetworkPolicy）（YAML）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 网络策略名称
 * @param yaml - 更新 YAML 文本
 */
function updateNetworkPolicyYaml(clusterUid: string, namespace: string, name: string, yaml: string): void {
  console.log('[Mock] updateNetworkPolicyYaml', clusterUid, namespace, name, yaml)
}

/**
 * 配置网络策略（NetworkPolicy）标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 网络策略名称
 * @param data - 标签配置请求对象
 */
function manageNetworkPolicyLabels(clusterUid: string, namespace: string, name: string, data: MetadataLabelForm): void {
  console.log('[Mock] manageNetworkPolicyLabels', clusterUid, namespace, name, data)
}

/**
 * 配置网络策略（NetworkPolicy）注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 网络策略名称
 * @param data - 注解配置请求对象
 */
function manageNetworkPolicyAnnotations(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
): void {
  console.log('[Mock] manageNetworkPolicyAnnotations', clusterUid, namespace, name, data)
}

/**
 * 删除网络策略（NetworkPolicy）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 网络策略名称
 */
function deleteNetworkPolicy(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] deleteNetworkPolicy', clusterUid, namespace, name)
}

/**
 * 批量删除网络策略（NetworkPolicy）
 * @param clusterUid - 集群 UID
 * @param uids - 网络策略 UID 数组
 */
function deleteNetworkPolicies(clusterUid: string, uids: string[]): void {
  console.log('[Mock] deleteNetworkPolicies', clusterUid, uids)
}

/**
 * 导入网络策略（NetworkPolicy）
 * @param clusterUid - 集群 UID
 * @param formData - 文件数据
 */
function importNetworkPolicy(clusterUid: string, formData: FormData): void {
  void formData
  console.log('[Mock] importNetworkPolicy', clusterUid)
}

/**
 * 导出网络策略（NetworkPolicy）
 * @param clusterUid - 集群 UID
 * @param query - 导出查询条件
 */
function exportNetworkPolicy(clusterUid: string, query: Partial<NetworkPolicyExportQueryForm>): void {
  console.log('[Mock] exportNetworkPolicy', clusterUid, query)
}
