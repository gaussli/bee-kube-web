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
  RoleListVo,
  RoleQueryForm,
  RoleUpdateForm,
  RoleYamlVo,
} from '@/types/kubernetes/security/role'

import { mockRoleDetail, mockRoleEvents, mockRoles, mockRoleYaml } from './roleData'

/**
 * 查看 Role 列表
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param query Role 查询条件请求对象（名称、UID）
 * @returns Role 分页列表
 */
function getRoleListMock(clusterUid: string, namespaceName: string, query: Partial<RoleQueryForm>): PageVo<RoleListVo> {
  console.log('[Mock] getRoleList', clusterUid, namespaceName, query)
  const filtered = mockRoles.filter((r: RoleListVo) => {
    if (r.clusterUid !== clusterUid) return false
    if (namespaceName && r.namespace !== namespaceName) return false
    return true
  })
  const filteredUid = query.uid ? filtered.filter(r => r.uid === query.uid) : []
  const filteredName = query.name ? filtered.filter(r => r.name.includes(query.name as string)) : []
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
 * 查看 Role 详情
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name Role 名称
 * @returns Role 详情响应对象
 */
function getRoleDetailMock(clusterUid: string, namespaceName: string, name: string): RoleDetailVo {
  console.log('[Mock] getRoleDetail', clusterUid, namespaceName, name)
  return mockRoleDetail
}

/**
 * 查看 Role YAML
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name Role 名称
 * @returns Role YAML 响应对象（完整 YAML 文本）
 */
function getRoleYamlMock(clusterUid: string, namespaceName: string, name: string): RoleYamlVo {
  console.log('[Mock] getRoleYaml', clusterUid, namespaceName, name)
  return mockRoleYaml
}

/**
 * 查看 Role 关联事件列表
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name Role 名称
 * @param query 事件查询条件
 * @returns Role 关联事件分页列表
 */
function getRoleEventListMock(
  clusterUid: string,
  namespaceName: string,
  name: string,
  query: Partial<EventQueryForm>,
): PageVo<EventListVo> {
  console.log('[Mock] getRoleEventList', clusterUid, namespaceName, name, query)
  const page = query.page || 1
  const pageSize = query.pageSize || 10
  const list = mockRoleEvents.slice((page - 1) * pageSize, page * pageSize)
  return {
    list,
    total: mockRoleEvents.length,
    page,
    pageSize,
  }
}

/**
 * 创建 Role
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param data 创建参数
 * @returns void
 */
function createRoleMock(clusterUid: string, namespaceName: string, data: Partial<RoleCreateForm>): void {
  console.log('[Mock] createRole', clusterUid, namespaceName, data)
}

/**
 * 通过 YAML 创建 Role
 * @param clusterUid 集群 UID
 * @param yaml Role YAML 文本
 * @returns void
 */
function createRoleYamlMock(clusterUid: string, yaml: string): void {
  console.log('[Mock] createRoleYaml', clusterUid, yaml)
}

/**
 * 更新 Role
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name Role 名称
 * @param data 更新参数
 * @returns void
 */
function updateRoleMock(clusterUid: string, namespaceName: string, name: string, data: Partial<RoleUpdateForm>): void {
  console.log('[Mock] updateRole', clusterUid, namespaceName, name, data)
}

/**
 * 通过 YAML 更新 Role
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name Role 名称
 * @param yaml Role YAML 文本
 * @returns void
 */
function updateRoleYamlMock(clusterUid: string, namespaceName: string, name: string, yaml: string): void {
  console.log('[Mock] updateRoleYaml', clusterUid, namespaceName, name, yaml)
}

/**
 * 更新 Role 标签
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name Role 名称
 * @param data 标签更新参数
 * @returns void
 */
function manageRoleLabelMock(clusterUid: string, namespaceName: string, name: string, data: MetadataLabelForm): void {
  console.log('[Mock] manageRoleLabel', clusterUid, namespaceName, name, data)
}

/**
 * 更新 Role 注解
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name Role 名称
 * @param data 注解更新参数
 * @returns void
 */
function manageRoleAnnotationMock(
  clusterUid: string,
  namespaceName: string,
  name: string,
  data: MetadataAnnotationForm,
): void {
  console.log('[Mock] manageRoleAnnotation', clusterUid, namespaceName, name, data)
}

/**
 * 删除 Role
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name Role 名称
 * @returns void
 */
function deleteRoleMock(clusterUid: string, namespaceName: string, name: string): void {
  console.log('[Mock] deleteRole', clusterUid, namespaceName, name)
}

/**
 * 批量删除 Role
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param uids Role UID 列表
 * @returns void
 */
function deleteRolesMock(clusterUid: string, namespaceName: string, uids: string[]): void {
  console.log('[Mock] deleteRoles', clusterUid, namespaceName, uids)
}

/**
 * 导入 Role
 * @param clusterUid 集群 UID
 * @param formData 上传的文件
 * @returns void
 */
function importRoleMock(clusterUid: string, formData: FormData): void {
  void formData
  console.log('[Mock] importRole', clusterUid)
}

/**
 * 导出 Role
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param query Role 查询条件请求对象（名称、UID）
 * @returns void
 */
function exportRoleMock(clusterUid: string, namespaceName: string, query: Partial<RoleQueryForm>): void {
  console.log('[Mock] exportRole', clusterUid, namespaceName, query)
}

export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/roles',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<RoleQueryForm> }) =>
      getRoleListMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/roles/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getRoleDetailMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/roles/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getRoleYamlMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/roles/:name/events',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }) =>
      getRoleEventListMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/roles',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<RoleCreateForm> }) =>
      createRoleMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/roles/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      createRoleYamlMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/roles/:name',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<RoleUpdateForm> }) =>
      updateRoleMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/roles/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      updateRoleYamlMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/roles/:name/labels',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataLabelForm }) =>
      manageRoleLabelMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/roles/:name/annotations',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataAnnotationForm }) =>
      manageRoleAnnotationMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/roles/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      deleteRoleMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/roles/batch',
    handler: (ctx: { pathParams: Record<string, string>; data: string[] }) =>
      deleteRolesMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/roles/import',
    handler: (ctx: { pathParams: Record<string, string>; data: FormData }) =>
      importRoleMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/roles/export',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<RoleQueryForm> }) =>
      exportRoleMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.params),
  },
]
