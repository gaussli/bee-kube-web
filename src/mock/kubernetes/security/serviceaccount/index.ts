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
  ServiceAccountExportQueryForm,
  ServiceAccountListVo,
  ServiceAccountQueryForm,
  ServiceAccountUpdateForm,
  ServiceAccountYamlVo,
} from '@/types/kubernetes/security/serviceaccount'

import { handleEventList } from '@/mock/utils'

import {
  mockServiceAccountDetail,
  mockServiceAccountEventList,
  mockServiceAccountList,
  mockServiceAccountYaml,
} from './data'

/**
 * 服务账号路由配置
 * @remarks
 * - GET    /kubernetes/clusters/:clusterUid/serviceaccounts                                         - 获取服务账号列表
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/serviceaccounts/:name             - 获取服务账号详情
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/serviceaccounts/:name/yaml        - 获取服务账号 YAML
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/serviceaccounts/:name/events      - 获取服务账号事件列表
 * - POST   /kubernetes/clusters/:clusterUid/serviceaccounts                                         - 创建服务账号
 * - POST   /kubernetes/clusters/:clusterUid/serviceaccounts/yaml                                    - 创建服务账号（YAML）
 * - PUT    /kubernetes/clusters/:clusterUid/namespaces/:namespace/serviceaccounts/:name             - 更新服务账号
 * - PUT    /kubernetes/clusters/:clusterUid/namespaces/:namespace/serviceaccounts/:name/yaml        - 更新服务账号（YAML）
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/serviceaccounts/:name/labels      - 配置服务账号标签
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/serviceaccounts/:name/annotations - 配置服务账号注解
 * - DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespace/serviceaccounts/:name             - 删除服务账号
 * - DELETE /kubernetes/clusters/:clusterUid/serviceaccounts                                         - 批量删除服务账号
 * - POST   /kubernetes/clusters/:clusterUid/serviceaccounts/import                                  - 导入服务账号
 * - GET    /kubernetes/clusters/:clusterUid/serviceaccounts/export                                  - 导出服务账号
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/serviceaccounts',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<ServiceAccountQueryForm> }) =>
      getServiceAccountList(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/serviceaccounts/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getServiceAccountDetail(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/serviceaccounts/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getServiceAccountYaml(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/serviceaccounts/:name/events',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }) =>
      getServiceAccountEventList(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/serviceaccounts',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<ServiceAccountCreateForm> }) =>
      createServiceAccount(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/serviceaccounts/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      createServiceAccountYaml(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/serviceaccounts/:name',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<ServiceAccountUpdateForm> }) =>
      updateServiceAccount(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/serviceaccounts/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      updateServiceAccountYaml(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/serviceaccounts/:name/labels',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataLabelForm }) =>
      manageServiceAccountLabels(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/serviceaccounts/:name/annotations',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataAnnotationForm }) =>
      manageServiceAccountAnnotations(
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
      deleteServiceAccount(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/serviceaccounts',
    handler: (ctx: { pathParams: Record<string, string>; data: string[] }) =>
      deleteServiceAccounts(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/serviceaccounts/import',
    handler: (ctx: { pathParams: Record<string, string>; data: FormData }) =>
      importServiceAccount(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/serviceaccounts/export',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<ServiceAccountExportQueryForm> }) =>
      exportServiceAccount(ctx.pathParams.clusterUid, ctx.params),
  },
]

/**
 * 获取服务账号（ServiceAccount）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的服务账号列表
 */
