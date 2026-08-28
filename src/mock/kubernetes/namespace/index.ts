import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  NamespaceCreateForm,
  NamespaceDetailVo,
  NamespaceExportQueryForm,
  NamespaceListVo,
  NamespaceMonitorQueryForm,
  NamespaceMonitorVo,
  NamespaceQueryForm,
  NamespaceSimpleListVo,
  NamespaceUpdateForm,
  NamespaceYamlVo,
} from '@/types/kubernetes/namespace'

import { handleEventList } from '@/mock/utils'

import {
  mockNamespaceDetail,
  mockNamespaceEventList,
  mockNamespaceList,
  mockNamespaceMonitor,
  mockNamespaceYaml,
} from './data'

/**
 * 命名空间路由配置
 * @remarks
 * - GET    /kubernetes/clusters/:clusterUid/namespaces                   - 获取命名空间列表
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:name             - 获取命名空间详情
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:name/yaml        - 获取命名空间 YAML
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:name/events      - 获取命名空间事件列表
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:name/monitor     - 获取命名空间监控数据
 * - POST   /kubernetes/clusters/:clusterUid/namespaces                   - 创建命名空间
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/yaml              - 创建命名空间（YAML）
 * - PUT    /kubernetes/clusters/:clusterUid/namespaces/:name             - 更新命名空间
 * - PUT    /kubernetes/clusters/:clusterUid/namespaces/:name/yaml        - 更新命名空间（YAML）
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:name/labels      - 配置命名空间标签
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:name/annotations - 配置命名空间注解
 * - DELETE /kubernetes/clusters/:clusterUid/namespaces/:name             - 删除命名空间
 * - DELETE /kubernetes/clusters/:clusterUid/namespaces                   - 批量删除命名空间
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/import            - 导入命名空间
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/export            - 导出命名空间
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<NamespaceQueryForm> }) =>
      getNamespaceList(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getNamespaceDetail(ctx.pathParams.clusterUid, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getNamespaceYaml(ctx.pathParams.clusterUid, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:name/events',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }) =>
      getNamespaceEventList(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:name/monitor',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<NamespaceMonitorQueryForm> }) =>
      getNamespaceMonitor(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<NamespaceCreateForm> }) =>
      createNamespace(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      createNamespaceYaml(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:name',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<NamespaceUpdateForm> }) =>
      updateNamespace(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      updateNamespaceYaml(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:name/labels',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataLabelForm }) =>
      manageNamespaceLabels(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:name/annotations',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataAnnotationForm }) =>
      manageNamespaceAnnotations(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      deleteNamespace(ctx.pathParams.clusterUid, ctx.pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces',
    handler: (ctx: { pathParams: Record<string, string>; data: string[] }) =>
      deleteNamespaces(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/import',
    handler: (ctx: { pathParams: Record<string, string>; data: FormData }) =>
      importNamespace(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/export',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<NamespaceExportQueryForm> }) =>
      exportNamespace(ctx.pathParams.clusterUid, ctx.params),
  },
]

/**
 * 获取命名空间（Namespace）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的命名空间列表
 */
function getNamespaceList(
  clusterUid: string,
  query: Partial<NamespaceQueryForm>,
): PageVo<NamespaceListVo | NamespaceSimpleListVo> {
  console.log('[Mock] getNamespaceList', clusterUid, query)
  const filtered = mockNamespaceList.filter((d: NamespaceListVo) => {
    if (query.status && d.status !== query.status) return false
    return true
  })
  const filteredUid = query.uid ? filtered.filter(d => d.uid === query.uid) : []
  const filteredName = query.name ? filtered.filter(d => d.name.includes(query.name as string)) : []
  const matched = query.uid || query.name ? Array.from(new Set([...filteredUid, ...filteredName])) : filtered
  if (query.mode && query.mode === 'Simple') {
    const page = 1
    const pageSize = matched.length
    return {
      list: matched.map((d: NamespaceListVo) => ({
        uid: d.uid,
        name: d.name,
        description: d.description,
      })),
      total: matched.length,
      page,
      pageSize,
    }
  } else {
    const page = query.page || 1
    const pageSize = query.pageSize || 10
    return {
      list: matched.slice((page - 1) * pageSize, page * pageSize),
      total: matched.length,
      page,
      pageSize,
    }
  }
}

/**
 * 获取命名空间（Namespace）详情
 * @param clusterUid - 集群 UID
 * @param name - 命名空间名称
 * @returns 命名空间详情
 */
function getNamespaceDetail(clusterUid: string, name: string): NamespaceDetailVo {
  console.log('[Mock] getNamespaceDetail', clusterUid, name)
  return mockNamespaceDetail
}

