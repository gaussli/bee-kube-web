/**
 * ConfigMap 管理 Mock
 * @module mock/kubernetes/config/configmap
 */
import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type {
  ConfigMapCreateForm,
  ConfigMapDetailVo,
  ConfigMapExportQueryForm,
  ConfigMapListVo,
  ConfigMapQueryForm,
  ConfigMapUpdateForm,
  ConfigMapYamlVo,
} from '@/types/kubernetes/config/configmap'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'

import { handleEventList } from '@/mock/utils'

import { mockConfigMapDetail, mockConfigMapEventList, mockConfigMapList, mockConfigMapYaml } from './data'

/**
 * 配置映射路由配置
 * @remarks
 * - GET    /kubernetes/clusters/:clusterUid/configmaps                                         - 获取配置映射列表
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name             - 获取配置映射详情
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name/yaml        - 获取配置映射 YAML
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name/events      - 获取配置映射事件列表
 * - POST   /kubernetes/clusters/:clusterUid/configmaps                                         - 创建配置映射
 * - POST   /kubernetes/clusters/:clusterUid/configmaps/yaml                                    - 创建配置映射（YAML）
 * - PUT    /kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name             - 更新配置映射
 * - PUT    /kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name/yaml        - 更新配置映射（YAML）
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name/labels      - 配置配置映射标签
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name/annotations - 配置配置映射注解
 * - DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name             - 删除配置映射
 * - DELETE /kubernetes/clusters/:clusterUid/configmaps                                         - 批量删除配置映射
 * - POST   /kubernetes/clusters/:clusterUid/configmaps/import                                  - 导入配置映射
 * - GET    /kubernetes/clusters/:clusterUid/configmaps/export                                  - 导出配置映射
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/configmaps',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<ConfigMapQueryForm> }) =>
      getConfigMapList(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getConfigMapDetail(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getConfigMapYaml(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name/events',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }) =>
      getConfigMapEventList(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/configmaps',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<ConfigMapCreateForm> }) =>
      createConfigMap(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/configmaps/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      createConfigMapYaml(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<ConfigMapUpdateForm> }) =>
      updateConfigMap(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      updateConfigMapYaml(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name/labels',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataLabelForm }) =>
      manageConfigMapLabels(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name/annotations',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataAnnotationForm }) =>
      manageConfigMapAnnotations(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      deleteConfigMap(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/configmaps',
    handler: (ctx: { pathParams: Record<string, string>; data: string[] }) =>
      deleteConfigMaps(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/configmaps/import',
    handler: (ctx: { pathParams: Record<string, string>; data: FormData }) =>
      importConfigMap(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/configmaps/export',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<ConfigMapQueryForm> }) =>
      exportConfigMap(ctx.pathParams.clusterUid, ctx.params),
  },
]

/**
 * 获取配置映射（ConfigMap）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的配置映射列表
 */
function getConfigMapList(clusterUid: string, query: Partial<ConfigMapQueryForm>): PageVo<ConfigMapListVo> {
  console.log('[Mock] getConfigMapList', clusterUid, query)
  const filtered = mockConfigMapList.filter((d: ConfigMapListVo) => {
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
 * 获取配置映射（ConfigMap）详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 配置映射名称
 * @returns 配置映射详情
 */
function getConfigMapDetail(clusterUid: string, namespace: string, name: string): ConfigMapDetailVo {
  console.log('[Mock] getConfigMapDetail', clusterUid, namespace, name)
  return mockConfigMapDetail
}

/**
 * 获取配置映射（ConfigMap）YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 配置映射名称
 * @returns 配置映射 YAML
 */
function getConfigMapYaml(clusterUid: string, namespace: string, name: string): ConfigMapYamlVo {
  console.log('[Mock] getConfigMapYaml', clusterUid, namespace, name)
  return { yaml: mockConfigMapYaml }
}

/**
 * 获取配置映射（ConfigMap）事件（Event）列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 配置映射名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
function getConfigMapEventList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<EventQueryForm>,
): PageVo<EventListVo> {
  console.log('[Mock] getConfigMapEventList', clusterUid, namespace, name, query)
  return handleEventList(query, mockConfigMapEventList)
}

/**
 * 创建配置映射（ConfigMap）
 * @param clusterUid - 集群 UID
 * @param data - 创建请求对象
 */
function createConfigMap(clusterUid: string, data: Partial<ConfigMapCreateForm>): void {
  console.log('[Mock] createConfigMap', clusterUid, data)
}

/**
 * 创建配置映射（ConfigMap）（YAML）
 * @param clusterUid - 集群 UID
 * @param yaml - 创建 YAML 文本
 */
function createConfigMapYaml(clusterUid: string, yaml: string): void {
  console.log('[Mock] createConfigMapYaml', clusterUid, yaml)
}

/**
 * 更新配置映射（ConfigMap）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 配置映射名称
 * @param data - 更新请求对象
 */
function updateConfigMap(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<ConfigMapUpdateForm>,
): void {
  console.log('[Mock] updateConfigMap', clusterUid, namespace, name, data)
}

/**
 * 更新配置映射（ConfigMap）（YAML）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 配置映射名称
 * @param yaml - 更新 YAML 文本
 */
function updateConfigMapYaml(clusterUid: string, namespace: string, name: string, yaml: string): void {
  console.log('[Mock] updateConfigMapYaml', clusterUid, namespace, name, yaml)
}

/**
 * 配置配置映射（ConfigMap）标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 配置映射名称
 * @param data - 标签配置请求对象
 */
function manageConfigMapLabels(clusterUid: string, namespace: string, name: string, data: MetadataLabelForm): void {
  console.log('[Mock] manageConfigMapLabels', clusterUid, namespace, name, data)
}

/**
 * 配置配置映射（ConfigMap）注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 配置映射名称
 * @param data - 注解配置请求对象
 */
function manageConfigMapAnnotations(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
): void {
  console.log('[Mock] manageConfigMapAnnotations', clusterUid, namespace, name, data)
}

/**
 * 删除配置映射（ConfigMap）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 配置映射名称
 */
function deleteConfigMap(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] deleteConfigMap', clusterUid, namespace, name)
}

/**
 * 批量删除配置映射（ConfigMap）
 * @param clusterUid - 集群 UID
 * @param uids - 配置映射 UID 数组
 */
function deleteConfigMaps(clusterUid: string, uids: string[]): void {
  console.log('[Mock] deleteConfigMaps', clusterUid, uids)
}

/**
 * 导入配置映射（ConfigMap）
 * @param clusterUid - 集群 UID
 * @param formData - 文件数据
 */
function importConfigMap(clusterUid: string, formData: FormData): void {
  void formData
  console.log('[Mock] importConfigMap', clusterUid)
}

/**
 * 导出配置映射（ConfigMap）
 * @param clusterUid - 集群 UID
 * @param query - 导出查询条件
 */
function exportConfigMap(clusterUid: string, query: Partial<ConfigMapExportQueryForm>): void {
  console.log('[Mock] exportConfigMap', clusterUid, query)
}
