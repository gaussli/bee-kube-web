/**
 * PersistentVolumeClaim 管理 Mock
 * @module mock/kubernetes/storage/persistentVolumeClaim
 */
import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  PersistentVolumeClaimCreateForm,
  PersistentVolumeClaimDetailVo,
  PersistentVolumeClaimExportQueryForm,
  PersistentVolumeClaimListVo,
  PersistentVolumeClaimQueryForm,
  PersistentVolumeClaimUpdateForm,
  PersistentVolumeClaimYamlVo,
} from '@/types/kubernetes/storage/persistentvolumeclaim'

import { handleEventList } from '@/mock/utils'

import {
  mockPersistentVolumeClaimDetail,
  mockPersistentVolumeClaimEventList,
  mockPersistentVolumeClaimList,
  mockPersistentVolumeClaimYaml,
} from './data'

/**
 * 持久卷声明路由配置
 * @remarks
 * - GET    /kubernetes/clusters/:clusterUid/persistentvolumeclaims                                         - 获取持久卷声明列表
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/persistentvolumeclaims/:name             - 获取持久卷声明详情
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/persistentvolumeclaims/:name/yaml        - 获取持久卷声明 YAML
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/persistentvolumeclaims/:name/events      - 获取持久卷声明事件列表
 * - POST   /kubernetes/clusters/:clusterUid/persistentvolumeclaims                                         - 创建持久卷声明
 * - POST   /kubernetes/clusters/:clusterUid/persistentvolumeclaims/yaml                                    - 创建持久卷声明（YAML）
 * - PUT    /kubernetes/clusters/:clusterUid/namespaces/:namespace/persistentvolumeclaims/:name             - 更新持久卷声明
 * - PUT    /kubernetes/clusters/:clusterUid/namespaces/:namespace/persistentvolumeclaims/:name/yaml        - 更新持久卷声明（YAML）
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/persistentvolumeclaims/:name/labels      - 配置持久卷声明标签
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/persistentvolumeclaims/:name/annotations - 配置持久卷声明注解
 * - DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespace/persistentvolumeclaims/:name             - 删除持久卷声明
 * - DELETE /kubernetes/clusters/:clusterUid/persistentvolumeclaims                                         - 批量删除持久卷声明
 * - POST   /kubernetes/clusters/:clusterUid/persistentvolumeclaims/import                                  - 导入持久卷声明
 * - GET    /kubernetes/clusters/:clusterUid/persistentvolumeclaims/export                                  - 导出持久卷声明
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/persistentvolumeclaims',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<PersistentVolumeClaimQueryForm> }) =>
      getPersistentVolumeClaimList(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/persistentvolumeclaims/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getPersistentVolumeClaimDetail(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/persistentvolumeclaims/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getPersistentVolumeClaimYaml(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/persistentvolumeclaims/:name/events',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }) =>
      getPersistentVolumeClaimEventList(
        ctx.pathParams.clusterUid,
        ctx.pathParams.namespace,
        ctx.pathParams.name,
        ctx.params,
      ),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/persistentvolumeclaims',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<PersistentVolumeClaimCreateForm> }) =>
      createPersistentVolumeClaim(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/persistentvolumeclaims/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      createPersistentVolumeClaimYaml(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/persistentvolumeclaims/:name',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<PersistentVolumeClaimUpdateForm> }) =>
      updatePersistentVolumeClaim(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/persistentvolumeclaims/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      updatePersistentVolumeClaimYaml(
        ctx.pathParams.clusterUid,
        ctx.pathParams.namespace,
        ctx.pathParams.name,
        ctx.data,
      ),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/persistentvolumeclaims/:name/labels',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataLabelForm }) =>
      managePersistentVolumeClaimLabels(
        ctx.pathParams.clusterUid,
        ctx.pathParams.namespace,
        ctx.pathParams.name,
        ctx.data,
      ),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/persistentvolumeclaims/:name/annotations',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataAnnotationForm }) =>
      managePersistentVolumeClaimAnnotations(
        ctx.pathParams.clusterUid,
        ctx.pathParams.namespace,
        ctx.pathParams.name,
        ctx.data,
      ),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/persistentvolumeclaims/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      deletePersistentVolumeClaim(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/persistentvolumeclaims',
    handler: (ctx: { pathParams: Record<string, string>; data: string[] }) =>
      deletePersistentVolumeClaims(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/persistentvolumeclaims/import',
    handler: (ctx: { pathParams: Record<string, string>; data: FormData }) =>
      importPersistentVolumeClaim(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/persistentvolumeclaims/export',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<PersistentVolumeClaimExportQueryForm> }) =>
      exportPersistentVolumeClaim(ctx.pathParams.clusterUid, ctx.params),
  },
]

/**
 * 获取持久卷声明（PersistentVolumeClaim）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的持久卷声明列表
 */
