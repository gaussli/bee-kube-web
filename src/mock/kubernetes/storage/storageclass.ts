/**
 * StorageClass 管理 Mock
 * @module mock/kubernetes/storage/storageclass
 */
import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  StorageClassCreateForm,
  StorageClassDetailVo,
  StorageClassListVo,
  StorageClassQueryForm,
  StorageClassUpdateForm,
  StorageClassYamlVo,
} from '@/types/kubernetes/storage/storageclass'

import {
  mockStorageClassDetail,
  mockStorageClassEvents,
  mockStorageClasses,
  mockStorageClassYaml,
} from './storageclassData'

/**
 * 查看 StorageClass 列表
 * @param clusterUid 集群 UID
 * @param query StorageClass 查询条件请求对象（名称、存储提供者、UID）
 * @returns StorageClass 分页列表
 */
function getStorageClassListMock(
  clusterUid: string,
  query: Partial<StorageClassQueryForm>,
): PageVo<StorageClassListVo> {
  console.log('[Mock] getStorageClassList', clusterUid, query)
  const filtered = mockStorageClasses.filter((s: StorageClassListVo) => {
    if (s.clusterUid !== clusterUid) return false
    if (query.provisioner && s.provisioner !== query.provisioner) return false
    return true
  })
  const filteredUid = query.uid ? filtered.filter(s => s.uid === query.uid) : []
  const filteredName = query.name ? filtered.filter(s => s.name.includes(query.name as string)) : []
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
 * 查看 StorageClass 详情
 * @param clusterUid 集群 UID
 * @param name StorageClass 名称
 * @returns StorageClass 详情响应对象
 */
function getStorageClassDetailMock(clusterUid: string, name: string): StorageClassDetailVo {
  console.log('[Mock] getStorageClassDetail', clusterUid, name)
  return mockStorageClassDetail
}

/**
 * 查看 StorageClass YAML
 * @param clusterUid 集群 UID
 * @param name StorageClass 名称
 * @returns StorageClass YAML 响应对象（完整 YAML 文本）
 */
function getStorageClassYamlMock(clusterUid: string, name: string): StorageClassYamlVo {
  console.log('[Mock] getStorageClassYaml', clusterUid, name)
  return mockStorageClassYaml
}

/**
 * 查看 StorageClass 关联事件列表
 * @param clusterUid 集群 UID
 * @param name StorageClass 名称
 * @param query 事件查询条件
 * @returns StorageClass 关联事件分页列表
 */
function getStorageClassEventListMock(
  clusterUid: string,
  name: string,
  query: Partial<EventQueryForm>,
): PageVo<EventListVo> {
  console.log('[Mock] getStorageClassEventList', clusterUid, name, query)
  const page = query.page || 1
  const pageSize = query.pageSize || 10
  const list = mockStorageClassEvents.slice((page - 1) * pageSize, page * pageSize)
  return {
    list,
    total: mockStorageClassEvents.length,
    page,
    pageSize,
  }
}

/**
 * 创建 StorageClass
 * @param clusterUid 集群 UID
 * @param data 创建参数
 * @returns void
 */
function createStorageClassMock(clusterUid: string, data: Partial<StorageClassCreateForm>): void {
  console.log('[Mock] createStorageClass', clusterUid, data)
}

/**
 * 通过 YAML 创建 StorageClass
 * @param clusterUid 集群 UID
 * @param yaml StorageClass YAML 文本
 * @returns void
 */
function createStorageClassYamlMock(clusterUid: string, yaml: string): void {
  console.log('[Mock] createStorageClassYaml', clusterUid, yaml)
}

/**
 * 更新 StorageClass
 * @param clusterUid 集群 UID
 * @param name StorageClass 名称
 * @param data 更新参数
 * @returns void
 */
function updateStorageClassMock(clusterUid: string, name: string, data: Partial<StorageClassUpdateForm>): void {
  console.log('[Mock] updateStorageClass', clusterUid, name, data)
}

/**
 * 通过 YAML 更新 StorageClass
 * @param clusterUid 集群 UID
 * @param name StorageClass 名称
 * @param yaml StorageClass YAML 文本
 * @returns void
 */
function updateStorageClassYamlMock(clusterUid: string, name: string, yaml: string): void {
  console.log('[Mock] updateStorageClassYaml', clusterUid, name, yaml)
}

/**
 * 更新 StorageClass 标签
 * @param clusterUid 集群 UID
 * @param name StorageClass 名称
 * @param data 标签更新参数
 * @returns void
 */
function manageStorageClassLabelMock(clusterUid: string, name: string, data: MetadataLabelForm): void {
  console.log('[Mock] manageStorageClassLabel', clusterUid, name, data)
}

/**
 * 更新 StorageClass 注解
 * @param clusterUid 集群 UID
 * @param name StorageClass 名称
 * @param data 注解更新参数
 * @returns void
 */
function manageStorageClassAnnotationMock(clusterUid: string, name: string, data: MetadataAnnotationForm): void {
  console.log('[Mock] manageStorageClassAnnotation', clusterUid, name, data)
}

/**
 * 删除 StorageClass
 * @param clusterUid 集群 UID
 * @param name StorageClass 名称
 * @returns void
 */
function deleteStorageClassMock(clusterUid: string, name: string): void {
  console.log('[Mock] deleteStorageClass', clusterUid, name)
}

/**
 * 批量删除 StorageClass
 * @param clusterUid 集群 UID
 * @param uids StorageClass UID 列表
 * @returns void
 */
function deleteStorageClassesMock(clusterUid: string, uids: string[]): void {
  console.log('[Mock] deleteStorageClasses', clusterUid, uids)
}

/**
 * 导入 StorageClass
 * @param clusterUid 集群 UID
 * @param formData 上传的文件
 * @returns void
 */
function importStorageClassMock(clusterUid: string, formData: FormData): void {
  void formData
  console.log('[Mock] importStorageClass', clusterUid)
}

/**
 * 导出 StorageClass
 * @param clusterUid 集群 UID
 * @param query StorageClass 查询条件请求对象（名称、存储提供者、UID）
 * @returns void
 */
function exportStorageClassMock(clusterUid: string, query: Partial<StorageClassQueryForm>): void {
  console.log('[Mock] exportStorageClass', clusterUid, query)
}

export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/storageclasses',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<StorageClassQueryForm> }) =>
      getStorageClassListMock(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/storageclasses/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getStorageClassDetailMock(ctx.pathParams.clusterUid, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/storageclasses/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getStorageClassYamlMock(ctx.pathParams.clusterUid, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/storageclasses/:name/events',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }) =>
      getStorageClassEventListMock(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/storageclasses',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<StorageClassCreateForm> }) =>
      createStorageClassMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/storageclasses/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      createStorageClassYamlMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/storageclasses/:name',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<StorageClassUpdateForm> }) =>
      updateStorageClassMock(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/storageclasses/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      updateStorageClassYamlMock(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/storageclasses/:name/labels',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataLabelForm }) =>
      manageStorageClassLabelMock(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/storageclasses/:name/annotations',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataAnnotationForm }) =>
      manageStorageClassAnnotationMock(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/storageclasses/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      deleteStorageClassMock(ctx.pathParams.clusterUid, ctx.pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/storageclasses/batch',
    handler: (ctx: { pathParams: Record<string, string>; data: string[] }) =>
      deleteStorageClassesMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/storageclasses/import',
    handler: (ctx: { pathParams: Record<string, string>; data: FormData }) =>
      importStorageClassMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/storageclasses/export',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<StorageClassQueryForm> }) =>
      exportStorageClassMock(ctx.pathParams.clusterUid, ctx.params),
  },
]
