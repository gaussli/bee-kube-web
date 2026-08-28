/**
 * ClusterRole 管理 Mock
 * @module mock/kubernetes/security/clusterrole
 */
import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  ClusterRoleCreateForm,
  ClusterRoleDetailVo,
  ClusterRoleListVo,
  ClusterRoleQueryForm,
  ClusterRoleUpdateForm,
  ClusterRoleYamlVo,
} from '@/types/kubernetes/security/clusterrole'

import { mockClusterRoleDetail, mockClusterRoleEvents, mockClusterRoles, mockClusterRoleYaml } from './data'

/**
 * 查看 ClusterRole 列表
 * @param clusterUid 集群 UID
 * @param query ClusterRole 查询条件请求对象（名称、UID）
 * @returns ClusterRole 分页列表
 */
function getClusterRoleListMock(clusterUid: string, query: Partial<ClusterRoleQueryForm>): PageVo<ClusterRoleListVo> {
  console.log('[Mock] getClusterRoleList', clusterUid, query)
  const filtered = mockClusterRoles.filter((c: ClusterRoleListVo) => c.clusterUid === clusterUid)
  const filteredUid = query.uid ? filtered.filter(c => c.uid === query.uid) : []
  const filteredName = query.name ? filtered.filter(c => c.name.includes(query.name as string)) : []
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
 * 查看 ClusterRole 详情
 * @param clusterUid 集群 UID
 * @param name ClusterRole 名称
 * @returns ClusterRole 详情响应对象
 */
function getClusterRoleDetailMock(clusterUid: string, name: string): ClusterRoleDetailVo {
  console.log('[Mock] getClusterRoleDetail', clusterUid, name)
  return mockClusterRoleDetail
}

/**
 * 查看 ClusterRole YAML
 * @param clusterUid 集群 UID
 * @param name ClusterRole 名称
 * @returns ClusterRole YAML 响应对象（完整 YAML 文本）
 */
function getClusterRoleYamlMock(clusterUid: string, name: string): ClusterRoleYamlVo {
  console.log('[Mock] getClusterRoleYaml', clusterUid, name)
  return mockClusterRoleYaml
}

/**
 * 查看 ClusterRole 关联事件列表
 * @param clusterUid 集群 UID
 * @param name ClusterRole 名称
 * @param query 事件查询条件
 * @returns ClusterRole 关联事件分页列表
 */
function getClusterRoleEventListMock(
  clusterUid: string,
  name: string,
  query: Partial<EventQueryForm>,
): PageVo<EventListVo> {
  console.log('[Mock] getClusterRoleEventList', clusterUid, name, query)
  const page = query.page || 1
  const pageSize = query.pageSize || 10
  const list = mockClusterRoleEvents.slice((page - 1) * pageSize, page * pageSize)
  return {
    list,
    total: mockClusterRoleEvents.length,
    page,
    pageSize,
  }
}

/**
 * 创建 ClusterRole
 * @param clusterUid 集群 UID
 * @param data 创建参数
 * @returns void
 */
function createClusterRoleMock(clusterUid: string, data: Partial<ClusterRoleCreateForm>): void {
  console.log('[Mock] createClusterRole', clusterUid, data)
}

/**
 * 通过 YAML 创建 ClusterRole
 * @param clusterUid 集群 UID
 * @param yaml ClusterRole YAML 文本
 * @returns void
 */
function createClusterRoleYamlMock(clusterUid: string, yaml: string): void {
  console.log('[Mock] createClusterRoleYaml', clusterUid, yaml)
}

/**
 * 更新 ClusterRole
 * @param clusterUid 集群 UID
 * @param name ClusterRole 名称
 * @param data 更新参数
 * @returns void
 */
function updateClusterRoleMock(clusterUid: string, name: string, data: Partial<ClusterRoleUpdateForm>): void {
  console.log('[Mock] updateClusterRole', clusterUid, name, data)
}

/**
 * 通过 YAML 更新 ClusterRole
 * @param clusterUid 集群 UID
 * @param name ClusterRole 名称
 * @param yaml ClusterRole YAML 文本
 * @returns void
 */
function updateClusterRoleYamlMock(clusterUid: string, name: string, yaml: string): void {
  console.log('[Mock] updateClusterRoleYaml', clusterUid, name, yaml)
}

/**
 * 更新 ClusterRole 标签
 * @param clusterUid 集群 UID
 * @param name ClusterRole 名称
 * @param data 标签更新参数
 * @returns void
 */
function manageClusterRoleLabelMock(clusterUid: string, name: string, data: MetadataLabelForm): void {
  console.log('[Mock] manageClusterRoleLabel', clusterUid, name, data)
}

/**
 * 更新 ClusterRole 注解
 * @param clusterUid 集群 UID
 * @param name ClusterRole 名称
 * @param data 注解更新参数
 * @returns void
 */
function manageClusterRoleAnnotationMock(clusterUid: string, name: string, data: MetadataAnnotationForm): void {
  console.log('[Mock] manageClusterRoleAnnotation', clusterUid, name, data)
}

/**
 * 删除 ClusterRole
 * @param clusterUid 集群 UID
 * @param name ClusterRole 名称
 * @returns void
 */
function deleteClusterRoleMock(clusterUid: string, name: string): void {
  console.log('[Mock] deleteClusterRole', clusterUid, name)
}

/**
 * 批量删除 ClusterRole
 * @param clusterUid 集群 UID
 * @param uids ClusterRole UID 列表
 * @returns void
 */
function deleteClusterRolesMock(clusterUid: string, uids: string[]): void {
  console.log('[Mock] deleteClusterRoles', clusterUid, uids)
}

/**
 * 导入 ClusterRole
 * @param clusterUid 集群 UID
 * @param formData 上传的文件
 * @returns void
 */
function importClusterRoleMock(clusterUid: string, formData: FormData): void {
  void formData
  console.log('[Mock] importClusterRole', clusterUid)
}

/**
 * 导出 ClusterRole
 * @param clusterUid 集群 UID
 * @param query ClusterRole 查询条件请求对象（名称、UID）
 * @returns void
 */
function exportClusterRoleMock(clusterUid: string, query: Partial<ClusterRoleQueryForm>): void {
  console.log('[Mock] exportClusterRole', clusterUid, query)
}

export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/clusterroles',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<ClusterRoleQueryForm> }) =>
      getClusterRoleListMock(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/clusterroles/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getClusterRoleDetailMock(ctx.pathParams.clusterUid, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/clusterroles/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getClusterRoleYamlMock(ctx.pathParams.clusterUid, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/clusterroles/:name/events',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }) =>
      getClusterRoleEventListMock(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/clusterroles',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<ClusterRoleCreateForm> }) =>
      createClusterRoleMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/clusterroles/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      createClusterRoleYamlMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/clusterroles/:name',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<ClusterRoleUpdateForm> }) =>
      updateClusterRoleMock(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/clusterroles/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      updateClusterRoleYamlMock(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/clusterroles/:name/labels',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataLabelForm }) =>
      manageClusterRoleLabelMock(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/clusterroles/:name/annotations',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataAnnotationForm }) =>
      manageClusterRoleAnnotationMock(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/clusterroles/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      deleteClusterRoleMock(ctx.pathParams.clusterUid, ctx.pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/clusterroles/batch',
    handler: (ctx: { pathParams: Record<string, string>; data: string[] }) =>
      deleteClusterRolesMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/clusterroles/import',
    handler: (ctx: { pathParams: Record<string, string>; data: FormData }) =>
      importClusterRoleMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/clusterroles/export',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<ClusterRoleQueryForm> }) =>
      exportClusterRoleMock(ctx.pathParams.clusterUid, ctx.params),
  },
]
