/**
 * Secret 管理 Mock
 * @module mock/kubernetes/config/secret
 */
import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type {
  SecretCreateForm,
  SecretDetailVo,
  SecretListVo,
  SecretQueryForm,
  SecretUpdateForm,
  SecretYamlVo,
} from '@/types/kubernetes/config/secret'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'

import { mockSecretDetail, mockSecretEvents, mockSecrets, mockSecretYaml } from './secretData'

/**
 * 查看 Secret 列表
 * @param clusterUid 集群 UID
 * @param query Secret 查询条件请求对象（名称、命名空间、类型、UID）
 * @returns Secret 分页列表
 */
function getSecretListMock(clusterUid: string, query: Partial<SecretQueryForm>): PageVo<SecretListVo> {
  console.log('[Mock] getSecretList', clusterUid, query)
  const filtered = mockSecrets.filter((s: SecretListVo) => {
    if (query.namespace && s.namespace !== query.namespace) return false
    if (query.type && s.type !== query.type) return false
    return true
  })
  const filteredUid = query.uid ? filtered.filter(s => s.uid === query.uid) : []
  const filteredName = query.name ? filtered.filter(s => s.name.includes(query.name as string)) : []
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
 * 查看 Secret 详情
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Secret 名称
 * @returns Secret 详情响应对象
 */
function getSecretDetailMock(clusterUid: string, namespace: string, name: string): SecretDetailVo {
  console.log('[Mock] getSecretDetail', clusterUid, namespace, name)
  return mockSecretDetail
}

/**
 * 查看 Secret YAML
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Secret 名称
 * @returns Secret YAML 响应对象（完整 YAML 文本）
 */
function getSecretYamlMock(clusterUid: string, namespace: string, name: string): SecretYamlVo {
  console.log('[Mock] getSecretYaml', clusterUid, namespace, name)
  return mockSecretYaml
}

/**
 * 查看 Secret 关联事件列表
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Secret 名称
 * @param query 事件查询条件
 * @returns Secret 关联事件分页列表
 */
function getSecretEventListMock(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<EventQueryForm>,
): PageVo<EventListVo> {
  console.log('[Mock] getSecretEventList', clusterUid, namespace, name, query)
  const page = query.page || 1
  const pageSize = query.pageSize || 10
  const list = mockSecretEvents.slice((page - 1) * pageSize, page * pageSize)
  return {
    list,
    total: mockSecretEvents.length,
    page,
    pageSize,
  }
}

/**
 * 创建 Secret
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param data 创建参数
 * @returns void
 */
function createSecretMock(clusterUid: string, namespace: string, data: Partial<SecretCreateForm>): void {
  console.log('[Mock] createSecret', clusterUid, namespace, data)
}

/**
 * 通过 YAML 创建 Secret
 * @param clusterUid 集群 UID
 * @param yaml Secret YAML 文本
 * @returns void
 */
function createSecretYamlMock(clusterUid: string, yaml: string): void {
  console.log('[Mock] createSecretYaml', clusterUid, yaml)
}

/**
 * 更新 Secret
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Secret 名称
 * @param data 更新参数
 * @returns void
 */
function updateSecretMock(clusterUid: string, namespace: string, name: string, data: Partial<SecretUpdateForm>): void {
  console.log('[Mock] updateSecret', clusterUid, namespace, name, data)
}

/**
 * 通过 YAML 更新 Secret
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Secret 名称
 * @param yaml Secret YAML 文本
 * @returns void
 */
function updateSecretYamlMock(clusterUid: string, namespace: string, name: string, yaml: string): void {
  console.log('[Mock] updateSecretYaml', clusterUid, namespace, name, yaml)
}

/**
 * 更新 Secret 标签
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Secret 名称
 * @param data 标签更新参数
 * @returns void
 */
function manageSecretLabelMock(clusterUid: string, namespace: string, name: string, data: MetadataLabelForm): void {
  console.log('[Mock] manageSecretLabel', clusterUid, namespace, name, data)
}

/**
 * 更新 Secret 注解
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Secret 名称
 * @param data 注解更新参数
 * @returns void
 */
function manageSecretAnnotationMock(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
): void {
  console.log('[Mock] manageSecretAnnotation', clusterUid, namespace, name, data)
}

/**
 * 删除 Secret
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Secret 名称
 * @returns void
 */
function deleteSecretMock(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] deleteSecret', clusterUid, namespace, name)
}

/**
 * 批量删除 Secret
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param uids Secret UID 列表
 * @returns void
 */
function deleteSecretsMock(clusterUid: string, namespace: string, uids: string[]): void {
  console.log('[Mock] deleteSecrets', clusterUid, namespace, uids)
}

/**
 * 导入 Secret
 * @param clusterUid 集群 UID
 * @param formData 上传的文件
 * @returns void
 */
function importSecretMock(clusterUid: string, formData: FormData): void {
  void formData
  console.log('[Mock] importSecret', clusterUid)
}

/**
 * 导出 Secret
 * @param clusterUid 集群 UID
 * @param query Secret 查询条件请求对象（名称、命名空间、类型、UID）
 * @returns void
 */
function exportSecretMock(clusterUid: string, query: Partial<SecretQueryForm>): void {
  console.log('[Mock] exportSecret', clusterUid, query)
}

export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/secrets',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<SecretQueryForm> }) =>
      getSecretListMock(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getSecretDetailMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getSecretYamlMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name/events',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }) =>
      getSecretEventListMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<SecretCreateForm> }) =>
      createSecretMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/secrets/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      createSecretYamlMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<SecretUpdateForm> }) =>
      updateSecretMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      updateSecretYamlMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name/labels',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataLabelForm }) =>
      manageSecretLabelMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name/annotations',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataAnnotationForm }) =>
      manageSecretAnnotationMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      deleteSecretMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/batch',
    handler: (ctx: { pathParams: Record<string, string>; data: string[] }) =>
      deleteSecretsMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/secrets/import',
    handler: (ctx: { pathParams: Record<string, string>; data: FormData }) =>
      importSecretMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/secrets/export',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<SecretQueryForm> }) =>
      exportSecretMock(ctx.pathParams.clusterUid, ctx.params),
  },
]
