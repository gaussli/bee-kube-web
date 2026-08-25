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
  NetworkPolicyListVo,
  NetworkPolicyQueryForm,
  NetworkPolicyUpdateForm,
  NetworkPolicyYamlVo,
} from '@/types/kubernetes/network/networkpolicy'

import {
  mockNetworkPolicies,
  mockNetworkPolicyDetail,
  mockNetworkPolicyEvents,
  mockNetworkPolicyYaml,
} from './networkpolicyData'

/**
 * 查看 NetworkPolicy 列表
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param query NetworkPolicy 查询条件请求对象（名称、UID）
 * @returns NetworkPolicy 分页列表
 */
function getNetworkPolicyListMock(
  clusterUid: string,
  namespaceName: string,
  query: Partial<NetworkPolicyQueryForm>,
): PageVo<NetworkPolicyListVo> {
  console.log('[Mock] getNetworkPolicyList', clusterUid, namespaceName, query)
  const filtered = mockNetworkPolicies.filter((n: NetworkPolicyListVo) => {
    if (n.clusterUid !== clusterUid) return false
    if (namespaceName && n.namespace !== namespaceName) return false
    return true
  })
  const filteredUid = query.uid ? filtered.filter(n => n.uid === query.uid) : []
  const filteredName = query.name ? filtered.filter(n => n.name.includes(query.name as string)) : []
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
 * 查看 NetworkPolicy 详情
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name NetworkPolicy 名称
 * @returns NetworkPolicy 详情响应对象
 */
function getNetworkPolicyDetailMock(clusterUid: string, namespaceName: string, name: string): NetworkPolicyDetailVo {
  console.log('[Mock] getNetworkPolicyDetail', clusterUid, namespaceName, name)
  return mockNetworkPolicyDetail
}

/**
 * 查看 NetworkPolicy YAML
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name NetworkPolicy 名称
 * @returns NetworkPolicy YAML 响应对象（完整 YAML 文本）
 */
function getNetworkPolicyYamlMock(clusterUid: string, namespaceName: string, name: string): NetworkPolicyYamlVo {
  console.log('[Mock] getNetworkPolicyYaml', clusterUid, namespaceName, name)
  return mockNetworkPolicyYaml
}

/**
 * 查看 NetworkPolicy 关联事件列表
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name NetworkPolicy 名称
 * @param query 事件查询条件
 * @returns NetworkPolicy 关联事件分页列表
 */
function getNetworkPolicyEventListMock(
  clusterUid: string,
  namespaceName: string,
  name: string,
  query: Partial<EventQueryForm>,
): PageVo<EventListVo> {
  console.log('[Mock] getNetworkPolicyEventList', clusterUid, namespaceName, name, query)
  const page = query.page || 1
  const pageSize = query.pageSize || 10
  const list = mockNetworkPolicyEvents.slice((page - 1) * pageSize, page * pageSize)
  return {
    list,
    total: mockNetworkPolicyEvents.length,
    page,
    pageSize,
  }
}

/**
 * 创建 NetworkPolicy
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param data 创建参数
 * @returns void
 */
function createNetworkPolicyMock(
  clusterUid: string,
  namespaceName: string,
  data: Partial<NetworkPolicyCreateForm>,
): void {
  console.log('[Mock] createNetworkPolicy', clusterUid, namespaceName, data)
}

/**
 * 通过 YAML 创建 NetworkPolicy
 * @param clusterUid 集群 UID
 * @param yaml NetworkPolicy YAML 文本
 * @returns void
 */
function createNetworkPolicyYamlMock(clusterUid: string, yaml: string): void {
  console.log('[Mock] createNetworkPolicyYaml', clusterUid, yaml)
}

/**
 * 更新 NetworkPolicy
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name NetworkPolicy 名称
 * @param data 更新参数
 * @returns void
 */
function updateNetworkPolicyMock(
  clusterUid: string,
  namespaceName: string,
  name: string,
  data: Partial<NetworkPolicyUpdateForm>,
): void {
  console.log('[Mock] updateNetworkPolicy', clusterUid, namespaceName, name, data)
}

/**
 * 通过 YAML 更新 NetworkPolicy
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name NetworkPolicy 名称
 * @param yaml NetworkPolicy YAML 文本
 * @returns void
 */
function updateNetworkPolicyYamlMock(clusterUid: string, namespaceName: string, name: string, yaml: string): void {
  console.log('[Mock] updateNetworkPolicyYaml', clusterUid, namespaceName, name, yaml)
}

/**
 * 更新 NetworkPolicy 标签
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name NetworkPolicy 名称
 * @param data 标签更新参数
 * @returns void
 */
function manageNetworkPolicyLabelMock(
  clusterUid: string,
  namespaceName: string,
  name: string,
  data: MetadataLabelForm,
): void {
  console.log('[Mock] manageNetworkPolicyLabel', clusterUid, namespaceName, name, data)
}

/**
 * 更新 NetworkPolicy 注解
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name NetworkPolicy 名称
 * @param data 注解更新参数
 * @returns void
 */
function manageNetworkPolicyAnnotationMock(
  clusterUid: string,
  namespaceName: string,
  name: string,
  data: MetadataAnnotationForm,
): void {
  console.log('[Mock] manageNetworkPolicyAnnotation', clusterUid, namespaceName, name, data)
}

/**
 * 删除 NetworkPolicy
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name NetworkPolicy 名称
 * @returns void
 */
function deleteNetworkPolicyMock(clusterUid: string, namespaceName: string, name: string): void {
  console.log('[Mock] deleteNetworkPolicy', clusterUid, namespaceName, name)
}

/**
 * 批量删除 NetworkPolicy
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param uids NetworkPolicy UID 列表
 * @returns void
 */
function deleteNetworkPoliciesMock(clusterUid: string, namespaceName: string, uids: string[]): void {
  console.log('[Mock] deleteNetworkPolicies', clusterUid, namespaceName, uids)
}

/**
 * 导入 NetworkPolicy
 * @param clusterUid 集群 UID
 * @param formData 上传的文件
 * @returns void
 */
function importNetworkPolicyMock(clusterUid: string, formData: FormData): void {
  void formData
  console.log('[Mock] importNetworkPolicy', clusterUid)
}

/**
 * 导出 NetworkPolicy
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name NetworkPolicy 名称
 * @returns void
 */
function exportNetworkPolicyMock(clusterUid: string, namespaceName: string, name: string): void {
  console.log('[Mock] exportNetworkPolicy', clusterUid, namespaceName, name)
}

export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<NetworkPolicyQueryForm> }) =>
      getNetworkPolicyListMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getNetworkPolicyDetailMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getNetworkPolicyYamlMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name/events',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }) =>
      getNetworkPolicyEventListMock(
        ctx.pathParams.clusterUid,
        ctx.pathParams.namespace,
        ctx.pathParams.name,
        ctx.params,
      ),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<NetworkPolicyCreateForm> }) =>
      createNetworkPolicyMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/networkpolicies/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      createNetworkPolicyYamlMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<NetworkPolicyUpdateForm> }) =>
      updateNetworkPolicyMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      updateNetworkPolicyYamlMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name/labels',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataLabelForm }) =>
      manageNetworkPolicyLabelMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name/annotations',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataAnnotationForm }) =>
      manageNetworkPolicyAnnotationMock(
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
      deleteNetworkPolicyMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/batch',
    handler: (ctx: { pathParams: Record<string, string>; data: string[] }) =>
      deleteNetworkPoliciesMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/networkpolicies/import',
    handler: (ctx: { pathParams: Record<string, string>; data: FormData }) =>
      importNetworkPolicyMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name/export',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      exportNetworkPolicyMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
]
