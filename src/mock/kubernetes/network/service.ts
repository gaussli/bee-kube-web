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
  ServiceListVo,
  ServiceQueryForm,
  ServiceUpdateForm,
  ServiceYamlVo,
} from '@/types/kubernetes/network/service'

import { mockServiceDetail, mockServiceEvents, mockServices, mockServiceYaml } from './serviceData'

/**
 * 查看 Service 列表
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param query Service 查询条件请求对象（名称、类型、UID）
 * @returns Service 分页列表
 */
function getServiceListMock(
  clusterUid: string,
  namespaceName: string,
  query: Partial<ServiceQueryForm>,
): PageVo<ServiceListVo> {
  console.log('[Mock] getServiceList', clusterUid, namespaceName, query)
  const filtered = mockServices.filter((s: ServiceListVo) => {
    if (s.clusterUid !== clusterUid) return false
    if (namespaceName && s.namespace !== namespaceName) return false
    if (query.type && s.type !== query.type) return false
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
 * 查看 Service 详情
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name Service 名称
 * @returns Service 详情响应对象
 */
function getServiceDetailMock(clusterUid: string, namespaceName: string, name: string): ServiceDetailVo {
  console.log('[Mock] getServiceDetail', clusterUid, namespaceName, name)
  return mockServiceDetail
}

/**
 * 查看 Service YAML
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name Service 名称
 * @returns Service YAML 响应对象（完整 YAML 文本）
 */
function getServiceYamlMock(clusterUid: string, namespaceName: string, name: string): ServiceYamlVo {
  console.log('[Mock] getServiceYaml', clusterUid, namespaceName, name)
  return mockServiceYaml
}

/**
 * 查看 Service 关联事件列表
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name Service 名称
 * @param query 事件查询条件
 * @returns Service 关联事件分页列表
 */
function getServiceEventListMock(
  clusterUid: string,
  namespaceName: string,
  name: string,
  query: Partial<EventQueryForm>,
): PageVo<EventListVo> {
  console.log('[Mock] getServiceEventList', clusterUid, namespaceName, name, query)
  const page = query.page || 1
  const pageSize = query.pageSize || 10
  const list = mockServiceEvents.slice((page - 1) * pageSize, page * pageSize)
  return {
    list,
    total: mockServiceEvents.length,
    page,
    pageSize,
  }
}

/**
 * 创建 Service
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param data 创建参数
 * @returns void
 */
function createServiceMock(clusterUid: string, namespaceName: string, data: Partial<ServiceCreateForm>): void {
  console.log('[Mock] createService', clusterUid, namespaceName, data)
}

/**
 * 通过 YAML 创建 Service
 * @param clusterUid 集群 UID
 * @param yaml Service YAML 文本
 * @returns void
 */
function createServiceYamlMock(clusterUid: string, yaml: string): void {
  console.log('[Mock] createServiceYaml', clusterUid, yaml)
}

/**
 * 更新 Service
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name Service 名称
 * @param data 更新参数
 * @returns void
 */
function updateServiceMock(
  clusterUid: string,
  namespaceName: string,
  name: string,
  data: Partial<ServiceUpdateForm>,
): void {
  console.log('[Mock] updateService', clusterUid, namespaceName, name, data)
}

/**
 * 通过 YAML 更新 Service
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name Service 名称
 * @param yaml Service YAML 文本
 * @returns void
 */
function updateServiceYamlMock(clusterUid: string, namespaceName: string, name: string, yaml: string): void {
  console.log('[Mock] updateServiceYaml', clusterUid, namespaceName, name, yaml)
}

/**
 * 更新 Service 标签
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name Service 名称
 * @param data 标签更新参数
 * @returns void
 */
function manageServiceLabelMock(
  clusterUid: string,
  namespaceName: string,
  name: string,
  data: MetadataLabelForm,
): void {
  console.log('[Mock] manageServiceLabel', clusterUid, namespaceName, name, data)
}

/**
 * 更新 Service 注解
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name Service 名称
 * @param data 注解更新参数
 * @returns void
 */
function manageServiceAnnotationMock(
  clusterUid: string,
  namespaceName: string,
  name: string,
  data: MetadataAnnotationForm,
): void {
  console.log('[Mock] manageServiceAnnotation', clusterUid, namespaceName, name, data)
}

/**
 * 删除 Service
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name Service 名称
 * @returns void
 */
function deleteServiceMock(clusterUid: string, namespaceName: string, name: string): void {
  console.log('[Mock] deleteService', clusterUid, namespaceName, name)
}

/**
 * 批量删除 Service
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param uids Service UID 列表
 * @returns void
 */
function deleteServicesMock(clusterUid: string, namespaceName: string, uids: string[]): void {
  console.log('[Mock] deleteServices', clusterUid, namespaceName, uids)
}

/**
 * 导入 Service
 * @param clusterUid 集群 UID
 * @param formData 上传的文件
 * @returns void
 */
function importServiceMock(clusterUid: string, formData: FormData): void {
  void formData
  console.log('[Mock] importService', clusterUid)
}

/**
 * 导出 Service
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name Service 名称
 * @returns void
 */
function exportServiceMock(clusterUid: string, namespaceName: string, name: string): void {
  console.log('[Mock] exportService', clusterUid, namespaceName, name)
}

export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/services',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<ServiceQueryForm> }) =>
      getServiceListMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getServiceDetailMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getServiceYamlMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name/events',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }) =>
      getServiceEventListMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/services',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<ServiceCreateForm> }) =>
      createServiceMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/services/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      createServiceYamlMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<ServiceUpdateForm> }) =>
      updateServiceMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      updateServiceYamlMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name/labels',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataLabelForm }) =>
      manageServiceLabelMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name/annotations',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataAnnotationForm }) =>
      manageServiceAnnotationMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      deleteServiceMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/services/batch',
    handler: (ctx: { pathParams: Record<string, string>; data: string[] }) =>
      deleteServicesMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/services/import',
    handler: (ctx: { pathParams: Record<string, string>; data: FormData }) =>
      importServiceMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/services/:name/export',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      exportServiceMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
]
