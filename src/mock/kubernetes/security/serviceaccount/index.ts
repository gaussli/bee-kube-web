/**
 * ServiceAccount 管理 Mock
 * @module mock/kubernetes/security/serviceAccount
 */
import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  ServiceAccountCreateForm,
  ServiceAccountDetailVo,
  ServiceAccountListVo,
  ServiceAccountQueryForm,
  ServiceAccountUpdateForm,
  ServiceAccountYamlVo,
} from '@/types/kubernetes/security/serviceaccount'

import { mockServiceAccountDetail, mockServiceAccountEvents, mockServiceAccounts, mockServiceAccountYaml } from './data'

/**
 * 查看 ServiceAccount 列表
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param query ServiceAccount 查询条件请求对象（名称、UID）
 * @returns ServiceAccount 分页列表
 */
function getServiceAccountListMock(
  clusterUid: string,
  namespaceName: string,
  query: Partial<ServiceAccountQueryForm>,
): PageVo<ServiceAccountListVo> {
  console.log('[Mock] getServiceAccountList', clusterUid, namespaceName, query)
  const filtered = mockServiceAccounts.filter((s: ServiceAccountListVo) => {
    if (s.clusterUid !== clusterUid) return false
    if (namespaceName && s.namespace !== namespaceName) return false
    return true
  })
  const filteredUid = query.uid ? filtered.filter(s => s.uid === query.uid) : []
  const filteredName = query.name ? filtered.filter(s => s.name.includes(query.name as string)) : []
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
 * 查看 ServiceAccount 详情
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name ServiceAccount 名称
 * @returns ServiceAccount 详情响应对象
 */
function getServiceAccountDetailMock(clusterUid: string, namespaceName: string, name: string): ServiceAccountDetailVo {
  console.log('[Mock] getServiceAccountDetail', clusterUid, namespaceName, name)
  return mockServiceAccountDetail
}

/**
 * 查看 ServiceAccount YAML
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name ServiceAccount 名称
 * @returns ServiceAccount YAML 响应对象（完整 YAML 文本）
 */
function getServiceAccountYamlMock(clusterUid: string, namespaceName: string, name: string): ServiceAccountYamlVo {
  console.log('[Mock] getServiceAccountYaml', clusterUid, namespaceName, name)
  return mockServiceAccountYaml
}

/**
 * 查看 ServiceAccount 关联事件列表
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name ServiceAccount 名称
 * @param query 事件查询条件
 * @returns ServiceAccount 关联事件分页列表
 */
function getServiceAccountEventListMock(
  clusterUid: string,
  namespaceName: string,
  name: string,
  query: Partial<EventQueryForm>,
): PageVo<EventListVo> {
  console.log('[Mock] getServiceAccountEventList', clusterUid, namespaceName, name, query)
  const page = query.page || 1
  const pageSize = query.pageSize || 10
  const list = mockServiceAccountEvents.slice((page - 1) * pageSize, page * pageSize)
  return {
    list,
    total: mockServiceAccountEvents.length,
    page,
    pageSize,
  }
}

/**
 * 创建 ServiceAccount
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param data 创建参数
 * @returns void
 */
function createServiceAccountMock(
  clusterUid: string,
  namespaceName: string,
  data: Partial<ServiceAccountCreateForm>,
): void {
  console.log('[Mock] createServiceAccount', clusterUid, namespaceName, data)
}

/**
 * 通过 YAML 创建 ServiceAccount
 * @param clusterUid 集群 UID
 * @param yaml ServiceAccount YAML 文本
 * @returns void
 */
function createServiceAccountYamlMock(clusterUid: string, yaml: string): void {
  console.log('[Mock] createServiceAccountYaml', clusterUid, yaml)
}

/**
 * 更新 ServiceAccount
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name ServiceAccount 名称
 * @param data 更新参数
 * @returns void
 */
function updateServiceAccountMock(
  clusterUid: string,
  namespaceName: string,
  name: string,
  data: Partial<ServiceAccountUpdateForm>,
): void {
  console.log('[Mock] updateServiceAccount', clusterUid, namespaceName, name, data)
}

/**
 * 通过 YAML 更新 ServiceAccount
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name ServiceAccount 名称
 * @param yaml ServiceAccount YAML 文本
 * @returns void
 */
function updateServiceAccountYamlMock(clusterUid: string, namespaceName: string, name: string, yaml: string): void {
  console.log('[Mock] updateServiceAccountYaml', clusterUid, namespaceName, name, yaml)
}

/**
 * 更新 ServiceAccount 标签
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name ServiceAccount 名称
 * @param data 标签更新参数
 * @returns void
 */
function manageServiceAccountLabelMock(
  clusterUid: string,
  namespaceName: string,
  name: string,
  data: MetadataLabelForm,
): void {
  console.log('[Mock] manageServiceAccountLabel', clusterUid, namespaceName, name, data)
}

/**
 * 更新 ServiceAccount 注解
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name ServiceAccount 名称
 * @param data 注解更新参数
 * @returns void
 */
function manageServiceAccountAnnotationMock(
  clusterUid: string,
  namespaceName: string,
  name: string,
  data: MetadataAnnotationForm,
): void {
  console.log('[Mock] manageServiceAccountAnnotation', clusterUid, namespaceName, name, data)
}

/**
 * 删除 ServiceAccount
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name ServiceAccount 名称
 * @returns void
 */
function deleteServiceAccountMock(clusterUid: string, namespaceName: string, name: string): void {
  console.log('[Mock] deleteServiceAccount', clusterUid, namespaceName, name)
}

/**
 * 批量删除 ServiceAccount
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param uids ServiceAccount UID 列表
 * @returns void
 */
function deleteServiceAccountsMock(clusterUid: string, namespaceName: string, uids: string[]): void {
  console.log('[Mock] deleteServiceAccounts', clusterUid, namespaceName, uids)
}

/**
 * 导入 ServiceAccount
 * @param clusterUid 集群 UID
 * @param formData 上传的文件
 * @returns void
 */
function importServiceAccountMock(clusterUid: string, formData: FormData): void {
  void formData
  console.log('[Mock] importServiceAccount', clusterUid)
}

/**
 * 导出 ServiceAccount
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param query ServiceAccount 查询条件请求对象（名称、UID）
 * @returns void
 */
function exportServiceAccountMock(
  clusterUid: string,
  namespaceName: string,
  query: Partial<ServiceAccountQueryForm>,
): void {
  console.log('[Mock] exportServiceAccount', clusterUid, namespaceName, query)
}

export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/serviceaccounts',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<ServiceAccountQueryForm> }) =>
      getServiceAccountListMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/serviceaccounts/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getServiceAccountDetailMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/serviceaccounts/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getServiceAccountYamlMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/serviceaccounts/:name/events',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }) =>
      getServiceAccountEventListMock(
        ctx.pathParams.clusterUid,
        ctx.pathParams.namespace,
        ctx.pathParams.name,
        ctx.params,
      ),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/serviceaccounts',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<ServiceAccountCreateForm> }) =>
      createServiceAccountMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/serviceaccounts/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      createServiceAccountYamlMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/serviceaccounts/:name',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<ServiceAccountUpdateForm> }) =>
      updateServiceAccountMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/serviceaccounts/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      updateServiceAccountYamlMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/serviceaccounts/:name/labels',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataLabelForm }) =>
      manageServiceAccountLabelMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/serviceaccounts/:name/annotations',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataAnnotationForm }) =>
      manageServiceAccountAnnotationMock(
        ctx.pathParams.clusterUid,
        ctx.pathParams.namespace,
        ctx.pathParams.name,
        ctx.data,
      ),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/serviceaccounts/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      deleteServiceAccountMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/serviceaccounts/batch',
    handler: (ctx: { pathParams: Record<string, string>; data: string[] }) =>
      deleteServiceAccountsMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/serviceaccounts/import',
    handler: (ctx: { pathParams: Record<string, string>; data: FormData }) =>
      importServiceAccountMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/serviceaccounts/export',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<ServiceAccountQueryForm> }) =>
      exportServiceAccountMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.params),
  },
]
