import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type {
  CustomResourceDefinitionCreateForm,
  CustomResourceDefinitionDetailVo,
  CustomResourceDefinitionExportQueryForm,
  CustomResourceDefinitionListVo,
  CustomResourceDefinitionQueryForm,
  CustomResourceDefinitionUpdateForm,
  CustomResourceDefinitionYamlVo,
} from '@/types/kubernetes/customresourcedefinition'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'

import { handleEventList } from '@/mock/utils'

import {
  mockCustomResourceDefinitionDetail,
  mockCustomResourceDefinitionEventList,
  mockCustomResourceDefinitionList,
  mockCustomResourceDefinitionYaml,
} from './data'

/**
 * 自定义资源定义路由配置
 * @remarks
 * - GET    /kubernetes/clusters/:clusterUid/customresourcedefinitions                   - 获取自定义资源定义列表
 * - GET    /kubernetes/clusters/:clusterUid/customresourcedefinitions/:name             - 获取自定义资源定义详情
 * - GET    /kubernetes/clusters/:clusterUid/customresourcedefinitions/:name/yaml        - 获取自定义资源定义 YAML
 * - GET    /kubernetes/clusters/:clusterUid/customresourcedefinitions/:name/events      - 获取自定义资源定义事件列表
 * - POST   /kubernetes/clusters/:clusterUid/customresourcedefinitions                   - 创建自定义资源定义
 * - POST   /kubernetes/clusters/:clusterUid/customresourcedefinitions/yaml              - 创建自定义资源定义（YAML）
 * - PUT    /kubernetes/clusters/:clusterUid/customresourcedefinitions/:name             - 更新自定义资源定义
 * - PUT    /kubernetes/clusters/:clusterUid/customresourcedefinitions/:name/yaml        - 更新自定义资源定义（YAML）
 * - POST   /kubernetes/clusters/:clusterUid/customresourcedefinitions/:name/labels      - 配置自定义资源定义标签
 * - POST   /kubernetes/clusters/:clusterUid/customresourcedefinitions/:name/annotations - 配置自定义资源定义注解
 * - DELETE /kubernetes/clusters/:clusterUid/customresourcedefinitions/:name             - 删除自定义资源定义
 * - DELETE /kubernetes/clusters/:clusterUid/customresourcedefinitions                   - 批量删除自定义资源定义
 * - POST   /kubernetes/clusters/:clusterUid/customresourcedefinitions/import            - 导入自定义资源定义
 * - GET    /kubernetes/clusters/:clusterUid/customresourcedefinitions/export            - 导出自定义资源定义
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/customresourcedefinitions',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<CustomResourceDefinitionQueryForm> }) =>
      getCustomResourceDefinitionList(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/customresourcedefinitions/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getCustomResourceDefinitionDetail(ctx.pathParams.clusterUid, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/customresourcedefinitions/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getCustomResourceDefinitionYaml(ctx.pathParams.clusterUid, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/customresourcedefinitions/:name/events',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }) =>
      getCustomResourceDefinitionEventList(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/customresourcedefinitions',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<CustomResourceDefinitionCreateForm> }) =>
      createCustomResourceDefinition(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/customresourcedefinitions/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      createCustomResourceDefinitionYaml(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/customresourcedefinitions/:name',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<CustomResourceDefinitionUpdateForm> }) =>
      updateCustomResourceDefinition(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/customresourcedefinitions/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      updateCustomResourceDefinitionYaml(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/customresourcedefinitions/:name/labels',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataLabelForm }) =>
      manageCustomResourceDefinitionLabels(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/customresourcedefinitions/:name/annotations',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataAnnotationForm }) =>
      manageCustomResourceDefinitionAnnotations(ctx.pathParams.clusterUid, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/customresourcedefinitions/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      deleteCustomResourceDefinition(ctx.pathParams.clusterUid, ctx.pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/customresourcedefinitions',
    handler: (ctx: { pathParams: Record<string, string>; data: string[] }) =>
      deleteCustomResourceDefinitions(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/customresourcedefinitions/import',
    handler: (ctx: { pathParams: Record<string, string>; data: FormData }) =>
      importCustomResourceDefinition(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/customresourcedefinitions/export',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<CustomResourceDefinitionQueryForm> }) =>
      exportCustomResourceDefinition(ctx.pathParams.clusterUid, ctx.params),
  },
]

/**
 * 获取自定义资源定义（CustomResourceDefinition）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的自定义资源定义列表
 */
