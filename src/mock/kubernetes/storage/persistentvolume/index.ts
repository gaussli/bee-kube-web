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
  PersistentVolumeExportQueryForm,
  PersistentVolumeListVo,
  PersistentVolumeQueryForm,
  PersistentVolumeUpdateForm,
  PersistentVolumeYamlVo,
} from '@/types/kubernetes/storage/persistentvolume'

import { handleEventList } from '@/mock/utils'

import {
  mockPersistentVolumeDetail,
  mockPersistentVolumeEventList,
  mockPersistentVolumeList,
  mockPersistentVolumeYaml,
} from './data'

/**
 * 持久卷路由配置
 * @remarks
 * - GET    /kubernetes/clusters/:clusterUid/persistentvolumes                   - 获取持久卷列表
 * - GET    /kubernetes/clusters/:clusterUid/persistentvolumes/:name             - 获取持久卷详情
 * - GET    /kubernetes/clusters/:clusterUid/persistentvolumes/:name/yaml        - 获取持久卷 YAML
 * - GET    /kubernetes/clusters/:clusterUid/persistentvolumes/:name/events      - 获取持久卷事件列表
 * - POST   /kubernetes/clusters/:clusterUid/persistentvolumes                   - 创建持久卷
 * - POST   /kubernetes/clusters/:clusterUid/persistentvolumes/yaml              - 创建持久卷（YAML）
 * - PUT    /kubernetes/clusters/:clusterUid/persistentvolumes/:name             - 更新持久卷
 * - PUT    /kubernetes/clusters/:clusterUid/persistentvolumes/:name/yaml        - 更新持久卷（YAML）
 * - POST   /kubernetes/clusters/:clusterUid/persistentvolumes/:name/labels      - 配置持久卷标签
 * - POST   /kubernetes/clusters/:clusterUid/persistentvolumes/:name/annotations - 配置持久卷注解
 * - DELETE /kubernetes/clusters/:clusterUid/persistentvolumes/:name             - 删除持久卷
 * - DELETE /kubernetes/clusters/:clusterUid/persistentvolumes                   - 批量删除持久卷
 * - POST   /kubernetes/clusters/:clusterUid/persistentvolumes/import            - 导入持久卷
 * - GET    /kubernetes/clusters/:clusterUid/persistentvolumes/export            - 导出持久卷
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/persistentvolumes',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<PersistentVolumeQueryForm> }) =>
      getPersistentVolumeList(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/persistentvolumes/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getPersistentVolumeDetail(ctx.pathParams.clusterUid, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/persistentvolumes/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getPersistentVolumeYaml(ctx.pathParams.clusterUid, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/persistentvolumes/:name/events',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }) =>
      getPersistentVolumeEventList(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/persistentvolumes',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<PersistentVolumeCreateForm> }) =>
      createPersistentVolume(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/persistentvolumes/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      createPersistentVolumeYaml(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/persistentvolumes/:name',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<PersistentVolumeUpdateForm> }) =>
      updatePersistentVolume(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/persistentvolumes/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      updatePersistentVolumeYaml(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/persistentvolumes/:name/labels',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataLabelForm }) =>
      managePersistentVolumeLabels(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/persistentvolumes/:name/annotations',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataAnnotationForm }) =>
      managePersistentVolumeAnnotations(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/persistentvolumes/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      deletePersistentVolume(ctx.pathParams.clusterUid, ctx.pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/persistentvolumes',
    handler: (ctx: { pathParams: Record<string, string>; data: string[] }) =>
      deletePersistentVolumes(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/persistentvolumes/import',
    handler: (ctx: { pathParams: Record<string, string>; data: FormData }) =>
      importPersistentVolume(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/persistentvolumes/export',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<PersistentVolumeExportQueryForm> }) =>
      exportPersistentVolume(ctx.pathParams.clusterUid, ctx.params),
  },
]

/**
 * 获取持久卷（PersistentVolume）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的持久卷列表
 */
