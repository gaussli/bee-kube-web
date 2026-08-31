import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  NamespaceResourceQuotaCreateForm,
  NamespaceResourceQuotaDetailVo,
  NamespaceResourceQuotaUpdateForm,
  NamespaceResourceQuotaYamlVo,
} from '@/types/kubernetes/namespace/resourcequota'

import { handleEventList } from '@/mock/utils'

import {
  mockNamespaceResourceQuotaDetail,
  mockNamespaceResourceQuotaEventList,
  mockNamespaceResourceQuotaYaml,
} from './data'

/**
 * 命名空间资源配额路由配置
 * @remarks
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/resourcequotas/:name             - 获取资源配额详情
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/resourcequotas/:name/yaml        - 获取资源配额 YAML
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/resourcequotas/:name/events      - 获取资源配额事件列表
 * - POST   /kubernetes/clusters/:clusterUid/resourcequotas                                         - 创建资源配额
 * - POST   /kubernetes/clusters/:clusterUid/resourcequotas/yaml                                    - 创建资源配额（YAML）
 * - PUT    /kubernetes/clusters/:clusterUid/namespaces/:namespace/resourcequotas/:name             - 更新资源配额
 * - PUT    /kubernetes/clusters/:clusterUid/namespaces/:namespace/resourcequotas/:name/yaml        - 更新资源配额（YAML）
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/resourcequotas/:name/labels      - 配置资源配额标签
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/resourcequotas/:name/annotations - 配置资源配额注解
 * - DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespace/resourcequotas/:name             - 删除资源配额
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/resourcequotas/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getNamespaceResourceQuotaDetail(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/resourcequotas/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getNamespaceResourceQuotaYaml(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/resourcequotas/:name/events',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }) =>
      getNamespaceResourceQuotaEventList(
        ctx.pathParams.clusterUid,
        ctx.pathParams.namespace,
        ctx.pathParams.name,
        ctx.params,
      ),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/resourcequotas',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<NamespaceResourceQuotaCreateForm> }) =>
      createNamespaceResourceQuota(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/resourcequotas/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      createNamespaceResourceQuotaYaml(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/resourcequotas/:name',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<NamespaceResourceQuotaUpdateForm> }) =>
      updateNamespaceResourceQuota(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/resourcequotas/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      updateNamespaceResourceQuotaYaml(
        ctx.pathParams.clusterUid,
        ctx.pathParams.namespace,
        ctx.pathParams.name,
        ctx.data,
      ),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/resourcequotas/:name/labels',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataLabelForm }) =>
      manageNamespaceResourceQuotaLabels(
        ctx.pathParams.clusterUid,
        ctx.pathParams.namespace,
        ctx.pathParams.name,
        ctx.data,
      ),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/resourcequotas/:name/annotations',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataAnnotationForm }) =>
      manageNamespaceResourceQuotaAnnotations(
        ctx.pathParams.clusterUid,
        ctx.pathParams.namespace,
        ctx.pathParams.name,
        ctx.data,
      ),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/resourcequotas/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      deleteNamespaceResourceQuota(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
]

/**
 * 获取命名空间（Namespace）的资源配额（ResourceQuota）详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 资源配额名称
 * @returns 命名空间资源配额详情
 */
function getNamespaceResourceQuotaDetail(
  clusterUid: string,
  namespace: string,
  name: string,
): NamespaceResourceQuotaDetailVo {
  console.log('[Mock] getNamespaceResourceQuotaDetail', clusterUid, namespace, name)
  return mockNamespaceResourceQuotaDetail
}

/**
 * 获取命名空间（Namespace）的资源配额（ResourceQuota）YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 资源配额名称
 * @returns 命名空间资源配额 YAML
 */
function getNamespaceResourceQuotaYaml(
  clusterUid: string,
  namespace: string,
  name: string,
): NamespaceResourceQuotaYamlVo {
  console.log('[Mock] getNamespaceResourceQuotaYaml', clusterUid, namespace, name)
  return { yaml: mockNamespaceResourceQuotaYaml }
}

/**
 * 获取命名空间（Namespace）的资源配额（ResourceQuota）事件（Event）列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 资源配额名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
function getNamespaceResourceQuotaEventList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<EventQueryForm>,
): PageVo<EventListVo> {
  console.log('[Mock] getNamespaceResourceQuotaEventList', clusterUid, namespace, name, query)
  return handleEventList(query, mockNamespaceResourceQuotaEventList)
}

/**
 * 创建命名空间（Namespace）的资源配额（ResourceQuota）
 * @param clusterUid - 集群 UID
 * @param data - 创建请求对象
 */
function createNamespaceResourceQuota(clusterUid: string, data: Partial<NamespaceResourceQuotaCreateForm>): void {
  console.log('[Mock] createNamespaceResourceQuota', clusterUid, data)
}

/**
 * 创建命名空间（Namespace）的资源配额（ResourceQuota）（YAML）
 * @param clusterUid - 集群 UID
 * @param yaml - 创建 YAML 文本
 */
function createNamespaceResourceQuotaYaml(clusterUid: string, yaml: string): void {
  console.log('[Mock] createNamespaceResourceQuotaYaml', clusterUid, yaml)
}

/**
 * 更新命名空间（Namespace）的资源配额（ResourceQuota）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 资源配额名称
 * @param data - 更新请求对象
 */
function updateNamespaceResourceQuota(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<NamespaceResourceQuotaUpdateForm>,
): void {
  console.log('[Mock] updateNamespaceResourceQuota', clusterUid, namespace, name, data)
}

/**
 * 更新命名空间（Namespace）的资源配额（ResourceQuota）（YAML）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 资源配额名称
 * @param yaml - 更新 YAML 文本
 */
function updateNamespaceResourceQuotaYaml(clusterUid: string, namespace: string, name: string, yaml: string): void {
  console.log('[Mock] updateNamespaceResourceQuotaYaml', clusterUid, namespace, name, yaml)
}

/**
 * 配置命名空间（Namespace）的资源配额（ResourceQuota）标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 资源配额名称
 * @param data - 标签配置请求对象
 */
function manageNamespaceResourceQuotaLabels(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataLabelForm,
): void {
  console.log('[Mock] manageNamespaceResourceQuotaLabels', clusterUid, namespace, name, data)
}

/**
 * 配置命名空间（Namespace）的资源配额（ResourceQuota）注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 资源配额名称
 * @param data - 注解配置请求对象
 */
function manageNamespaceResourceQuotaAnnotations(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
): void {
  console.log('[Mock] manageNamespaceResourceQuotaAnnotations', clusterUid, namespace, name, data)
}

/**
 * 删除命名空间（Namespace）的资源配额（ResourceQuota）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 资源配额名称
 */
function deleteNamespaceResourceQuota(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] deleteNamespaceResourceQuota', clusterUid, namespace, name)
}
