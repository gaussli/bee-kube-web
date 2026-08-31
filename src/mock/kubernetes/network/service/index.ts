/**
 * Service 管理 Mock
 * @module mock/kubernetes/network/service
 */
import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  ServiceCreateForm,
  ServiceDetailVo,
  ServiceExportQueryForm,
  ServiceListVo,
  ServiceQueryForm,
  ServiceUpdateForm,
  ServiceYamlVo,
} from '@/types/kubernetes/network/service'

import { handleEventList } from '@/mock/utils'

import { mockServiceDetail, mockServiceEventList, mockServiceList, mockServiceYaml } from './data'

/**
 * 服务路由配置
 * @remarks
 * - GET    /kubernetes/clusters/:clusterUid/services                                         - 获取服务列表
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name             - 获取服务详情
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name/yaml        - 获取服务 YAML
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name/events      - 获取服务事件列表
 * - POST   /kubernetes/clusters/:clusterUid/services                                         - 创建服务
 * - POST   /kubernetes/clusters/:clusterUid/services/yaml                                    - 创建服务（YAML）
 * - PUT    /kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name             - 更新服务
 * - PUT    /kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name/yaml        - 更新服务（YAML）
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name/labels      - 配置服务标签
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name/annotations - 配置服务注解
 * - DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name             - 删除服务
 * - DELETE /kubernetes/clusters/:clusterUid/services                                         - 批量删除服务
 * - POST   /kubernetes/clusters/:clusterUid/services/import                                  - 导入服务
 * - GET    /kubernetes/clusters/:clusterUid/services/export                                  - 导出服务
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/services',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<ServiceQueryForm> }) =>
      getServiceList(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getServiceDetail(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getServiceYaml(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name/events',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }) =>
      getServiceEventList(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/services',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<ServiceCreateForm> }) =>
      createService(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/services/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      createServiceYaml(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<ServiceUpdateForm> }) =>
      updateService(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      updateServiceYaml(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name/labels',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataLabelForm }) =>
      manageServiceLabels(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name/annotations',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataAnnotationForm }) =>
      manageServiceAnnotations(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      deleteService(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/services',
    handler: (ctx: { pathParams: Record<string, string>; data: string[] }) =>
      deleteServices(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/services/import',
    handler: (ctx: { pathParams: Record<string, string>; data: FormData }) =>
      importService(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/services/export',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<ServiceExportQueryForm> }) =>
      exportService(ctx.pathParams.clusterUid, ctx.params),
  },
]

/**
 * 获取服务（Service）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的服务列表
 */
function getServiceList(clusterUid: string, query: Partial<ServiceQueryForm>): PageVo<ServiceListVo> {
  console.log('[Mock] getServiceList', clusterUid, query)
  const filtered = mockServiceList.filter((d: ServiceListVo) => {
    if (query.namespace && d.namespace !== query.namespace) return false
    if (query.type && d.type !== query.type) return false
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
 * 获取服务（Service）详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 服务名称
 * @returns 服务详情
 */
function getServiceDetail(clusterUid: string, namespace: string, name: string): ServiceDetailVo {
  console.log('[Mock] getServiceDetail', clusterUid, namespace, name)
  return mockServiceDetail
}

/**
 * 获取服务（Service）YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 服务名称
 * @returns 服务 YAML
 */
function getServiceYaml(clusterUid: string, namespace: string, name: string): ServiceYamlVo {
  console.log('[Mock] getServiceYaml', clusterUid, namespace, name)
  return { yaml: mockServiceYaml }
}

/**
 * 获取服务（Service）事件（Event）列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 服务名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
function getServiceEventList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<EventQueryForm>,
): PageVo<EventListVo> {
  console.log('[Mock] getServiceEventList', clusterUid, namespace, name, query)
  return handleEventList(query, mockServiceEventList)
}

/**
 * 创建服务（Service）
 * @param clusterUid - 集群 UID
 * @param data - 创建请求对象
 */
function createService(clusterUid: string, data: Partial<ServiceCreateForm>): void {
  console.log('[Mock] createService', clusterUid, data)
}

/**
 * 创建服务（Service）（YAML）
 * @param clusterUid - 集群 UID
 * @param yaml - 创建 YAML 文本
 */
function createServiceYaml(clusterUid: string, yaml: string): void {
  console.log('[Mock] createServiceYaml', clusterUid, yaml)
}

/**
 * 更新服务（Service）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 服务名称
 * @param data - 更新请求对象
 */
function updateService(clusterUid: string, namespace: string, name: string, data: Partial<ServiceUpdateForm>): void {
  console.log('[Mock] updateService', clusterUid, namespace, name, data)
}

/**
 * 更新服务（Service）（YAML）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 服务名称
 * @param yaml - 更新 YAML 文本
 */
function updateServiceYaml(clusterUid: string, namespace: string, name: string, yaml: string): void {
  console.log('[Mock] updateServiceYaml', clusterUid, namespace, name, yaml)
}

/**
 * 配置服务（Service）标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 服务名称
 * @param data - 标签配置请求对象
 */
function manageServiceLabels(clusterUid: string, namespace: string, name: string, data: MetadataLabelForm): void {
  console.log('[Mock] manageServiceLabels', clusterUid, namespace, name, data)
}

/**
 * 配置服务（Service）注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 服务名称
 * @param data - 注解配置请求对象
 */
function manageServiceAnnotations(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
): void {
  console.log('[Mock] manageServiceAnnotations', clusterUid, namespace, name, data)
}

/**
 * 删除服务（Service）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 服务名称
 */
function deleteService(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] deleteService', clusterUid, namespace, name)
}

/**
 * 批量删除服务（Service）
 * @param clusterUid - 集群 UID
 * @param uids - 服务 UID 数组
 */
function deleteServices(clusterUid: string, uids: string[]): void {
  console.log('[Mock] deleteServices', clusterUid, uids)
}

/**
 * 导入服务（Service）
 * @param clusterUid - 集群 UID
 * @param formData - 文件数据
 */
function importService(clusterUid: string, formData: FormData): void {
  void formData
  console.log('[Mock] importService', clusterUid)
}

/**
 * 导出服务（Service）
 * @param clusterUid - 集群 UID
 * @param query - 导出查询条件
 */
function exportService(clusterUid: string, query: Partial<ServiceExportQueryForm>): void {
  console.log('[Mock] exportService', clusterUid, query)
}