function getCustomResourceDefinitionList(
  clusterUid: string,
  query: Partial<CustomResourceDefinitionQueryForm>,
): PageVo<CustomResourceDefinitionListVo> {
  console.log('[Mock] getCustomResourceDefinitionList', clusterUid, query)
  const filtered = mockCustomResourceDefinitionList
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
 * 获取自定义资源定义（CustomResourceDefinition）详情
 * @param clusterUid - 集群 UID
 * @param name - 自定义资源定义名称
 * @returns 自定义资源定义详情
 */
function getCustomResourceDefinitionDetail(clusterUid: string, name: string): CustomResourceDefinitionDetailVo {
  console.log('[Mock] getCustomResourceDefinitionDetail', clusterUid, name)
  return mockCustomResourceDefinitionDetail
}

/**
 * 获取自定义资源定义（CustomResourceDefinition）YAML
 * @param clusterUid - 集群 UID
 * @param name - 自定义资源定义名称
 * @returns 自定义资源定义 YAML
 */
function getCustomResourceDefinitionYaml(clusterUid: string, name: string): CustomResourceDefinitionYamlVo {
  console.log('[Mock] getCustomResourceDefinitionYaml', clusterUid, name)
  return { yaml: mockCustomResourceDefinitionYaml }
}

/**
 * 获取自定义资源定义（CustomResourceDefinition）事件（Event）列表
 * @param clusterUid - 集群 UID
 * @param name - 自定义资源定义名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
function getCustomResourceDefinitionEventList(
  clusterUid: string,
  name: string,
  query: Partial<EventQueryForm>,
): PageVo<EventListVo> {
  console.log('[Mock] getCustomResourceDefinitionEventList', clusterUid, name, query)
  return handleEventList(query, mockCustomResourceDefinitionEventList)
}

/**
 * 创建自定义资源定义（CustomResourceDefinition）
 * @param clusterUid - 集群 UID
 * @param data - 创建请求对象
 */
function createCustomResourceDefinition(clusterUid: string, data: Partial<CustomResourceDefinitionCreateForm>): void {
  console.log('[Mock] createCustomResourceDefinition', clusterUid, data)
}

/**
 * 创建自定义资源定义（CustomResourceDefinition）（YAML）
 * @param clusterUid - 集群 UID
 * @param yaml - 创建 YAML 文本
 */
function createCustomResourceDefinitionYaml(clusterUid: string, yaml: string): void {
  console.log('[Mock] createCustomResourceDefinitionYaml', clusterUid, yaml)
}

/**
 * 更新自定义资源定义（CustomResourceDefinition）
 * @param clusterUid - 集群 UID
 * @param name - 自定义资源定义名称
 * @param data - 更新请求对象
 */
function updateCustomResourceDefinition(
  clusterUid: string,
  name: string,
  data: Partial<CustomResourceDefinitionUpdateForm>,
): void {
  console.log('[Mock] updateCustomResourceDefinition', clusterUid, name, data)
}

/**
 * 更新自定义资源定义（CustomResourceDefinition）（YAML）
 * @param clusterUid - 集群 UID
 * @param name - 自定义资源定义名称
 * @param yaml - 更新 YAML 文本
 */
function updateCustomResourceDefinitionYaml(clusterUid: string, name: string, yaml: string): void {
  console.log('[Mock] updateCustomResourceDefinitionYaml', clusterUid, name, yaml)
}

/**
 * 配置自定义资源定义（CustomResourceDefinition）标签
 * @param clusterUid - 集群 UID
 * @param name - 自定义资源定义名称
 * @param data - 标签配置请求对象
 */
function manageCustomResourceDefinitionLabels(clusterUid: string, name: string, data: MetadataLabelForm): void {
  console.log('[Mock] manageCustomResourceDefinitionLabels', clusterUid, name, data)
}

/**
 * 配置自定义资源定义（CustomResourceDefinition）注解
 * @param clusterUid - 集群 UID
 * @param name - 自定义资源定义名称
 * @param data - 注解配置请求对象
 */
function manageCustomResourceDefinitionAnnotations(
  clusterUid: string,
  name: string,
  data: MetadataAnnotationForm,
): void {
  console.log('[Mock] manageCustomResourceDefinitionAnnotations', clusterUid, name, data)
}

/**
 * 删除自定义资源定义（CustomResourceDefinition）
 * @param clusterUid - 集群 UID
 * @param name - 自定义资源定义名称
 */
function deleteCustomResourceDefinition(clusterUid: string, name: string): void {
  console.log('[Mock] deleteCustomResourceDefinition', clusterUid, name)
}

/**
 * 批量删除自定义资源定义（CustomResourceDefinition）
 * @param clusterUid - 集群 UID
 * @param uids - 自定义资源定义 UID 数组
 */
function deleteCustomResourceDefinitions(clusterUid: string, uids: string[]): void {
  console.log('[Mock] deleteCustomResourceDefinitions', clusterUid, uids)
}

/**
 * 导入自定义资源定义（CustomResourceDefinition）
 * @param clusterUid - 集群 UID
 * @param formData - 文件数据
 * @param onProgress - 上传进度回调
 */
function importCustomResourceDefinition(clusterUid: string, formData: FormData): void {
  void formData
  console.log('[Mock] importCustomResourceDefinition', clusterUid)
}

/**
 * 导出自定义资源定义（CustomResourceDefinition）
 * @param clusterUid - 集群 UID
 * @param query - 导出查询条件
 */
function exportCustomResourceDefinition(
  clusterUid: string,
  query: Partial<CustomResourceDefinitionExportQueryForm>,
): void {
  console.log('[Mock] exportCustomResourceDefinition', clusterUid, query)
}
