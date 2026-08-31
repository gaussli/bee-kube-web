/**
 * Role 管理 Mock
 * @module mock/kubernetes/security/role
 */
import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  RoleCreateForm,
  RoleDetailVo,
  RoleExportQueryForm,
  RoleListVo,
  RoleQueryForm,
  RoleUpdateForm,
  RoleYamlVo,
} from '@/types/kubernetes/security/role'

import { handleEventList } from '@/mock/utils'

import { mockRoleDetail, mockRoleEventList, mockRoleList, mockRoleYaml } from './data'

/**
 * 获取角色（Role）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的角色列表
 */
function getRoleList(clusterUid: string, query: Partial<RoleQueryForm>): PageVo<RoleListVo> {
  console.log('[Mock] getRoleList', clusterUid, query)
  const filtered = mockRoleList.filter((d: RoleListVo) => {
    if (query.namespace && d.namespace !== query.namespace) return false
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
 * 获取角色（Role）详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 角色名称
 * @returns 角色详情
 */
function getRoleDetail(clusterUid: string, namespace: string, name: string): RoleDetailVo {
  console.log('[Mock] getRoleDetail', clusterUid, namespace, name)
  return mockRoleDetail
}

/**
 * 获取角色（Role）YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 角色名称
 * @returns 角色 YAML
 */
function getRoleYaml(clusterUid: string, namespace: string, name: string): RoleYamlVo {
  console.log('[Mock] getRoleYaml', clusterUid, namespace, name)
  return { yaml: mockRoleYaml }
}

/**
 * 获取角色（Role）事件（Event）列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 角色名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
function getRoleEventList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<EventQueryForm>,
): PageVo<EventListVo> {
  console.log('[Mock] getRoleEventList', clusterUid, namespace, name, query)
  return handleEventList(query, mockRoleEventList)
}

/**
 * 创建角色（Role）
 * @param clusterUid - 集群 UID
 * @param data - 创建请求对象
 */
function createRole(clusterUid: string, data: Partial<RoleCreateForm>): void {
  console.log('[Mock] createRole', clusterUid, data)
}

/**
 * 创建角色（Role）（YAML）
 * @param clusterUid - 集群 UID
 * @param yaml - 创建 YAML 文本
 */
function createRoleYaml(clusterUid: string, yaml: string): void {
  console.log('[Mock] createRoleYaml', clusterUid, yaml)
}

/**
 * 更新角色（Role）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 角色名称
 * @param data - 更新请求对象
 */
function updateRole(clusterUid: string, namespace: string, name: string, data: Partial<RoleUpdateForm>): void {
  console.log('[Mock] updateRole', clusterUid, namespace, name, data)
}

/**
 * 更新角色（Role）（YAML）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 角色名称
 * @param yaml - 更新 YAML 文本
 */
function updateRoleYaml(clusterUid: string, namespace: string, name: string, yaml: string): void {
  console.log('[Mock] updateRoleYaml', clusterUid, namespace, name, yaml)
}

/**
 * 配置角色（Role）标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 角色名称
 * @param data - 标签配置请求对象
 */
function manageRoleLabels(clusterUid: string, namespace: string, name: string, data: MetadataLabelForm): void {
  console.log('[Mock] manageRoleLabels', clusterUid, namespace, name, data)
}

/**
 * 配置角色（Role）注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 角色名称
 * @param data - 注解配置请求对象
 */
function manageRoleAnnotations(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
): void {
  console.log('[Mock] manageRoleAnnotations', clusterUid, namespace, name, data)
}

/**
 * 删除角色（Role）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 角色名称
 */
function deleteRole(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] deleteRole', clusterUid, namespace, name)
}

/**
 * 批量删除角色（Role）
 * @param clusterUid - 集群 UID
 * @param uids - 角色 UID 数组
 */
function deleteRoles(clusterUid: string, uids: string[]): void {
  console.log('[Mock] deleteRoles', clusterUid, uids)
}

/**
 * 导入角色（Role）
 * @param clusterUid - 集群 UID
 * @param formData - 文件数据
 */
function importRole(clusterUid: string, formData: FormData): void {
  void formData
  console.log('[Mock] importRole', clusterUid)
}

/**
 * 导出角色（Role）
 * @param clusterUid - 集群 UID
 * @param query - 导出查询条件
 */
function exportRole(clusterUid: string, query: Partial<RoleExportQueryForm>): void {
  console.log('[Mock] exportRole', clusterUid, query)
}

/**
 * 角色路由配置
 * @remarks
 * - GET    /kubernetes/clusters/:clusterUid/roles                                         - 获取角色列表
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/roles/:name             - 获取角色详情
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/roles/:name/yaml        - 获取角色 YAML
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/roles/:name/events      - 获取角色事件列表
 * - POST   /kubernetes/clusters/:clusterUid/roles                                         - 创建角色
 * - POST   /kubernetes/clusters/:clusterUid/roles/yaml                                    - 创建角色（YAML）
 * - PUT    /kubernetes/clusters/:clusterUid/namespaces/:namespace/roles/:name             - 更新角色
 * - PUT    /kubernetes/clusters/:clusterUid/namespaces/:namespace/roles/:name/yaml        - 更新角色（YAML）
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/roles/:name/labels      - 配置角色标签
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/roles/:name/annotations - 配置角色注解
 * - DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespace/roles/:name             - 删除角色
 * - DELETE /kubernetes/clusters/:clusterUid/roles                                         - 批量删除角色
 * - POST   /kubernetes/clusters/:clusterUid/roles/import                                  - 导入角色
 * - GET    /kubernetes/clusters/:clusterUid/roles/export                                  - 导出角色
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/roles',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<RoleQueryForm> }) =>
      getRoleList(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/roles/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getRoleDetail(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/roles/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getRoleYaml(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/roles/:name/events',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }) =>
      getRoleEventList(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/roles',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<RoleCreateForm> }) =>
      createRole(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/roles/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      createRoleYaml(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/roles/:name',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<RoleUpdateForm> }) =>
      updateRole(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/roles/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      updateRoleYaml(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/roles/:name/labels',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataLabelForm }) =>
      manageRoleLabels(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/roles/:name/annotations',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataAnnotationForm }) =>
      manageRoleAnnotations(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/roles/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      deleteRole(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/roles',
    handler: (ctx: { pathParams: Record<string, string>; data: string[] }) =>
      deleteRoles(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/roles/import',
    handler: (ctx: { pathParams: Record<string, string>; data: FormData }) =>
      importRole(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/roles/export',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<RoleExportQueryForm> }) =>
      exportRole(ctx.pathParams.clusterUid, ctx.params),
  },
]
