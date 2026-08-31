/**
 * ClusterRole 管理 Mock
 * @module mock/kubernetes/security/clusterrole
 */
import type { PageVo } from '@/types/index'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  ClusterRoleCreateForm,
  ClusterRoleDetailVo,
  ClusterRoleExportQueryForm,
  ClusterRoleListVo,
  ClusterRoleQueryForm,
  ClusterRoleUpdateForm,
  ClusterRoleYamlVo,
} from '@/types/kubernetes/security/clusterrole'

import { handleEventList } from '@/mock/utils'

import { mockClusterRoleDetail, mockClusterRoleEventList, mockClusterRoleList, mockClusterRoleYaml } from './data'

/**
 * 集群角色路由配置
 * @remarks
 * - GET    /kubernetes/clusters/:clusterUid/clusterroles                   - 获取集群角色列表
 * - GET    /kubernetes/clusters/:clusterUid/clusterroles/:name             - 获取集群角色详情
 * - GET    /kubernetes/clusters/:clusterUid/clusterroles/:name/yaml        - 获取集群角色 YAML
 * - GET    /kubernetes/clusters/:clusterUid/clusterroles/:name/events      - 获取集群角色事件列表
 * - POST   /kubernetes/clusters/:clusterUid/clusterroles                   - 创建集群角色
 * - POST   /kubernetes/clusters/:clusterUid/clusterroles/yaml              - 创建集群角色（YAML）
 * - PUT    /kubernetes/clusters/:clusterUid/clusterroles/:name             - 更新集群角色
 * - PUT    /kubernetes/clusters/:clusterUid/clusterroles/:name/yaml        - 更新集群角色（YAML）
 * - POST   /kubernetes/clusters/:clusterUid/clusterroles/:name/labels      - 配置集群角色标签
 * - POST   /kubernetes/clusters/:clusterUid/clusterroles/:name/annotations - 配置集群角色注解
 * - DELETE /kubernetes/clusters/:clusterUid/clusterroles/:name             - 删除集群角色
 * - DELETE /kubernetes/clusters/:clusterUid/clusterroles                   - 批量删除集群角色
 * - POST   /kubernetes/clusters/:clusterUid/clusterroles/import            - 导入集群角色
 * - GET    /kubernetes/clusters/:clusterUid/clusterroles/export            - 导出集群角色
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/clusterroles',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<ClusterRoleQueryForm> }) =>
      getClusterRoleList(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/clusterroles/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getClusterRoleDetail(ctx.pathParams.clusterUid, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/clusterroles/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getClusterRoleYaml(ctx.pathParams.clusterUid, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/clusterroles/:name/events',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }) =>
      getClusterRoleEventList(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/clusterroles',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<ClusterRoleCreateForm> }) =>
      createClusterRole(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/clusterroles/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      createClusterRoleYaml(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/clusterroles/:name',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<ClusterRoleUpdateForm> }) =>
      updateClusterRole(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/clusterroles/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      updateClusterRoleYaml(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/clusterroles/:name/labels',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataLabelForm }) =>
      manageClusterRoleLabels(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/clusterroles/:name/annotations',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataAnnotationForm }) =>
      manageClusterRoleAnnotations(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/clusterroles/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      deleteClusterRole(ctx.pathParams.clusterUid, ctx.pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/clusterroles',
    handler: (ctx: { pathParams: Record<string, string>; data: string[] }) =>
      deleteClusterRoles(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/clusterroles/import',
    handler: (ctx: { pathParams: Record<string, string>; data: FormData }) =>
      importClusterRole(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/clusterroles/export',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<ClusterRoleExportQueryForm> }) =>
      exportClusterRole(ctx.pathParams.clusterUid, ctx.params),
  },
]

/**
 * 获取集群角色（ClusterRole）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的集群角色列表
 */