function getPersistentVolumeList(
  clusterUid: string,
  query: Partial<PersistentVolumeQueryForm>,
): PageVo<PersistentVolumeListVo> {
  console.log('[Mock] getPersistentVolumeList', clusterUid, query)
  const filtered = mockPersistentVolumeList.filter((d: PersistentVolumeListVo) => {
    if (query.status && d.status !== query.status) return false
    return true
  })
  const filteredUid = query.uid ? filtered.filter(d => d.uid === query.uid) : []
  const filteredName = query.name ? filtered.filter(d => d.name.includes(query.name as string)) : []
  const filteredStorageClassName = query.storageClassName
    ? filtered.filter(d => d.storageClassName?.includes(query.storageClassName as string))
    : []
  const matched =
    query.uid || query.name || query.storageClassName
      ? Array.from(new Set([...filteredUid, ...filteredName, ...filteredStorageClassName]))
      : filtered
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
 * 获取持久卷（PersistentVolume）详情
 * @param clusterUid - 集群 UID
 * @param name - 持久卷名称
 * @returns 持久卷详情
 */
function getPersistentVolumeDetail(clusterUid: string, name: string): PersistentVolumeDetailVo {
  console.log('[Mock] getPersistentVolumeDetail', clusterUid, name)
  return mockPersistentVolumeDetail
}

/**
 * 获取持久卷（PersistentVolume）YAML
 * @param clusterUid - 集群 UID
 * @param name - 持久卷名称
 * @returns 持久卷 YAML
 */
function getPersistentVolumeYaml(clusterUid: string, name: string): PersistentVolumeYamlVo {
  console.log('[Mock] getPersistentVolumeYaml', clusterUid, name)
  return { yaml: mockPersistentVolumeYaml }
}

/**
 * 获取持久卷（PersistentVolume）事件（Event）列表
 * @param clusterUid - 集群 UID
 * @param name - 持久卷名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
function getPersistentVolumeEventList(
  clusterUid: string,
  name: string,
  query: Partial<EventQueryForm>,
): PageVo<EventListVo> {
  console.log('[Mock] getPersistentVolumeEventList', clusterUid, name, query)
  return handleEventList(query, mockPersistentVolumeEventList)
}

/**
 * 创建持久卷（PersistentVolume）
 * @param clusterUid - 集群 UID
 * @param data - 创建请求对象
 */
function createPersistentVolume(clusterUid: string, data: Partial<PersistentVolumeCreateForm>): void {
  console.log('[Mock] createPersistentVolume', clusterUid, data)
}

/**
 * 创建持久卷（PersistentVolume）（YAML）
 * @param clusterUid - 集群 UID
 * @param yaml - 创建 YAML 文本
 */
function createPersistentVolumeYaml(clusterUid: string, yaml: string): void {
  console.log('[Mock] createPersistentVolumeYaml', clusterUid, yaml)
}

/**
 * 更新持久卷（PersistentVolume）
 * @param clusterUid - 集群 UID
 * @param name - 持久卷名称
 * @param data - 更新请求对象
 */
function updatePersistentVolume(clusterUid: string, name: string, data: Partial<PersistentVolumeUpdateForm>): void {
  console.log('[Mock] updatePersistentVolume', clusterUid, name, data)
}

/**
 * 更新持久卷（PersistentVolume）（YAML）
 * @param clusterUid - 集群 UID
 * @param name - 持久卷名称
 * @param yaml - 更新 YAML 文本
 */
function updatePersistentVolumeYaml(clusterUid: string, name: string, yaml: string): void {
  console.log('[Mock] updatePersistentVolumeYaml', clusterUid, name, yaml)
}

/**
 * 配置持久卷（PersistentVolume）标签
 * @param clusterUid - 集群 UID
 * @param name - 持久卷名称
 * @param data - 标签配置请求对象
 */
function managePersistentVolumeLabels(clusterUid: string, name: string, data: MetadataLabelForm): void {
  console.log('[Mock] managePersistentVolumeLabels', clusterUid, name, data)
}

/**
 * 配置持久卷（PersistentVolume）注解
 * @param clusterUid - 集群 UID
 * @param name - 持久卷名称
 * @param data - 注解配置请求对象
 */
function managePersistentVolumeAnnotations(clusterUid: string, name: string, data: MetadataAnnotationForm): void {
  console.log('[Mock] managePersistentVolumeAnnotations', clusterUid, name, data)
}

/**
 * 删除持久卷（PersistentVolume）
 * @param clusterUid - 集群 UID
 * @param name - 持久卷名称
 */
function deletePersistentVolume(clusterUid: string, name: string): void {
  console.log('[Mock] deletePersistentVolume', clusterUid, name)
}

/**
 * 批量删除持久卷（PersistentVolume）
 * @param clusterUid - 集群 UID
 * @param uids - 持久卷 UID 数组
 */
function deletePersistentVolumes(clusterUid: string, uids: string[]): void {
  console.log('[Mock] deletePersistentVolumes', clusterUid, uids)
}

/**
 * 导入持久卷（PersistentVolume）
 * @param clusterUid - 集群 UID
 * @param formData - 文件数据
 */
function importPersistentVolume(clusterUid: string, formData: FormData): void {
  void formData
  console.log('[Mock] importPersistentVolume', clusterUid)
}

/**
 * 导出持久卷（PersistentVolume）
 * @param clusterUid - 集群 UID
 * @param query - 导出查询条件
 */
function exportPersistentVolume(clusterUid: string, query: Partial<PersistentVolumeExportQueryForm>): void {
  console.log('[Mock] exportPersistentVolume', clusterUid, query)
}
