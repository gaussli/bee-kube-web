/**
 * ClusterRoleBinding 管理 Mock
 * @module mock/kubernetes/security/clusterrolebinding
 */
import type { PageVo } from '@/types/index'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  ClusterRoleBindingCreateForm,
  ClusterRoleBindingDetailVo,
  ClusterRoleBindingExportQueryForm,
  ClusterRoleBindingListVo,
  ClusterRoleBindingQueryForm,
  ClusterRoleBindingUpdateForm,
  ClusterRoleBindingYamlVo,
} from '@/types/kubernetes/security/clusterrolebinding'

import { handleEventList } from '@/mock/utils'

import {
  mockClusterRoleBindingDetail,
  mockClusterRoleBindingEventList,
  mockClusterRoleBindingList,
  mockClusterRoleBindingYaml,
} from './data'

/**
 * 集群角色绑定路由配置
 * @remarks
 * - GET    /kubernetes/clusters/:clusterUid/clusterrolebindings                   - 获取集群角色绑定列表
 * - GET    /kubernetes/clusters/:clusterUid/clusterrolebindings/:name             - 获取集群角色绑定详情
 * - GET    /kubernetes/clusters/:clusterUid/clusterrolebindings/:name/yaml        - 获取集群角色绑定 YAML
 * - GET    /kubernetes/clusters/:clusterUid/clusterrolebindings/:name/events      - 获取集群角色绑定事件列表
 * - POST   /kubernetes/clusters/:clusterUid/clusterrolebindings                   - 创建集群角色绑定
 * - POST   /kubernetes/clusters/:clusterUid/clusterrolebindings/yaml              - 创建集群角色绑定（YAML）
 * - PUT    /kubernetes/clusters/:clusterUid/clusterrolebindings/:name             - 更新集群角色绑定
 * - PUT    /kubernetes/clusters/:clusterUid/clusterrolebindings/:name/yaml        - 更新集群角色绑定（YAML）
 * - POST   /kubernetes/clusters/:clusterUid/clusterrolebindings/:name/labels      - 配置集群角色绑定标签
 * - POST   /kubernetes/clusters/:clusterUid/clusterrolebindings/:name/annotations - 配置集群角色绑定注解
 * - DELETE /kubernetes/clusters/:clusterUid/clusterrolebindings/:name             - 删除集群角色绑定
 * - DELETE /kubernetes/clusters/:clusterUid/clusterrolebindings                   - 批量删除集群角色绑定
 * - POST   /kubernetes/clusters/:clusterUid/clusterrolebindings/import            - 导入集群角色绑定
 * - GET    /kubernetes/clusters/:clusterUid/clusterrolebindings/export            - 导出集群角色绑定
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/clusterrolebindings',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<ClusterRoleBindingQueryForm> }) =>
      getClusterRoleBindingList(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/clusterrolebindings/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getClusterRoleBindingDetail(ctx.pathParams.clusterUid, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/clusterrolebindings/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getClusterRoleBindingYaml(ctx.pathParams.clusterUid, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/clusterrolebindings/:name/events',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }) =>
      getClusterRoleBindingEventList(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/clusterrolebindings',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<ClusterRoleBindingCreateForm> }) =>
      createClusterRoleBinding(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/clusterrolebindings/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      createClusterRoleBindingYaml(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/clusterrolebindings/:name',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<ClusterRoleBindingUpdateForm> }) =>
      updateClusterRoleBinding(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/clusterrolebindings/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      updateClusterRoleBindingYaml(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/clusterrolebindings/:name/labels',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataLabelForm }) =>
      manageClusterRoleBindingLabels(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/clusterrolebindings/:name/annotations',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataAnnotationForm }) =>
      manageClusterRoleBindingAnnotations(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/clusterrolebindings/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      deleteClusterRoleBinding(ctx.pathParams.clusterUid, ctx.pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/clusterrolebindings',
    handler: (ctx: { pathParams: Record<string, string>; data: string[] }) =>
      deleteClusterRoleBindings(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/clusterrolebindings/import',
    handler: (ctx: { pathParams: Record<string, string>; data: FormData }) =>
      importClusterRoleBinding(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/clusterrolebindings/export',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<ClusterRoleBindingExportQueryForm> }) =>
      exportClusterRoleBinding(ctx.pathParams.clusterUid, ctx.params),
  },
]

/**
 * 获取集群角色绑定（ClusterRoleBinding）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的集群角色绑定列表
 */