function getPersistentVolumeClaimList(
  clusterUid: string,
  query: Partial<PersistentVolumeClaimQueryForm>,
): PageVo<PersistentVolumeClaimListVo> {
  console.log('[Mock] getPersistentVolumeClaimList', clusterUid, query)
  const filtered = mockPersistentVolumeClaimList.filter((d: PersistentVolumeClaimListVo) => {
    if (query.namespace && d.namespace !== query.namespace) return false
    if (query.status && d.status !== query.status) return false
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
 * 获取持久卷声明（PersistentVolumeClaim）详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 持久卷声明名称
 * @returns 持久卷声明详情
 */
function getPersistentVolumeClaimDetail(
  clusterUid: string,
  namespace: string,
  name: string,
): PersistentVolumeClaimDetailVo {
  console.log('[Mock] getPersistentVolumeClaimDetail', clusterUid, namespace, name)
  return mockPersistentVolumeClaimDetail
}

/**
 * 获取持久卷声明（PersistentVolumeClaim）YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 持久卷声明名称
 * @returns 持久卷声明 YAML
 */
function getPersistentVolumeClaimYaml(
  clusterUid: string,
  namespace: string,
  name: string,
): PersistentVolumeClaimYamlVo {
  console.log('[Mock] getPersistentVolumeClaimYaml', clusterUid, namespace, name)
  return { yaml: mockPersistentVolumeClaimYaml }
}

/**
 * 获取持久卷声明（PersistentVolumeClaim）事件（Event）列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 持久卷声明名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
function getPersistentVolumeClaimEventList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<EventQueryForm>,
): PageVo<EventListVo> {
  console.log('[Mock] getPersistentVolumeClaimEventList', clusterUid, namespace, name, query)
  return handleEventList(query, mockPersistentVolumeClaimEventList)
}

/**
 * 创建持久卷声明（PersistentVolumeClaim）
 * @param clusterUid - 集群 UID
 * @param data - 创建请求对象
 */
function createPersistentVolumeClaim(clusterUid: string, data: Partial<PersistentVolumeClaimCreateForm>): void {
  console.log('[Mock] createPersistentVolumeClaim', clusterUid, data)
}

/**
 * 创建持久卷声明（PersistentVolumeClaim）（YAML）
 * @param clusterUid - 集群 UID
 * @param yaml - 创建 YAML 文本
 */
function createPersistentVolumeClaimYaml(clusterUid: string, yaml: string): void {
  console.log('[Mock] createPersistentVolumeClaimYaml', clusterUid, yaml)
}

/**
 * 更新持久卷声明（PersistentVolumeClaim）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 持久卷声明名称
 * @param data - 更新请求对象
 */
function updatePersistentVolumeClaim(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<PersistentVolumeClaimUpdateForm>,
): void {
  console.log('[Mock] updatePersistentVolumeClaim', clusterUid, namespace, name, data)
}

/**
 * 更新持久卷声明（PersistentVolumeClaim）（YAML）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 持久卷声明名称
 * @param yaml - 更新 YAML 文本
 */
function updatePersistentVolumeClaimYaml(clusterUid: string, namespace: string, name: string, yaml: string): void {
  console.log('[Mock] updatePersistentVolumeClaimYaml', clusterUid, namespace, name, yaml)
}

/**
 * 配置持久卷声明（PersistentVolumeClaim）标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 持久卷声明名称
 * @param data - 标签配置请求对象
 */
function managePersistentVolumeClaimLabels(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataLabelForm,
): void {
  console.log('[Mock] managePersistentVolumeClaimLabels', clusterUid, namespace, name, data)
}

/**
 * 配置持久卷声明（PersistentVolumeClaim）注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 持久卷声明名称
 * @param data - 注解配置请求对象
 */
function managePersistentVolumeClaimAnnotations(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
): void {
  console.log('[Mock] managePersistentVolumeClaimAnnotations', clusterUid, namespace, name, data)
}

/**
 * 删除持久卷声明（PersistentVolumeClaim）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 持久卷声明名称
 */
function deletePersistentVolumeClaim(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] deletePersistentVolumeClaim', clusterUid, namespace, name)
}

/**
 * 批量删除持久卷声明（PersistentVolumeClaim）
 * @param clusterUid - 集群 UID
 * @param uids - 持久卷声明 UID 数组
 */
function deletePersistentVolumeClaims(clusterUid: string, uids: string[]): void {
  console.log('[Mock] deletePersistentVolumeClaims', clusterUid, uids)
}

/**
 * 导入持久卷声明（PersistentVolumeClaim）
 * @param clusterUid - 集群 UID
 * @param formData - 文件数据
 */
function importPersistentVolumeClaim(clusterUid: string, formData: FormData): void {
  void formData
  console.log('[Mock] importPersistentVolumeClaim', clusterUid)
}

/**
 * 导出持久卷声明（PersistentVolumeClaim）
 * @param clusterUid - 集群 UID
 * @param query - 导出查询条件
 */
function exportPersistentVolumeClaim(clusterUid: string, query: Partial<PersistentVolumeClaimExportQueryForm>): void {
  console.log('[Mock] exportPersistentVolumeClaim', clusterUid, query)
}
