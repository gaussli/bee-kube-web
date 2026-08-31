/**
 * StorageClass 管理 Mock
 * @module mock/kubernetes/storage/storageclass
 */
import type { PageVo } from '@/types/index'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  StorageClassCreateForm,
  StorageClassDetailVo,
  StorageClassExportQueryForm,
  StorageClassListVo,
  StorageClassQueryForm,
  StorageClassUpdateForm,
  StorageClassYamlVo,
} from '@/types/kubernetes/storage/storageclass'

import { handleEventList } from '@/mock/utils'

import { mockStorageClassDetail, mockStorageClassEventList, mockStorageClassList, mockStorageClassYaml } from './data'

/**
 * 存储类路由配置
 * @remarks
 * - GET    /kubernetes/clusters/:clusterUid/storageclasses                   - 获取存储类列表
 * - GET    /kubernetes/clusters/:clusterUid/storageclasses/:name             - 获取存储类详情
 * - GET    /kubernetes/clusters/:clusterUid/storageclasses/:name/yaml        - 获取存储类 YAML
 * - GET    /kubernetes/clusters/:clusterUid/storageclasses/:name/events      - 获取存储类事件列表
 * - POST   /kubernetes/clusters/:clusterUid/storageclasses                   - 创建存储类
 * - POST   /kubernetes/clusters/:clusterUid/storageclasses/yaml              - 创建存储类（YAML）
 * - PUT    /kubernetes/clusters/:clusterUid/storageclasses/:name             - 更新存储类
 * - PUT    /kubernetes/clusters/:clusterUid/storageclasses/:name/yaml        - 更新存储类（YAML）
 * - POST   /kubernetes/clusters/:clusterUid/storageclasses/:name/labels      - 配置存储类标签
 * - POST   /kubernetes/clusters/:clusterUid/storageclasses/:name/annotations - 配置存储类注解
 * - DELETE /kubernetes/clusters/:clusterUid/storageclasses/:name             - 删除存储类
 * - DELETE /kubernetes/clusters/:clusterUid/storageclasses                   - 批量删除存储类
 * - POST   /kubernetes/clusters/:clusterUid/storageclasses/import            - 导入存储类
 * - GET    /kubernetes/clusters/:clusterUid/storageclasses/export            - 导出存储类
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/storageclasses',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<StorageClassQueryForm> }) =>
      getStorageClassList(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/storageclasses/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getStorageClassDetail(ctx.pathParams.clusterUid, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/storageclasses/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getStorageClassYaml(ctx.pathParams.clusterUid, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/storageclasses/:name/events',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }) =>
      getStorageClassEventList(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/storageclasses',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<StorageClassCreateForm> }) =>
      createStorageClass(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/storageclasses/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      createStorageClassYaml(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/storageclasses/:name',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<StorageClassUpdateForm> }) =>
      updateStorageClass(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/storageclasses/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      updateStorageClassYaml(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/storageclasses/:name/labels',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataLabelForm }) =>
      manageStorageClassLabels(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/storageclasses/:name/annotations',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataAnnotationForm }) =>
      manageStorageClassAnnotations(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/storageclasses/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      deleteStorageClass(ctx.pathParams.clusterUid, ctx.pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/storageclasses',
    handler: (ctx: { pathParams: Record<string, string>; data: string[] }) =>
      deleteStorageClasses(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/storageclasses/import',
    handler: (ctx: { pathParams: Record<string, string>; data: FormData }) =>
      importStorageClass(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/storageclasses/export',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<StorageClassExportQueryForm> }) =>
      exportStorageClass(ctx.pathParams.clusterUid, ctx.params),
  },
]

/**
 * 获取存储类（StorageClass）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的存储类列表
 */
