/**
 * RoleBinding 管理 Mock
 * @module mock/kubernetes/security/rolebinding
 */
import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  RoleBindingCreateForm,
  RoleBindingDetailVo,
  RoleBindingListVo,
  RoleBindingQueryForm,
  RoleBindingUpdateForm,
  RoleBindingYamlVo,
} from '@/types/kubernetes/security/rolebinding'

import { mockRoleBindingDetail, mockRoleBindingEvents, mockRoleBindings, mockRoleBindingYaml } from './rolebindingData'

/**
 * 查看 RoleBinding 列表
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param query RoleBinding 查询条件请求对象（名称、角色名、UID）
 * @returns RoleBinding 分页列表
 */
function getRoleBindingListMock(
  clusterUid: string,
  namespaceName: string,
  query: Partial<RoleBindingQueryForm>,
): PageVo<RoleBindingListVo> {
  console.log('[Mock] getRoleBindingList', clusterUid, namespaceName, query)
  const filtered = mockRoleBindings.filter((r: RoleBindingListVo) => {
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
 * 查看 RoleBinding 详情
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name RoleBinding 名称
 * @returns RoleBinding 详情响应对象
 */
function getRoleBindingDetailMock(clusterUid: string, namespaceName: string, name: string): RoleBindingDetailVo {
  console.log('[Mock] getRoleBindingDetail', clusterUid, namespaceName, name)
  return mockRoleBindingDetail
}

/**
 * 查看 RoleBinding YAML
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name RoleBinding 名称
 * @returns RoleBinding YAML 响应对象（完整 YAML 文本）
 */
function getRoleBindingYamlMock(clusterUid: string, namespaceName: string, name: string): RoleBindingYamlVo {
  console.log('[Mock] getRoleBindingYaml', clusterUid, namespaceName, name)
  return mockRoleBindingYaml
}

/**
 * 查看 RoleBinding 关联事件列表
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name RoleBinding 名称
 * @param query 事件查询条件
 * @returns RoleBinding 关联事件分页列表
 */
function getRoleBindingEventListMock(
  clusterUid: string,
  namespaceName: string,
  name: string,
  query: Partial<EventQueryForm>,
): PageVo<EventListVo> {
  console.log('[Mock] getRoleBindingEventList', clusterUid, namespaceName, name, query)
  const page = query.page || 1
  const pageSize = query.pageSize || 10
  const list = mockRoleBindingEvents.slice((page - 1) * pageSize, page * pageSize)
  return {
    list,
    total: mockRoleBindingEvents.length,
    page,
    pageSize,
  }
}

/**
 * 创建 RoleBinding
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param data 创建参数
 * @returns void
 */
function createRoleBindingMock(clusterUid: string, namespaceName: string, data: Partial<RoleBindingCreateForm>): void {
  console.log('[Mock] createRoleBinding', clusterUid, namespaceName, data)
}

/**
 * 通过 YAML 创建 RoleBinding
 * @param clusterUid 集群 UID
 * @param yaml RoleBinding YAML 文本
 * @returns void
 */
function createRoleBindingYamlMock(clusterUid: string, yaml: string): void {
  console.log('[Mock] createRoleBindingYaml', clusterUid, yaml)
}

/**
 * 更新 RoleBinding
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name RoleBinding 名称
 * @param data 更新参数
 * @returns void
 */
function updateRoleBindingMock(
  clusterUid: string,
  namespaceName: string,
  name: string,
  data: Partial<RoleBindingUpdateForm>,
): void {
  console.log('[Mock] updateRoleBinding', clusterUid, namespaceName, name, data)
}

/**
 * 通过 YAML 更新 RoleBinding
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name RoleBinding 名称
 * @param yaml RoleBinding YAML 文本
 * @returns void
 */
function updateRoleBindingYamlMock(clusterUid: string, namespaceName: string, name: string, yaml: string): void {
  console.log('[Mock] updateRoleBindingYaml', clusterUid, namespaceName, name, yaml)
}

/**
 * 更新 RoleBinding 标签
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name RoleBinding 名称
 * @param data 标签更新参数
 * @returns void
 */
function manageRoleBindingLabelMock(
  clusterUid: string,
  namespaceName: string,
  name: string,
  data: MetadataLabelForm,
): void {
  console.log('[Mock] manageRoleBindingLabel', clusterUid, namespaceName, name, data)
}

/**
 * 更新 RoleBinding 注解
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name RoleBinding 名称
 * @param data 注解更新参数
 * @returns void
 */
function manageRoleBindingAnnotationMock(
  clusterUid: string,
  namespaceName: string,
  name: string,
  data: MetadataAnnotationForm,
): void {
  console.log('[Mock] manageRoleBindingAnnotation', clusterUid, namespaceName, name, data)
}

/**
 * 删除 RoleBinding
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param name RoleBinding 名称
 * @returns void
 */
function deleteRoleBindingMock(clusterUid: string, namespaceName: string, name: string): void {
  console.log('[Mock] deleteRoleBinding', clusterUid, namespaceName, name)
}

/**
 * 批量删除 RoleBinding
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param uids RoleBinding UID 列表
 * @returns void
 */
function deleteRoleBindingsMock(clusterUid: string, namespaceName: string, uids: string[]): void {
  console.log('[Mock] deleteRoleBindings', clusterUid, namespaceName, uids)
}

/**
 * 导入 RoleBinding
 * @param clusterUid 集群 UID
 * @param formData 上传的文件
 * @returns void
 */
function importRoleBindingMock(clusterUid: string, formData: FormData): void {
  void formData
  console.log('[Mock] importRoleBinding', clusterUid)
}

/**
 * 导出 RoleBinding
 * @param clusterUid 集群 UID
 * @param namespaceName 命名空间名称
 * @param query RoleBinding 查询条件请求对象（名称、角色名、UID）
 * @returns void
 */
function exportRoleBindingMock(clusterUid: string, namespaceName: string, query: Partial<RoleBindingQueryForm>): void {
  console.log('[Mock] exportRoleBinding', clusterUid, namespaceName, query)
}

export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/rolebindings',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<RoleBindingQueryForm> }) =>
      getRoleBindingListMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/rolebindings/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getRoleBindingDetailMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/rolebindings/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getRoleBindingYamlMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/rolebindings/:name/events',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }) =>
      getRoleBindingEventListMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/rolebindings',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<RoleBindingCreateForm> }) =>
      createRoleBindingMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/rolebindings/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      createRoleBindingYamlMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/rolebindings/:name',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<RoleBindingUpdateForm> }) =>
      updateRoleBindingMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/rolebindings/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      updateRoleBindingYamlMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/rolebindings/:name/labels',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataLabelForm }) =>
      manageRoleBindingLabelMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/rolebindings/:name/annotations',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataAnnotationForm }) =>
      manageRoleBindingAnnotationMock(
        ctx.pathParams.clusterUid,
        ctx.pathParams.namespace,
        ctx.pathParams.name,
        ctx.data,
      ),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/rolebindings/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      deleteRoleBindingMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/rolebindings/batch',
    handler: (ctx: { pathParams: Record<string, string>; data: string[] }) =>
      deleteRoleBindingsMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/rolebindings/import',
    handler: (ctx: { pathParams: Record<string, string>; data: FormData }) =>
      importRoleBindingMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/rolebindings/export',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<RoleBindingQueryForm> }) =>
      exportRoleBindingMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.params),
  },
]
