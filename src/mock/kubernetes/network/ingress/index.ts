/**
 * Ingress 管理 Mock
 * @module mock/kubernetes/network/ingress
 */
import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  IngressCreateForm,
  IngressDetailVo,
  IngressExportQueryForm,
  IngressListVo,
  IngressQueryForm,
  IngressUpdateForm,
  IngressYamlVo,
} from '@/types/kubernetes/network/ingress'

import { handleEventList } from '@/mock/utils'

import { mockIngressDetail, mockIngressEventList, mockIngressList, mockIngressYaml } from './data'

export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/ingresses',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<IngressQueryForm> }) =>
      getIngressList(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getIngressDetail(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getIngressYaml(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses/:name/events',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }) =>
      getIngressEventList(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/ingresses',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<IngressCreateForm> }) =>
      createIngress(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/ingresses/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      createIngressYaml(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses/:name',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<IngressUpdateForm> }) =>
      updateIngress(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      updateIngressYaml(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses/:name/labels',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataLabelForm }) =>
      manageIngressLabels(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses/:name/annotations',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataAnnotationForm }) =>
      manageIngressAnnotations(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      deleteIngress(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/ingresses/batch',
    handler: (ctx: { pathParams: Record<string, string>; data: string[] }) =>
      deleteIngresses(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/ingresses/import',
    handler: (ctx: { pathParams: Record<string, string>; data: FormData }) =>
      importIngress(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/ingresses/export',
    handler: (ctx: { pathParams: Record<string, string>; params: IngressExportQueryForm }) =>
      exportIngress(ctx.pathParams.clusterUid, ctx.params),
  },
]

/**
 * 获取入口（Ingress）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的入口列表
 */
export function getIngressList(clusterUid: string, query: Partial<IngressQueryForm>): PageVo<IngressListVo> {
  console.log('[Mock] getIngressList', clusterUid, query)
  const filtered = mockIngressList.filter((d: IngressListVo) => {
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
 * 获取入口（Ingress）详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 入口名称
 * @returns 入口详情
 */
export function getIngressDetail(clusterUid: string, namespace: string, name: string): IngressDetailVo {
  console.log('[Mock] getIngressDetail', clusterUid, namespace, name)
  return mockIngressDetail
}

/**
 * 获取入口（Ingress）YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 入口名称
 * @returns 入口 YAML
 */
export function getIngressYaml(clusterUid: string, namespace: string, name: string): IngressYamlVo {
  console.log('[Mock] getIngressYaml', clusterUid, namespace, name)
  return { yaml: mockIngressYaml }
}

/**
 * 获取入口（Ingress）事件（Event）列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 入口名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
export function getIngressEventList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<EventQueryForm>,
): PageVo<EventListVo> {
  console.log('[Mock] getIngressEventList', clusterUid, namespace, name, query)
  return handleEventList(query, mockIngressEventList)
}

/**
 * 创建入口（Ingress）
 * @param clusterUid - 集群 UID
 * @param data - 创建请求对象
 */
export function createIngress(clusterUid: string, data: Partial<IngressCreateForm>): void {
  console.log('[Mock] createIngress', clusterUid, data)
}

/**
 * 创建入口（Ingress）（YAML）
 * @param clusterUid - 集群 UID
 * @param yaml - 创建 YAML 文本
 */
export function createIngressYaml(clusterUid: string, yaml: string): void {
  console.log('[Mock] createIngressYaml', clusterUid, yaml)
}

/**
 * 更新入口（Ingress）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 入口名称
 * @param data - 更新请求对象
 */
export function updateIngress(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<IngressUpdateForm>,
): void {
  console.log('[Mock] updateIngress', clusterUid, namespace, name, data)
}

/**
 * 更新入口（Ingress）（YAML）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 入口名称
 * @param yaml - 更新 YAML 文本
 */
export function updateIngressYaml(clusterUid: string, namespace: string, name: string, yaml: string): void {
  console.log('[Mock] updateIngressYaml', clusterUid, namespace, name, yaml)
}

/**
 * 配置入口（Ingress）标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 入口名称
 * @param data - 标签配置请求对象
 */
export function manageIngressLabels(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataLabelForm,
): void {
  console.log('[Mock] manageIngressLabels', clusterUid, namespace, name, data)
}

/**
 * 配置入口（ingress）注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 入口名称
 * @param data - 注解配置请求对象
 */
export function manageIngressAnnotations(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
): void {
  console.log('[Mock] manageIngressAnnotations', clusterUid, namespace, name, data)
}

/**
 * 删除入口（ingress）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 入口名称
 */
export function deleteIngress(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] deleteIngress', clusterUid, namespace, name)
}

/**
 * 批量删除入口（ingress）
 * @param clusterUid - 集群 UID
 * @param uids - 入口 UID 数组
 */
export function deleteIngresses(clusterUid: string, uids: string[]): void {
  console.log('[Mock] deleteIngresses', clusterUid, uids)
}

/**
 * 导入入口（Ingress）
 * @param clusterUid - 集群 UID
 * @param formData - 文件数据
 * @param onProgress - 上传进度回调
 */
export function importIngress(clusterUid: string, formData: FormData): void {
  void formData
  console.log('[Mock] importIngress', clusterUid)
}

/**
 * 导出入口（Ingress）
 * @param clusterUid - 集群 UID
 * @param query - 导出查询条件
 */
export function exportIngress(clusterUid: string, query: Partial<IngressExportQueryForm>): void {
  console.log('[Mock] exportIngress', clusterUid, query)
}