function getStorageClassList(clusterUid: string, query: Partial<StorageClassQueryForm>): PageVo<StorageClassListVo> {
  console.log('[Mock] getStorageClassList', clusterUid, query)
  const filtered = mockStorageClassList
  const filteredUid = query.uid ? filtered.filter(d => d.uid === query.uid) : []
  const filteredName = query.name ? filtered.filter(d => d.name.includes(query.name as string)) : []
  const filteredProvisioner = query.provisioner
    ? filtered.filter(d => d.provisioner.includes(query.provisioner as string))
    : []
  const matched =
    query.uid || query.name || query.provisioner
      ? Array.from(new Set([...filteredUid, ...filteredName, ...filteredProvisioner]))
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
 * 获取存储类（StorageClass）详情
 * @param clusterUid - 集群 UID
 * @param name - 存储类名称
 * @returns 存储类详情
 */
function getStorageClassDetail(clusterUid: string, name: string): StorageClassDetailVo {
  console.log('[Mock] getStorageClassDetail', clusterUid, name)
  return mockStorageClassDetail
}

/**
 * 获取存储类（StorageClass）YAML
 * @param clusterUid - 集群 UID
 * @param name - 存储类名称
 * @returns 存储类 YAML
 */
function getStorageClassYaml(clusterUid: string, name: string): StorageClassYamlVo {
  console.log('[Mock] getStorageClassYaml', clusterUid, name)
  return { yaml: mockStorageClassYaml }
}

/**
 * 获取存储类（StorageClass）事件（Event）列表
 * @param clusterUid - 集群 UID
 * @param name - 存储类名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
function getStorageClassEventList(
  clusterUid: string,
  name: string,
  query: Partial<EventQueryForm>,
): PageVo<EventListVo> {
  console.log('[Mock] getStorageClassEventList', clusterUid, name, query)
  return handleEventList(query, mockStorageClassEventList)
}

/**
 * 创建存储类（StorageClass）
 * @param clusterUid - 集群 UID
 * @param data - 创建请求对象
 */
function createStorageClass(clusterUid: string, data: Partial<StorageClassCreateForm>): void {
  console.log('[Mock] createStorageClass', clusterUid, data)
}

/**
 * 创建存储类（StorageClass）（YAML）
 * @param clusterUid - 集群 UID
 * @param yaml - 创建 YAML 文本
 */
function createStorageClassYaml(clusterUid: string, yaml: string): void {
  console.log('[Mock] createStorageClassYaml', clusterUid, yaml)
}

/**
 * 更新存储类（StorageClass）
 * @param clusterUid - 集群 UID
 * @param name - 存储类名称
 * @param data - 更新请求对象
 */
function updateStorageClass(clusterUid: string, name: string, data: Partial<StorageClassUpdateForm>): void {
  console.log('[Mock] updateStorageClass', clusterUid, name, data)
}

/**
 * 更新存储类（StorageClass）（YAML）
 * @param clusterUid - 集群 UID
 * @param name - 存储类名称
 * @param yaml - 更新 YAML 文本
 */
function updateStorageClassYaml(clusterUid: string, name: string, yaml: string): void {
  console.log('[Mock] updateStorageClassYaml', clusterUid, name, yaml)
}

/**
 * 配置存储类（StorageClass）标签
 * @param clusterUid - 集群 UID
 * @param name - 存储类名称
 * @param data - 标签配置请求对象
 */
function manageStorageClassLabels(clusterUid: string, name: string, data: MetadataLabelForm): void {
  console.log('[Mock] manageStorageClassLabels', clusterUid, name, data)
}

/**
 * 配置存储类（StorageClass）注解
 * @param clusterUid - 集群 UID
 * @param name - 存储类名称
 * @param data - 注解配置请求对象
 */
function manageStorageClassAnnotations(clusterUid: string, name: string, data: MetadataAnnotationForm): void {
  console.log('[Mock] manageStorageClassAnnotations', clusterUid, name, data)
}

/**
 * 删除存储类（StorageClass）
 * @param clusterUid - 集群 UID
 * @param name - 存储类名称
 */
function deleteStorageClass(clusterUid: string, name: string): void {
  console.log('[Mock] deleteStorageClass', clusterUid, name)
}

/**
 * 批量删除存储类（StorageClass）
 * @param clusterUid - 集群 UID
 * @param uids - 存储类 UID 数组
 */
function deleteStorageClasses(clusterUid: string, uids: string[]): void {
  console.log('[Mock] deleteStorageClasses', clusterUid, uids)
}

/**
 * 导入存储类（StorageClass）
 * @param clusterUid - 集群 UID
 * @param formData - 文件数据
 */
function importStorageClass(clusterUid: string, formData: FormData): void {
  void formData
  console.log('[Mock] importStorageClass', clusterUid)
}

/**
 * 导出存储类（StorageClass）
 * @param clusterUid - 集群 UID
 * @param query - 导出查询条件
 */
function exportStorageClass(clusterUid: string, query: Partial<StorageClassExportQueryForm>): void {
  console.log('[Mock] exportStorageClass', clusterUid, query)
}
