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
  IngressListVo,
  IngressQueryForm,
  IngressUpdateForm,
  IngressYamlVo,
} from '@/types/kubernetes/network/ingress'

import { mockIngressDetail, mockIngressEvents, mockIngresses, mockIngressYaml } from './ingressData'

/**
 * 查看 Ingress 列表
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param query Ingress 查询条件请求对象（名称、Ingress 类名、UID）
 * @returns Ingress 分页列表
 */
function getIngressListMock(
  clusterUid: string,
  namespaceName: string,
  query: Partial<IngressQueryForm>,
): PageVo<IngressListVo> {
  console.log('[Mock] getIngressList', clusterUid, namespaceName, query)
  const filtered = mockIngresses.filter((i: IngressListVo) => {
    if (i.clusterUid !== clusterUid) return false
    if (namespaceName && i.namespace !== namespaceName) return false
    if (query.ingressClassName && i.ingressClassName !== query.ingressClassName) return false
    return true
  })
  const filteredUid = query.uid ? filtered.filter(i => i.uid === query.uid) : []
  const filteredName = query.name ? filtered.filter(i => i.name.includes(query.name as string)) : []
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
 * 查看 Ingress 详情
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name Ingress 名称
 * @returns Ingress 详情响应对象
 */
function getIngressDetailMock(clusterUid: string, namespaceName: string, name: string): IngressDetailVo {
  console.log('[Mock] getIngressDetail', clusterUid, namespaceName, name)
  return mockIngressDetail
}

/**
 * 查看 Ingress YAML
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name Ingress 名称
 * @returns Ingress YAML 响应对象（完整 YAML 文本）
 */
function getIngressYamlMock(clusterUid: string, namespaceName: string, name: string): IngressYamlVo {
  console.log('[Mock] getIngressYaml', clusterUid, namespaceName, name)
  return mockIngressYaml
}

/**
 * 查看 Ingress 关联事件列表
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name Ingress 名称
 * @param query 事件查询条件
 * @returns Ingress 关联事件分页列表
 */
function getIngressEventListMock(
  clusterUid: string,
  namespaceName: string,
  name: string,
  query: Partial<EventQueryForm>,
): PageVo<EventListVo> {
  console.log('[Mock] getIngressEventList', clusterUid, namespaceName, name, query)
  const page = query.page || 1
  const pageSize = query.pageSize || 10
  const list = mockIngressEvents.slice((page - 1) * pageSize, page * pageSize)
  return {
    list,
    total: mockIngressEvents.length,
    page,
    pageSize,
  }
}

/**
 * 创建 Ingress
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param data 创建参数
 * @returns void
 */
function createIngressMock(clusterUid: string, namespaceName: string, data: Partial<IngressCreateForm>): void {
  console.log('[Mock] createIngress', clusterUid, namespaceName, data)
}

/**
 * 通过 YAML 创建 Ingress
 * @param clusterUid 集群 UID
 * @param yaml Ingress YAML 文本
 * @returns void
 */
function createIngressYamlMock(clusterUid: string, yaml: string): void {
  console.log('[Mock] createIngressYaml', clusterUid, yaml)
}

/**
 * 更新 Ingress
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name Ingress 名称
 * @param data 更新参数
 * @returns void
 */
function updateIngressMock(
  clusterUid: string,
  namespaceName: string,
  name: string,
  data: Partial<IngressUpdateForm>,
): void {
  console.log('[Mock] updateIngress', clusterUid, namespaceName, name, data)
}

/**
 * 通过 YAML 更新 Ingress
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name Ingress 名称
 * @param yaml Ingress YAML 文本
 * @returns void
 */
function updateIngressYamlMock(clusterUid: string, namespaceName: string, name: string, yaml: string): void {
  console.log('[Mock] updateIngressYaml', clusterUid, namespaceName, name, yaml)
}

/**
 * 更新 Ingress 标签
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name Ingress 名称
 * @param data 标签更新参数
 * @returns void
 */
function manageIngressLabelMock(
  clusterUid: string,
  namespaceName: string,
  name: string,
  data: MetadataLabelForm,
): void {
  console.log('[Mock] manageIngressLabel', clusterUid, namespaceName, name, data)
}

/**
 * 更新 Ingress 注解
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name Ingress 名称
 * @param data 注解更新参数
 * @returns void
 */
function manageIngressAnnotationMock(
  clusterUid: string,
  namespaceName: string,
  name: string,
  data: MetadataAnnotationForm,
): void {
  console.log('[Mock] manageIngressAnnotation', clusterUid, namespaceName, name, data)
}

/**
 * 删除 Ingress
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name Ingress 名称
 * @returns void
 */
function deleteIngressMock(clusterUid: string, namespaceName: string, name: string): void {
  console.log('[Mock] deleteIngress', clusterUid, namespaceName, name)
}

/**
 * 批量删除 Ingress
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param uids Ingress UID 列表
 * @returns void
 */
function deleteIngressesMock(clusterUid: string, namespaceName: string, uids: string[]): void {
  console.log('[Mock] deleteIngresses', clusterUid, namespaceName, uids)
}

/**
 * 导入 Ingress
 * @param clusterUid 集群 UID
 * @param formData 上传的文件
 * @returns void
 */
function importIngressMock(clusterUid: string, formData: FormData): void {
  void formData
  console.log('[Mock] importIngress', clusterUid)
}

/**
 * 导出 Ingress
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name Ingress 名称
 * @returns void
 */
function exportIngressMock(clusterUid: string, namespaceName: string, name: string): void {
  console.log('[Mock] exportIngress', clusterUid, namespaceName, name)
}

export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<IngressQueryForm> }) =>
      getIngressListMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getIngressDetailMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getIngressYamlMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses/:name/events',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }) =>
      getIngressEventListMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<IngressCreateForm> }) =>
      createIngressMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/ingresses/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      createIngressYamlMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses/:name',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<IngressUpdateForm> }) =>
      updateIngressMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      updateIngressYamlMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses/:name/labels',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataLabelForm }) =>
      manageIngressLabelMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses/:name/annotations',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataAnnotationForm }) =>
      manageIngressAnnotationMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      deleteIngressMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses/batch',
    handler: (ctx: { pathParams: Record<string, string>; data: string[] }) =>
      deleteIngressesMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/ingresses/import',
    handler: (ctx: { pathParams: Record<string, string>; data: FormData }) =>
      importIngressMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/ingresses/:name/export',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      exportIngressMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
]