function getClusterRoleList(clusterUid: string, query: Partial<ClusterRoleQueryForm>): PageVo<ClusterRoleListVo> {
  console.log('[Mock] getClusterRoleList', clusterUid, query)
  const filtered = mockClusterRoleList
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
 * 获取集群角色（ClusterRole）详情
 * @param clusterUid - 集群 UID
 * @param name - 集群角色名称
 * @returns 集群角色详情
 */
function getClusterRoleDetail(clusterUid: string, name: string): ClusterRoleDetailVo {
  console.log('[Mock] getClusterRoleDetail', clusterUid, name)
  return mockClusterRoleDetail
}

/**
 * 获取集群角色（ClusterRole）YAML
 * @param clusterUid - 集群 UID
 * @param name - 集群角色名称
 * @returns 集群角色 YAML
 */
function getClusterRoleYaml(clusterUid: string, name: string): ClusterRoleYamlVo {
  console.log('[Mock] getClusterRoleYaml', clusterUid, name)
  return { yaml: mockClusterRoleYaml }
}

/**
 * 获取集群角色（ClusterRole）事件（Event）列表
 * @param clusterUid - 集群 UID
 * @param name - 集群角色名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
function getClusterRoleEventList(
  clusterUid: string,
  name: string,
  query: Partial<EventQueryForm>,
): PageVo<EventListVo> {
  console.log('[Mock] getClusterRoleEventList', clusterUid, name, query)
  return handleEventList(query, mockClusterRoleEventList)
}

/**
 * 创建集群角色（ClusterRole）
 * @param clusterUid - 集群 UID
 * @param data - 创建请求对象
 */
function createClusterRole(clusterUid: string, data: Partial<ClusterRoleCreateForm>): void {
  console.log('[Mock] createClusterRole', clusterUid, data)
}

/**
 * 创建集群角色（ClusterRole）（YAML）
 * @param clusterUid - 集群 UID
 * @param yaml - 创建 YAML 文本
 */
function createClusterRoleYaml(clusterUid: string, yaml: string): void {
  console.log('[Mock] createClusterRoleYaml', clusterUid, yaml)
}

/**
 * 更新集群角色（ClusterRole）
 * @param clusterUid - 集群 UID
 * @param name - 集群角色名称
 * @param data - 更新请求对象
 */
function updateClusterRole(clusterUid: string, name: string, data: Partial<ClusterRoleUpdateForm>): void {
  console.log('[Mock] updateClusterRole', clusterUid, name, data)
}

/**
 * 更新集群角色（ClusterRole）（YAML）
 * @param clusterUid - 集群 UID
 * @param name - 集群角色名称
 * @param yaml - 更新 YAML 文本
 */
function updateClusterRoleYaml(clusterUid: string, name: string, yaml: string): void {
  console.log('[Mock] updateClusterRoleYaml', clusterUid, name, yaml)
}

/**
 * 配置集群角色（ClusterRole）标签
 * @param clusterUid - 集群 UID
 * @param name - 集群角色名称
 * @param data - 标签配置请求对象
 */
function manageClusterRoleLabels(clusterUid: string, name: string, data: MetadataLabelForm): void {
  console.log('[Mock] manageClusterRoleLabels', clusterUid, name, data)
}

/**
 * 配置集群角色（ClusterRole）注解
 * @param clusterUid - 集群 UID
 * @param name - 集群角色名称
 * @param data - 注解配置请求对象
 */
function manageClusterRoleAnnotations(clusterUid: string, name: string, data: MetadataAnnotationForm): void {
  console.log('[Mock] manageClusterRoleAnnotations', clusterUid, name, data)
}

/**
 * 删除集群角色（ClusterRole）
 * @param clusterUid - 集群 UID
 * @param name - 集群角色名称
 */
function deleteClusterRole(clusterUid: string, name: string): void {
  console.log('[Mock] deleteClusterRole', clusterUid, name)
}

/**
 * 批量删除集群角色（ClusterRole）
 * @param clusterUid - 集群 UID
 * @param uids - 集群角色 UID 数组
 */
function deleteClusterRoles(clusterUid: string, uids: string[]): void {
  console.log('[Mock] deleteClusterRoles', clusterUid, uids)
}

/**
 * 导入集群角色（ClusterRole）
 * @param clusterUid - 集群 UID
 * @param formData - 文件数据
 */
function importClusterRole(clusterUid: string, formData: FormData): void {
  void formData
  console.log('[Mock] importClusterRole', clusterUid)
}

/**
 * 导出集群角色（ClusterRole）
 * @param clusterUid - 集群 UID
 * @param query - 导出查询条件
 */
function exportClusterRole(clusterUid: string, query: Partial<ClusterRoleExportQueryForm>): void {
  console.log('[Mock] exportClusterRole', clusterUid, query)
}
