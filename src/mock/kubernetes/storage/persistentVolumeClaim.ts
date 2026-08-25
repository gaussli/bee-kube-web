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
  PersistentVolumeClaimListVo,
  PersistentVolumeClaimQueryForm,
  PersistentVolumeClaimUpdateForm,
  PersistentVolumeClaimYamlVo,
} from '@/types/kubernetes/storage/persistentvolumeclaim'

import {
  mockPersistentVolumeClaimDetail,
  mockPersistentVolumeClaimEvents,
  mockPersistentVolumeClaims,
  mockPersistentVolumeClaimYaml,
} from './persistentvolumeclaimData'

/**
 * 查看 PersistentVolumeClaim 列表
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param query PersistentVolumeClaim 查询条件请求对象（名称、状态、存储类名、UID）
 * @returns PersistentVolumeClaim 分页列表
 */
function getPersistentVolumeClaimListMock(
  clusterUid: string,
  namespaceName: string,
  query: Partial<PersistentVolumeClaimQueryForm>,
): PageVo<PersistentVolumeClaimListVo> {
  console.log('[Mock] getPersistentVolumeClaimList', clusterUid, namespaceName, query)
  const filtered = mockPersistentVolumeClaims.filter((p: PersistentVolumeClaimListVo) => {
    if (p.clusterUid !== clusterUid) return false
    if (namespaceName && p.namespace !== namespaceName) return false
    if (query.status && p.status !== query.status) return false
    if (query.storageClassName && p.storageClassName !== query.storageClassName) return false
    return true
  })
  const filteredUid = query.uid ? filtered.filter(p => p.uid === query.uid) : []
  const filteredName = query.name ? filtered.filter(p => p.name.includes(query.name as string)) : []
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
 * 查看 PersistentVolumeClaim 详情
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name PersistentVolumeClaim 名称
 * @returns PersistentVolumeClaim 详情响应对象
 */
function getPersistentVolumeClaimDetailMock(
  clusterUid: string,
  namespaceName: string,
  name: string,
): PersistentVolumeClaimDetailVo {
  console.log('[Mock] getPersistentVolumeClaimDetail', clusterUid, namespaceName, name)
  return mockPersistentVolumeClaimDetail
}

/**
 * 查看 PersistentVolumeClaim YAML
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name PersistentVolumeClaim 名称
 * @returns PersistentVolumeClaim YAML 响应对象（完整 YAML 文本）
 */
function getPersistentVolumeClaimYamlMock(
  clusterUid: string,
  namespaceName: string,
  name: string,
): PersistentVolumeClaimYamlVo {
  console.log('[Mock] getPersistentVolumeClaimYaml', clusterUid, namespaceName, name)
  return mockPersistentVolumeClaimYaml
}

/**
 * 查看 PersistentVolumeClaim 关联事件列表
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name PersistentVolumeClaim 名称
 * @param query 事件查询条件
 * @returns PersistentVolumeClaim 关联事件分页列表
 */
function getPersistentVolumeClaimEventListMock(
  clusterUid: string,
  namespaceName: string,
  name: string,
  query: Partial<EventQueryForm>,
): PageVo<EventListVo> {
  console.log('[Mock] getPersistentVolumeClaimEventList', clusterUid, namespaceName, name, query)
  const page = query.page || 1
  const pageSize = query.pageSize || 10
  const list = mockPersistentVolumeClaimEvents.slice((page - 1) * pageSize, page * pageSize)
  return {
    list,
    total: mockPersistentVolumeClaimEvents.length,
    page,
    pageSize,
  }
}

/**
 * 创建 PersistentVolumeClaim
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param data 创建参数
 * @returns void
 */
function createPersistentVolumeClaimMock(
  clusterUid: string,
  namespaceName: string,
  data: Partial<PersistentVolumeClaimCreateForm>,
): void {
  console.log('[Mock] createPersistentVolumeClaim', clusterUid, namespaceName, data)
}

/**
 * 通过 YAML 创建 PersistentVolumeClaim
 * @param clusterUid 集群 UID
 * @param yaml PersistentVolumeClaim YAML 文本
 * @returns void
 */
function createPersistentVolumeClaimYamlMock(clusterUid: string, yaml: string): void {
  console.log('[Mock] createPersistentVolumeClaimYaml', clusterUid, yaml)
}

/**
 * 更新 PersistentVolumeClaim
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name PersistentVolumeClaim 名称
 * @param data 更新参数
 * @returns void
 */
function updatePersistentVolumeClaimMock(
  clusterUid: string,
  namespaceName: string,
  name: string,
  data: Partial<PersistentVolumeClaimUpdateForm>,
): void {
  console.log('[Mock] updatePersistentVolumeClaim', clusterUid, namespaceName, name, data)
}

/**
 * 通过 YAML 更新 PersistentVolumeClaim
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name PersistentVolumeClaim 名称
 * @param yaml PersistentVolumeClaim YAML 文本
 * @returns void
 */
function updatePersistentVolumeClaimYamlMock(
  clusterUid: string,
  namespaceName: string,
  name: string,
  yaml: string,
): void {
  console.log('[Mock] updatePersistentVolumeClaimYaml', clusterUid, namespaceName, name, yaml)
}

/**
 * 更新 PersistentVolumeClaim 标签
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name PersistentVolumeClaim 名称
 * @param data 标签更新参数
 * @returns void
 */
function managePersistentVolumeClaimLabelMock(
  clusterUid: string,
  namespaceName: string,
  name: string,
  data: MetadataLabelForm,
): void {
  console.log('[Mock] managePersistentVolumeClaimLabel', clusterUid, namespaceName, name, data)
}

/**
 * 更新 PersistentVolumeClaim 注解
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name PersistentVolumeClaim 名称
 * @param data 注解更新参数
 * @returns void
 */
function managePersistentVolumeClaimAnnotationMock(
  clusterUid: string,
  namespaceName: string,
  name: string,
  data: MetadataAnnotationForm,
): void {
  console.log('[Mock] managePersistentVolumeClaimAnnotation', clusterUid, namespaceName, name, data)
}

/**
 * 删除 PersistentVolumeClaim
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name PersistentVolumeClaim 名称
 * @returns void
 */
function deletePersistentVolumeClaimMock(clusterUid: string, namespaceName: string, name: string): void {
  console.log('[Mock] deletePersistentVolumeClaim', clusterUid, namespaceName, name)
}

/**
 * 批量删除 PersistentVolumeClaim
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param uids PersistentVolumeClaim UID 列表
 * @returns void
 */
function deletePersistentVolumeClaimsMock(clusterUid: string, namespaceName: string, uids: string[]): void {
  console.log('[Mock] deletePersistentVolumeClaims', clusterUid, namespaceName, uids)
}

/**
 * 导入 PersistentVolumeClaim
 * @param clusterUid 集群 UID
 * @param formData 上传的文件
 * @returns void
 */
function importPersistentVolumeClaimMock(clusterUid: string, formData: FormData): void {
  void formData
  console.log('[Mock] importPersistentVolumeClaim', clusterUid)
}

/**
 * 导出 PersistentVolumeClaim
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param query PersistentVolumeClaim 查询条件请求对象（名称、状态、存储类名、UID）
 * @returns void
 */
function exportPersistentVolumeClaimMock(
  clusterUid: string,
  namespaceName: string,
  query: Partial<PersistentVolumeClaimQueryForm>,
): void {
  console.log('[Mock] exportPersistentVolumeClaim', clusterUid, namespaceName, query)
}

export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/persistentvolumeclaims',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<PersistentVolumeClaimQueryForm> }) =>
      getPersistentVolumeClaimListMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/persistentvolumeclaims/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getPersistentVolumeClaimDetailMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/persistentvolumeclaims/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getPersistentVolumeClaimYamlMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/persistentvolumeclaims/:name/events',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }) =>
      getPersistentVolumeClaimEventListMock(
        ctx.pathParams.clusterUid,
        ctx.pathParams.namespace,
        ctx.pathParams.name,
        ctx.params,
      ),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/persistentvolumeclaims',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<PersistentVolumeClaimCreateForm> }) =>
      createPersistentVolumeClaimMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/persistentvolumeclaims/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      createPersistentVolumeClaimYamlMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/persistentvolumeclaims/:name',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<PersistentVolumeClaimUpdateForm> }) =>
      updatePersistentVolumeClaimMock(
        ctx.pathParams.clusterUid,
        ctx.pathParams.namespace,
        ctx.pathParams.name,
        ctx.data,
      ),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/persistentvolumeclaims/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      updatePersistentVolumeClaimYamlMock(
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
      managePersistentVolumeClaimLabelMock(
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
      managePersistentVolumeClaimAnnotationMock(
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
      deletePersistentVolumeClaimMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/persistentvolumeclaims/batch',
    handler: (ctx: { pathParams: Record<string, string>; data: string[] }) =>
      deletePersistentVolumeClaimsMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/persistentvolumeclaims/import',
    handler: (ctx: { pathParams: Record<string, string>; data: FormData }) =>
      importPersistentVolumeClaimMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/persistentvolumeclaims/export',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<PersistentVolumeClaimQueryForm> }) =>
      exportPersistentVolumeClaimMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.params),
  },
]