/**
 * 获取命名空间（Namespace）YAML
 * @param clusterUid - 集群 UID
 * @param name - 命名空间名称
 * @returns 命名空间 YAML
 */
function getNamespaceYaml(clusterUid: string, name: string): NamespaceYamlVo {
  console.log('[Mock] getNamespaceYaml', clusterUid, name)
  return { yaml: mockNamespaceYaml }
}

/**
 * 获取命名空间（Namespace）事件（Event）列表
 * @param clusterUid - 集群 UID
 * @param name - 命名空间名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
function getNamespaceEventList(clusterUid: string, name: string, query: Partial<EventQueryForm>): PageVo<EventListVo> {
  console.log('[Mock] getNamespaceEventList', clusterUid, name, query)
  return handleEventList(query, mockNamespaceEventList)
}

/**
 * 获取命名空间（Namespace）监控数据
 * @param clusterUid - 集群 UID
 * @param name - 命名空间名称
 * @param query - 监控查询条件
 * @returns 命名空间监控数据
 */
function getNamespaceMonitor(
  clusterUid: string,
  name: string,
  query: Partial<NamespaceMonitorQueryForm>,
): NamespaceMonitorVo {
  console.log('[Mock] getNamespaceMonitor', clusterUid, name, query)
  return mockNamespaceMonitor
}

/**
 * 创建命名空间（Namespace）
 * @param clusterUid - 集群 UID
 * @param data - 创建请求对象
 */
function createNamespace(clusterUid: string, data: Partial<NamespaceCreateForm>): void {
  console.log('[Mock] createNamespace', clusterUid, data)
}

/**
 * 创建命名空间（Namespace）（YAML）
 * @param clusterUid - 集群 UID
 * @param yaml - 创建 YAML 文本
 */
function createNamespaceYaml(clusterUid: string, yaml: string): void {
  console.log('[Mock] createNamespaceYaml', clusterUid, yaml)
}

/**
 * 更新命名空间（Namespace）
 * @param clusterUid - 集群 UID
 * @param name - 命名空间名称
 * @param data - 更新请求对象
 */
function updateNamespace(clusterUid: string, name: string, data: Partial<NamespaceUpdateForm>): void {
  console.log('[Mock] updateNamespace', clusterUid, name, data)
}

/**
 * 更新命名空间（Namespace）（YAML）
 * @param clusterUid - 集群 UID
 * @param name - 命名空间名称
 * @param yaml - 更新 YAML 文本
 */
function updateNamespaceYaml(clusterUid: string, name: string, yaml: string): void {
  console.log('[Mock] updateNamespaceYaml', clusterUid, name, yaml)
}

/**
 * 配置命名空间（Namespace）标签
 * @param clusterUid - 集群 UID
 * @param name - 命名空间名称
 * @param data - 标签配置请求对象
 */
function manageNamespaceLabels(clusterUid: string, name: string, data: MetadataLabelForm): void {
  console.log('[Mock] manageNamespaceLabels', clusterUid, name, data)
}

/**
 * 配置命名空间（Namespace）注解
 * @param clusterUid - 集群 UID
 * @param name - 命名空间名称
 * @param data - 注解配置请求对象
 */
function manageNamespaceAnnotations(clusterUid: string, name: string, data: MetadataAnnotationForm): void {
  console.log('[Mock] manageNamespaceAnnotations', clusterUid, name, data)
}

/**
 * 删除命名空间（Namespace）
 * @param clusterUid - 集群 UID
 * @param name - 命名空间名称
 */
function deleteNamespace(clusterUid: string, name: string): void {
  console.log('[Mock] deleteNamespace', clusterUid, name)
}

/**
 * 批量删除命名空间（Namespace）
 * @param clusterUid - 集群 UID
 * @param uids - 命名空间 UID 数组
 */
function deleteNamespaces(clusterUid: string, uids: string[]): void {
  console.log('[Mock] deleteNamespaces', clusterUid, uids)
}

/**
 * 导入命名空间（Namespace）
 * @param clusterUid - 集群 UID
 * @param formData - 文件数据
 * @param onProgress - 上传进度回调
 */
function importNamespace(clusterUid: string, formData: FormData): void {
  void formData
  console.log('[Mock] importNamespace', clusterUid)
}

/**
 * 导出命名空间（Namespace）
 * @param clusterUid - 集群 UID
 * @param query - 导出查询条件
 */
function exportNamespace(clusterUid: string, query: Partial<NamespaceExportQueryForm>): void {
  console.log('[Mock] exportNamespace', clusterUid, query)
}
