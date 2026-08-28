/**
 * ClusterRoleBinding 管理 Mock
 * @module mock/kubernetes/security/clusterrolebinding
 */
import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  ClusterRoleBindingCreateForm,
  ClusterRoleBindingDetailVo,
  ClusterRoleBindingListVo,
  ClusterRoleBindingQueryForm,
  ClusterRoleBindingUpdateForm,
  ClusterRoleBindingYamlVo,
} from '@/types/kubernetes/security/clusterrolebinding'

import {
  mockClusterRoleBindingDetail,
  mockClusterRoleBindingEvents,
  mockClusterRoleBindings,
  mockClusterRoleBindingYaml,
} from './data'

/**
 * 查看 ClusterRoleBinding 列表
 * @param clusterUid 集群 UID
 * @param query ClusterRoleBinding 查询条件请求对象（名称、角色名、UID）
 * @returns ClusterRoleBinding 分页列表
 */
function getClusterRoleBindingListMock(
  clusterUid: string,
  query: Partial<ClusterRoleBindingQueryForm>,
): PageVo<ClusterRoleBindingListVo> {
  console.log('[Mock] getClusterRoleBindingList', clusterUid, query)
  const filtered = mockClusterRoleBindings.filter((c: ClusterRoleBindingListVo) => c.clusterUid === clusterUid)
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
 * 查看 ClusterRoleBinding 详情
 * @param clusterUid 集群 UID
 * @param name ClusterRoleBinding 名称
 * @returns ClusterRoleBinding 详情响应对象
 */
function getClusterRoleBindingDetailMock(clusterUid: string, name: string): ClusterRoleBindingDetailVo {
  console.log('[Mock] getClusterRoleBindingDetail', clusterUid, name)
  return mockClusterRoleBindingDetail
}

/**
 * 查看 ClusterRoleBinding YAML
 * @param clusterUid 集群 UID
 * @param name ClusterRoleBinding 名称
 * @returns ClusterRoleBinding YAML 响应对象（完整 YAML 文本）
 */
function getClusterRoleBindingYamlMock(clusterUid: string, name: string): ClusterRoleBindingYamlVo {
  console.log('[Mock] getClusterRoleBindingYaml', clusterUid, name)
  return mockClusterRoleBindingYaml
}

/**
 * 查看 ClusterRoleBinding 关联事件列表
 * @param clusterUid 集群 UID
 * @param name ClusterRoleBinding 名称
 * @param query 事件查询条件
 * @returns ClusterRoleBinding 关联事件分页列表
 */
function getClusterRoleBindingEventListMock(
  clusterUid: string,
  name: string,
  query: Partial<EventQueryForm>,
): PageVo<EventListVo> {
  console.log('[Mock] getClusterRoleBindingEventList', clusterUid, name, query)
  const page = query.page || 1
  const pageSize = query.pageSize || 10
  const list = mockClusterRoleBindingEvents.slice((page - 1) * pageSize, page * pageSize)
  return {
    list,
    total: mockClusterRoleBindingEvents.length,
    page,
    pageSize,
  }
}

/**
 * 创建 ClusterRoleBinding
 * @param clusterUid 集群 UID
 * @param data 创建参数
 * @returns void
 */
function createClusterRoleBindingMock(clusterUid: string, data: Partial<ClusterRoleBindingCreateForm>): void {
  console.log('[Mock] createClusterRoleBinding', clusterUid, data)
}

/**
 * 通过 YAML 创建 ClusterRoleBinding
 * @param clusterUid 集群 UID
 * @param yaml ClusterRoleBinding YAML 文本
 * @returns void
 */
function createClusterRoleBindingYamlMock(clusterUid: string, yaml: string): void {
  console.log('[Mock] createClusterRoleBindingYaml', clusterUid, yaml)
}

/**
 * 更新 ClusterRoleBinding
 * @param clusterUid 集群 UID
 * @param name ClusterRoleBinding 名称
 * @param data 更新参数
 * @returns void
 */
function updateClusterRoleBindingMock(
  clusterUid: string,
  name: string,
  data: Partial<ClusterRoleBindingUpdateForm>,
): void {
  console.log('[Mock] updateClusterRoleBinding', clusterUid, name, data)
}

/**
 * 通过 YAML 更新 ClusterRoleBinding
 * @param clusterUid 集群 UID
 * @param name ClusterRoleBinding 名称
 * @param yaml ClusterRoleBinding YAML 文本
 * @returns void
 */
function updateClusterRoleBindingYamlMock(clusterUid: string, name: string, yaml: string): void {
  console.log('[Mock] updateClusterRoleBindingYaml', clusterUid, name, yaml)
}

/**
 * 更新 ClusterRoleBinding 标签
 * @param clusterUid 集群 UID
 * @param name ClusterRoleBinding 名称
 * @param data 标签更新参数
 * @returns void
 */
function manageClusterRoleBindingLabelMock(clusterUid: string, name: string, data: MetadataLabelForm): void {
  console.log('[Mock] manageClusterRoleBindingLabel', clusterUid, name, data)
}

/**
 * 更新 ClusterRoleBinding 注解
 * @param clusterUid 集群 UID
 * @param name ClusterRoleBinding 名称
 * @param data 注解更新参数
 * @returns void
 */
function manageClusterRoleBindingAnnotationMock(clusterUid: string, name: string, data: MetadataAnnotationForm): void {
  console.log('[Mock] manageClusterRoleBindingAnnotation', clusterUid, name, data)
}

/**
 * 删除 ClusterRoleBinding
 * @param clusterUid 集群 UID
 * @param name ClusterRoleBinding 名称
 * @returns void
 */
function deleteClusterRoleBindingMock(clusterUid: string, name: string): void {
  console.log('[Mock] deleteClusterRoleBinding', clusterUid, name)
}

/**
 * 批量删除 ClusterRoleBinding
 * @param clusterUid 集群 UID
 * @param uids ClusterRoleBinding UID 列表
 * @returns void
 */
function deleteClusterRoleBindingsMock(clusterUid: string, uids: string[]): void {
  console.log('[Mock] deleteClusterRoleBindings', clusterUid, uids)
}

/**
 * 导入 ClusterRoleBinding
 * @param clusterUid 集群 UID
 * @param formData 上传的文件
 * @returns void
 */
function importClusterRoleBindingMock(clusterUid: string, formData: FormData): void {
  void formData
  console.log('[Mock] importClusterRoleBinding', clusterUid)
}

/**
 * 导出 ClusterRoleBinding
 * @param clusterUid 集群 UID
 * @param query ClusterRoleBinding 查询条件请求对象（名称、角色名、UID）
 * @returns void
 */
function exportClusterRoleBindingMock(clusterUid: string, query: Partial<ClusterRoleBindingQueryForm>): void {
  console.log('[Mock] exportClusterRoleBinding', clusterUid, query)
}

export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/clusterrolebindings',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<ClusterRoleBindingQueryForm> }) =>
      getClusterRoleBindingListMock(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/clusterrolebindings/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getClusterRoleBindingDetailMock(ctx.pathParams.clusterUid, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/clusterrolebindings/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getClusterRoleBindingYamlMock(ctx.pathParams.clusterUid, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/clusterrolebindings/:name/events',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }) =>
      getClusterRoleBindingEventListMock(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/clusterrolebindings',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<ClusterRoleBindingCreateForm> }) =>
      createClusterRoleBindingMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/clusterrolebindings/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      createClusterRoleBindingYamlMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/clusterrolebindings/:name',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<ClusterRoleBindingUpdateForm> }) =>
      updateClusterRoleBindingMock(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/clusterrolebindings/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      updateClusterRoleBindingYamlMock(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/clusterrolebindings/:name/labels',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataLabelForm }) =>
      manageClusterRoleBindingLabelMock(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/clusterrolebindings/:name/annotations',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataAnnotationForm }) =>
      manageClusterRoleBindingAnnotationMock(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/clusterrolebindings/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      deleteClusterRoleBindingMock(ctx.pathParams.clusterUid, ctx.pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/clusterrolebindings/batch',
    handler: (ctx: { pathParams: Record<string, string>; data: string[] }) =>
      deleteClusterRoleBindingsMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/clusterrolebindings/import',
    handler: (ctx: { pathParams: Record<string, string>; data: FormData }) =>
      importClusterRoleBindingMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/clusterrolebindings/export',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<ClusterRoleBindingQueryForm> }) =>
      exportClusterRoleBindingMock(ctx.pathParams.clusterUid, ctx.params),
  },
]
