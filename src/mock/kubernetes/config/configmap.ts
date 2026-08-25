/**
 * ConfigMap 管理 Mock
 * @module mock/kubernetes/config/configmap
 */
import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type {
  ConfigMapCreateForm,
  ConfigMapDetailVo,
  ConfigMapListVo,
  ConfigMapQueryForm,
  ConfigMapUpdateForm,
  ConfigMapYamlVo,
} from '@/types/kubernetes/config/configmap'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'

import { mockConfigMapDetail, mockConfigMapEvents, mockConfigMaps, mockConfigMapYaml } from './configmapData'

/**
 * 查看 ConfigMap 列表
 * @param clusterUid 集群 UID
 * @param query ConfigMap 查询条件请求对象（名称、命名空间、UID）
 * @returns ConfigMap 分页列表
 */
function getConfigMapListMock(clusterUid: string, query: Partial<ConfigMapQueryForm>): PageVo<ConfigMapListVo> {
  console.log('[Mock] getConfigMapList', clusterUid, query)
  const filtered = mockConfigMaps.filter((c: ConfigMapListVo) => {
    if (query.namespace && c.namespace !== query.namespace) return false
    return true
  })
  const filteredUid = query.uid ? filtered.filter(c => c.uid === query.uid) : []
  const filteredName = query.name ? filtered.filter(c => c.name.includes(query.name as string)) : []
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
 * 查看 ConfigMap 详情
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name ConfigMap 名称
 * @returns ConfigMap 详情响应对象
 */
function getConfigMapDetailMock(clusterUid: string, namespace: string, name: string): ConfigMapDetailVo {
  console.log('[Mock] getConfigMapDetail', clusterUid, namespace, name)
  return mockConfigMapDetail
}

/**
 * 查看 ConfigMap YAML
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name ConfigMap 名称
 * @returns ConfigMap YAML 响应对象（完整 YAML 文本）
 */
function getConfigMapYamlMock(clusterUid: string, namespace: string, name: string): ConfigMapYamlVo {
  console.log('[Mock] getConfigMapYaml', clusterUid, namespace, name)
  return mockConfigMapYaml
}

/**
 * 查看 ConfigMap 关联事件列表
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name ConfigMap 名称
 * @param query 事件查询条件
 * @returns ConfigMap 关联事件分页列表
 */
function getConfigMapEventListMock(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<EventQueryForm>,
): PageVo<EventListVo> {
  console.log('[Mock] getConfigMapEventList', clusterUid, namespace, name, query)
  const page = query.page || 1
  const pageSize = query.pageSize || 10
  const list = mockConfigMapEvents.slice((page - 1) * pageSize, page * pageSize)
  return {
    list,
    total: mockConfigMapEvents.length,
    page,
    pageSize,
  }
}

/**
 * 创建 ConfigMap
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param data 创建参数
 * @returns void
 */
function createConfigMapMock(clusterUid: string, namespace: string, data: Partial<ConfigMapCreateForm>): void {
  console.log('[Mock] createConfigMap', clusterUid, namespace, data)
}

/**
 * 通过 YAML 创建 ConfigMap
 * @param clusterUid 集群 UID
 * @param yaml ConfigMap YAML 文本
 * @returns void
 */
function createConfigMapYamlMock(clusterUid: string, yaml: string): void {
  console.log('[Mock] createConfigMapYaml', clusterUid, yaml)
}

/**
 * 更新 ConfigMap
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name ConfigMap 名称
 * @param data 更新参数
 * @returns void
 */
function updateConfigMapMock(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<ConfigMapUpdateForm>,
): void {
  console.log('[Mock] updateConfigMap', clusterUid, namespace, name, data)
}

/**
 * 通过 YAML 更新 ConfigMap
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name ConfigMap 名称
 * @param yaml ConfigMap YAML 文本
 * @returns void
 */
function updateConfigMapYamlMock(clusterUid: string, namespace: string, name: string, yaml: string): void {
  console.log('[Mock] updateConfigMapYaml', clusterUid, namespace, name, yaml)
}

/**
 * 更新 ConfigMap 标签
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name ConfigMap 名称
 * @param data 标签更新参数
 * @returns void
 */
function manageConfigMapLabelMock(clusterUid: string, namespace: string, name: string, data: MetadataLabelForm): void {
  console.log('[Mock] manageConfigMapLabel', clusterUid, namespace, name, data)
}

/**
 * 更新 ConfigMap 注解
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name ConfigMap 名称
 * @param data 注解更新参数
 * @returns void
 */
function manageConfigMapAnnotationMock(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
): void {
  console.log('[Mock] manageConfigMapAnnotation', clusterUid, namespace, name, data)
}

/**
 * 删除 ConfigMap
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name ConfigMap 名称
 * @returns void
 */
function deleteConfigMapMock(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] deleteConfigMap', clusterUid, namespace, name)
}

/**
 * 批量删除 ConfigMap
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param uids ConfigMap UID 列表
 * @returns void
 */
function deleteConfigMapsMock(clusterUid: string, namespace: string, uids: string[]): void {
  console.log('[Mock] deleteConfigMaps', clusterUid, namespace, uids)
}

/**
 * 导入 ConfigMap
 * @param clusterUid 集群 UID
 * @param formData 上传的文件
 * @returns void
 */
function importConfigMapMock(clusterUid: string, formData: FormData): void {
  void formData
  console.log('[Mock] importConfigMap', clusterUid)
}

/**
 * 导出 ConfigMap
 * @param clusterUid 集群 UID
 * @param query ConfigMap 查询条件请求对象（名称、命名空间、UID）
 * @returns void
 */
function exportConfigMapMock(clusterUid: string, query: Partial<ConfigMapQueryForm>): void {
  console.log('[Mock] exportConfigMap', clusterUid, query)
}

export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/configmaps',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<ConfigMapQueryForm> }) =>
      getConfigMapListMock(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getConfigMapDetailMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getConfigMapYamlMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name/events',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }) =>
      getConfigMapEventListMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<ConfigMapCreateForm> }) =>
      createConfigMapMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/configmaps/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      createConfigMapYamlMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<ConfigMapUpdateForm> }) =>
      updateConfigMapMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      updateConfigMapYamlMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name/labels',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataLabelForm }) =>
      manageConfigMapLabelMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name/annotations',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataAnnotationForm }) =>
      manageConfigMapAnnotationMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      deleteConfigMapMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/batch',
    handler: (ctx: { pathParams: Record<string, string>; data: string[] }) =>
      deleteConfigMapsMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/configmaps/import',
    handler: (ctx: { pathParams: Record<string, string>; data: FormData }) =>
      importConfigMapMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/configmaps/export',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<ConfigMapQueryForm> }) =>
      exportConfigMapMock(ctx.pathParams.clusterUid, ctx.params),
  },
]