function getClusterRoleBindingList(
  clusterUid: string,
  query: Partial<ClusterRoleBindingQueryForm>,
): PageVo<ClusterRoleBindingListVo> {
  console.log('[Mock] getClusterRoleBindingList', clusterUid, query)
  const filtered = mockClusterRoleBindingList
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
 * 获取集群角色绑定（ClusterRoleBinding）详情
 * @param clusterUid - 集群 UID
 * @param name - 集群角色绑定名称
 * @returns 集群角色绑定详情
 */
function getClusterRoleBindingDetail(clusterUid: string, name: string): ClusterRoleBindingDetailVo {
  console.log('[Mock] getClusterRoleBindingDetail', clusterUid, name)
  return mockClusterRoleBindingDetail
}

/**
 * 获取集群角色绑定（ClusterRoleBinding）YAML
 * @param clusterUid - 集群 UID
 * @param name - 集群角色绑定名称
 * @returns 集群角色绑定 YAML
 */
function getClusterRoleBindingYaml(clusterUid: string, name: string): ClusterRoleBindingYamlVo {
  console.log('[Mock] getClusterRoleBindingYaml', clusterUid, name)
  return { yaml: mockClusterRoleBindingYaml }
}

/**
 * 获取集群角色绑定（ClusterRoleBinding）事件（Event）列表
 * @param clusterUid - 集群 UID
 * @param name - 集群角色绑定名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
function getClusterRoleBindingEventList(
  clusterUid: string,
  name: string,
  query: Partial<EventQueryForm>,
): PageVo<EventListVo> {
  console.log('[Mock] getClusterRoleBindingEventList', clusterUid, name, query)
  return handleEventList(query, mockClusterRoleBindingEventList)
}

/**
 * 创建集群角色绑定（ClusterRoleBinding）
 * @param clusterUid - 集群 UID
 * @param data - 创建请求对象
 */
function createClusterRoleBinding(clusterUid: string, data: Partial<ClusterRoleBindingCreateForm>): void {
  console.log('[Mock] createClusterRoleBinding', clusterUid, data)
}

/**
 * 创建集群角色绑定（ClusterRoleBinding）（YAML）
 * @param clusterUid - 集群 UID
 * @param yaml - 创建 YAML 文本
 */
function createClusterRoleBindingYaml(clusterUid: string, yaml: string): void {
  console.log('[Mock] createClusterRoleBindingYaml', clusterUid, yaml)
}

/**
 * 更新集群角色绑定（ClusterRoleBinding）
 * @param clusterUid - 集群 UID
 * @param name - 集群角色绑定名称
 * @param data - 更新请求对象
 */
function updateClusterRoleBinding(clusterUid: string, name: string, data: Partial<ClusterRoleBindingUpdateForm>): void {
  console.log('[Mock] updateClusterRoleBinding', clusterUid, name, data)
}

/**
 * 更新集群角色绑定（ClusterRoleBinding）（YAML）
 * @param clusterUid - 集群 UID
 * @param name - 集群角色绑定名称
 * @param yaml - 更新 YAML 文本
 */
function updateClusterRoleBindingYaml(clusterUid: string, name: string, yaml: string): void {
  console.log('[Mock] updateClusterRoleBindingYaml', clusterUid, name, yaml)
}

/**
 * 配置集群角色绑定（ClusterRoleBinding）标签
 * @param clusterUid - 集群 UID
 * @param name - 集群角色绑定名称
 * @param data - 标签配置请求对象
 */
function manageClusterRoleBindingLabels(clusterUid: string, name: string, data: MetadataLabelForm): void {
  console.log('[Mock] manageClusterRoleBindingLabels', clusterUid, name, data)
}

/**
 * 配置集群角色绑定（ClusterRoleBinding）注解
 * @param clusterUid - 集群 UID
 * @param name - 集群角色绑定名称
 * @param data - 注解配置请求对象
 */
function manageClusterRoleBindingAnnotations(clusterUid: string, name: string, data: MetadataAnnotationForm): void {
  console.log('[Mock] manageClusterRoleBindingAnnotations', clusterUid, name, data)
}

/**
 * 删除集群角色绑定（ClusterRoleBinding）
 * @param clusterUid - 集群 UID
 * @param name - 集群角色绑定名称
 */
function deleteClusterRoleBinding(clusterUid: string, name: string): void {
  console.log('[Mock] deleteClusterRoleBinding', clusterUid, name)
}

/**
 * 批量删除集群角色绑定（ClusterRoleBinding）
 * @param clusterUid - 集群 UID
 * @param uids - 集群角色绑定 UID 数组
 */
function deleteClusterRoleBindings(clusterUid: string, uids: string[]): void {
  console.log('[Mock] deleteClusterRoleBindings', clusterUid, uids)
}

/**
 * 导入集群角色绑定（ClusterRoleBinding）
 * @param clusterUid - 集群 UID
 * @param formData - 文件数据
 */
function importClusterRoleBinding(clusterUid: string, formData: FormData): void {
  void formData
  console.log('[Mock] importClusterRoleBinding', clusterUid)
}

/**
 * 导出集群角色绑定（ClusterRoleBinding）
 * @param clusterUid - 集群 UID
 * @param query - 导出查询条件
 */
function exportClusterRoleBinding(clusterUid: string, query: Partial<ClusterRoleBindingExportQueryForm>): void {
  console.log('[Mock] exportClusterRoleBinding', clusterUid, query)
}
