/**
 * RoleBinding 管理 Mock
 * @module mock/kubernetes/security/rolebinding
 */
import type { PageVo } from '@/types/index'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  RoleBindingCreateForm,
  RoleBindingDetailVo,
  RoleBindingExportQueryForm,
  RoleBindingListVo,
  RoleBindingQueryForm,
  RoleBindingUpdateForm,
  RoleBindingYamlVo,
} from '@/types/kubernetes/security/rolebinding'

import { handleEventList } from '@/mock/utils'

import { mockRoleBindingDetail, mockRoleBindingEventList, mockRoleBindingList, mockRoleBindingYaml } from './data'

/**
 * 获取角色绑定（RoleBinding）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的角色绑定列表
 */
function getRoleBindingList(clusterUid: string, query: Partial<RoleBindingQueryForm>): PageVo<RoleBindingListVo> {
  console.log('[Mock] getRoleBindingList', clusterUid, query)
  const filtered = mockRoleBindingList.filter((d: RoleBindingListVo) => {
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
 * 获取角色绑定（RoleBinding）详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 角色绑定名称
 * @returns 角色绑定详情
 */
function getRoleBindingDetail(clusterUid: string, namespace: string, name: string): RoleBindingDetailVo {
  console.log('[Mock] getRoleBindingDetail', clusterUid, namespace, name)
  return mockRoleBindingDetail
}

/**
 * 获取角色绑定（RoleBinding）YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 角色绑定名称
 * @returns 角色绑定 YAML
 */
function getRoleBindingYaml(clusterUid: string, namespace: string, name: string): RoleBindingYamlVo {
  console.log('[Mock] getRoleBindingYaml', clusterUid, namespace, name)
  return { yaml: mockRoleBindingYaml }
}

/**
 * 获取角色绑定（RoleBinding）事件（Event）列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 角色绑定名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
function getRoleBindingEventList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<EventQueryForm>,
): PageVo<EventListVo> {
  console.log('[Mock] getRoleBindingEventList', clusterUid, namespace, name, query)
  return handleEventList(query, mockRoleBindingEventList)
}

/**
 * 创建角色绑定（RoleBinding）
 * @param clusterUid - 集群 UID
 * @param data - 创建请求对象
 */
function createRoleBinding(clusterUid: string, data: Partial<RoleBindingCreateForm>): void {
  console.log('[Mock] createRoleBinding', clusterUid, data)
}

/**
 * 创建角色绑定（RoleBinding）（YAML）
 * @param clusterUid - 集群 UID
 * @param yaml - 创建 YAML 文本
 */
function createRoleBindingYaml(clusterUid: string, yaml: string): void {
  console.log('[Mock] createRoleBindingYaml', clusterUid, yaml)
}

/**
 * 更新角色绑定（RoleBinding）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 角色绑定名称
 * @param data - 更新请求对象
 */
function updateRoleBinding(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<RoleBindingUpdateForm>,
): void {
  console.log('[Mock] updateRoleBinding', clusterUid, namespace, name, data)
}

/**
 * 更新角色绑定（RoleBinding）（YAML）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 角色绑定名称
 * @param yaml - 更新 YAML 文本
 */
function updateRoleBindingYaml(clusterUid: string, namespace: string, name: string, yaml: string): void {
  console.log('[Mock] updateRoleBindingYaml', clusterUid, namespace, name, yaml)
}

/**
 * 配置角色绑定（RoleBinding）标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 角色绑定名称
 * @param data - 标签配置请求对象
 */
function manageRoleBindingLabels(clusterUid: string, namespace: string, name: string, data: MetadataLabelForm): void {
  console.log('[Mock] manageRoleBindingLabels', clusterUid, namespace, name, data)
}

/**
 * 配置角色绑定（RoleBinding）注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 角色绑定名称
 * @param data - 注解配置请求对象
 */
function manageRoleBindingAnnotations(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
): void {
  console.log('[Mock] manageRoleBindingAnnotations', clusterUid, namespace, name, data)
}

/**
 * 删除角色绑定（RoleBinding）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 角色绑定名称
 */
function deleteRoleBinding(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] deleteRoleBinding', clusterUid, namespace, name)
}

/**
 * 批量删除角色绑定（RoleBinding）
 * @param clusterUid - 集群 UID
 * @param uids - 角色绑定 UID 数组
 */
function deleteRoleBindings(clusterUid: string, uids: string[]): void {
  console.log('[Mock] deleteRoleBindings', clusterUid, uids)
}

/**
 * 导入角色绑定（RoleBinding）
 * @param clusterUid - 集群 UID
 * @param formData - 文件数据
 */
function importRoleBinding(clusterUid: string, formData: FormData): void {
  void formData
  console.log('[Mock] importRoleBinding', clusterUid)
}

/**
 * 导出角色绑定（RoleBinding）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param query - 导出查询条件
 */
function exportRoleBinding(clusterUid: string, namespace: string, query: Partial<RoleBindingExportQueryForm>): void {
  console.log('[Mock] exportRoleBinding', clusterUid, namespace, query)
}

/**
 * 角色绑定路由配置
 * @remarks
 * - GET    /kubernetes/clusters/:clusterUid/rolebindings                                         - 获取角色绑定列表
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/rolebindings/:name             - 获取角色绑定详情
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/rolebindings/:name/yaml        - 获取角色绑定 YAML
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/rolebindings/:name/events      - 获取角色绑定事件列表
 * - POST   /kubernetes/clusters/:clusterUid/rolebindings                                         - 创建角色绑定
 * - POST   /kubernetes/clusters/:clusterUid/rolebindings/yaml                                    - 创建角色绑定（YAML）
 * - PUT    /kubernetes/clusters/:clusterUid/namespaces/:namespace/rolebindings/:name             - 更新角色绑定
 * - PUT    /kubernetes/clusters/:clusterUid/namespaces/:namespace/rolebindings/:name/yaml        - 更新角色绑定（YAML）
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/rolebindings/:name/labels      - 配置角色绑定标签
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/rolebindings/:name/annotations - 配置角色绑定注解
 * - DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespace/rolebindings/:name             - 删除角色绑定
 * - DELETE /kubernetes/clusters/:clusterUid/rolebindings                                         - 批量删除角色绑定
 * - POST   /kubernetes/clusters/:clusterUid/rolebindings/import                                  - 导入角色绑定
 * - GET    /kubernetes/clusters/:clusterUid/rolebindings/export                                  - 导出角色绑定
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/rolebindings',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<RoleBindingQueryForm> }) =>
      getRoleBindingList(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/rolebindings/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getRoleBindingDetail(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/rolebindings/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getRoleBindingYaml(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/rolebindings/:name/events',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }) =>
      getRoleBindingEventList(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/rolebindings',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<RoleBindingCreateForm> }) =>
      createRoleBinding(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/rolebindings/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      createRoleBindingYaml(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/rolebindings/:name',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<RoleBindingUpdateForm> }) =>
      updateRoleBinding(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/rolebindings/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      updateRoleBindingYaml(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/rolebindings/:name/labels',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataLabelForm }) =>
      manageRoleBindingLabels(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/rolebindings/:name/annotations',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataAnnotationForm }) =>
      manageRoleBindingAnnotations(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/rolebindings/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      deleteRoleBinding(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/rolebindings',
    handler: (ctx: { pathParams: Record<string, string>; data: string[] }) =>
      deleteRoleBindings(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/rolebindings/import',
    handler: (ctx: { pathParams: Record<string, string>; data: FormData }) =>
      importRoleBinding(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/rolebindings/export',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<RoleBindingExportQueryForm> }) =>
      exportRoleBinding(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.params),
  },
]
