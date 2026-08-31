import type { PageVo } from '@/types/index'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  NamespaceLimitRangeCreateForm,
  NamespaceLimitRangeDetailVo,
  NamespaceLimitRangeUpdateForm,
  NamespaceLimitRangeYamlVo,
} from '@/types/kubernetes/namespace/limitrange'

import { handleEventList } from '@/mock/utils'

import { mockNamespaceLimitRangeDetail, mockNamespaceLimitRangeEventList, mockNamespaceLimitRangeYaml } from './data'

/**
 * 命名空间资源限制路由配置
 * @remarks
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/limitranges/:name             - 获取资源限制详情
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/limitranges/:name/yaml        - 获取资源限制 YAML
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/limitranges/:name/events      - 获取资源限制事件列表
 * - POST   /kubernetes/clusters/:clusterUid/limitranges                                         - 创建资源限制
 * - POST   /kubernetes/clusters/:clusterUid/limitranges/yaml                                    - 创建资源限制（YAML）
 * - PUT    /kubernetes/clusters/:clusterUid/namespaces/:namespace/limitranges/:name             - 更新资源限制
 * - PUT    /kubernetes/clusters/:clusterUid/namespaces/:namespace/limitranges/:name/yaml        - 更新资源限制（YAML）
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/limitranges/:name/labels      - 配置资源限制标签
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/limitranges/:name/annotations - 配置资源限制注解
 * - DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespace/limitranges/:name             - 删除资源限制
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/limitranges/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getNamespaceLimitRangeDetail(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/limitranges/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getNamespaceLimitRangeYaml(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/limitranges/:name/events',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }) =>
      getNamespaceLimitRangeEventList(
        ctx.pathParams.clusterUid,
        ctx.pathParams.namespace,
        ctx.pathParams.name,
        ctx.params,
      ),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/limitranges',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<NamespaceLimitRangeCreateForm> }) =>
      createNamespaceLimitRange(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/limitranges/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      createNamespaceLimitRangeYaml(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/limitranges/:name',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<NamespaceLimitRangeUpdateForm> }) =>
      updateNamespaceLimitRange(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/limitranges/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      updateNamespaceLimitRangeYaml(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/limitranges/:name/labels',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataLabelForm }) =>
      manageNamespaceLimitRangeLabels(
        ctx.pathParams.clusterUid,
        ctx.pathParams.namespace,
        ctx.pathParams.name,
        ctx.data,
      ),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/limitranges/:name/annotations',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataAnnotationForm }) =>
      manageNamespaceLimitRangeAnnotations(
        ctx.pathParams.clusterUid,
        ctx.pathParams.namespace,
        ctx.pathParams.name,
        ctx.data,
      ),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/limitranges/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      deleteNamespaceLimitRange(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
]

/**
 * 获取命名空间（Namespace）的资源限制（LimitRange）详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 资源限制名称
 * @returns 命名空间资源限制详情
 */
function getNamespaceLimitRangeDetail(
  clusterUid: string,
  namespace: string,
  name: string,
): NamespaceLimitRangeDetailVo {
  console.log('[Mock] getNamespaceLimitRangeDetail', clusterUid, namespace, name)
  return mockNamespaceLimitRangeDetail
}

/**
 * 获取命名空间（Namespace）的资源限制（LimitRange）YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 资源限制名称
 * @returns 命名空间资源限制 YAML
 */
function getNamespaceLimitRangeYaml(clusterUid: string, namespace: string, name: string): NamespaceLimitRangeYamlVo {
  console.log('[Mock] getNamespaceLimitRangeYaml', clusterUid, namespace, name)
  return { yaml: mockNamespaceLimitRangeYaml }
}

/**
 * 获取命名空间（Namespace）的资源限制（LimitRange）事件（Event）列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 资源限制名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
function getNamespaceLimitRangeEventList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<EventQueryForm>,
): PageVo<EventListVo> {
  console.log('[Mock] getNamespaceLimitRangeEventList', clusterUid, namespace, name, query)
  return handleEventList(query, mockNamespaceLimitRangeEventList)
}

/**
 * 创建命名空间（Namespace）的资源限制（LimitRange）
 * @param clusterUid - 集群 UID
 * @param data - 创建请求对象
 */
function createNamespaceLimitRange(clusterUid: string, data: Partial<NamespaceLimitRangeCreateForm>): void {
  console.log('[Mock] createNamespaceLimitRange', clusterUid, data)
}

/**
 * 创建命名空间（Namespace）的资源限制（LimitRange）（YAML）
 * @param clusterUid - 集群 UID
 * @param yaml - 创建 YAML 文本
 */
function createNamespaceLimitRangeYaml(clusterUid: string, yaml: string): void {
  console.log('[Mock] createNamespaceLimitRangeYaml', clusterUid, yaml)
}

/**
 * 更新命名空间（Namespace）的资源限制（LimitRange）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 资源限制名称
 * @param data - 更新请求对象
 */
function updateNamespaceLimitRange(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<NamespaceLimitRangeUpdateForm>,
): void {
  console.log('[Mock] updateNamespaceLimitRange', clusterUid, namespace, name, data)
}

/**
 * 更新命名空间（Namespace）的资源限制（LimitRange）（YAML）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 资源限制名称
 * @param yaml - 更新 YAML 文本
 */
function updateNamespaceLimitRangeYaml(clusterUid: string, namespace: string, name: string, yaml: string): void {
  console.log('[Mock] updateNamespaceLimitRangeYaml', clusterUid, namespace, name, yaml)
}

/**
 * 配置命名空间（Namespace）的资源限制（LimitRange）标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 资源限制名称
 * @param data - 标签配置请求对象
 */
function manageNamespaceLimitRangeLabels(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataLabelForm,
): void {
  console.log('[Mock] manageNamespaceLimitRangeLabels', clusterUid, namespace, name, data)
}

/**
 * 配置命名空间（Namespace）的资源限制（LimitRange）注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 资源限制名称
 * @param data - 注解配置请求对象
 */
function manageNamespaceLimitRangeAnnotations(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
): void {
  console.log('[Mock] manageNamespaceLimitRangeAnnotations', clusterUid, namespace, name, data)
}

/**
 * 删除命名空间（Namespace）的资源限制（LimitRange）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 资源限制名称
 */
function deleteNamespaceLimitRange(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] deleteNamespaceLimitRange', clusterUid, namespace, name)
}
