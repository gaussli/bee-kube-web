/**
 * Secret 管理 Mock
 * @module mock/kubernetes/config/secret
 */
import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type {
  SecretCreateForm,
  SecretDetailVo,
  SecretExportQueryForm,
  SecretListVo,
  SecretQueryForm,
  SecretUpdateForm,
  SecretYamlVo,
} from '@/types/kubernetes/config/secret'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'

import { handleEventList } from '@/mock/utils'

import { mockSecretDetail, mockSecretEventList, mockSecretList, mockSecretYaml } from './data'

/**
 * 密钥路由配置
 * @remarks
 * - GET    /kubernetes/clusters/:clusterUid/secrets                                         - 获取密钥列表
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name             - 获取密钥详情
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name/yaml        - 获取密钥 YAML
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name/events      - 获取密钥事件列表
 * - POST   /kubernetes/clusters/:clusterUid/secrets                                         - 创建密钥
 * - POST   /kubernetes/clusters/:clusterUid/secrets/yaml                                    - 创建密钥（YAML）
 * - PUT    /kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name             - 更新密钥
 * - PUT    /kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name/yaml        - 更新密钥（YAML）
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name/labels      - 配置密钥标签
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name/annotations - 配置密钥注解
 * - DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name             - 删除密钥
 * - DELETE /kubernetes/clusters/:clusterUid/secrets                                         - 批量删除密钥
 * - POST   /kubernetes/clusters/:clusterUid/secrets/import                                  - 导入密钥
 * - GET    /kubernetes/clusters/:clusterUid/secrets/export                                  - 导出密钥
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/secrets',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<SecretQueryForm> }) =>
      getSecretList(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getSecretDetail(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getSecretYaml(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name/events',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }) =>
      getSecretEventList(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/secrets',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<SecretCreateForm> }) =>
      createSecret(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/secrets/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      createSecretYaml(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<SecretUpdateForm> }) =>
      updateSecret(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      updateSecretYaml(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name/labels',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataLabelForm }) =>
      manageSecretLabels(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name/annotations',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataAnnotationForm }) =>
      manageSecretAnnotations(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      deleteSecret(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/secrets',
    handler: (ctx: { pathParams: Record<string, string>; data: string[] }) =>
      deleteSecrets(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/secrets/import',
    handler: (ctx: { pathParams: Record<string, string>; data: FormData }) =>
      importSecret(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/secrets/export',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<SecretQueryForm> }) =>
      exportSecret(ctx.pathParams.clusterUid, ctx.params),
  },
]

/**
 * 获取密钥（Secret）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的密钥列表
 */
function getSecretList(clusterUid: string, query: Partial<SecretQueryForm>): PageVo<SecretListVo> {
  console.log('[Mock] getSecretList', clusterUid, query)
  const filtered = mockSecretList.filter((d: SecretListVo) => {
    if (query.namespace && d.namespace !== query.namespace) return false
    if (query.type && d.type !== query.type) return false
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
 * 获取密钥（Secret）详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 密钥名称
 * @returns 密钥详情
 */
function getSecretDetail(clusterUid: string, namespace: string, name: string): SecretDetailVo {
  console.log('[Mock] getSecretDetail', clusterUid, namespace, name)
  return mockSecretDetail
}

/**
 * 获取密钥（Secret）YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 密钥名称
 * @returns 密钥 YAML
 */
function getSecretYaml(clusterUid: string, namespace: string, name: string): SecretYamlVo {
  console.log('[Mock] getSecretYaml', clusterUid, namespace, name)
  return { yaml: mockSecretYaml }
}

/**
 * 获取密钥（Secret）事件（Event）列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 密钥名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
function getSecretEventList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<EventQueryForm>,
): PageVo<EventListVo> {
  console.log('[Mock] getSecretEventList', clusterUid, namespace, name, query)
  return handleEventList(query, mockSecretEventList)
}

/**
 * 创建密钥（Secret）
 * @param clusterUid - 集群 UID
 * @param data - 创建请求对象
 */
function createSecret(clusterUid: string, data: Partial<SecretCreateForm>): void {
  console.log('[Mock] createSecret', clusterUid, data)
}

/**
 * 创建密钥（Secret）（YAML）
 * @param clusterUid - 集群 UID
 * @param yaml - 创建 YAML 文本
 */
function createSecretYaml(clusterUid: string, yaml: string): void {
  console.log('[Mock] createSecretYaml', clusterUid, yaml)
}

/**
 * 更新密钥（Secret）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 密钥名称
 * @param data - 更新请求对象
 */
function updateSecret(clusterUid: string, namespace: string, name: string, data: Partial<SecretUpdateForm>): void {
  console.log('[Mock] updateSecret', clusterUid, namespace, name, data)
}

/**
 * 更新密钥（Secret）（YAML）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 密钥名称
 * @param yaml - 更新 YAML 文本
 */
function updateSecretYaml(clusterUid: string, namespace: string, name: string, yaml: string): void {
  console.log('[Mock] updateSecretYaml', clusterUid, namespace, name, yaml)
}

/**
 * 配置密钥（Secret）标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 密钥名称
 * @param data - 标签配置请求对象
 */
function manageSecretLabels(clusterUid: string, namespace: string, name: string, data: MetadataLabelForm): void {
  console.log('[Mock] manageSecretLabels', clusterUid, namespace, name, data)
}

/**
 * 配置密钥（Secret）注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 密钥名称
 * @param data - 注解配置请求对象
 */
function manageSecretAnnotations(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
): void {
  console.log('[Mock] manageSecretAnnotations', clusterUid, namespace, name, data)
}

/**
 * 删除密钥（Secret）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 密钥名称
 */
function deleteSecret(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] deleteSecret', clusterUid, namespace, name)
}

/**
 * 批量删除密钥（Secret）
 * @param clusterUid - 集群 UID
 * @param uids - 密钥 UID 数组
 */
function deleteSecrets(clusterUid: string, uids: string[]): void {
  console.log('[Mock] deleteSecrets', clusterUid, uids)
}

/**
 * 导入密钥（Secret）
 * @param clusterUid - 集群 UID
 * @param formData - 文件数据
 */
function importSecret(clusterUid: string, formData: FormData): void {
  void formData
  console.log('[Mock] importSecret', clusterUid)
}

/**
 * 导出密钥（Secret）
 * @param clusterUid - 集群 UID
 * @param query - 导出查询条件
 */
function exportSecret(clusterUid: string, query: Partial<SecretExportQueryForm>): void {
  console.log('[Mock] exportSecret', clusterUid, query)
}
