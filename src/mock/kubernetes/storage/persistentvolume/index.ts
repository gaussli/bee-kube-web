/**
 * PersistentVolume 管理 Mock
 * @module mock/kubernetes/storage/persistentVolume
 */
import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  PersistentVolumeCreateForm,
  PersistentVolumeDetailVo,
  PersistentVolumeListVo,
  PersistentVolumeQueryForm,
  PersistentVolumeUpdateForm,
  PersistentVolumeYamlVo,
} from '@/types/kubernetes/storage/persistentvolume'

import {
  mockPersistentVolumeDetail,
  mockPersistentVolumeEvents,
  mockPersistentVolumes,
  mockPersistentVolumeYaml,
} from './data'

/**
 * 查看 PersistentVolume 列表
 * @param clusterUid 集群 UID
 * @param query PersistentVolume 查询条件请求对象（名称、状态、存储类名、UID）
 * @returns PersistentVolume 分页列表
 */
function getPersistentVolumeListMock(
  clusterUid: string,
  query: Partial<PersistentVolumeQueryForm>,
): PageVo<PersistentVolumeListVo> {
  console.log('[Mock] getPersistentVolumeList', clusterUid, query)
  const filtered = mockPersistentVolumes.filter((p: PersistentVolumeListVo) => {
    if (p.clusterUid !== clusterUid) return false
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
 * 查看 PersistentVolume 详情
 * @param clusterUid 集群 UID
 * @param name PersistentVolume 名称
 * @returns PersistentVolume 详情响应对象
 */
function getPersistentVolumeDetailMock(clusterUid: string, name: string): PersistentVolumeDetailVo {
  console.log('[Mock] getPersistentVolumeDetail', clusterUid, name)
  return mockPersistentVolumeDetail
}

/**
 * 查看 PersistentVolume YAML
 * @param clusterUid 集群 UID
 * @param name PersistentVolume 名称
 * @returns PersistentVolume YAML 响应对象（完整 YAML 文本）
 */
function getPersistentVolumeYamlMock(clusterUid: string, name: string): PersistentVolumeYamlVo {
  console.log('[Mock] getPersistentVolumeYaml', clusterUid, name)
  return mockPersistentVolumeYaml
}

/**
 * 查看 PersistentVolume 关联事件列表
 * @param clusterUid 集群 UID
 * @param name PersistentVolume 名称
 * @param query 事件查询条件
 * @returns PersistentVolume 关联事件分页列表
 */
function getPersistentVolumeEventListMock(
  clusterUid: string,
  name: string,
  query: Partial<EventQueryForm>,
): PageVo<EventListVo> {
  console.log('[Mock] getPersistentVolumeEventList', clusterUid, name, query)
  const page = query.page || 1
  const pageSize = query.pageSize || 10
  const list = mockPersistentVolumeEvents.slice((page - 1) * pageSize, page * pageSize)
  return {
    list,
    total: mockPersistentVolumeEvents.length,
    page,
    pageSize,
  }
}

/**
 * 创建 PersistentVolume
 * @param clusterUid 集群 UID
 * @param data 创建参数
 * @returns void
 */
function createPersistentVolumeMock(clusterUid: string, data: Partial<PersistentVolumeCreateForm>): void {
  console.log('[Mock] createPersistentVolume', clusterUid, data)
}

/**
 * 通过 YAML 创建 PersistentVolume
 * @param clusterUid 集群 UID
 * @param yaml PersistentVolume YAML 文本
 * @returns void
 */
function createPersistentVolumeYamlMock(clusterUid: string, yaml: string): void {
  console.log('[Mock] createPersistentVolumeYaml', clusterUid, yaml)
}

/**
 * 更新 PersistentVolume
 * @param clusterUid 集群 UID
 * @param name PersistentVolume 名称
 * @param data 更新参数
 * @returns void
 */
function updatePersistentVolumeMock(clusterUid: string, name: string, data: Partial<PersistentVolumeUpdateForm>): void {
  console.log('[Mock] updatePersistentVolume', clusterUid, name, data)
}

/**
 * 通过 YAML 更新 PersistentVolume
 * @param clusterUid 集群 UID
 * @param name PersistentVolume 名称
 * @param yaml PersistentVolume YAML 文本
 * @returns void
 */
function updatePersistentVolumeYamlMock(clusterUid: string, name: string, yaml: string): void {
  console.log('[Mock] updatePersistentVolumeYaml', clusterUid, name, yaml)
}

/**
 * 更新 PersistentVolume 标签
 * @param clusterUid 集群 UID
 * @param name PersistentVolume 名称
 * @param data 标签更新参数
 * @returns void
 */
function managePersistentVolumeLabelMock(clusterUid: string, name: string, data: MetadataLabelForm): void {
  console.log('[Mock] managePersistentVolumeLabel', clusterUid, name, data)
}

/**
 * 更新 PersistentVolume 注解
 * @param clusterUid 集群 UID
 * @param name PersistentVolume 名称
 * @param data 注解更新参数
 * @returns void
 */
function managePersistentVolumeAnnotationMock(clusterUid: string, name: string, data: MetadataAnnotationForm): void {
  console.log('[Mock] managePersistentVolumeAnnotation', clusterUid, name, data)
}

/**
 * 删除 PersistentVolume
 * @param clusterUid 集群 UID
 * @param name PersistentVolume 名称
 * @returns void
 */
function deletePersistentVolumeMock(clusterUid: string, name: string): void {
  console.log('[Mock] deletePersistentVolume', clusterUid, name)
}

/**
 * 批量删除 PersistentVolume
 * @param clusterUid 集群 UID
 * @param uids PersistentVolume UID 列表
 * @returns void
 */
function deletePersistentVolumesMock(clusterUid: string, uids: string[]): void {
  console.log('[Mock] deletePersistentVolumes', clusterUid, uids)
}

/**
 * 导入 PersistentVolume
 * @param clusterUid 集群 UID
 * @param formData 上传的文件
 * @returns void
 */
function importPersistentVolumeMock(clusterUid: string, formData: FormData): void {
  void formData
  console.log('[Mock] importPersistentVolume', clusterUid)
}

/**
 * 导出 PersistentVolume
 * @param clusterUid 集群 UID
 * @param query PersistentVolume 查询条件请求对象（名称、状态、存储类名、UID）
 * @returns void
 */
function exportPersistentVolumeMock(clusterUid: string, query: Partial<PersistentVolumeQueryForm>): void {
  console.log('[Mock] exportPersistentVolume', clusterUid, query)
}

export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/persistentvolumes',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<PersistentVolumeQueryForm> }) =>
      getPersistentVolumeListMock(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/persistentvolumes/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getPersistentVolumeDetailMock(ctx.pathParams.clusterUid, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/persistentvolumes/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getPersistentVolumeYamlMock(ctx.pathParams.clusterUid, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/persistentvolumes/:name/events',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }) =>
      getPersistentVolumeEventListMock(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/persistentvolumes',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<PersistentVolumeCreateForm> }) =>
      createPersistentVolumeMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/persistentvolumes/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      createPersistentVolumeYamlMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/persistentvolumes/:name',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<PersistentVolumeUpdateForm> }) =>
      updatePersistentVolumeMock(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/persistentvolumes/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      updatePersistentVolumeYamlMock(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/persistentvolumes/:name/labels',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataLabelForm }) =>
      managePersistentVolumeLabelMock(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/persistentvolumes/:name/annotations',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataAnnotationForm }) =>
      managePersistentVolumeAnnotationMock(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/persistentvolumes/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      deletePersistentVolumeMock(ctx.pathParams.clusterUid, ctx.pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/persistentvolumes/batch',
    handler: (ctx: { pathParams: Record<string, string>; data: string[] }) =>
      deletePersistentVolumesMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/persistentvolumes/import',
    handler: (ctx: { pathParams: Record<string, string>; data: FormData }) =>
      importPersistentVolumeMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/persistentvolumes/export',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<PersistentVolumeQueryForm> }) =>
      exportPersistentVolumeMock(ctx.pathParams.clusterUid, ctx.params),
  },
]