function getServiceAccountList(
  clusterUid: string,
  query: Partial<ServiceAccountQueryForm>,
): PageVo<ServiceAccountListVo> {
  console.log('[Mock] getServiceAccountList', clusterUid, query)
  const filtered = mockServiceAccountList.filter((d: ServiceAccountListVo) => {
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
 * 获取服务账号（ServiceAccount）详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 服务账号名称
 * @returns 服务账号详情
 */
function getServiceAccountDetail(clusterUid: string, namespace: string, name: string): ServiceAccountDetailVo {
  console.log('[Mock] getServiceAccountDetail', clusterUid, namespace, name)
  return mockServiceAccountDetail
}

/**
 * 获取服务账号（ServiceAccount）YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 服务账号名称
 * @returns 服务账号 YAML
 */
function getServiceAccountYaml(clusterUid: string, namespace: string, name: string): ServiceAccountYamlVo {
  console.log('[Mock] getServiceAccountYaml', clusterUid, namespace, name)
  return { yaml: mockServiceAccountYaml }
}

/**
 * 获取服务账号（ServiceAccount）事件（Event）列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 服务账号名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
function getServiceAccountEventList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<EventQueryForm>,
): PageVo<EventListVo> {
  console.log('[Mock] getServiceAccountEventList', clusterUid, namespace, name, query)
  return handleEventList(query, mockServiceAccountEventList)
}

/**
 * 创建服务账号（ServiceAccount）
 * @param clusterUid - 集群 UID
 * @param data - 创建请求对象
 */
function createServiceAccount(clusterUid: string, data: Partial<ServiceAccountCreateForm>): void {
  console.log('[Mock] createServiceAccount', clusterUid, data)
}

/**
 * 创建服务账号（ServiceAccount）（YAML）
 * @param clusterUid - 集群 UID
 * @param yaml - 创建 YAML 文本
 */
function createServiceAccountYaml(clusterUid: string, yaml: string): void {
  console.log('[Mock] createServiceAccountYaml', clusterUid, yaml)
}

/**
 * 更新服务账号（ServiceAccount）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 服务账号名称
 * @param data - 更新请求对象
 */
function updateServiceAccount(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<ServiceAccountUpdateForm>,
): void {
  console.log('[Mock] updateServiceAccount', clusterUid, namespace, name, data)
}

/**
 * 更新服务账号（ServiceAccount）（YAML）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 服务账号名称
 * @param yaml - 更新 YAML 文本
 */
function updateServiceAccountYaml(clusterUid: string, namespace: string, name: string, yaml: string): void {
  console.log('[Mock] updateServiceAccountYaml', clusterUid, namespace, name, yaml)
}

/**
 * 配置服务账号（ServiceAccount）标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 服务帐号名称
 * @param data - 标签配置请求对象
 */
function manageServiceAccountLabels(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataLabelForm,
): void {
  console.log('[Mock] manageServiceAccountLabels', clusterUid, namespace, name, data)
}

/**
 * 配置服务账号（ServiceAccount）注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 服务帐号名称
 * @param data - 注解配置请求对象
 */
function manageServiceAccountAnnotations(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
): void {
  console.log('[Mock] manageServiceAccountAnnotations', clusterUid, namespace, name, data)
}

/**
 * 删除服务账号（ServiceAccount）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 服务帐号名称
 */
function deleteServiceAccount(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] deleteServiceAccount', clusterUid, namespace, name)
}

/**
 * 批量删除服务账号（ServiceAccount）
 * @param clusterUid - 集群 UID
 * @param uids - 服务帐号 UID 数组
 */
function deleteServiceAccounts(clusterUid: string, uids: string[]): void {
  console.log('[Mock] deleteServiceAccounts', clusterUid, uids)
}

/**
 * 导入服务账号（ServiceAccount）
 * @param clusterUid - 集群 UID
 * @param formData - 文件数据
 */
function importServiceAccount(clusterUid: string, formData: FormData): void {
  void formData
  console.log('[Mock] importServiceAccount', clusterUid)
}

/**
 * 导出服务账号（ServiceAccount）
 * @param clusterUid - 集群 UID
 * @param query - 导出查询条件
 */
function exportServiceAccount(clusterUid: string, query: Partial<ServiceAccountExportQueryForm>): void {
  console.log('[Mock] exportServiceAccount', clusterUid, query)
}
